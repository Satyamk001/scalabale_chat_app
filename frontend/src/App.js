import './App.css';
import Chat from './components/chat';
import { SocketProvider } from "./context/socketContext";
function App() {
  return (
    <div className="App">
     <SocketProvider>
     <Chat/>
     </SocketProvider>
    </div>
  );
}

export default App;
