import React from 'react';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';
import {
  AuthProvider,
  DatabaseProvider,
  useFirebaseApp,
} from 'reactfire';
import Guard from './Guard';

function App() {
  const app = useFirebaseApp();
  const database = getDatabase(app);
  const auth = getAuth(app);

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <Guard/>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
