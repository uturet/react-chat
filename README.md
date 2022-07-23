# Realtime Chat App with React and Firebase

### Database Structure

```js
{
    users: User[]
    chats: Chat[]
}

User {
    online: boolean
    typing: boolean
    chats: [
        {
            user: User_reference
            chat: Chat_reference
        }
    ]
}

Chat {
    message: Message[]
}

Message {
    timestamp: timestamp
    viewed: boolean
    content: string
}
```
