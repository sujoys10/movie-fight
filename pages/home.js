import Head from 'next/head'
import RoomForm from '../components/RoomForm';
import { useState, useEffect, useContext } from 'react';
import RoomList from '../components/RoomList';
import { SocketContext } from '../context/SocketContext';
import Layout from '../components/Layout';

export default function Home({ onlineUsers }) {
    const { socket }= useContext(SocketContext)
    const [ users, setUsers ] = useState(onlineUsers || 0);
    const [ tab, setTab ] = useState('home');

    useEffect(() => {
      socket && socket.on('user', (count) => {
       setUsers(count)
      })

       /* return () => {
         socket.off('user')
       }  */
    },[])
    return (
      <Layout>
        <div className="container">
          <Head>
            <title>Movie Fight</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <p className="fixed top-1 right-2">Online : {users}</p>
          <div className="py-1 my-2 flex w-full">
            <p 
              className="text-center w-half p-2" 
              style={tab === 'home' ? {color: '#1c8fe7'} : null}
              onClick={() => setTab('home')}
            >Home</p>
            <p 
              className="text-center w-half p-2"
              onClick={() => setTab('rooms')}
              style={tab === 'rooms' ? {color: '#1c8fe7'} : null}
            >Rooms</p>
          </div>
          { tab === 'home' ? <RoomForm /> : <RoomList /> }
        </div>
      </Layout>
    )
}


export async function getServerSideProps(){
  const res = await fetch('https://movie-cricket.herokuapp.com/online');
  const onlineUsers = await res.json();
  return { props: { onlineUsers } }
}