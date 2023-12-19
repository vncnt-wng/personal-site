import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import StickerCanvas from './components/StickerCanvas';
import Navbar from './components/Navbar';

const App = () => {
	return (
		<div className="App">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<StickerCanvas />}></Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
