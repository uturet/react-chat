import React from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useUser,
} from 'reactfire';
import {
  collection,
} from 'firebase/firestore';
import {UserInterface} from './interface';
import {useCurChat} from './CurChatContext';

interface UserItemProps {
  user: UserInterface
  active: boolean
  onClick: () => void
}
export const UserItem: React.FunctionComponent<UserItemProps> = ({user, active, onClick}) => {
  return (
    <div onClick={onClick} className={`${active && 'bg-slate-600'} w-full h-[65px] border-solid border-slate-800 border-b-2 flex flex-row items-center px-3`}>
      <div className='w-10 h-10 relative'>
        <img className='rounded-full' src={user.photoURL} alt="User`s Photo" />
        {user.online && <span className='w-3 h-3 bg-green-400 rounded-full absolute right-0 bottom-0' />}
      </div>
      <div className='ml-3 h-12'>
        <p className='font-semibold text-slate-300'>{user.displayName}</p>
        {user.typing ? <p className='text-green-300'>Typing...</p> : <p className='text-slate-500'>Lorem ipsum dolor sit...</p>}
      </div>
      <div className='ml-auto rounded-full h-6 w-6 bg-slate-800 flex items-center justify-center'>
        <span className='font-semibold text-slate-300 text-xs'>10</span>
      </div>
    </div>
  );
};


interface UserListProps {
    displayUsers: boolean
}
const UserList: React.FunctionComponent<UserListProps> = ({displayUsers}) => {
  const firestore = useFirestore();
  const user = useUser();
  const usersRef = collection(firestore, 'users');
  const {status, data: users} = useFirestoreCollectionData(usersRef);
  const [curChat, setCurChat] = useCurChat();

  if (status === 'loading') {
    return <span>loading...</span>;
  }
  return (
    <section className={`${displayUsers? 'left-0': 'left-screen'} w-full overflow-y-scroll scrollbar-hide min-h-full bg-slate-700 border-solid border-slate-800 border-r-2 absolute md:static transition-all md:w-2/5 xl:w-1/4`}>
      {users.map((u) => user.data?.uid == u.uid ? null : <UserItem
        onClick={() => setCurChat({user: u as UserInterface, messages: []})}
        active={curChat?.user.uid === u.uid}
        user={u as UserInterface}
        key={u.uid}/>)}
    </section>
  );
};

export default UserList;
