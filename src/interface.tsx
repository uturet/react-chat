export interface UserInterface {
    online: boolean
    displayName: string
    photoURL: string
    uid: string
}

export interface ChatInterface {
    user?: UserInterface // not stored
    users: string[] // uid[]
    typing: string[] // uid[]
    messages: MessageInterface[]
}

export interface MessageInterface {
    sender: string // user.uid
    timestamp: number
    viewed: boolean
    content: string
}
