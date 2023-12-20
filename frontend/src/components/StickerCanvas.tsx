
import { Stage, Layer, Transformer } from 'react-konva';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import Sticker, { SheetStickerInfo } from './Sticker';
import "../App.css";


const initialStickers: SheetStickerInfo[] = [
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
];



interface GallerySticker {
	url: string
}


const galleryStickers: GallerySticker[] = [
	{
		url: "https://konvajs.org/assets/lion.png"
	},
	{
		url: "https://konvajs.org/assets/lion.png"
	},
	{
		url: "https://konvajs.org/assets/lion.png"
	},
	{
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
	},
	{
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
	},
	{
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
	}
]



const StickerCanvas = () => {
	// const [galleryStickers, setGalleryStickers] = useState<GallerySticker[]>(galleryStickers)
	const [stickers, setStickers] = useState<SheetStickerInfo[]>(initialStickers);
	const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([]);
	const transformerRef = useRef<any>();
	const editLayerRef = useRef<any>();

	const stageContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const stageRef = useRef(null);
	const [stageWidth, setStageWidth] = useState<number>(0);
	const [stageHeight, setStageHeight] = useState<number>(0);


	useEffect(() => {
		const handleResize = (e: any) => {
			setStageWidth(stageContainerRef.current.offsetWidth - 8);
			setStageHeight(stageContainerRef.current.offsetHeight - 8)
		};

		handleResize(null);
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (transformerRef) {
			const stickerNodes = selectedStickerIds.map((id) => editLayerRef.current.findOne("#" + id))
			transformerRef.current!.nodes(stickerNodes);
			transformerRef.current!.getLayer().batchDraw();
		}
	}, [selectedStickerIds])


	const checkDeselect = (e: Konva.KonvaEventObject<any>) => {
		// deselect when clicked on empty area
		const clickedOnEmpty = e.target._id === e.target.getStage()?._id;
		if (clickedOnEmpty) {
			setSelectedStickerIds([]);
		}
	};

	const onStickerSelect = (e: Konva.KonvaEventObject<any>) => {
		const stickerId = e.target.id()
		const isAlreadySelected = selectedStickerIds.indexOf(stickerId) >= 0;

		if (e.evt.shiftKey && isAlreadySelected) {
			setSelectedStickerIds(selectedStickerIds.filter((id) => id !== stickerId))
		} else if (e.evt.shiftKey) {
			setSelectedStickerIds([...selectedStickerIds, stickerId])
		} else {
			setSelectedStickerIds([stickerId])
		}
	}

	const applyStickerTransform = (newStickerData: SheetStickerInfo) => {
		const newStickers = stickers.slice();
		for (let i = 0; i < newStickers.length; i++) {
			if (newStickers[i].id === newStickerData.id) {
				newStickers[i] = newStickerData
			}
		}
		setStickers(newStickers);
	}

	return (
		<div className='grid grid-cols-4 fixed h-[calc(100vh-80px)] w-full top-20'>
			<div className='h-full box-border bg-indigo-400 border-indigo-500 border-4 grid grid-rows-2'>
				<div className='text-lg border-2 border-indigo-500'>
					<p>Stickers</p>
					<div className="grid grid-cols-2">
						{galleryStickers.map((gallerySticker) =>
							<img src={gallerySticker.url}>
							</img>
						)}
					</div>
				</div>
				<div className='text-lg border-2 border-indigo-500'>
					<p>Sticker Options</p>
				</div>
			</div>
			<div
				className='h-full w-full col-span-3 box-border border-pink-400 border-4'
				ref={stageContainerRef}
			>
				<Stage
					width={stageWidth}
					height={stageHeight}
					onMouseDown={checkDeselect}
					onTouchStart={checkDeselect}
					style={{ backgroundColor: 'pink' }}
					ref={stageRef}
				>
					<Layer>
						{stickers.filter((s) => !s.editable).map((sticker, i) =>
							<Sticker
								stickerData={sticker}
							/>
						)}
					</Layer>
					<Layer ref={editLayerRef}>

						{stickers.filter((s) => s.editable).map((sticker, i) =>
							<Sticker
								stickerData={sticker}
								onStickerSelect={onStickerSelect}
								applyStickerTransform={applyStickerTransform}
							/>
						)}
						<Transformer
							ref={transformerRef}
						/>
					</Layer>
				</Stage >
			</div>
		</div >

	)
}

export default StickerCanvas;