import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../styles/globals.css'

import { Auth0Provider } from '@auth0/auth0-react'
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from 'convex/react'
import { ConvexProviderWithAuth0 } from 'convex/react-auth0'
import Login from '../components/Login'
import { useEffect, useState } from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || '')

function MyApp({ Component, pageProps }: AppProps) {
  const config = {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  }

  return (
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      authorizationParams={{
        redirect_uri:
          typeof location !== 'undefined' ? window.location.origin : '',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <Authenticated>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Authenticated>
        <Unauthenticated>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Unauthenticated>
        <AuthLoading>
          <Layout>Loading...</Layout>
        </AuthLoading>
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  )
}

export default MyApp
