import '../styles/globals.css'
import '../styles/tailwind.css'
import { Provider } from 'next-auth/client'
import {
  RecoilRoot,
} from 'recoil';

function MyApp ({ Component, pageProps }) {
  return (
    <RecoilRoot>
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
    </RecoilRoot>
  )
}

export default MyApp
