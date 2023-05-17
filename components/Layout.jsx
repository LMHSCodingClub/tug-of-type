import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Collapse, Container, Nav, NavItem, NavLink, Navbar, NavbarToggler } from "reactstrap";
import styles from "../styles/Home.module.css";
import Logout from "./Logout";
import AuthenticatedHeaderWidget from "./AuthenticatedHeaderWidget"
import { useConvexAuth } from "convex/react";
import { useQuery } from "../convex/_generated/react";
import Login from "./Login";

export default function Layout(props) {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useConvexAuth();

    const toggle = () => setIsOpen(!isOpen);

    const router = useRouter()

    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar expand="md" container="fluid" style={{ borderBottom: '3px solid #f5b01a' }}>
                <Link href="/"><a>Tug of Type</a></Link>

                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ms-5 me-auto align-items-center" navbar>
                        <NavItem>
                            <Link href="/textbank"><NavLink href="">Texts</NavLink></Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/submit-text"><NavLink href="">Submit Text</NavLink></Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/ongoing-races"><NavLink href="">Ongoing Races</NavLink></Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/completed-races"><NavLink href="">Completed Races</NavLink></Link>
                        </NavItem>
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
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/convex.svg" alt="Convex Logo" width={90} height={18} />
                    </span>
                </a>
            </footer>
        </div>
    );
}