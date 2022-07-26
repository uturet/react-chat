import {Timestamp, DocumentReference, DocumentData} from 'firebase/firestore';

export interface UserInterface {
    online: boolean
    displayName: string
    photoURL: string
    uid: string
}

export interface LocalChatInterface extends ChatInterface {
    user: UserInterface
}

export interface ChatInterface {
    users: string[] // uid[]
    typing: string[] // uid[]
    messages: MessageInterface[]
    ref?: DocumentReference<DocumentData>
}

export interface MessageInterface {
    sender: string // user.uid
    timestamp: Timestamp
    viewed: boolean
    content: string
}
