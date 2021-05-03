import Layout from '../components/Layout'
import { signin, useSession } from 'next-auth/client'
import Link from 'next/link'
import { Button } from "../components/Buttons"
import { Compass } from "../components/Compass"
import { useEffect, useState } from 'react'
import dbConnect from '../utils/dbConnect'
const Menu = () => {
  return <>
    <Link href="/tracks"><Button>Radat</Button></Link>
  </>
}

export default function Home ({warm}) {
  const [session, loading] = useSession()
  const [angle, setAngle] = useState(0)


  useEffect(() => {
    setTimeout(() => setAngle((angle+1)%360), 100)
  }, [angle])
  return (
    <Layout menu={<Menu/>}>
      <h3 className='mt-8 mb-8 text-xl text-bold text-orange-900'>Tervetuloa OMArastiin.</h3>

      {!session && (
        <div>
          <button className='signInButton' onClick={() => signin('google')}>Kirjaudu</button>

          <p>
            Kirjaudu Google-tunnuksella sisälle omaRastiin,
            niin voit luoda suunnistusratoja, jakaa niitä kavereillesi,
            ja käydä suunnistamassa radan puhelimen kanssa.
          </p>
          <p>Sähköpostiosoitettasi ei välitetä muihin palveluihin,
            eikä käytöstäsi kerätä mitään tilastoja.
            Kirjautumista käytetään ainoastaan siihen, että
            vain sinä voit muokata tekemiäsi ratoja. Samoin ainoastaan
            sinulla on pääsy valitsemaasi "suunnistajanimeen",
            jolla esiinnyt palvelun muille käyttäjille.
          </p>
        </div>
      )}

      <h1 className='mt-4 mb-4 text-xl'>Ole ratamestari</h1>

      <p>
        Tee tampereen alueen kartalle oma suunnistusrata.
        Jaa linkki rataan kavereillesi, ja...
      </p>

      <h1 className='mt-4 mb-4 text-xl'>Suunnista</h1>

      <ul>
        <li>Kun olet lähellä rastia, "näet" sen puhelimen ruudulla.</li>
        <li>Kun olet aivan rastin vieressä, voit "leimata" puhelimella.</li>
      </ul>
      <Compass angle={angle} cName="w-40 mx-auto"></Compass>

    </Layout>
  )
}

// speed up serverless by warming up db connection
export async function getServerSideProps({req}) {
  dbConnect().then(() => console.log('Warmed up') )
  return { props: { 'warm' : 'up' } }
}