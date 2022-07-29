import React from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useUser,
} from 'reactfire';
import {
  collection,
  CollectionReference,
  Timestamp} from 'firebase/firestore';
import {UserInterface} from './interface';
import {useChat} from './ChatContext';

interface UserItemProps {
  user: UserInterface
  active: boolean
  typing: boolean
  timeValidation: boolean
  onClick: () => void
  chatData: {
    unreadMsgs: number
    lastMsg: string
  }
}
export const UserItem: React.FunctionComponent<UserItemProps> = ({user, active, onClick, typing, chatData, timeValidation}) => {
  return (
    <div onClick={onClick} className={`${active && 'bg-slate-600'} w-full h-[65px] border-solid border-slate-800 border-b-2 flex flex-row items-center px-3`}>
      <div className='w-10 h-10 relative'>
        <img className='rounded-full' src={user.photoURL} alt="User`s Photo" />
        {timeValidation && user.online && <span className='w-3 h-3 bg-green-400 rounded-full absolute right-0 bottom-0' />}
      </div>
      <div className='ml-3 h-12'>
        <p className='font-semibold text-slate-300'>{user.displayName}</p>
        {typing && timeValidation ? <p className='text-green-300'>Typing...</p>: <p className='text-slate-500'>{chatData.lastMsg}</p>}
      </div>
      {chatData.unreadMsgs>0 && <div className='ml-auto rounded-full h-6 w-6 bg-slate-800 flex items-center justify-center'>
        <span className='font-semibold text-slate-300 text-xs'>{chatData.unreadMsgs}</span>
      </div>}
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
  const {status, data: users} = useFirestoreCollectionData<UserInterface>(usersRef as CollectionReference<UserInterface>);
  const [chats, curChat, selectCurChat, typingUsers] = useChat();
  const curTime = Timestamp.now().seconds;

  const getChatData = (u: UserInterface): {unreadMsgs: number, lastMsg: string} => {
    const chatData = {
      unreadMsgs: 0,
      lastMsg: ''};
    chats.every(((c) => {
      if (c.users.includes(u.uid)) {
        chatData.lastMsg = c.messages.length > 0 ? c.messages[c.messages.length-1].content.slice(0, 20) + '...': '';
        for (let i = c.messages.length-1; i>-1; i--) {
          if (c.messages[i].sender != u.uid) continue;
          if (c.messages[i].viewed) break;
          chatData.unreadMsgs++;
        }
        return false;
      }
      return true;
    }));
    return chatData;
  };

  if (status === 'loading') {
    return <span>loading...</span>;
  }
  return (
    <section className={`${displayUsers? 'left-0': 'left-screen'} w-full overflow-y-scroll scrollbar-hide min-h-full bg-slate-700 border-solid border-slate-800 border-r-2 absolute md:static transition-all md:w-2/5 xl:w-1/4`}>
      {users.map((u) => user.data?.uid == u.uid ? null : <UserItem
        typing={typingUsers.has(u.uid)}
        onClick={() => selectCurChat(u)}
        active={Boolean(curChat.chat?.users.includes(u.uid))}
        user={u}
        timeValidation={curTime - u.lastUpdate.seconds < 120}
        chatData={getChatData(u)}
        key={u.uid}/>)}
    </section>
  );
};

export default UserList;
