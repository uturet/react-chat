export interface UserInterface {
    online: boolean
    typing: boolean
    displayName: string
    photoURL: string
    uid: string
    chats: ChatInterface[]
}

export interface ChatInterface {
    user: UserInterface
    messages: MessageInterface[]
}

export interface MessageInterface {
    timestamp: number
    viewed: boolean
    content: string
}
