import { useQuery } from "../convex/_generated/react";
import Logout from "./Logout";

export default function AuthenticatedHeaderWidget(props) {
    const user = useQuery('readUser');

    return (
        <>
            <span style={{ marginRight: '10px' }}>{user?.name}</span>
            <Logout />
        </>
    );
}