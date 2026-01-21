import { createContext, useCallback, useContext, useMemo, useEffect, useState } from "react";
import { io } from "socket.io-client";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = io("http://localhost:3001");
    const [messages, setMessages] = useState([]);

    const sendMessage = useCallback((msg) => {
        console.log("Message sent", msg);
        socket.emit("message", msg);
    }, [socket])

    const onMessageReceived = useCallback((msg) => {
        console.log("Message from server", msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
    }, [])
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        })
        socket.on("message", onMessageReceived);
        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        })
        return () => {
            socket.disconnect();
        }
    }, [socket])
    return (
        <SocketContext.Provider value={{ socket, sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    if (!SocketContext) {
        throw new Error("useSocket must be used within a SocketProvider")
    }
    return useContext(SocketContext)
}