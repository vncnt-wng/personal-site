import { useRef, useState, useEffect } from "react"
import { Position, Colour } from "../../@types/context"


interface StickerCreatorCanvasProps {
	brushType: string,
	brushSize: number,
	colour: Colour
	width: number,
	height: number
	setCanvasElement: (canvas: HTMLCanvasElement) => void
}


const StickerCreatorCanvas = ({
	brushType,
	brushSize,
	colour, width,
	height,
	setCanvasElement
}: StickerCreatorCanvasProps) => {
	const editorCanvasRef = useRef<HTMLCanvasElement>(null)
	const editorContext = useRef<CanvasRenderingContext2D | null>(null)
	const cursorCanvasRef = useRef<HTMLCanvasElement>(null)
	const cursorContext = useRef<CanvasRenderingContext2D | null>(null)
	const [prevBrushPos, setPrevBrushPos] = useState<Position | null>({ x: 0, y: 0 })
	const [canvasPos, setCanvasPos] = useState<Position>({ x: 0, y: 0 })
	const [mouseDown, setMouseDown] = useState<boolean>(false)


	useEffect(() => {
		const canvas = cursorCanvasRef.current!
		canvas.addEventListener("mousedown", onMouseDown)
		canvas.addEventListener("mousedown", onMouseDown)
		canvas.addEventListener("mouseup", onMouseUp)
		canvas.addEventListener("mouseout", onMouseUp)
		canvas.addEventListener("click", onClick)

		cursorContext.current = cursorCanvasRef.current!.getContext("2d")
		editorContext.current = editorCanvasRef.current!.getContext("2d")
		setCanvasElement(editorCanvasRef.current!)

		return () => {
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mouseUp', onMouseUp);
			canvas.removeEventListener("mouseout", onMouseUp)
			canvas.removeEventListener("click", onClick)
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])


	useEffect(() => {
		const canvas = cursorCanvasRef.current!
		canvas.addEventListener("mousemove", onMouseMove)
		canvas.addEventListener("click", onClick)
		return () => {
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener("click", onClick)
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [brushSize, brushType, colour])


	useEffect(() => {
		if (mouseDown && brushType === "brush" && prevBrushPos !== null) {
			const editorCtx = editorContext.current!
			// const distance = Math.pow(Math.pow(prevBrushPos.x - canvasPos.x, 2) + Math.pow(prevBrushPos.y - canvasPos.y, 2), 1 / 2)
			editorCtx.beginPath();
			// if (distance < brushSize / 2) {
			// 	editorCtx.arc(canvasPos.x, canvasPos.y, brushSize / 2, 0, 2 * Math.PI)
			// 	editorCtx.fill()
			// } else {
			editorCtx.moveTo(prevBrushPos.x, prevBrushPos.y)
			editorCtx.lineTo(canvasPos.x, canvasPos.y)
			editorCtx.lineWidth = brushSize
			editorCtx.stroke()
			// }
			editorCtx.closePath()
			setPrevBrushPos(canvasPos)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		cursorCtx.clearRect(0, 0, width, height)
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

	const getImageDataIndex = (x: number, y: number) => (x + y * width) * 4

	const shouldFillPixel = (x: number, y: number, initialColour: Uint8ClampedArray, imageData: ImageData) => {
		if (x < 0 || x >= width || y < 0 || y >= height) {
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
			seen.add(e.offsetX + e.offsetY * width)
			const nodes: number[][] = [initialPos]
			const imageData = editorCtx.getImageData(0, 0, width, height)
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
		if (shouldFillPixel(currPos[0] + dx, currPos[1] + dy, initialColour, imageData) && !seen.has((currPos[0] + dx) + (currPos[1] + dy) * height)) {
			nodes.push([currPos[0] + dx, currPos[1] + dy])
			seen.add((currPos[0] + dx) + (currPos[1] + dy) * height)
		}
	}

	return (
		<div className="col-span-1 flex justify-end">
			<canvas
				height={height}
				width={width}
				className="box-border border-4 border-indigo-600 bg-white absolute"
				ref={editorCanvasRef}
			>
			</canvas>
			<canvas
				height={height}
				width={width}
				className="box-border border-4 border-indigo-600 bg-transparent absolute"
				ref={cursorCanvasRef}
			></canvas>
		</div>
	)
}

export default StickerCreatorCanvas