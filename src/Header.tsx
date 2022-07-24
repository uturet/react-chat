import React from 'react';
import {useUser, useAuth} from 'reactfire';
import {signOut} from 'firebase/auth';

interface HeaderProps {
  toggleDisplayUsers: () => void
  displayUsers: boolean
}
const Header: React.FunctionComponent<HeaderProps> = ({displayUsers, toggleDisplayUsers}) => {
  const user = useUser();
  const auth = useAuth();
  const logout = () => signOut(auth);

  return (
    <header>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="md:hidden absolute inset-y-0 left-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="ml-3 relative">
                <div onClick={toggleDisplayUsers} className={`flex flex-col transition-all ${displayUsers && 'rotate-90'}`}>
                  <span className='w-6 h-1 bg-slate-300 rounded'/>
                  <span className='w-6 h-1 mt-1 bg-slate-300 rounded'/>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="ml-3 relative">
                <div className='flex flex-row'>
                  <span className="h-10 w-10  bg-gray-800 flex rounded-full" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <img className="rounded-full" src={`${user.data?.photoURL}`} alt=""/>
                  </span>
                  <span className='hidden sm:block py-2 px-3 text-md text-slate-300 font-semibold'>
                    {user.data?.displayName}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="ml-3 relative">
                <div className='flex flex-row'>
                  <a
                    className="pointer inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full"
                    onClick={logout}>
                    <span>Logout <span aria-hidden="true">→</span></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
