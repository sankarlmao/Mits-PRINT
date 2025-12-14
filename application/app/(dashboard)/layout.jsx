import { getServerSession } from 'next-auth';
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer';



 async function layout({children}){

      const session =  await getServerSession();

     if(!session) redirect('/login')
  
        const user = session;
        return <div className='bg-[#f2f2f2] h-full w-full  '>
        <Navbar user={user}/>
        {children}
        <Footer/>

    </div>
}

export default layout;