import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import Room from './Room';
import ErrorBoundary from './ErrorBoundary';

export default function RoomList(){
    const { socket } = useContext(SocketContext);
    const [roomsList, setRoomsList ] = useState([]);

    useEffect(() => {
        fetchRooms();
    },[]);

    const fetchRooms = async () => {
        const availableRooms = await axios.get('https://movie-battle.herokuapp.com/roomlist');
        setRoomsList(availableRooms.data);
    }

    useEffect(() => {
        socket && socket.on('roomList', rooms => {
            setRoomsList(rooms);
        })

         return () => {
            socket && socket.off('roomList');
        } 
    },[]);

    return(
        <ErrorBoundary>
            <div>
                { roomsList.length !== 0? (
                    <div>
                        { roomsList.map((room, index) => (
                            <Room key={index} room={room} />
                        ))}
                    </div>
                ): <p className="m-2 text-center">No rooms available</p> 
                }
            </div>
        </ErrorBoundary>
    )
}

