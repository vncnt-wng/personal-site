
import { Stage, Layer, Star, Text, Image, Transformer } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import "../App.css";




const createSVGImageElement = () => {

}

interface StickerProps {
	stickerData: StickerData,
	setStickerRef: (el: any) => void
}

// const Sticker = ({ stickerData, setStickerRef }: StickerProps) => {
// 	const {
// 		x,
// 		y,
// 		selected
// 	} = stickerData
// 	const [image] = useImage('https://konvajs.org/assets/lion.png');

// 	return (
// 		<>
// 			<Image
// 				x={x}
// 				y={y}
// 				ref={setStickerRef}
// 				image={image}
// 				draggable
// 			// onDragEnd={(e) => {
// 			// 	onChange({
// 			// 		...shapeProps,
// 			// 		x: e.target.x(),
// 			// 		y: e.target.y(),
// 			// 	});
// 			// }}
// 			// onTransformEnd={(e) => {
// 			// 	// transformer is changing scale of the node
// 			// 	// and NOT its width or height
// 			// 	// but in the store we have only width and height
// 			// 	// to match the data better we will reset scale on transform end
// 			// 	const node = imageRef.current;
// 			// 	const scaleX = node.scaleX();
// 			// 	const scaleY = node.scaleY();

// 			// 	// we will reset it back
// 			// 	node.scaleX(1);
// 			// 	node.scaleY(1);
// 			// 	onChange({
// 			// 		...shapeProps,
// 			// 		x: node.x(),
// 			// 		y: node.y(),
// 			// 		// set minimal value
// 			// 		width: Math.max(5, node.width() * scaleX),
// 			// 		height: Math.max(node.height() * scaleY),
// 			// 	});
// 			// 	}}

// 			/>
// 		</>
// 	)
// }

interface StickerData {
	x: number,
	y: number,
	id: string
}

const initialStickers: StickerData[] = [
	{
		x: 200,
		y: 200,
		id: "img1"
	},
	{
		x: 300,
		y: 300,
		id: "img2"
	}
];


const StickerCanvas = () => {
	// const stickerRefs = useRef(Array.from({ length: initialStickers.length }, a => React.createRef()))
	const [stickers, setStickers] = useState<StickerData[]>(initialStickers);
	const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([]);
	const transformerRef = useRef<any>();
	const editLayerRef = useRef<any>();
	const [image] = useImage('https://konvajs.org/assets/lion.png');

	useEffect(() => {
		console.log("got here")
		console.log(transformerRef)
		if (transformerRef) {
			console.log(editLayerRef.current)
			const stickerNodes = selectedStickerIds.map((id) => editLayerRef.current.findOne("#" + id))
			transformerRef.current!.nodes(stickerNodes);
			transformerRef.current!.getLayer().batchDraw();
			// console.log(transformerRef)
		}
	}, [selectedStickerIds])


	const checkDeselect = (e: Konva.KonvaEventObject<any>) => {
		console.log("check deselct")
		// deselect when clicked on empty area
		const clickedOnEmpty = e.target._id === e.target.getStage()?._id;
		if (clickedOnEmpty) {
			setSelectedStickerIds([]);
			// transformerRef.current!.nodes([]);
		}
	};

	const onStickerSelect = (e: Konva.KonvaEventObject<any>, i: number) => {
		console.log(e.evt.shiftKey)
		const stickerId = e.target.id()
		const isAlreadySelected = selectedStickerIds.indexOf(stickerId) >= 0;

		if (e.evt.shiftKey && isAlreadySelected) {
			setSelectedStickerIds(selectedStickerIds.filter((id) => id !== stickerId))
		} else if (e.evt.shiftKey) {
			setSelectedStickerIds([...selectedStickerIds, stickerId])
		} else {
			setSelectedStickerIds([stickerId])
		}
		console.log(selectedStickerIds)
	}

	// const setStickerRef = (el: any, index: number) => {
	// 	stickerRefs.current[index] = el
	// 	// setStickerRefs(newStickerRefs)
	// 	console.log(stickerRefs)
	// }

	return (
		<Stage
			width={window.innerWidth}
			height={window.innerHeight}
			onMouseDown={checkDeselect}
			onTouchStart={checkDeselect}
		>
			<Layer ref={editLayerRef}>

				{stickers.map((sticker, i) =>
					<Image
						{...sticker}
						// ref={el => setStickerRef(el, i)}
						image={image}
						onClick={e => onStickerSelect(e, i)}
						onTap={e => onStickerSelect(e, i)}
						draggable
						stroke={'black'}
						strokeWidth={5}
					/>
				)}
				<Transformer
					ref={transformerRef}
				/>
			</Layer>
		</Stage >
	)
}

export default StickerCanvas;