import Head from 'next/head'
import Header from './Header'
import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Layout = ({
  menu,
  children,
  map,
  isPrivate = true,
  hasRequiredData = true,
}: {
  menu: ReactNode
  children: ReactNode
  map?: string
  isPrivate?: boolean
  hasRequiredData?: boolean
}) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === 'loading'

  useEffect(() => {
    if ((isPrivate && !isLoading && !session) || !hasRequiredData) {
      router.push('/')
    }
  }, [isPrivate, session, isLoading])

  const margins = map === 'true' ? '' : 'mx-2'
  return (
    <>
      <Head>
        <title>OMArasti</title>
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.5.1/dist/leaflet.css'
          integrity='sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=='
        />
        <script
          src='https://unpkg.com/leaflet@1.5.1/dist/leaflet.js'
          integrity='sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=='
        />
      </Head>
      <div className='flex flex-col'>
        {((isPrivate && session && hasRequiredData) || (!isPrivate && hasRequiredData)) && (
          <>
            <div className='flex-none'>
              <Header menu={menu} />
            </div>
            <main className={`flex-grow md:container md:mx-auto ${margins}`}>
              {!isLoading && children}
              {isLoading && <div className='p-20'>Ladataan...</div>}
            </main>
          </>
        )}
      </div>
    </>
  )
}

export { Layout }
