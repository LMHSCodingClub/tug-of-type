import Link from "next/link";
import { useQuery } from "../convex/_generated/react";
import Logout from "./Logout";

export default function AuthenticatedHeaderWidget(props) {
    const user = useQuery('user/readUser')

    return (
        <>
            <Link href="/profile" className="d-flex mx-2">{user?.name || ' '}</Link>
            <Logout />
        </>
    );
}