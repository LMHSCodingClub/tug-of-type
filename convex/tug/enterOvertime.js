import {mutation} from "../_generated/server";

export default mutation(async ({db}, { id }) => {
    const tug = await db.get(id)
    
    if (tug.status === 'AP') {
        db.patch(id, { status: 'OV', timer: 45 })
        return 45
    } else if (tug.status === 'OV') {
        db.patch(id, { status: 'DO', timer: 30 })
        return 30
    } else if (tug.status === 'DO') {
        db.patch(id, { status: 'SD', timer: 10 })
        return 10
    }
})