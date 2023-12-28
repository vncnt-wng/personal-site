
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

export interface GallerySticker {
  url: string
  name: string
}

export type StickerCanvasContextType = {
  galleryStickers: GallerySticker[],
  stickers: SheetStickerInfo[],
  setStickers: (stickers: SheetStickerInfo[]) => void,
  selectedStickerIds: string[],
  setSelectedStickerIds: (selectedStickerIds: string[]) => void,
  onStickerSelect: (e: Konva.KonvaEventObject<any>) => void,
  applyStickerTransform: (newStickerData: SheetStickerInfo) => void,
  stickerIdExists: (id: string) => boolean,
  addStickerToArea: (gallerySticker: GallerySticker) => void,
  removeSelectedStickersFromArea: () => void,
  stickerBorderEnabledForId: (id: string) => boolean,
  stickerBorderWidthForId: (id: string) => number | undefined,
  toggleStickerBorderEnabledForId: (id: string) => void,
  setStickerBorderWidthForId: (id: string, newWidth: number) => void
}