
import React, { use } from 'react'
import PrintUploader from '../../components/FileUploadCard';
import Footer from '../../components/Footer';
import { getPrinterStatus } from '../../services/printer.service';

const Homepage = async() => {
  

  return <section className='flex flex-col  items-center py-3 w-full  h-full  '>

    <PrintUploader/>



  </section>
} 

export default Homepage;