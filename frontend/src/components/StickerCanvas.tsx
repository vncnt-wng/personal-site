
import { Stage, Layer, Transformer } from 'react-konva';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import Sticker, { SheetStickerInfo } from './Sticker';
import "../App.css";
import 'remixicon/fonts/remixicon.css'

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
	name: string
}


const galleryStickers: GallerySticker[] = [
	{
		url: "https://konvajs.org/assets/lion.png",
		name: "lion"
	},
	{
		url: "https://konvajs.org/assets/lion.png",
		name: "lion"
	},
	{
		url: "https://konvajs.org/assets/lion.png",
		name: "lion"
	},
	{
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
		name: "react"
	},
	{
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
		name: "react"
	},
	{
		url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
		name: "react"
	},
	{
		url: "https://konvajs.org/assets/lion.png",
		name: "lion"
	},
	{
		url: "https://konvajs.org/assets/lion.png",
		name: "lion"
	},
	{
		url: "https://konvajs.org/assets/lion.png",
		name: "lion"
	},
]



const StickerCanvas = () => {
	// const [galleryStickers, setGalleryStickers] = useState<GallerySticker[]>(galleryStickers)
	const [stickers, setStickers] = useState<SheetStickerInfo[]>(initialStickers);
	const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([]);
	const transformerRef = useRef<any>();
	const editLayerRef = useRef<any>();

	const stageContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const stageRef = useRef() as React.MutableRefObject<Konva.Stage>;
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

	const handleExport = (e: any) => {
		const dataURL = stageRef.current.toDataURL({ pixelRatio: 1 });
		const link = document.createElement('a');
		link.download = 'sticker-sheet.png';
		link.href = dataURL;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		// TODO delete link element
	}

	return (
		<div className='grid grid-cols-4 fixed h-[calc(100vh-80px)] w-full top-20'>
			<div className='overflow-scroll max-h-full h-full box-border bg-indigo-400 border-indigo-500 border-4 grid grid-rows-2'>
				<div className='overflow-scroll text-lg border-2 h-full border-indigo-500 p-2'>
					<p className='fixed p-4'>Stickers</p>
					<div className="mt-20 grid grid-cols-3 gap-2">
						{galleryStickers.map((gallerySticker) =>
							<img
								src={gallerySticker.url} alt={gallerySticker.name + " sticker"}
							// onClick={ }
							>
							</img>
						)}
					</div>
				</div>
				<div className='text-lg border-2 h-full border-indigo-500'>
					<p>Sticker Options</p>
					{selectedStickerIds.length === 0 ?
						<p>Please select a sticker</p>
						: selectedStickerIds.length > 1 ?
							<p>Cannot change options for multiple stickers at once</p>
							: <p>options</p>}
				</div>
			</div>
			<div
				className='h-full w-full col-span-3 box-border border-pink-400 border-4'
				ref={stageContainerRef}
			>
				<div className="fixed h-30 flex flex-col justify-start gap-2 p-2 z-50">
					<button className='m-w-0 group flex w-min px-3 py-2 gap-1 justify-start align-start bg-blue-300 border-2 border-blue-400 shadow-md rounded-full'>
						<i className="ri-save-line text-xl"></i>
						<p className="hidden group-hover:block over whitespace-nowrap">Save sheet</p>

					</button>
					<button
						className='m-w-0 group flex w-min px-3 py-2 gap-1 justify-start align-start bg-blue-300 border-2 border-blue-400 shadow-md rounded-full'
						onClick={handleExport}
					>
						<i className="ri-export-line text-xl"></i>
						<p className="hidden group-hover:block">Export</p>
					</button>
				</div>
				<Stage
					width={stageWidth}
					height={stageHeight}
					onMouseDown={checkDeselect}
					onTouchStart={checkDeselect}
					style={{ backgroundColor: "pink" }}
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