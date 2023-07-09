export default function TugGameStatus({ tug }) {
    if (!tug.guest) return <p>Waiting for opponent...</p>
    switch (tug.status) {
        case 'OJ':
            return <p>Waiting for opponent...</p>
        case 'AP':
            return <p>Type the text faster than your opponent to reach the solid line<br/></p>
        case 'EC':
            return <p>Winner! Calculating scores...</p>
        case 'OV':
            return <p>Overtime</p>
        case 'DO':
            return <p>Double Overtime</p>
        case 'SD':
            return <p>Sudden Death! First to type wins.</p>
        case 'WH':
            return <p>The host wins!</p>
        case 'WG':
            return <p>The guest wins!</p>
    }
}