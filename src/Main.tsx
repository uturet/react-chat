/* eslint-disable max-len */
import React, {useState, useEffect} from 'react';
import Header from './Header';
import UserList from './UserList';
import Chat from './Chat';
import {useCurChat} from './CurChatContext';

const Main = () => {
  const [displayUsers, setDisplayUsers] = useState(false);
  const toggleDisplayUsers = () => setDisplayUsers((prev) => !prev);
  const [, setCurChat] = useCurChat();

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setCurChat(null);
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  return (
    <div className='relative h-screen'>
      <Header displayUsers={displayUsers} toggleDisplayUsers={toggleDisplayUsers}/>
      <main className='flex flex-row w-screen h-screen absolute top-0 pt-[64px] overflow-hidden'>
        <UserList displayUsers={displayUsers} />
        <Chat/>
      </main>
    </div>
  );
};

export default Main;
