export async function selectRandomText(db) {
    const texts = await db.query('texts').collect();
    const totalRows = texts.length;
    const rowNumber = Math.round(Math.random() * ((totalRows) - 1));
    return texts[rowNumber]._id;
}