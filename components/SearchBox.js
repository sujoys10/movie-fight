import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import MovieList from './MovieList';
import { SocketContext } from '../context/SocketContext';
import { debounce } from '../utils/debounce';
import { GameContext } from '../context/GameContext';

export default function SearchBox(){    
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ searchResult, setSearchResult ] = useState([]);
    const { socket } = useContext(SocketContext);
    const { player, opponent } = useContext(GameContext);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);  
        debouncify(e.target.value)
    }

    const fetchMovie = async (input) => {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: process.env.omdb_api,
                s: input
            }
        });
        if(response.data.Error){
            return [];
        }
        setSearchResult(response.data.Search);
    }

    const debouncify = useCallback(debounce(fetchMovie, 300),[]);


    const handleFocus = () => {
        socket && socket.emit('searching');
    }

    return(
        <div className="flex flex-col items-center w-full">
            <input
                className="my-1 p-1 w-full rounded-sm text-black text-sm"
                name="search" 
                type="text"
                placeholder="Search Movie"
                disabled={!opponent.name || !!player.movie}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleFocus}
            />
            
            <MovieList searchResult={searchResult} clearInput={setSearchTerm} />
        </div>
    )
}