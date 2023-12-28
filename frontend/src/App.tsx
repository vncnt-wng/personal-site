import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import StickerCanvas from './components/StickerCanvas';
import StickerCreator from "./components/StickerCreator";
import Navbar from './components/Navbar';
import { StickerCanvasProvider } from "./components/context/StickerCanvasContext";

const App = () => {
	return (
		<div className="App">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<>home</>}></Route>
					<Route path="/stickerSheet" element={<StickerCanvasProvider><StickerCanvas /></StickerCanvasProvider>}></Route>
					<Route path="/stickerCreator" element={<StickerCreator />}></Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
