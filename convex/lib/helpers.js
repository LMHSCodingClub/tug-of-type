import { Id } from "../_generated/dataModel";

export async function selectRandomText(db) {
    const texts = await db.query('texts').collect();
    const totalRows = texts.length;
    const rowNumber = Math.round(Math.random() * ((totalRows) - 1));
    return texts[rowNumber]._id;
}

export async function decrementTimer(db, { tableName, id }) {
    const identification = new Id(tableName, id)
    const type = await db.get(identification);
    type.timer = Math.max(parseInt(type.timer) - 1, 0);
    db.replace(identification, type);
    return type.timer - 1
}