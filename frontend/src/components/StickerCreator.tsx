import { useEffect, useRef, useState } from "react"

interface Position {
	x: number,
	y: number,
}


const StickerCreator = () => {
	const editorCanvasRef = useRef<HTMLCanvasElement>(null)
	const editorContext = useRef<CanvasRenderingContext2D | null>(null)
	const cursorCanvasRef = useRef<HTMLCanvasElement>(null)
	const cursorContext = useRef<CanvasRenderingContext2D | null>(null)
	const [prevBrushPos, setPrevBrushPos] = useState<Position | null>({ x: 0, y: 0 })
	const [canvasPos, setCanvasPos] = useState<Position>({ x: 0, y: 0 })
	const [brushSize, setBrushSize] = useState<number>(4)
	const [color, setColor] = useState(null)
	const [mouseDown, setMouseDown] = useState<boolean>(false)

	const brushTypes = ["brush", "fill"]
	const [brushType, setBrushType] = useState<string>("brush")

	const onMouseMove = (e: MouseEvent) => {
		const x = e.offsetX
		const y = e.offsetY

		// Draw cursor
		const cursorCtx = cursorContext.current!
		cursorCtx.clearRect(0, 0, 400, 400)
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
		console.log("down")
		setMouseDown(true)
		setPrevBrushPos({ x: e.offsetX, y: e.offsetY })
	}

	const onMouseUp = () => {
		console.log("up")
		setMouseDown(false)
		setPrevBrushPos(null)
	}

	const onClick = (e: MouseEvent) => {
		if (brushType === "brush") {
			const editorCtx = editorContext.current!
			editorCtx.beginPath();
			editorCtx.arc(e.offsetX, e.offsetY, brushSize / 2, 0, 2 * Math.PI)
			editorCtx.fill()
			editorCtx.closePath()
		} else if (brushType === "fill") {
		}
	}

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
		console.log(canvasPos)
		console.log(mouseDown)
		if (mouseDown && brushType === "brush" && prevBrushPos !== null) {
			const editorCtx = editorContext.current!
			editorCtx.beginPath();
			editorCtx.moveTo(prevBrushPos.x, prevBrushPos.y)
			editorCtx.lineTo(canvasPos.x, canvasPos.y)
			editorCtx.strokeStyle = "black"
			editorCtx.lineWidth = brushSize
			editorCtx.stroke()
			editorCtx.closePath()
			setPrevBrushPos(canvasPos)
		}
	}, [canvasPos])

	const onBrushSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setBrushType(e.target.value)
	}

	return (
		<div className="h-full w-full" style={{ backgroundColor: "pink" }}>
			<canvas
				height={400}
				width={400}
				className="box-border border-4 border-indigo-600 bg-white fixed"
				ref={editorCanvasRef}
			>
			</canvas>
			<canvas
				height={400}
				width={400}
				className="box-border border-4 border-indigo-600 fixed bg-transparent"
				ref={cursorCanvasRef}
			></canvas>
			<div>
				<select name="brushSelect" id="brushSelect" onChange={onBrushSelectChange}>
					{brushTypes.map((brush) =>
						<option value={brush}>{brush}</option>
					)}
				</select>
			</div>
		</div>
	)
}

export default StickerCreator