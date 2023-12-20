import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import StickerCanvas from './components/StickerCanvas';
import StickerCreator from "./components/StickerCreator";
import Navbar from './components/Navbar';

const App = () => {
	return (
		<div className="App">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<StickerCanvas />}></Route>
					<Route path="/stickerSheet" element={<StickerCanvas />}></Route>
					<Route path="/stickerCreator" element={<StickerCreator />}></Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
