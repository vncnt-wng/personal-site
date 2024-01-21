import { useEffect, useRef, useState } from "react"

interface Position {
	x: number,
	y: number,
}

interface Colour {
	[index: string]: string | number,
	r: number,
	g: number,
	b: number,
	a: number
}

const StickerCreator = () => {
	const editorCanvasRef = useRef<HTMLCanvasElement>(null)
	const editorContext = useRef<CanvasRenderingContext2D | null>(null)
	const cursorCanvasRef = useRef<HTMLCanvasElement>(null)
	const cursorContext = useRef<CanvasRenderingContext2D | null>(null)
	const [prevBrushPos, setPrevBrushPos] = useState<Position | null>({ x: 0, y: 0 })
	const [canvasPos, setCanvasPos] = useState<Position>({ x: 0, y: 0 })
	const [brushSize, setBrushSize] = useState<number>(4)
	const [colour, setColour] = useState<Colour>({ r: 0, g: 0, b: 0, a: 1.0 })
	const [mouseDown, setMouseDown] = useState<boolean>(false)
	const WIDTH = 400
	const HEIGHT = 400

	const brushTypes = ["brush", "fill"]
	const [brushType, setBrushType] = useState<string>("brush")

	const [name, setName] = useState<string>("unnamed")

	useEffect(() => {
		const canvas = cursorCanvasRef.current!
		editorContext.current = canvas.getContext("2d")
		canvas.addEventListener("mousemove", onMouseMove)
		canvas.addEventListener("mousedown", onMouseDown)
		canvas.addEventListener("mouseup", onMouseUp)
		canvas.addEventListener("click", onClick)

		cursorContext.current = cursorCanvasRef.current!.getContext("2d")
		editorContext.current = editorCanvasRef.current!.getContext("2d")

		return () => {
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mouseUp', onMouseUp);
			canvas.removeEventListener("click", onClick)
		};
	}, [])

	useEffect(() => {
		const canvas = cursorCanvasRef.current!
		canvas.addEventListener("click", onClick)
		return () => {
			canvas.removeEventListener("click", onClick)
		};
	}, [brushType, colour])

	useEffect(() => {
		if (mouseDown && brushType === "brush" && prevBrushPos !== null) {
			const editorCtx = editorContext.current!
			editorCtx.beginPath();
			editorCtx.moveTo(prevBrushPos.x, prevBrushPos.y)
			editorCtx.lineTo(canvasPos.x, canvasPos.y)
			// editorCtx.strokeStyle = "black"
			editorCtx.lineWidth = brushSize
			editorCtx.stroke()
			editorCtx.closePath()
			setPrevBrushPos(canvasPos)
		}
	}, [canvasPos])

	useEffect(() => {
		let colourString = "rgb("
		colourString += colour.r + " "
		colourString += colour.g + " "
		colourString += colour.b + " / "
		colourString += Math.abs(colour.a * 100) + "%)"
		console.log(colourString)
		editorContext.current!.strokeStyle = colourString
		editorContext.current!.fillStyle = colourString
		cursorContext.current!.fillStyle = colourString
	}, [colour])

	const onMouseMove = (e: MouseEvent) => {
		const x = e.offsetX
		const y = e.offsetY

		// Draw cursor
		const cursorCtx = cursorContext.current!
		cursorCtx.clearRect(0, 0, WIDTH, HEIGHT)
		cursorCtx.beginPath();
		cursorCtx.arc(x, y, brushSize / 2, 0, 2 * Math.PI)
		cursorCtx.fill()
		cursorCtx.closePath()

		setCanvasPos({
			x: x,
			y: y
		})
	}

	const onMouseDown = (e: MouseEvent) => {
		setMouseDown(true)
		setPrevBrushPos({ x: e.offsetX, y: e.offsetY })
	}

	const onMouseUp = () => {
		setMouseDown(false)
		setPrevBrushPos(null)
	}

	const getImageDataIndex = (x: number, y: number) => (x + y * WIDTH) * 4

	const shouldFillPixel = (x: number, y: number, initialColour: Uint8ClampedArray, imageData: ImageData) => {
		if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
			return false
		}
		const index = getImageDataIndex(x, y)
		// console.log(initialColour)
		// console.log(imageData.data.slice(index, index + 4))

		return (
			initialColour[0] === imageData.data[index] &&
			initialColour[1] === imageData.data[index + 1] &&
			initialColour[2] === imageData.data[index + 2] &&
			initialColour[3] === imageData.data[index + 3]
		)
	}

	const onClick = (e: MouseEvent) => {
		const editorCtx = editorContext.current!

		if (brushType === "brush") {
			editorCtx.beginPath();
			editorCtx.arc(e.offsetX, e.offsetY, brushSize / 2, 0, 2 * Math.PI)
			editorCtx.fill()
			editorCtx.closePath()

		} else if (brushType === "fill") {
			console.log("fill")
			const initialPos = [e.offsetX, e.offsetY]
			const seen: Set<number> = new Set<number>()
			seen.add(e.offsetX + e.offsetY * WIDTH)
			const nodes: number[][] = [initialPos]
			const imageData = editorCtx.getImageData(0, 0, WIDTH, HEIGHT)
			const startIndex = getImageDataIndex(initialPos[0], initialPos[1])
			const initialColour = imageData.data.slice(startIndex, startIndex + 4)
			console.log(initialColour)
			while (nodes.length > 0) {
				const curr = nodes.shift()!
				const pixelIndex = getImageDataIndex(curr[0], curr[1])
				imageData.data[pixelIndex] = colour.r
				imageData.data[pixelIndex + 1] = colour.g
				imageData.data[pixelIndex + 2] = colour.b
				imageData.data[pixelIndex + 3] = colour.a * 255

				checkNeighbouringPixel(curr, 1, 0, nodes, seen, initialColour, imageData)
				checkNeighbouringPixel(curr, 0, 1, nodes, seen, initialColour, imageData)
				checkNeighbouringPixel(curr, -1, 0, nodes, seen, initialColour, imageData)
				checkNeighbouringPixel(curr, 0, -1, nodes, seen, initialColour, imageData)
			}
			editorCtx.putImageData(imageData, 0, 0)
		}
	}

	const checkNeighbouringPixel = (
		currPos: number[],
		dx: number,
		dy: number,
		nodes: number[][],
		seen: Set<number>,
		initialColour: Uint8ClampedArray,
		imageData: ImageData
	) => {
		if (shouldFillPixel(currPos[0] + dx, currPos[1] + dy, initialColour, imageData) && !seen.has((currPos[0] + dx) + (currPos[1] + dy) * HEIGHT)) {
			nodes.push([currPos[0] + dx, currPos[1] + dy])
			seen.add((currPos[0] + dx) + (currPos[1] + dy) * HEIGHT)
		}
	}

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

	const handleExport = (e: any) => {
		const dataURL = editorCanvasRef.current!.toDataURL("img/png");
		const link = document.createElement('a');
		link.download = name + '.png';
		link.href = dataURL;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	const handleSave = () => {

	}

	const onNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	return (
		<div className="h-full w-full grid grid-cols-2" style={{ backgroundColor: "pink" }}>
			<div className="col-span-1 flex justify-end">
				<canvas
					height={HEIGHT}
					width={WIDTH}
					className="box-border border-4 border-indigo-600 bg-white absolute"
					ref={editorCanvasRef}
				>
				</canvas>
				<canvas
					height={HEIGHT}
					width={WIDTH}
					className="box-border border-4 border-indigo-600 bg-transparent absolute"
					ref={cursorCanvasRef}
				></canvas>
			</div>
			<div className="col-span-1 flex flex-col justify-start align-middle gap-4 p-4 w-2/3">
				<input
					value={name}
					className="rounded-lg px-3 py-1 shadow-md"
					onChange={onNameFieldChange}></input>
				<button
					className="bg-red-400 px-3 py-1 box-border border-2 border-red-500 rounded-lg shadow-md"
					onClick={() => {
						editorContext.current?.clearRect(0, 0, WIDTH, HEIGHT)
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