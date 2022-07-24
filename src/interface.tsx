export interface UserInterface {
    online: boolean
    typing: boolean
    displayName: string
    photoURL: string
    uid: string
    chats: UserChatInterface[]
}

export interface UserChatInterface {
    user: UserInterface
    chat: ChatInterface
}

export interface ChatInterface {
    messages: MessageInterface[]
}

export interface MessageInterface {
    timestamp: number
    viewed: boolean
    content: string
}
