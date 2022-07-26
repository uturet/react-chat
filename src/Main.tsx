import React, {useState} from 'react';
import Header from './Header';
import UserList from './UserList';
import Chat from './Chat';

const Main = () => {
  const [displayUsers, setDisplayUsers] = useState(false);
  const toggleDisplayUsers = () => setDisplayUsers((prev) => !prev);

  return (
    <div className='relative h-screen'>
      <Header displayUsers={displayUsers} toggleDisplayUsers={toggleDisplayUsers}/>
      <main className='flex flex-row w-screen h-screen mt-[-64px] top-0 pt-[64px] overflow-hidden'>
        <UserList displayUsers={displayUsers} />
        <Chat/>
      </main>
    </div>
  );
};

export default Main;
