import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // default to dark mode for the whole app
    try {
      document.documentElement.classList.add('dark')
    } catch (e) {}
  }, [])

  return <Component {...pageProps} />
}
