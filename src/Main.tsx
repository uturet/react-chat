/* eslint-disable max-len */
import React, {useState} from 'react';
import Header from './Header';

const Main = () => {
  const [displayUsers, setDisplayUsers] = useState(false);
  const toggleDisplayUsers = () => setDisplayUsers((prev) => !prev);
  return (
    <div className='relative h-screen'>
      <Header displayUsers={displayUsers} toggleDisplayUsers={toggleDisplayUsers}/>
      <main className='flex flex-row h-full'>
        <section className={`${displayUsers? 'left-0': 'left-screen'} w-full bg-slate-400 absolute md:static transition-all md:w-2/5 xl:w-1/4 h-full`}>

        </section>
        <section className='bg-slate-600 w-full md:w-3/5 xl:w-3/4 h-full'>

        </section>
      </main>
    </div>
  );
};

export default Main;
