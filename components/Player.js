import React, { useContext } from 'react';
import SearchBox from './SearchBox';
import MovieBox from './MovieBox';
import { GameContext } from '../context/GameContext';


export default function Player(){
    const { player } = useContext(GameContext);

    return(
        <div className="bg-gray-200 h-53">
            <div className="mx-2 flex justify-between">
                <p className="text-sm uppercase tracking-wider">{player.name}</p>
                <p>score: {player.score}</p>
            </div>
            <div className="flex flex-col items-center w-48 my-1 mx-auto">
                <SearchBox />
                <MovieBox player={true} id={player.movie}/>
            </div>
        </div>
    )
}