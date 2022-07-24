import React from 'react';
import {useCurChat} from './CurChatContext';
import {ChatInterface} from './interface';

interface ChatProps {
  chat?: ChatInterface
}
const Chat: React.FunctionComponent<ChatProps> = () => {
  const [chat] = useCurChat();

  if (!chat) {
    return (
      <section className='bg-slate-600 w-full md:w-3/5 xl:w-3/4 h-auto'/>
    );
  }
  return (
    <section className='bg-slate-600 w-full md:w-3/5 xl:w-3/4 h-auto'>
      <div className='w-full h-[65px] border-solid border-slate-800 border-b-2 flex flex-row items-center px-3'>
        <div className='w-10 h-10 relative'>
          <img className='rounded-full' src={chat.user.photoURL} alt="User`s Photo" />
        </div>
        <div className='ml-3 h-12'>
          <p className='font-semibold text-slate-300'>{chat.user.displayName}</p>
        </div>
      </div>
    </section>
  );
};

export default Chat;
