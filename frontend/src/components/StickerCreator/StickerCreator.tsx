import { useState } from "react"
import StickerCreatorCanvas from "./StickerCreatorCanvas"
import { Colour } from "../../@types/context"


const StickerCreator = () => {
	const brushTypes = ["brush", "fill"]
	const [brushType, setBrushType] = useState<string>("brush")
	const [brushSize, setBrushSize] = useState<number>(4)
	const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
	const [colour, setColour] = useState<Colour>({ r: 0, g: 0, b: 0, a: 1.0 })
	const [name, setName] = useState<string>("unnamed")
	const WIDTH = 400
	const HEIGHT = 400

	const onBrushSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setBrushType(e.target.value)
	}

	const getColourStyleString = (colour: Colour) => {
		return "rgb(" + colour.r + "," + colour.g + "," + colour.b + "," + colour.a + ")"
	}

	const onColourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColour = { ...colour }
		newColour[e.target.name] = e.target.value
		setColour(newColour)
	}

	const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const handleExport = (e: any) => {
		const dataURL = canvasElement!.toDataURL("img/png");
		const link = document.createElement('a');
		link.download = name + '.png';
		link.href = dataURL;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	const handleSave = () => {

	}

	return (
		<div className="h-full w-full grid grid-cols-2" style={{ backgroundColor: "pink" }}>
			<StickerCreatorCanvas
				brushType={brushType}
				brushSize={brushSize}
				colour={colour}
				width={WIDTH}
				height={HEIGHT}
				setCanvasElement={setCanvasElement}
			/>
			<div className="col-span-1 flex flex-col justify-start align-middle gap-4 p-4 w-2/3">
				<input
					value={name}
					className="rounded-lg px-3 py-1 shadow-md"
					onChange={onNameFieldChange}></input>
				<button
					className="bg-red-400 px-3 py-1 box-border border-2 border-red-500 rounded-lg shadow-md"
					onClick={() => {
						canvasElement!.getContext("2d")!.clearRect(0, 0, WIDTH, HEIGHT)
					}}
				>Clear canvas</button>
				<select
					name="brushSelect"
					id="brushSelect"
					onChange={onBrushSelectChange}
					className="bg-purple-300 px-3 py-1 box-border border-2 border-purple-400 rounded-lg shadow-md"
				>
					{brushTypes.map((brush, i) =>
						<option value={brush} key={i}>{brush}</option>
					)}
				</select>

				<div className="flex flex-col gap-2 py-2">
					<div className="flex flex-row justify-center">
						<div className="m-w-0 flex-shrink-0 flex-grow-0 box-border border-4 rounded-full w-24 h-24 shadow-lg" style={{ backgroundColor: getColourStyleString(colour) }}></div>
					</div>
					<form className="flex flex-col px-4">
						{["r", "g", "b"].map((col) =>
							<div className="grid grid-cols-9">
								<p className="col-span-2">{col}: {colour[col]}</p>
								<input className="col-span-7" name={col} type="range" min={0} max={255} value={colour[col]} onChange={e => onColourChange(e)} />
							</div>
						)}
						<div className="grid grid-cols-9">
							<p className="col-span-2">a: {colour["a"]}</p>
							<input className="col-span-7" name="a" type="range" min={0} max={1} value={colour.a} step={0.01} onChange={e => onColourChange(e)} />
						</div>
						<div className="grid grid-cols-5 pt-3">
							<p className="col-span-2">Brush Size: {brushSize}</p>
							<input className="col-span-3" name="brushSize" type="range" min={1} max={40} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} />
						</div>
					</form>
				</div>
				<div className="flex flex-row gap-2 justify-center">
					<button className="bg-purple-300 px-4 py-1 box-border border-2 border-purple-400 rounded-lg shadow-md" onClick={handleExport}>Export</button>
					<button className="bg-purple-300 px-4 py-1 box-border border-2 border-purple-400 rounded-lg shadow-md" onClick={handleSave}>Save</button>
				</div>
			</div>
		</div>
	)
}

export default StickerCreator