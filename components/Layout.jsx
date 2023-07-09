import { useConvexAuth } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Collapse, Container, Nav, NavItem, Navbar, NavbarToggler } from "reactstrap";
import styles from "../styles/Home.module.css";
import AuthenticatedHeaderWidget from "./AuthenticatedHeaderWidget";
import Login from "./Login";

export default function Layout(props) {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useConvexAuth();

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar expand="md" container="fluid" style={{ borderBottom: '3px solid #f5b01a' }}>
                <Image src="/icon.png" height={50} width={50} className="me-3" alt="The tug of type logo, represented by people tugging at a rope" />
                <Link href="/">Tug of Type</Link>

                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav
                        className="ms-5 me-auto align-items-center d-flex"
                        style={{ gap: '10px' }} navbar
                    >
                        <NavItem><Link href="/textbank">Texts</Link></NavItem>
                        <NavItem><Link href="/submit-text">Submit Text</Link></NavItem>
                        <NavItem><Link href="/completed-types">Completed Types</Link></NavItem>
                    </Nav>
                    {isAuthenticated ? <AuthenticatedHeaderWidget /> : <Login />}
                </Collapse>

            </Navbar>
            <Container fluid className={styles.container}>
                {props.children}
            </Container>
            <footer className={styles.footer}>
                <a
                    href="https://www.convex.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className={styles.logo}>
                        Powered by{' '}
                        <Image src="/convex.svg" alt="Convex Logo" width={90} height={18} />
                    </span>

                </a>
                <a href="https://lmhscodingclub.com" target="_black" rel="noopener noreferrer">Built by the LMHS Coding Club</a>
            </footer>
        </div>
    );
}