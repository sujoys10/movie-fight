import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'

export const  SocketContext = React.createContext();

const SocketInstance = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io();
        setSocket(socket);
    },[])

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}

export default SocketInstance