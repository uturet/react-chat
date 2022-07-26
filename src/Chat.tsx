import React, {useRef, useEffect} from 'react';
import {useUser} from 'reactfire';
import {useChat} from './ChatContext';
import {ChatInterface, MessageInterface} from './interface';
import {
  Timestamp,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';


const checkIcons = {
  double: <path d="M182.6 246.6C170.1 259.1 149.9 259.1 137.4 246.6L57.37 166.6C44.88 154.1 44.88 133.9 57.37 121.4C69.87 108.9 90.13 108.9 102.6 121.4L159.1 178.7L297.4 41.37C309.9 28.88 330.1 28.88 342.6 41.37C355.1 53.87 355.1 74.13 342.6 86.63L182.6 246.6zM182.6 470.6C170.1 483.1 149.9 483.1 137.4 470.6L9.372 342.6C-3.124 330.1-3.124 309.9 9.372 297.4C21.87 284.9 42.13 284.9 54.63 297.4L159.1 402.7L393.4 169.4C405.9 156.9 426.1 156.9 438.6 169.4C451.1 181.9 451.1 202.1 438.6 214.6L182.6 470.6z"/>,
  single: <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>,
};

interface MessageProps {
  content: string
  own: boolean
  viewed: boolean
}
const Message: React.FunctionComponent<MessageProps> = ({own, viewed, content}) => {
  return (
    <div className={`max-w-[400px] p-3 m-2 bg-slate-700 text-slate-200 rounded-xl ${!own && 'self-end'}`}>
      <div id='message' className='text-slate-500 message-metadata'>
        <div className='float-right'></div>
        <div className='float-right flex flex-row pl-4 font-semibold whitespace-nowrap'>timestamp<svg
          className="ml-3 h-5 w-5 text-slate-500"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
          aria-hidden="true">{viewed ? checkIcons.double : checkIcons.single}</svg></div>
      </div>
      <p className='text-justify'>{content}</p>
    </div>
  );
};


interface ChatProps {
  chat?: ChatInterface
}
const Chat: React.FunctionComponent<ChatProps> = () => {
  const [chats, curChat, selectCurChat] = useChat();
  const user = useUser();
  const inputRef: {current: HTMLTextAreaElement|null} = useRef(null);
  const btnRef: {current: HTMLButtonElement|null} = useRef(null);
  const moveToRef: {current: HTMLDivElement|null} = useRef(null);

  async function send() {
    if (!inputRef.current || !user.data || !curChat.chat) return;
    if (!curChat.chat.ref) return;
    const message: MessageInterface = {
      sender: user.data.uid,
      timestamp: Timestamp.now(),
      viewed: false,
      content: inputRef.current.innerText,
    };
    inputRef.current.innerHTML = '';
    inputRef.current.focus();
    await updateDoc(curChat.chat.ref, {
      messages: arrayUnion(message),
    });
  };

  useEffect(() => {
    if (!curChat || !inputRef.current || !moveToRef.current) return;
    inputRef.current.innerHTML = '';
    inputRef.current.focus();
    moveToRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
  }, [chats, curChat]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        btnRef.current?.click();
      } else if (event.key === 'Escape' && inputRef.current) {
        event.preventDefault();
        inputRef.current.innerHTML = '';
        selectCurChat();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  if (!curChat.chat) {
    return (
      <section className='bg-slate-600 w-full md:w-3/5 xl:w-3/4 h-auto'/>
    );
  }
  return (
    <section className='bg-slate-600 w-full md:w-3/5 xl:w-3/4 h-auto flex flex-col'>
      <div className='w-full h-[65px] border-solid border-slate-800 border-b-2 flex flex-row items-center px-3'>
        <div className='w-10 h-10 relative'>
          <img className='rounded-full' src={curChat.chat.user?.photoURL} alt="User`s Photo" />
        </div>
        <div className='ml-3 h-12'>
          <p className='font-semibold text-slate-300'>{curChat.chat.user?.displayName}</p>
        </div>
      </div>

      <div className='w-full flex-grow overflow-y-scroll scrollbar-hide'>
        <div className='flex flex-col justify-end '>
          {curChat.chat.messages.map((m, i) => <Message
            key={i+m.sender}
            own={m.sender === user.data?.uid}
            viewed={m.viewed}
            content={m.content} />)}
          <div ref={moveToRef}/>
        </div>
      </div>

      <div className='transition-all bg-slate-200 flex flex-row max-h-[30%]'>
        <span
          ref={inputRef}
          role="textbox"
          contentEditable
          className='block textarea transition-all flex-grow px-3 py-2 scrollbar-hide bg-slate-200'/>
        <button ref={btnRef} onClick={send} className='mt-auto'>
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
