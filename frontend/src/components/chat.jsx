import React, { useState } from 'react'
import { useSocket } from '../context/socketContext';

const Chat = () => {
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useSocket();

    const sendMessageHandler = () => {
        sendMessage(message);
        setMessage('');
    }
    return (
        <div>
            <h1>Chat</h1>
            <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter message' />
            <button onClick={sendMessageHandler}>Send</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    )
}

export default Chat