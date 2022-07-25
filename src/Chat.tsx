import React, {useRef, useEffect} from 'react';
import {useChat} from './ChatContext';
import {ChatInterface} from './interface';

interface ChatProps {
  chat?: ChatInterface
}
const Chat: React.FunctionComponent<ChatProps> = () => {
  const [, chat] = useChat();
  const inputRef: {current: HTMLTextAreaElement|null} = useRef(null);

  const send = () => {
    if (!inputRef.current) return;
    console.log(inputRef.current.innerText);
    inputRef.current.innerHTML = '';
    inputRef.current.focus();
  };

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        send();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  if (!chat) {
    return (
      <section className='bg-slate-600 w-full md:w-3/5 xl:w-3/4 h-auto'/>
    );
  }
  return (
    <section className='bg-slate-600 w-full md:w-3/5 xl:w-3/4 h-auto flex flex-col'>
      <div className='w-full h-[65px] border-solid border-slate-800 border-b-2 flex flex-row items-center px-3'>
        <div className='w-10 h-10 relative'>
          <img className='rounded-full' src={chat.user?.photoURL} alt="User`s Photo" />
        </div>
        <div className='ml-3 h-12'>
          <p className='font-semibold text-slate-300'>{chat.user?.displayName}</p>
        </div>
      </div>

      <div className='w-full flex-grow shadow-inner'>

      </div>

      <div className='transition-all bg-slate-200 flex flex-row max-h-[30%]'>
        <span
          ref={inputRef}
          role="textbox"
          contentEditable
          className='block textarea transition-all flex-grow px-3 py-2 scrollbar-hide bg-slate-200'/>
        <button onClick={send} className='mt-auto'>
          <svg
            className="h-5 w-5 m-3 text-slate-600"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            aria-hidden="true">
            <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Chat;
