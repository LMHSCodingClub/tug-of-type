import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { useMutation } from "../convex/_generated/react";
import { Logout } from "../lib/account-auth";
import styles from "../styles/Home.module.css";

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
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar color="secondary" dark expand="md" container="fluid">
                <Link href="/" passHref legacyBehavior>
                    <CustomNavbarBrand />
                </Link>

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
                        <NavItem>
                            <Link href="/ongoing-races"><NavLink href="">Ongoing Races</NavLink></Link>
                        </NavItem>
                    </Nav>
                    <Logout />
                </Collapse>

            </Navbar>
            <Container fluid>
                {props.children}
            </Container>
            <footer className={styles.footer}>
                <a
                    href="https://www.convex.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/convex.svg" alt="Convex Logo" width={90} height={18} />
                    </span>
                </a>
            </footer>
        </div>
    );
}

/**
 * @link https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component
 */
const CustomNavbarBrand = forwardRef(({ href }, ref) => {
    return (
        <NavbarBrand className="d-flex align-items-center" href={href}>
            <Image width={50} height={50} src="/favicon.ico" />
            <span className="mx-3">Tug of Type</span>
        </NavbarBrand>
    )
})