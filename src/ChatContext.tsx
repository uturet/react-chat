import React, {createContext, useContext, useEffect, useState} from 'react';
import {ChatInterface, UserInterface, LocalChatInterface} from './interface';
import {useFirestore, useUser} from 'reactfire';
import {collection, query, where, onSnapshot, addDoc} from 'firebase/firestore';

const ChatContext = createContext(null);


const ChatProvider = (props: any) => {
  const [curChat, setCurChat] = useState<LocalChatInterface|null>(null);
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
        if (curChat && c.users.includes(curChat.user.uid)) {
          setCurChat((prev) => {
            if (!prev) return {...c, user: curChat.user};
            return {...prev, ref: doc.ref, messages: [...c.messages]};
          });
        }
      });
      setChats(tmpChats);
      setTypingUsers(tmpTypingUsers);
    });
  }, [user]);


  const selectCurChat = async (u?: UserInterface) => {
    if (u === undefined) {
      setCurChat(null);
      return;
    }

    for (let i=0; i<chats.length; i++) {
      if (chats[i].users.includes(u.uid)) {
        setCurChat({...chats[i], user: u});
        return;
      }
    }
    const tmpCurChat: LocalChatInterface = {
      users: [u.uid],
      typing: [],
      user: u,
      messages: [],
    };
    setCurChat(tmpCurChat);
    const docRef = await addDoc(collection(firestore, 'chats'), {
      users: [u.uid, user.data?.uid],
      typing: [],
      messages: [],
    });
    onSnapshot(docRef, (doc) => {
      const c = doc.data() as ChatInterface;
      c.ref = docRef;
      chats.push(c);
      setCurChat({...c, user: u});
    });
  };

  return <ChatContext.Provider
    value={[chats, curChat, selectCurChat, typingUsers]} {...props} />;
};

const useChat = ():[ChatInterface[], null|LocalChatInterface, (user?: UserInterface) => void, Set<string>] => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useChat, ChatProvider};
