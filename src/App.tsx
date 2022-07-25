import React from 'react';
import {getAuth} from 'firebase/auth';
import {
  AuthProvider,
  useFirebaseApp,
  useInitFirestore,
  FirestoreProvider,
} from 'reactfire';
import Guard from './Guard';
import {initializeFirestore, enableIndexedDbPersistence} from 'firebase/firestore';

function App() {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const {status, data: firestoreInstance} = useInitFirestore(async (firebaseApp) => {
    const db = initializeFirestore(firebaseApp, {});
    await enableIndexedDbPersistence(db, {forceOwnership: true});
    return db;
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestoreInstance}>
        <Guard/>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
