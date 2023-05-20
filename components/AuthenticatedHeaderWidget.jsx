import Link from "next/link";
import { useQuery } from "../convex/_generated/react";
import Logout from "./Logout";

export default function AuthenticatedHeaderWidget(props) {
    const { user } = useQuery('readUser') || { user: {} }

    return (
        <>
            <Link href="/profile"><a className="d-flex mx-2">{user?.name || ' '}</a></Link>
            <Logout />
        </>
    );
}