"use client"
import React from 'react';
import Link from 'next/link';
import { Printer, Home } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans antialiased p-6">
      
      <div className="flex flex-col items-center text-center space-y-8">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className=" p-1 rounded-2xl shadow-sm">
            <Image src={'/mitsprint.png'} width={51} height={51} alt='logo' className='rounded-2xl'/>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            MITS <span className="text-red-600 font-black">PRINT</span>
          </h1>
        </div>

        {/* Big 404 Visual */}
        <div className="relative py-4">
          <span className="text-[12rem] font-black leading-none text-slate-100 select-none">
            404
          </span>
          <div className="absolute inset-0 flex ìtems-center justify-center">
             <div className="h-1 w-12 bg-rose-500 rounded-full mb-4 animate-pulse" />
          </div>
        </div>

        {/* Minimal Action */}
        <div className="space-y-6 flex flex-col justify-center items-center">
          <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-sm">
            Page Not Found
          </p>
          
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-slate-900 font-bold hover:text-emerald-600 transition-colors"
          >
            <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>GO HOME</span>
          </Link>
        </div>

      </div>

      
    </div>
  );
}