import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import 'public/nprogress.css'
import { useEffect, useState } from 'react'
import 'styles/globals.css'
import { userService } from '../services/user.service'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [auth, setAuth] = useState(false)
  useEffect(() => {
    function authCheck(url: string) {
      // redirect to login page if accessing a private page and not logged in
      const publicPaths = ['/','/login', '/register']
      const path = url.split('?')[0]

      //document.cookie.indexOf('qid=') == -1
      if (!userService.userValue && !publicPaths.includes(path)) {
        console.log('not authenticated')
        setAuth(false)
        router.push({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        })
      } else {
        setAuth(true)
      }
    }

    // getMe();
    authCheck(router.asPath)

    // set authorized to false to hide page content while changing routes
    // const hideContent = () => setAuth(false)
    router.events.on('routeChangeStart', authCheck)

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck)

    const handleStart = (url: string) => {
      console.log(`Loading: ${url}`)
      nProgress.start()
    }
    const handleStop = () => {
      nProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    // unsubscribe from events in useEffect return function
    return () => {
      // router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return <ChakraProvider>{auth && <Component {...pageProps} />}</ChakraProvider>
}

export default MyApp
