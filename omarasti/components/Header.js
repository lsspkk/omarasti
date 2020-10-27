// components/header.js

import Link from 'next/link';
import { signin, signout, useSession } from 'next-auth/client';

const Header = () => {
  const [session, loading] = useSession();
  return (
    <header>
      <nav>
        <Link href="/">
          <a className="logo">
           <img src="/logo.png" alt="omaRasti"/>
          </a>
        </Link>

        <p>
        {!session && (          
             <button className="signInButton" onClick={() => signin('google')}>Kirjaudu</button>
          )}
          {session && (
            <>
              <Link href="/profile">
              <span className="email">{session.user.email}</span>
              </Link>
              <button  className="signInButton" onClick={signout}>Kirjaudu ulos</button>
            </>
          )}
        </p>
      </nav>

      <style jsx>{`
        header {
          border-bottom: 1px solid #ccc;
        }
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 42rem;
          margin: 0 auto;
          padding: 0.2rem 1.25rem;
        }
        .logo {
          max-height: 2rem;
        }
        .avatar {
          border-radius: 2rem;
          float: left;
          height: 2.2rem;
          width: 2.2rem;
          background-color: white;
          background-size: cover;
          border: 2px solid #ddd;
        }
        .email {
          margin-right: 1rem;
          font-size: 0.8rem;
          vertical-align: middle;
          margin-left: 0.25rem;

        }
        .signInButton {
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
        }
        .signInButton {
          background-color: #1eb1fc;
        }
        .signInButton:hover {
          background-color: #1b9fe2;
        }
      `}</style>
    </header>
  );
};



export default Header;