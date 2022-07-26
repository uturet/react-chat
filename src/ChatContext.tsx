import React, {createContext, useContext, useEffect, useState, useReducer} from 'react';
import {ChatInterface, UserInterface, LocalChatInterface} from './interface';
import {useFirestore, useUser} from 'reactfire';
import {collection, query, where, onSnapshot, addDoc} from 'firebase/firestore';

const ChatContext = createContext(null);

const initialCurChat = {chat: null};

function reducer(state: any, action: any) {
  console.log('Dispatch', state, action);
  switch (action.type) {
  case 'set':
    state.chat = action.chat;
    break;
  case 'update':
    if (state.chat) {
      state.chat = action.chat;
    }
    break;
  case 'empty':
    state.chat = null;
    break;
  }
  return {...state};
}


const ChatProvider = (props: any) => {
  const [curChat, dispatchCurChat] = useReducer(reducer, initialCurChat);
  // const [curChat, setCurChat] = useState<LocalChatInterface|null>(null);
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
      console.log('Message', curChat.chat);
      setChats(tmpChats);
      setTypingUsers(tmpTypingUsers);
    });
  }, [user]);


  const selectCurChat = async (u?: UserInterface) => {
    console.log('SelectCurChat', u);
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
