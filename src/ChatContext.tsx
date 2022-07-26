import React, {createContext, useContext, useEffect, useState, useReducer} from 'react';
import {ChatInterface, UserInterface, LocalChatInterface} from './interface';
import {useFirestore, useUser} from 'reactfire';
import {collection, query, where, onSnapshot, addDoc, updateDoc} from 'firebase/firestore';

const ChatContext = createContext(null);

const initialCurChat: {chat: LocalChatInterface|null} = {chat: null};

function reducer(state: {chat: LocalChatInterface|null}, action: {type: string, chat?: LocalChatInterface}) {
  switch (action.type) {
  case 'set':
    state.chat = action.chat as LocalChatInterface;
    viewMessages(state.chat);
    break;
  case 'update':
    if (state.chat) {
      state.chat = action.chat as LocalChatInterface;
      viewMessages(state.chat);
    }
    break;
  case 'empty':
    state.chat = null;
    break;
  }
  return {...state};
}

const viewMessages = async (chat: LocalChatInterface) => {
  let update = false;
  for (let i=chat.messages.length-1; i>-1; i--) {
    if (!chat.messages[i].viewed && chat.messages[i].sender == chat.user.uid) {
      chat.messages[i].viewed = true;
      update = true;
    } else {
      break;
    }
  }
  if (update && chat.ref) {
    await updateDoc(chat.ref, {
      messages: chat.messages,
    });
  }
};

const ChatProvider = (props: any) => {
  const [curChat, dispatchCurChat] = useReducer(reducer, initialCurChat);
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const user = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (!user.data) return;
    const q = query(collection(firestore, 'chats'), where('users', 'array-contains', user.data.uid));
    onSnapshot(q, (querySnapshot) => {
      const tmpChats: ChatInterface[] = [];
      const tmpTypingUsers: Set<string> = new Set();

      querySnapshot.forEach((doc) => {
        const c = doc.data() as ChatInterface;
        c.ref = doc.ref;
        tmpChats.push(c);
        c.typing.forEach((uid) => tmpTypingUsers.add(uid));

        if (curChat.chat && c.users.includes(curChat.chat.user.uid)) {
          dispatchCurChat({type: 'update', chat: {...c, user: curChat.chat.user}});
        }
      });
      setChats(tmpChats);
      setTypingUsers(tmpTypingUsers);
    });
  }, [user]);


  const selectCurChat = async (u?: UserInterface) => {
    if (u === undefined) {
      dispatchCurChat({type: 'empty'});
      return;
    }

    for (let i=0; i<chats.length; i++) {
      if (chats[i].users.includes(u.uid)) {
        dispatchCurChat({type: 'set', chat: {...chats[i], user: u}});
        return;
      }
    }
    const tmpCurChat: LocalChatInterface = {
      users: [u.uid],
      typing: [],
      user: u,
      messages: [],
    };
    dispatchCurChat({type: 'set', chat: tmpCurChat});
    const docRef = await addDoc(collection(firestore, 'chats'), {
      users: [u.uid, user.data?.uid],
      typing: [],
      messages: [],
    });
    onSnapshot(docRef, (doc) => {
      const c = doc.data() as ChatInterface;
      c.ref = docRef;
      chats.push(c);
      dispatchCurChat({type: 'set', chat: {...c, user: u}});
    });
  };

  return <ChatContext.Provider
    value={[chats, curChat, selectCurChat, typingUsers]} {...props} />;
};

const useChat = ():[ChatInterface[], {chat: LocalChatInterface|null}, (user?: UserInterface) => void, Set<string>] => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useChat, ChatProvider};
