import React, { useContext, useState, useEffect } from 'react';
import MovieBox from './MovieBox';
import { SocketContext } from '../context/SocketContext';
import { GameContext } from '../context/GameContext';
import ErrorBoundary from './ErrorBoundary';

export default function Opponent(){
    const { socket } = useContext(SocketContext);
    const { opponent, addOpponentMovie, addSelectedMovies } = useContext(GameContext);
    const [ searching, setSearching ] = useState(false);

    useEffect(() => {
        //listen searching event
        socket && socket.on('searching', () => {
            setSearching(true);
        })

        //listen to selectedMovieByOpponent
        socket && socket.on('selectedMovieByOpponent', movie => {
            setSearching(false);
            addOpponentMovie(movie)
            addSelectedMovies(movie);
        })

        return () => {
            if(socket){
                socket.off('searching');
                socket.off('selectedMovieByOpponent');
            }
        }
    })

    return(
        <ErrorBoundary>
            <div className="h-half ">
                <div className="mx-2 flex justify-between">
                    <p className="text-sm uppercase tracking-wider" >{opponent.name? opponent.name : 'waiting...'}</p>
                    <p>score: {opponent.score}</p>
                </div>
                <div className="flex flex-col items-center my-1">
                    { searching && (
                        <p className="m-1 font-medium">Searching...</p>
                    )}
                    <MovieBox id={opponent.movie}/>
                </div>
            </div>
        </ErrorBoundary>
       
    )
}