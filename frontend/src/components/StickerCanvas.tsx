
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
	onStickerSelect: (el: any) => void
}

const Sticker = ({ stickerData, onStickerSelect }: StickerProps) => {
	const imageRef = useRef<any>(null);
	const [image] = useImage(stickerData.url, "anonymous");
	// const [image] = useImage('https://konvajs.org/assets/lion.png', "anonymous");

	useEffect(() => {
		if (image) {
			console.log(imageRef)
			// you many need to reapply cache on some props changes like shadow, stroke, etc.
			imageRef.current!.cache();
		}
	}, [image]);

	const canvas = document.createElement('canvas');
	const tempCanvas = document.createElement('canvas');

	// make all pixels opaque 100% (except pixels that 100% transparent)
	function removeTransparency(canvas: HTMLCanvasElement) {
		var ctx = canvas.getContext('2d')!;

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		console.log(imageData)
		console.log(canvas.height, canvas.width)
		var nPixels = imageData.data.length;
		console.log(nPixels)
		for (var i = 3; i < nPixels; i += 4) {
			if (imageData.data[i] > 0) {
				imageData.data[i] = 255;
			}
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(imageData, 0, 0);
		return canvas;
	}

	function allNonTransparentGrayScale(canvas: HTMLCanvasElement, grayscaleValue: number) {
		const ctx = canvas.getContext('2d')!;

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const nPixels = imageData.data.length;

		for (let i = 3; i < nPixels; i += 4) {
			if (imageData.data[i] > 0) {
				imageData.data[i] = 255;
				imageData.data[i - 1] = grayscaleValue;
				imageData.data[i - 2] = grayscaleValue;
				imageData.data[i - 3] = grayscaleValue;
			}
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(imageData, 0, 0);
		return canvas;
	}

	const getSmoothedColouredShadow = (
		canvas: HTMLCanvasElement,
		tempCanvas: HTMLCanvasElement,
		shadowSize: number,
		shadowColour: string,
		filled: boolean = true
	) => {

		var ctx = canvas.getContext('2d')!;

		// 3. we will use shadow as border
		// so we just need apply shadow on the original image
		ctx.save();
		ctx.shadowColor = shadowColour;
		ctx.shadowBlur = shadowSize;
		ctx.drawImage(tempCanvas, 0, 0);
		ctx.restore();

		// - Then we will dive in into image data of [original image + shadow]
		// and remove transparency from shadow
		const tempImageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

		const SMOOTH_MIN_THRESHOLD = 3;
		var SMOOTH_MAX_THRESHOLD = 5;

		let val, hasValue;

		if (filled) {
			for (var i = 3; i < tempImageData.data.length; i += 4) {
				// skip opaque pixels
				if (tempImageData.data[i] === 255) {
					continue;
				}

				val = tempImageData.data[i];
				hasValue = val !== 0;
				if (!hasValue) {
					continue;
				}
				if (val > SMOOTH_MAX_THRESHOLD) {
					val = 255;
				} else if (val < SMOOTH_MIN_THRESHOLD) {
					val = 0;
				} else {
					val =
						((val - SMOOTH_MIN_THRESHOLD) /
							(SMOOTH_MAX_THRESHOLD - SMOOTH_MIN_THRESHOLD)) *
						255;
				}
				tempImageData!.data[i] = val;
			}
		}

		return tempImageData;
	}

	const stickerBorder = (imageData: ImageData) => {
		// - first set correct dimensions for canvases
		canvas.width = imageData.width;
		canvas.height = imageData.height;

		tempCanvas.width = imageData.width;
		tempCanvas.height = imageData.height;

		tempCanvas.getContext('2d')?.putImageData(imageData, 0, 0);
		removeTransparency(tempCanvas);
		const innerBorder = getSmoothedColouredShadow(canvas, tempCanvas, 4, "black")

		canvas.getContext('2d')?.clearRect(0, 0, imageData.width, imageData.height)
		tempCanvas.getContext('2d')?.clearRect(0, 0, imageData.width, imageData.height)
		tempCanvas.getContext('2d')?.putImageData(imageData, 0, 0);
		removeTransparency(tempCanvas);

		const outerBorder = getSmoothedColouredShadow(canvas, tempCanvas, 10, "white")

		canvas.getContext('2d')?.clearRect(0, 0, imageData.width, imageData.height)
		tempCanvas.getContext('2d')?.clearRect(0, 0, imageData.width, imageData.height)
		tempCanvas.getContext('2d')?.putImageData(outerBorder, 0, 0);
		removeTransparency(tempCanvas);
		const outerBorderWithDropShadow = getSmoothedColouredShadow(canvas, tempCanvas, 2, "grey", false)

		// for (let i = 3; i < imageData.data.length; i += 1) {
		// 	imageData.data[i] = outerBorderWithDropShadow.data[i]
		// }

		for (var i = 3; i < imageData.data.length; i += 4) {
			if (imageData.data[i] !== 0) {
				continue;
			} else if (innerBorder.data[i] !== 0) {
				imageData.data[i] = innerBorder.data[i]
				imageData.data[i - 1] = innerBorder.data[i - 1]
				imageData.data[i - 2] = innerBorder.data[i - 1]
				imageData.data[i - 3] = innerBorder.data[i - 1]
			} else if (outerBorderWithDropShadow.data[i] !== 0) {
				imageData.data[i] = outerBorderWithDropShadow.data[i]
				imageData.data[i - 1] = outerBorderWithDropShadow.data[i - 1]
				imageData.data[i - 2] = outerBorderWithDropShadow.data[i - 1]
				imageData.data[i - 3] = outerBorderWithDropShadow.data[i - 1]
			}
		}


		// draw resulted image(original + shadow without opacity) into canvas

		// ctx?.putImageData(imageData, 0, 0);


		// // then fill whole image with color (after that shadow is colored)
		// ctx?.save();
		// ctx!.globalCompositeOperation = 'source-in';
		// ctx!.fillStyle = color;
		// ctx?.fillRect(0, 0, canvas.width, canvas.height);
		// ctx?.restore();

		// // then we need to copy colored shadow into original imageData
		// var newImageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

		// var indexesToProcess = [];
		// for (var i = 3; i < nPixels; i += 4) {
		// 	var hasTransparentOnTop =
		// 		imageData.data[i - imageData.width * 4 * offset] === 0;
		// 	var hasTransparentOnTopRight =
		// 		imageData.data[i - (imageData.width * 4 + 4) * offset] === 0;
		// 	var hasTransparentOnTopLeft =
		// 		imageData.data[i - (imageData.width * 4 - 4) * offset] === 0;
		// 	var hasTransparentOnRight = imageData.data[i + 4 * offset] === 0;
		// 	var hasTransparentOnLeft = imageData.data[i - 4 * offset] === 0;
		// 	var hasTransparentOnBottom =
		// 		imageData.data[i + imageData.width * 4 * offset] === 0;
		// 	var hasTransparentOnBottomRight =
		// 		imageData.data[i + (imageData.width * 4 + 4) * offset] === 0;
		// 	var hasTransparentOnBottomLeft =
		// 		imageData.data[i + (imageData.width * 4 - 4) * offset] === 0;
		// 	var hasTransparentAround =
		// 		hasTransparentOnTop ||
		// 		hasTransparentOnRight ||
		// 		hasTransparentOnLeft ||
		// 		hasTransparentOnBottom ||
		// 		hasTransparentOnTopRight ||
		// 		hasTransparentOnTopLeft ||
		// 		hasTransparentOnBottomRight ||
		// 		hasTransparentOnBottomLeft;

		// 	// if pixel presented in original image - skip it
		// 	// because we need to change only shadow area
		// 	if (
		// 		imageData.data[i] === 255 ||
		// 		(imageData.data[i] && !hasTransparentAround)
		// 	) {
		// 		continue;
		// 	}
		// 	if (!newImageData?.data[i]) {
		// 		// skip transparent pixels
		// 		continue;
		// 	}
		// 	indexesToProcess.push(i);
		// }

		// for (var index = 0; index < indexesToProcess.length; index += 1) {
		// 	var i = indexesToProcess[index];

		// 	var alpha = imageData.data[i] / 255;

		// 	if (alpha > 0 && alpha < 1) {
		// 		var aa = 1 + 1;
		// 	}
		// 	imageData.data[i] = newImageData!.data[i];
		// 	imageData.data[i - 1] =
		// 		newImageData!.data[i - 1] * (1 - alpha) +
		// 		imageData.data[i - 1] * alpha;
		// 	imageData.data[i - 2] =
		// 		newImageData!.data[i - 2] * (1 - alpha) +
		// 		imageData.data[i - 2] * alpha;
		// 	imageData.data[i - 3] =
		// 		newImageData!.data[i - 3] * (1 - alpha) +
		// 		imageData.data[i - 3] * alpha;

		// 	if (newImageData!.data[i] < 255 && alpha > 0) {
		// 		var bb = 1 + 1;
		// 	}
		// }
	}

	return (
		<Image
			{...stickerData}
			ref={imageRef}
			image={image}
			onClick={onStickerSelect}
			onTap={onStickerSelect}
			draggable
			// stroke={'black'}
			// strokeWidth={5}
			filters={[stickerBorder]}
		/>
	)
}

// const Sticker = ({stickerData, setStickerRef}: StickerProps) => {
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
	id: string,
	x: number,
	y: number,
	rotation: number,
	scaleX: number,
	scaleY: number,
	editable: boolean,
	url: string
}

const initialStickers: StickerData[] = [
	{
		id: "img1",
		x: 200,
		y: 200,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		editable: true,
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
	},
	{
		id: "img2",
		x: 300,
		y: 300,
		rotation: 90,
		scaleX: 1,
		scaleY: 1,
		editable: true,
		url: "https://konvajs.org/assets/lion.png"
	},
	{
		id: "img3",
		x: 300,
		y: 400,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		editable: false,
		url: "https://konvajs.org/assets/lion.png"
	},
	{
		id: "img3",
		x: 300,
		y: 400,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		editable: true,
		url: "https://www.freeiconspng.com/img/44275"
	}
];


const StickerCanvas = () => {
	// const stickerRefs = useRef(Array.from({length: initialStickers.length }, a => React.createRef()))
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

	const onStickerSelect = (e: Konva.KonvaEventObject<any>) => {
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
			<Layer>
				{stickers.filter((s) => !s.editable).map((sticker, i) =>
					<Image
						{...sticker}
						// ref={el => setStickerRef(el, i)}
						image={image}
						stroke={'black'}
						strokeWidth={5}
					/>
				)}
			</Layer>
			<Layer ref={editLayerRef}>

				{stickers.filter((s) => s.editable).map((sticker, i) =>
					<Sticker stickerData={sticker} onStickerSelect={onStickerSelect} />
				)}
				<Transformer
					ref={transformerRef}
				/>
			</Layer>
		</Stage >
	)
}

export default StickerCanvas;