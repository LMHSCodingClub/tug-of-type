import EndedRace from "../components/EndedRace";
import OngoingRace from "../components/OngoingRace";
import { useQuery } from '../convex/_generated/react';
import { useEffect } from "react";

export default function Race() {
    const params = new URLSearchParams(window.location.search);
    const race = useQuery('readRace', { id: params.get('id') })

    const redirect = () => window.location.href = "/ongoing-races"

    if (race) {
        return race?.ended ? <EndedRace id={params.get('id')} /> : <OngoingRace raceId={params.get('id')} />
    } else if (typeof race === 'boolean' && !race) {
        const goToRacesList = () => setTimeout(redirect, 1000)
        return <p>The race does not exist. {goToRacesList()}</p>
    } else {
        return <p>Loading...</p>
    }
}
