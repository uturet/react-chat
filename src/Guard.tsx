import React from 'react';
import {useUser} from 'reactfire';
import Main from './Main';
import Auth from './Auth';
import {CurChatProvider} from './CurChatContext';

const Guard = () => {
  const user = useUser();

  if (user.data) {
    return (
      <CurChatProvider>
        <Main/>
      </CurChatProvider>
    );
  }

  return <Auth/>;
};

export default Guard;
