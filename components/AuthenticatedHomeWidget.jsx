import { useEffect } from "react";
import { useMutation } from "../convex/_generated/react";

export default function AuthenticatedHomeWidget() {
    const storeUser = useMutation("storeUser");

    useEffect(() => {
        // Store the user in the database.
        // Recall that `storeUser` gets the user information via the `auth`
        // object on the server. You don't need to pass anything manually here.
        storeUser();
    }, [storeUser]);

    return <></>
}