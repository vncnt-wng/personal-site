import { ResultSetHeader } from "mysql2";
import sql from "../db/db";
import { StickerSheet, SheetSticker } from "@prisma/client";

const clearTables = () => {
    return new Promise<void>((resolve, reject) => {
        sql.query(
            "DELETE FROM SheetSticker", (err, res) => {
                if (err) {
                    reject(err)
                }
            }
        )
        sql.query(
            "DELETE FROM StickerSheet", (err, res) => {
                if (err) {
                    reject(err)
                }
            }
        )
        resolve()
    })
}

const createStickerSheet = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        sql.query(
            `INSERT INTO StickerSheet
            (id)
            VALUES
            (DEFAULT)
        `, (err, res: any) => {
            if (err) {
                reject(err)
            } else {
                console.log(res)
                resolve(res.insertId)
            }
        })
    })
}


const createStickers = (sheetId: number) => {
    return new Promise((resolve, reject) => {
        const stickers = [
            // id
            // x
            // y
            // editable
            // url
            // stickerBorderWidth
            // sheetId
            [
                1,
                200,
                200,
                true,
                "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
                4,
                sheetId
            ],
            [
                2,
                300,
                300,
                true,
                "https://konvajs.org/assets/lion.png",
                3,
                sheetId
            ],
            [
                3,
                300,
                400,
                false,
                "https://konvajs.org/assets/lion.png",
                2,
                sheetId
            ]
        ]
        sql.query(
            `INSERT INTO SheetSticker
            (id, x, y, editable, url, stickerBorderWidth, sheetId)
            VALUES
            ?`,
            [stickers],
            (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
    })
}


const populate_test_db = async () => {
    try {
        await clearTables()
        const sheetId = await createStickerSheet()
        console.log("sticker sheet id: " + sheetId)
        console.log(await createStickers(sheetId))
    } catch (error) {
        console.error(error)
    }
}

populate_test_db()