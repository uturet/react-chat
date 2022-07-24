import React from 'react';
import {useUser} from 'reactfire';
import Main from './Main';
import Auth from './Auth';

const Guard = () => {
  const user = useUser();
  console.log(user);
  return (
    <>
      {user.data ? <Main/> : <Auth/>}
    </>
  );
};

export default Guard;
