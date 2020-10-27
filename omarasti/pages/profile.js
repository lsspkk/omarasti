// pages/profile.js

import { useSession } from 'next-auth/client';
import Layout from '../components/Layout';

const Profile = () => {
  const [session, loading] = useSession();

  if (loading) return <div>loading...</div>;
  if (!session) return <div>no session</div>;

  return (
    <Layout>
      {session && (
        <>
          <img src={session.user.image} className="avatar" />
          <h1>{session.user.email}</h1>
        </>
      )}

      <style jsx>{`
        .avatar {
          width: 120px;
          border-radius: 20px;
        }
      `}</style>
      Et ole kirjautunut sisään
    </Layout>
  );
};

export default Profile;