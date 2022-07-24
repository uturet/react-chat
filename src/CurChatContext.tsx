import React, {createContext, useContext, useState} from 'react';
import {ChatInterface} from './interface';

const CurChatContext = createContext(null);


const CurChatProvider = (props: any) => {
  const [curChat, setCurChat] = useState(null);
  return <CurChatContext.Provider value={[curChat, setCurChat]} {...props} />;
};

const useCurChat = ():[null|ChatInterface, (chat: ChatInterface|null) => void] => {
  const context = useContext(CurChatContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useCurChat, CurChatProvider};
