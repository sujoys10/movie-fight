import React, { useState, useContext } from 'react';
//import useSWR from 'swr';
import axios from 'axios';
import MovieList from './MovieList';
import { GameContext } from '../context/GameContext';
import { SocketContext } from '../context/SocketContext';

export default function SearchBox(){    
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ searchResult, setSearchResult ] = useState([]);
    const { player } = useContext(GameContext);
    const { socket } = useContext(SocketContext);


    const handleInputChange = async (e) => {
        setSearchTerm(e.target.value);
        //console.log('input: ',e.target.value);
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '64337330',
                s: e.target.value
            }
        });
        if(response.data.Error){
            return [];
        }
        setSearchResult(response.data.Search);
    }

    const handleFocus = () => {
        socket.emit('searching');
    }

    return(
        <div className="flex flex-col items-center w-full">
            <input
                className="my-1 p-1 w-full rounded-sm text-black text-sm"
                name="search" 
                type="text"
                placeholder="Search Movie"
                disabled={!!player.movie}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleFocus}
            />
            
            <MovieList searchResult={searchResult} clearInput={setSearchTerm} />
        </div>
    )
}