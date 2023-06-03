import { query } from './_generated/server';

async function listTypes({ db }, { finished }) {
    const isFinished = q => q.eq(q.field('ended'), finished)

    const races = await db.query('races').order("desc").filter(isFinished).collect();
    const tugs = await db.query('tugs').order('desc').filter(isFinished).collect()

    async function includeOtherInfoAboutType(type) {
        return {
            ...type,
            text: await db.get(type.text),
            host: await db.get(type.host),
            mode: this.mode
        }
    }

    const types = await Promise.all([
        ...races.map(includeOtherInfoAboutType, { mode: "Race" }),
        ...tugs.map(includeOtherInfoAboutType, { mode: "Tug" })
    ])


    return types
}



export default query(listTypes)


