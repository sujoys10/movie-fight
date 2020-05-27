import '../styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import  SocketInstance  from "../context/SocketContext";
import GameState from "../context/GameContext";

function MyApp({ Component, pageProps }) {

    return (
        <SocketInstance>
            <GameState>
                <Component {...pageProps} />
            </GameState>
        </SocketInstance>
    )}
  
  export default MyApp;