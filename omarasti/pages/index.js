import Layout from '../components/Layout'
import { signin, useSession } from 'next-auth/client'
import Link from 'next/link'
import { Button } from "../components/Buttons"
import { Compass } from "../components/Compass"
const Menu = () => {
  return <>
    <Link href="/tracks"><Button>Radat</Button></Link>
  </>
}

export default function Home () {
  const [session, loading] = useSession()
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

      <ul>
        <li>Tee tampereen alueen kartalle oma suunnistusrata.</li>
        <li>Jaa linkki rataan kavereillesi, ja...</li>
      </ul>

      <h1 className='mt-4 mb-4 text-xl'>Suunnista</h1>

      <ul>
        <li>Kun olet lähellä rastia, "näät" sen puhelimen ruudulla.</li>
        <li>Kun olet aivan rastin vieressä, voit "leimata" puhelimella.</li>
      </ul>
      <div className="w-1/2">
      <Compass ></Compass>
      </div>

    </Layout>
  )
}
