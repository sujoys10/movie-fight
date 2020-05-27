import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client'

export const  SocketContext = React.createContext();

const SocketInstance = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io();
        socketRef.current = socket;
       // console.log(socket)
    },[])

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}

export default SocketInstance