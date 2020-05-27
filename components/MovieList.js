import React, { Fragment, useState, useEffect, useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function MovieList({ searchResult, clearInput }){
    const [ open, setOpen ] = useState(false);
    const [ option, setOption ] = useState([]);
    const { selectedMovies, addSelectedMovies, addPlayerMovie } = useContext(GameContext)
    

    const handleSelect = (id) => {
        setOpen(false);
        clearInput('');
        //call onSelectOption
        addSelectedMovies(id);
        addPlayerMovie(id);
    }

    useEffect(() => {
        //remove all the selected movies from searchResult
        const availableOptions = searchResult.filter(x => {
            return !selectedMovies.includes(x.imdbID)
        });
        setOpen(true)
        setOption(availableOptions);
    },[searchResult])

    return (
        <div className="bg-white max-h-8 w-full overflow-y-auto rounded-sm">
            { open && 
                option.length !== 0 && 
                    option.map((movie,index) => (
                        <Fragment key={index}>
                            <div
                              className=" flex items-center px-1  mt-1 curser-pointer" 
                              onClick={() => handleSelect(movie.imdbID)}>
                                <div className="bg-gray-400 w-6 h-6">
                                    <img className="h-full w-full" src={movie.Poster}/>
                                </div>
                                <p className="text-xs pl-2">{movie.Title}</p>
                            </div>
                        </Fragment>
                    ))
            }
        </div>
    )
}