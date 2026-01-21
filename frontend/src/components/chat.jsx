import React, { useState } from 'react'
import { useSocket } from '../context/socketContext';

const Chat = () => {
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useSocket();

    const sendMessageHandler = (e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }
    return (
        <div>
            <h1>Chat</h1>
            <form onSubmit={sendMessageHandler}>
                <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter message' />
                <button type='submit'>Send</button>
            </form>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    )
}

export default Chat