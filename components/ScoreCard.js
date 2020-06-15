import React, { useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { SocketContext } from '../context/SocketContext';
import { GameContext } from '../context/GameContext';
import Button from './utils/Button';
import ErrorBoundary from './ErrorBoundary';

export default function ScoreCard({closeModal, resetRound}){
    const Router = useRouter();
    const { player, opponent, calculateScore , startRematch } = useContext(GameContext);
    const { socket } = useContext(SocketContext);
    const [ rematch, setRematch ] = useState(false);
    const toastID = useRef('');

    const handlePlayAgain = () => {
        //emit rematch request
        socket && socket.emit('rematch', player.name);
        toastID.current = toast.info('Waiting for response...', {
            autoClose: false
        })
        //setWaiting(true);
    }

    const handleAcceptRematch = () => {   
        //emit rematch acception
        socket && socket.emit('rematchAccepted');
        toast.dismiss(toastID.current);

        closeModal(false);
        startRematch();
        resetRound(3);

    }

    const handleRouteToHome = () => {
        //emit leave room
        Router.replace('/home');
    }

    useEffect(() => {
         //listen to rematch
         socket && socket.on('playAgain', user => {
            toastID.current = toast.info(`${opponent.name} wants a rematch`, {
                autoClose: false
            })
            setRematch(true);
        })

        //listen to rematch acception
        socket && socket.on('startRematch', () => {
            toast.dismiss(toastID.current);
            toast.info(`Challenge accepted`, {
                autoClose: 800
            });
            //setWaiting(false);
            closeModal(false);
            startRematch();
            resetRound(2);
        })

        return () => {
            toastID.current &&  toast.dismiss(toastID.current);
            if(socket){
                socket.off('playAgain');
                socket.off('startRematch');
            }
        }
    }, [])

    return (
        <ErrorBoundary>
            <div
            style={{top:0, left:0}}
            className="fixed bg-black bg-opacity-75 h-screen w-screen">
                <div className="fixed bg-theme top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        bg-gray-100 h-48 w-64 rounded p-2 flex flex-col items-center
                ">
                    <p className="font-medium uppercase tracking-wilder mb-1">Scorecard</p>
                    <p className="capitalize font-semibold my-1">{calculateScore()}</p>
                    <table className="table-auto my-1">
                        <thead>
                        <tr>
                            <th className="border px-3 py-1 capitalize">{player.name? player.name : 'you'}</th>
                            <th className="border px-3 py-1 capitalize">{opponent.name? opponent.name : 'opponent'}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border p-1 text-center">{player.score}</td>
                            <td className="border p-1 text-center">{opponent.score}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="inline-block">
                        <Button name="home" handleClick={handleRouteToHome}/>
                        { !rematch ?
                            <Button name="Play Again" handleClick={handlePlayAgain} /> :
                            <Button name="Accept" handleClick={handleAcceptRematch}/>
                        }
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}