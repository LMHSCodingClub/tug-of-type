import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import Layout from "../components/Layout";
import '../styles/globals.css';

import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import convexConfig from "../convex.json";

import { Login } from "../lib/account-auth";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || '')
const authInfo = convexConfig.authInfo[0];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConvexProviderWithAuth0 client={convex} authInfo={authInfo} loggedOut={<Login />}>
      <Layout>
      <Component {...pageProps} />
      </Layout>
    </ConvexProviderWithAuth0>
  )
}

export default MyApp
