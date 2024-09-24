import Head from 'next/head'
import Header from './Header'

const Layout = ({ menu, children, map }) => {
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
          crossorigin=''
        />
        <script
          src='https://unpkg.com/leaflet@1.5.1/dist/leaflet.js'
          integrity='sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=='
          crossorigin=''
        />
      </Head>
      <div className='flex flex-col'>
        <div className='flex-none'>
          <Header menu={menu} />
        </div>
        <main className={`flex-grow md:container md:mx-auto ${margins}`}>{children}</main>
      </div>
    </>
  )
}

export { Layout }
