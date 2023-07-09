import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "reactstrap";

export default function Logout(props) {
    const { logout } = useAuth0();

    return (
        <Button color="danger"
            onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
            }
        >
            Log out
        </Button>
    );
}