
import React, { use } from 'react'
import PrintUploader from '../../components/FileUploadCard';
import Footer from '../../components/Footer';

const Homepage = async() => {




  return <section className='flex flex-col  items-center py-3 w-full  h-full  '>
    <h1 className='text-xl font-sans'> 
       UPLOAD FILE
    </h1>


    <PrintUploader/>



  </section>
} 

export default Homepage;