import React, { useEffect, useState, useContext, Fragment } from 'react';
import axios from 'axios';
import { GameContext } from '../context/GameContext';


const MovieBox = React.memo(function({ id, player }){
    const [ movieDetails, setMovieDetails] = useState('');
    const { addPlayerScore, addOpponentScore } = useContext(GameContext);

    useEffect(() => {
        id && fetchMovie(id);

        return () => {
            setMovieDetails('');
        }
    }, [id])

    const fetchMovie = async (id) => {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '64337330',
                i: id
            }
        });
        setMovieDetails(response.data);
        player ?
            addPlayerScore(response.data.imdbRating) :
            addOpponentScore(response.data.imdbRating)
    }

    return(
        <Fragment>
            { movieDetails ? (
                <div className="flex flex-col items-center mt-4">
                    <div className="h-24 w-24 lg:h-32 lg:w-32 rounded">
                        <img className="h-full w-full shadow rounded" src={movieDetails.Poster} alt={movieDetails.imdbRating} />
                    </div>
                    <p className="text-xs font-medium mt-px">IMDB: {movieDetails.imdbRating}</p>
                    <p className="text-sm max-w-md">{movieDetails.Title}</p>
                </div>
            ): null}
        </Fragment>
    )
})

export default MovieBox;