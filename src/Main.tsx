import React from 'react';
import {useAuth, useUser} from 'reactfire';
import {signOut} from 'firebase/auth';


const Main = () => {
  const user = useUser();
  const auth = useAuth();
  console.log(user);
  console.log(auth);
  const logout = () => signOut(auth);

  return (
    <main>
      <button onClick={logout}>Logout</button>
    </main>

  );
};

export default Main;
