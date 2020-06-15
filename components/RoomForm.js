import React, { useState, useContext } from'react';
import { useRouter } from 'next/router';
import { SocketContext } from '../context/SocketContext';
import Button from './utils/Button';
import Input from './utils/Input';


export default function RoomForm(){
    const { socket } = useContext(SocketContext);
    const [room, setRoom] = useState('');
    const Router = useRouter();

    const handleRoomChange = (e) => {
        setRoom(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const nickname = localStorage.getItem('nickname');

        socket && socket.emit('join', { name: nickname, room });
        Router.push('/stage/[id]', `/stage/${room}`)
    }
    return(
        <div className="bg-theme fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        h-32 w-64 flex items-center justify-center rounded">
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <Input 
                    name="room"
                    label="Create Room"
                    placeholder="Enter room name"
                    required={true} 
                    value={room} 
                    handleChange={handleRoomChange}
                />
                <Button name={"Go Go"}/>
            </form>
        </div>
    )
} 