import { useState, useContext, useEffect } from "react";
import { SocketContext } from "./SocketContext";

export const GameContext = React.createContext();

const GameState =({ children }) => {
    const { socket } = useContext(SocketContext);
    const [ player, setPlayer ] = useState({ name: '', score: 0, movie: '' })
    const [ opponent, setOpponent ] = useState({ name: '', score: 0, movie: '' })
    const [ selectedMovies, setSelectedMovies ] = useState([]);
    
    useEffect(() => {
        const nickname = localStorage.getItem('nickname');
        nickname && 
            setPlayer(player => ({...player, name: nickname}));
    }, [])

    const addSelectedMovies = (id) => {
        const movies = [...selectedMovies, id];
        setSelectedMovies(movies);
        //emit selectedMovie List
        socket.emit('selectedMovies', selectedMovies);
    }

    const resetGame = () => {
        setPlayer(player => ({...player, score: 0, movie: '' }));
        setOpponent({name: '', score: 0, movie: '' });
        setSelectedMovies([]);
    }

    const resetBoard = () => {
        setPlayer(player => ({ ...player, movie: ''}));
        setOpponent(opponent => ({ ...opponent, movie: ''}));
    }

    const startRematch = () => {
        setPlayer(player => ({ ...player, score: 0, movie: ''}));
        setOpponent(opponent => ({ ...opponent, score: 0, movie: ''}));
    }


    const addPlayerName = (name) => {
        setPlayer(player => ({...player, name}));
        localStorage.setItem('nickname', name);
    }
    
    const addOpponentName = (name) => {
        setOpponent(opponent => ({...opponent, name}))
    }
    const addPlayerMovie = (movie) => {
        setPlayer(player => ({...player, movie}));
        //emit movie 
        socket.emit('selectedMovie', movie);
    }

    const addOpponentMovie = (movie) => {
        setOpponent(opponent => ({...opponent, movie}));
    }

    const addPlayerScore = (point) => {
        const score = point === 'N/A'? 0 : parseInt(point.split('.')[1]);
        setPlayer({...player, score: player.score + score});
    }

    const addOpponentScore = (point) => {
        const score = point === 'N/A'? 0 : parseInt(point.split('.')[1]);
        setOpponent({...opponent, score: opponent.score + score});
    }

    const calculateScore = () => {
        if(player.score > opponent.score){
           return `${player.name} won`;
        }else if(player.score < opponent.score){
           return `${opponent.name} won`;
        }else{
           return "DRAW";
        }
    }

    return (
        <GameContext.Provider
            value={{
                player,
                opponent,
                selectedMovies,
                addPlayerName,
                addOpponentName,
                addSelectedMovies,
                addPlayerMovie,
                addOpponentMovie,
                addPlayerScore,
                addOpponentScore,
                calculateScore,
                resetBoard,
                resetGame,
                startRematch
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export default GameState;