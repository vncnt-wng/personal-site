
import { Stage, Layer, Transformer } from 'react-konva';
import Konva from 'konva';
import { useEffect, useRef, useState, useContext } from 'react';
import Sticker from './Sticker';
import { GallerySticker, StickerCanvasContextType } from '../@types/context';
import { RiSaveLine, RiExportLine, RiDeleteBinLine } from "@remixicon/react";
import { StickerCanvasContext } from './context/StickerCanvasContext';


const StickerCanvas = () => {
	const {
		galleryStickers,
		stickers,
		selectedStickerIds,
		setSelectedStickerIds,
		addStickerToArea,
		removeSelectedStickersFromArea,
		stickerBorderEnabledForId,
		stickerBorderWidthForId,
		toggleStickerBorderEnabledForId,
		setStickerBorderWidthForId
	} = useContext(StickerCanvasContext) as StickerCanvasContextType;

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
		console.log("triggered add to transformer for " + selectedStickerIds[0])
		if (transformerRef) {
			const stickerNodes = selectedStickerIds.map((id) => editLayerRef.current.findOne("#" + id))
			console.log(stickerNodes)
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
			<div className='w-full overflow-scroll max-h-full h-full box-border bg-indigo-400 border-indigo-600 border-4 grid grid-rows-2 grid-cols col-span-1'>
				<div className='flex flex-col w-full overflow-scroll border-2 h-full border-indigo-600 text-lg'>
					<div className='flex justify-between w-full p-4 bg-indigo-300 border-4 border-indigo-500'>
						<p className=''>Stickers</p>
						<div className='text-sm mt-auto mb-auto'><p>options</p></div>
					</div>

					<div className="overflow-scroll grid md:grid-cols-2 xl:grid-cols-3 gap-2">
						{galleryStickers.map((gallerySticker: GallerySticker, i: number) =>
							<img
								src={gallerySticker.url} alt={gallerySticker.name + " sticker"}
								onClick={e => addStickerToArea(gallerySticker)}
								key={i}
							>
							</img>
						)}
					</div>
				</div>
				<div className='flex flex-col w-full overflow-scroll border-2 text-lg h-full border-indigo-600'>
					<div className='flex justify-between w-full p-4 bg-indigo-300 border-4 border-indigo-500'>
						<p className=''>Sticker Options</p>
					</div>
					{selectedStickerIds.length === 0 ?
						<p className='p-4'>Please click on a sticker</p>
						: <></>}
					<div className='flex flex-col p-4 gap-2'>
						{selectedStickerIds.length >= 1 ?
							<button
								className='m-w-0 flex w-min p-3 py-1 gap-1 justify-start align-start bg-red-400 border-2 border-red-500 shadow-md rounded-lg'
								onClick={e => removeSelectedStickersFromArea()}
							>
								<i className="ri-delete-bin-line text-sm"></i>
								<p className="whitespace-nowrap text-sm">Remove Sticker</p>
							</button>
							: <></>}
						{selectedStickerIds.length === 1 ?
							<>
								<div className='flex gap-2'>
									<p className='text-sm'>Enable sticker border:</p>
									<input
										type="checkbox"
										checked={stickerBorderEnabledForId(selectedStickerIds[0])}
										onChange={e => toggleStickerBorderEnabledForId(selectedStickerIds[0])}
									/>
								</div>
								{stickerBorderEnabledForId(selectedStickerIds[0]) ?
									<div className='flex gap-2'>
										<p className='text-sm'>Sticker border width:</p>
										<input
											type="range"
											min={"2"}
											max={"15"}
											value={stickerBorderWidthForId(selectedStickerIds[0]) ?? 5}
											onChange={e => setStickerBorderWidthForId(selectedStickerIds[0], parseInt(e.target.value))}
										/>
									</div> : <></>} </>
							: <></>}
					</div>
				</div>
			</div>
			<div
				className='h-full w-full col-span-3 box-border border-pink-400 border-4'
				ref={stageContainerRef}
			>
				<div className="fixed h-30 flex flex-col justify-start gap-2 p-2 z-50">
					<button className='m-w-0 group flex w-min p-2 gap-1 justify-start align-start bg-blue-300 border-2 border-blue-400 shadow-md rounded-full'>
						<RiSaveLine className='text-lg' />
						<p className="hidden group-hover:block whitespace-nowrap mt-auto mb-auto">Save sheet</p>

					</button>
					<button
						className='m-w-0 group flex w-min p-2 gap-1 justify-start align-start bg-blue-300 border-2 border-blue-400 shadow-md rounded-full'
						onClick={handleExport}
					>
						<RiExportLine className='text-lg' />
						<p className="hidden group-hover:block whitespace-nowrap mt-auto mb-auto">Export</p>
					</button>
					{selectedStickerIds.length > 0 ?
						<button
							className='m-w-0 group flex w-min p-2 gap-1 justify-start align-start bg-red-400 border-2 border-red-500 shadow-md rounded-full'
							onClick={(e) => removeSelectedStickersFromArea()}
						>
							<RiDeleteBinLine className='text-lg' />
							<p className="hidden group-hover:block whitespace-nowrap mt-auto mb-auto">Remove Sticker</p>
						</button>
						: <></>}
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
								key={i}
							/>
						)}
					</Layer>
					<Layer ref={editLayerRef}>
						{stickers.filter((s) => s.editable).map((sticker, i) => {
							return <Sticker
								stickerData={sticker}
								key={i}
							/>
						})}
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