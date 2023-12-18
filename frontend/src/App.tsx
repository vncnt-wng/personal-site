import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Layer, Star, Text, Image, Transformer } from 'react-konva';
import useImage from 'use-image';


interface StickerData {
	x: number,
	y: number,
	selected: boolean,
	id: string
}

const Sticker = ({ x, y, selected }: StickerData) => {
	const [image] = useImage('https://konvajs.org/assets/lion.png');
	const imageRef = useRef(null);
	// const transformerRef = useRef(null);

	// useEffect(() => {
	// 	transformerRef.current.nodes([imageRef!.current]);
	// 	transformerRef.current.getLayer().batchDraw();
	// }, [selected])

	return (
		<>
			<Image
				x={x}
				y={y}
				ref={imageRef}
				image={image}
				draggable
			// onDragEnd={(e) => {
			// 	onChange({
			// 		...shapeProps,
			// 		x: e.target.x(),
			// 		y: e.target.y(),
			// 	});
			// }}
			// onTransformEnd={(e) => {
			// 	// transformer is changing scale of the node
			// 	// and NOT its width or height
			// 	// but in the store we have only width and height
			// 	// to match the data better we will reset scale on transform end
			// 	const node = imageRef.current;
			// 	const scaleX = node.scaleX();
			// 	const scaleY = node.scaleY();

			// 	// we will reset it back
			// 	node.scaleX(1);
			// 	node.scaleY(1);
			// 	onChange({
			// 		...shapeProps,
			// 		x: node.x(),
			// 		y: node.y(),
			// 		// set minimal value
			// 		width: Math.max(5, node.width() * scaleX),
			// 		height: Math.max(node.height() * scaleY),
			// 	});
			// 	}}

			/>
			{/* {selected ?
				<Transformer
					ref={transformerRef}
				/> :
				<></>
			} */}
		</>
	)
}

const initialStickers: StickerData[] = [
	{
		x: 200,
		y: 200,
		selected: false,
		id: "img1"
	}
];

const App = () => {

	const [stickers, setStickers] = useState<StickerData[]>(initialStickers);
	const [selectedStickerID, setSelectedStickerID] = useState<string | null>(null);

	return (
		<div className="App">
			<Stage width={window.innerWidth} height={window.innerHeight}>
				<Layer>
					{stickers.map((sticker) =>
						<Sticker {...sticker} />
					)}
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
