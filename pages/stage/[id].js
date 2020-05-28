import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer, Slide} from 'react-toastify';
import Player from "../../components/Player";
import Opponent from "../../components/Opponent";
import { SocketContext } from "../../context/SocketContext";
import { GameContext } from "../../context/GameContext";
import ScoreCard from "../../components/ScoreCard";
import Layout from "../../components/Layout";
import ErrorBoundary from '../../components/ErrorBoundary';

export default function Stage(){
    const Router = useRouter();
    const { socket } = useContext(SocketContext);
    const { player, opponent, nextRound, addOpponentName, resetGame } = useContext(GameContext);
    const [ open, setOpen ] = useState(false);
    const [ round, setRound ] = useState(2)


    const handleRouteChange = (url) => {
      socket && socket.emit('leaveRoom');
    }

    const resetStage = () => {
      setRound(2);
      resetGame();
      setOpen(false)
    }

    const startNextRound = () => {
      nextRound();
      toast.info('Next round 🦄');
    }

    useEffect(() => {
      Router.events.on('routeChangeStart', handleRouteChange);

      //listen to welcome message
      socket && socket.on('welcomeMsg', msg => {
        console.log('welcome:' ,{msg})
      })

      //listen to new member joining
      socket && socket.on('newMember', name => {
        console.log('newMember: ' ,`${name} joined`)
        toast.info(`${name} joined`);
        addOpponentName(name);
      })

      socket && socket.on('opponentLeft', (opponent) => {
        console.log('opponent left');
        toast.error(`${opponent} left`)
        setRound(1);
        resetGame();
        setOpen(false)
      })

      socket && socket.on('ownerLeft', (owner) => {
          console.log('owner left');
          toast.error(`${owner} left.`);
          Router.replace('/home');
      })

      return () => {
        Router.events.off('routeChangeStart', handleRouteChange)
        resetStage();
        if(socket){
          socket.off('opponentLeft');
          socket.off('ownerLeft');
          socket.off('newMember');
          socket.off('welcomeMsg');
        }
      }
    },[])

    

    useEffect(() => {
      if(player.movie && opponent.movie){
        const currentRound = round - 1;
        setRound(currentRound);
        if(currentRound === 0){
          setOpen(true)
        }else{
          setTimeout(startNextRound, 2500);
        }
      }
    }, [player.movie, opponent.movie])

    return(
      <ErrorBoundary>
        <Layout>
          <div className="relative h-game">
            <div className="flex flex-col h-full">
                <Opponent />
                <Player />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black
                  rounded-full h-12 w-12 
            ">
              <p className="text-white text-xl font-medium  text-center my-15p">{round}</p>
            </div>
            { open ? <ScoreCard closeModal={setOpen} resetRound={setRound} /> : null }
            <ToastContainer
              position="top-center"
              autoClose={1000}
              closeOnClick={false}
              hideProgressBar
              transition={Slide}
              rtl={false}
            />
          </div>
        </Layout>
      </ErrorBoundary>
    )
}

