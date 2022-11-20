import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Collapse, Container, FormGroup, Input, Label, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { Id } from "../convex/_generated/dataModel";
import { useMutation } from "../convex/_generated/react";
import { Logout } from "../lib/account-auth";
// Render a chat message.
export default function Layout(props) {
    const storeUser = useMutation("storeUser");
    useEffect(() => {
        // Store the user in the database.
        // Recall that `storeUser` gets the user information via the `auth`
        // object on the server. You don't need to pass anything manually here.
        async function createUser() {
            const id = await storeUser();
        }
        createUser();
    }, [storeUser]);

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const router = useRouter()

    return (
        <div>
            <Navbar color="secondary" dark expand="md" container="fluid">
                <Link href="/"><NavbarBrand href="/"><img alt='logo' height={50} src="/favicon.png" /> Tug of War Typeracer</NavbarBrand></Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ms-5 me-auto align-items-center" navbar>
                        <NavItem>
                            <Link href="/textbank"><NavLink href="">Texts</NavLink></Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/about"><NavLink href="">About Us</NavLink></Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/submit-text"><NavLink href="">Submit Text</NavLink></Link>
                        </NavItem>
                    </Nav>
                    <Logout />
                </Collapse>

            </Navbar>
            <Container fluid>
                {props.children}
            </Container>
        </div>
    );
}