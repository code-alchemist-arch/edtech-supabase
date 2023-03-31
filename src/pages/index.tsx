import Layout from '@/layout';
import { useSession } from '@supabase/auth-helpers-react';

export default function Home() {
  const session = useSession();
  console.log(session);

  return (
    <Layout title='Home'>
      <div className='md:px-[40px] px-[20px] py-8'>
        <h1>This is a Homepage.</h1>
      </div>
    </Layout>
  );
}
