import { internalMutation } from "./_generated/server";

const deleteColumn = (table, column) => (
    internalMutation(async ({ db }) => {
        const rows = await db.query(table).collect();
        for (const row of rows) {
            if (row[column] !== undefined) {
                delete row[column];
                await db.replace(row._id, row);
            }
        }
    })
)

export const replaceCarriageReturns = internalMutation(async ({ db }) => {
    const rows = await db.query('texts').collect()
    for (const row of rows) {
        row.words = row.words.replace(/\n/g, ' ')
        await db.replace(row._id, row)
    }
})

export const removeMode = deleteColumn('races', 'mode')
