import React, { useContext } from 'react';
import {  useRouter } from 'next/router';
import { SocketContext } from '../context/SocketContext';
import { GameContext } from '../context/GameContext';
import Button from './utils/Button';

export default function Room({ room }){
    const { socket } = useContext(SocketContext);
    const { player, addOpponentName } = useContext(GameContext);
    const Router = useRouter();

    const handleJoinRoom = () => {

        const nickname = localStorage.getItem('nickname');
        socket.emit('join', { name: player.name, room: room.name })
        addOpponentName(room.owner);
        Router.push('/stage/[id]', `/stage/${room.name}`);

    }

    return (
        <div className="bg-white flex justify-between m-2 px-2 py-1 shadow rounded">
            <div className="-mb-1">
                <p className="font-medium">{room.name}</p>
                <p className="font-xs text-gray-700">admin: {room.owner}</p>
            </div>
            <Button 
                name="JOIN"
                handleClick={handleJoinRoom}
            />
        </div>
    )
}