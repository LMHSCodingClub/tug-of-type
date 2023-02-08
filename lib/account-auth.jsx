import { useRouter } from "next/router";
import { Button } from "reactstrap"
import { useAuth0 } from "@auth0/auth0-react"
import Layout from "../components/Layout";

export function Login() {
    const { isLoading, loginWithRedirect } = useAuth0();
    if (isLoading) {
        return <button className="btn btn-primary">Loading...</button>
    }

    return (
        <Layout className="py-4">
            <h1 className="text-center">Tug of Type</h1>
            <div className="text-center">
                <Button color="primary" onClick={loginWithRedirect}>Log In</Button>
            </div>
        </Layout>
    );
}

export function Logout() {
    const router = useRouter();
    const { logout, user } = useAuth0();
    return (
        <div className="float-end">
            <img onClick={() => router.push("/profile")} src="https://picsum.photos.com/300/300" width="35" height="35" className="rounded-circle float-start me-3" />
            <button className="btn btn-secondary float-end"
                onClick={() => logout({ returnTo: window.location.origin })}
            >Log out</button>
        </div>
    );
}