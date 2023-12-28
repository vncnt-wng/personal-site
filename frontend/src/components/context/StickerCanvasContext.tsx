import { createContext, useState, useEffect, ReactNode } from "react";
import { StickerCanvasContextType, SheetStickerInfo, GallerySticker } from "../../@types/context";
import Konva from 'konva';

export const StickerCanvasContext = createContext<StickerCanvasContextType | null>(null);


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

const initialStickers: SheetStickerInfo[] = [
  {
    id: "img1",
    x: 200,
    y: 200,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    editable: true,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    stickerBorderEnabled: true,
    stickerBorderWidth: 4
  },
  {
    id: "img2",
    x: 300,
    y: 300,
    rotation: 90,
    scaleX: 1,
    scaleY: 1,
    editable: true,
    url: "https://konvajs.org/assets/lion.png",
    stickerBorderEnabled: true,
    stickerBorderWidth: 3
  },
  {
    id: "img3",
    x: 300,
    y: 400,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    editable: false,
    url: "https://konvajs.org/assets/lion.png",
    stickerBorderEnabled: true,
    stickerBorderWidth: 2
  },
];

export const StickerCanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [galleryStickers, setGalleryStickers] = useState<GallerySticker[]>(galleryStickers)
  const [stickers, setStickers] = useState<SheetStickerInfo[]>([]);
  const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([]);

  useEffect(() => {
    setStickers(initialStickers)
    // setGalleryStickers(galleryStickers)
    // TODO get initial stickers from backend
  }, [])


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

  const stickerIdExists = (id: string): boolean => {
    return stickers.findIndex((sticker) => sticker.id === id) >= 0;
  }

  const addStickerToArea = (gallerySticker: GallerySticker) => {
    // TODO figure out how to do sticker names/ids in the canvas
    let i = 0
    let newId = gallerySticker.name.slice();
    let idExists = stickerIdExists(newId)
    while (idExists) {
      newId = gallerySticker.name + i
      i += 1
      idExists = stickerIdExists(newId)
    }
    const newCanvasSticker: SheetStickerInfo = {
      id: newId,
      x: 200,
      y: 200,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      url: gallerySticker.url,
      editable: true,
      stickerBorderEnabled: true,
      stickerBorderWidth: 5
    }
    setStickers([...stickers, newCanvasSticker])
    setSelectedStickerIds([newId]);
    console.log(stickers)
  }

  const removeSelectedStickersFromArea = () => {
    setStickers(stickers.filter((sticker) => selectedStickerIds.find((id) => sticker.id === id) === undefined))
    setSelectedStickerIds([])
  }

  // TODO refactor following functions to generic getters/setters taking in property name

  const stickerBorderEnabledForId = (id: string): boolean => {
    for (let i = 0; i < stickers.length; i++) {
      if (stickers[i].id === id) {
        return stickers[i].stickerBorderEnabled;
      }
    }
    return false;
  }

  const stickerBorderWidthForId = (id: string): number | undefined => {
    for (let i = 0; i < stickers.length; i++) {
      if (stickers[i].id === id) {
        return stickers[i].stickerBorderWidth;
      }
    }
  }


  const toggleStickerBorderEnabledForId = (id: string) => {
    const newStickers = stickers.slice();
    for (let i = 0; i < newStickers.length; i++) {
      if (newStickers[i].id === id) {
        newStickers[i].stickerBorderEnabled = !newStickers[i].stickerBorderEnabled;
      }
    }
    setStickers(newStickers);
  }


  const setStickerBorderWidthForId = (id: string, newWidth: number) => {
    const newStickers = stickers.slice();
    for (let i = 0; i < newStickers.length; i++) {
      if (newStickers[i].id === id) {
        newStickers[i].stickerBorderWidth = newWidth;
      }
    }
    setStickers(newStickers);
  }

  return (
    <StickerCanvasContext.Provider
      value={{
        galleryStickers,
        stickers,
        setStickers,
        selectedStickerIds,
        setSelectedStickerIds,
        onStickerSelect,
        applyStickerTransform,
        stickerIdExists,
        addStickerToArea,
        removeSelectedStickersFromArea,
        stickerBorderEnabledForId,
        stickerBorderWidthForId,
        toggleStickerBorderEnabledForId,
        setStickerBorderWidthForId
      }}
    >
      {children}
    </StickerCanvasContext.Provider>
  )
}