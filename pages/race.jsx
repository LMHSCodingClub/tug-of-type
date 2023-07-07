import { useRouter } from "next/router";
import EndedRace from "../components/EndedRace";
import OngoingRace from "../components/OngoingRace";
import { useQuery } from '../convex/_generated/react';
import { useConvexAuth } from "convex/react";

export default function Race() {
    const { isAuthenticated } = useConvexAuth()
    if (!isAuthenticated) return <p>You must log in before you can play</p>

    const params = new URLSearchParams(window.location.search);
    const race = useQuery('race/readRace', { id: params.get('id') })
    const router = useRouter()

    if (race) {
        return race?.ended ? <EndedRace id={params.get('id')} /> : <OngoingRace raceId={params.get('id')} />
    } else if (typeof race === 'boolean' && !race) {
        setTimeout(() => {
            if (!window.location.pathname.includes('practice'))
                router.push('/')
        }, 2000)
        return <p>The race does not exist.</p>
    } else {
        return <p>Loading...</p>
    }
}
