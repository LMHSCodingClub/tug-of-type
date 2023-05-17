import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "reactstrap";

export default function Login() {
    const { loginWithRedirect } = useAuth0();

    return <Button color="primary" onClick={loginWithRedirect}>Log In</Button>
}