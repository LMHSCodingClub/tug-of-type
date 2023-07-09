import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "../convex/_generated/react"

export default function Timer({
    onTimerFinish,
    initialTime=120,
    typeInfo: { typeName, typeId },
    withMutate = false // Whether to change the timer value, if false then only read and display the timer
}) {
    const decrementTimer = useMutation(`${typeName.toLowerCase()}/decrementTimer`);
    const { timer: timeValue, ended } = useQuery(`${typeName.toLowerCase()}/read${typeName}`, { id: typeId }) || {}
    const timerCallback = useRef();

    useEffect(() => {
        if (withMutate) {
            const id = setInterval(() => {
                timerCallback.current(id);
            }, 1000);
            return () => clearInterval(id);
        }
    }, [withMutate, initialTime]);

    const timer = (id) => {
        if (timeValue === 0) {
            onTimerFinish()
            if (withMutate)
                clearInterval(id);
        } else if (withMutate) {
            decrementTimer({ id: typeId });
        }
    };

    useEffect(() => {
        timerCallback.current = timer;
    }, [timer]);

    // Using inline styles because there are so few that they do not need a separate file
    const styles = {
        timerContainer: {
            fontSize: '2rem',
            display: 'flex',
            justifyContent: 'center'
        },
        timer: {
            display: "inline-flex",
            placeContent: "center",
            placeItems: "center",
            border: "1px solid rebeccapurple",
            borderRadius: "100%",
            width: "100px",
            height: "100px",
            padding: "1em",
        }
    }

    return (
        <p style={styles.timerContainer}>
            <time style={styles.timer}>{timeValue}</time>
        </p>
    );
}