import React from 'react';
import {useUser} from 'reactfire';
import Main from './Main';
import Auth from './Auth';
import {ChatProvider} from './ChatContext';

const Guard = () => {
  const user = useUser();

  if (user.data) {
    return (
      <ChatProvider>
        <Main/>
      </ChatProvider>
    );
  }

  return <Auth/>;
};

export default Guard;
