import React, {createContext, useContext, useEffect, useState} from 'react';
import {ChatInterface, UserInterface} from './interface';
import {useFirestore, useUser} from 'reactfire';
import {collection, query, where, onSnapshot, addDoc} from 'firebase/firestore';

const ChatContext = createContext(null);


const ChatProvider = (props: any) => {
  const [curChat, setCurChat] = useState<ChatInterface|null>(null);
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
        tmpChats.push(c);
        c.typing.forEach((uid) => tmpTypingUsers.add(uid));
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
        chats[i].user = u;
        setCurChat({...chats[i], user: u});
        return;
      }
    }

    const docRef = await addDoc(collection(firestore, 'chats'), {
      users: [u.uid, user.data?.uid],
      typing: [],
    });
    onSnapshot(docRef, (doc) => {
      const c = doc.data() as ChatInterface;
      chats.push(c);
      setCurChat({...c, user: u});
    });
  };

  return <ChatContext.Provider
    value={[chats, curChat, selectCurChat, typingUsers]} {...props} />;
};

const useChat = ():[ChatInterface[], null|ChatInterface, (user?: UserInterface) => void, Set<string>] => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useChat, ChatProvider};
