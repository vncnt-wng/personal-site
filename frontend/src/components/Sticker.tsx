import { useEffect, useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import Konva from "konva"



export interface SheetStickerInfo {
	id: string,
	x: number,
	y: number,
	rotation: number,
	scaleX: number,
	scaleY: number,
	editable: boolean,
	url: string,
	stickerBorderEnabled: boolean,
	stickerBorderWidth?: number,
}

interface StickerProps {
	stickerData: SheetStickerInfo,
	onStickerSelect?: (el: any) => void,
	applyStickerTransform?: (stickerData: SheetStickerInfo) => void
}

const Sticker = ({ stickerData, onStickerSelect, applyStickerTransform }: StickerProps) => {
	const imageRef = useRef<any>(null);
	const [image] = useImage(stickerData.url, "anonymous");

	useEffect(() => {
		if (image) {
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
		var nPixels = imageData.data.length;
		for (var i = 3; i < nPixels; i += 4) {
			if (imageData.data[i] > 0) {
				imageData.data[i] = 255;
			}
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(imageData, 0, 0);
		return canvas;
	}

	const getSmoothedColouredShadow = (
		imageData: ImageData,
		canvas: HTMLCanvasElement,
		tempCanvas: HTMLCanvasElement,
		shadowSize: number,
		shadowColour: string,
		filled: boolean = true
	) => {
		// Clear canvases and write imageData to tempCanvas
		const ctx = canvas.getContext('2d')!;
		const tempCtx = tempCanvas.getContext('2d')!;
		ctx.clearRect(0, 0, imageData.width, imageData.height)
		tempCtx.clearRect(0, 0, imageData.width, imageData.height)
		tempCtx.putImageData(imageData, 0, 0);
		removeTransparency(tempCanvas);


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
		const SMOOTH_MAX_THRESHOLD = 10;

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

		let imageWithBorder = getSmoothedColouredShadow(imageData, canvas, tempCanvas, stickerData.stickerBorderWidth! * 0.8, "black")
		imageWithBorder = getSmoothedColouredShadow(imageWithBorder, canvas, tempCanvas, stickerData.stickerBorderWidth! * 1.2, "white")
		imageWithBorder = getSmoothedColouredShadow(imageWithBorder, canvas, tempCanvas, 2, "grey", false)

		for (let i = 0; i < imageData.data.length; i += 1) {
			imageData.data[i] = imageWithBorder.data[i]
		}

		// Interpolate between original transparent and new 
		// for (let i = 3; i < imageData.data.length; i += 4) {
		// 	var alpha = imageData.data[i] / 255;
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
		// }
	}

	return (
		!stickerData.editable ?
			<Image
				{...stickerData}
				ref={imageRef}
				image={image}
				filters={[stickerBorder, Konva.Filters.Blur]}
			/> :
			<Image
				{...stickerData}
				ref={imageRef}
				image={image}
				filters={stickerData.stickerBorderEnabled ? [stickerBorder] : undefined}
				draggable
				onClick={onStickerSelect}
				onTap={onStickerSelect}
				onDragEnd={(e) => {
					applyStickerTransform!({
						...stickerData,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransformEnd={(e) => {
					const node = imageRef.current;
					applyStickerTransform!({
						...stickerData,
						x: node.x(),
						y: node.y(),
						scaleX: node.scaleX(),
						scaleY: node.scaleY(),
						rotation: node.rotation()
					});
				}}
			/>
	)
}

export default Sticker;
