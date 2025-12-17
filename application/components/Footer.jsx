import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
   <footer className="mt-10 py-4 text-sm text-gray-800 bg-white absolute bottom-0 w-full">
  <div className="flex flex-col md:flex-row justify-between items-center gap-2 px-4 min-lg:justify-center">
    <span>© 2025 MIT Prints</span>

    <div className="flex gap-4">
      <span>Academic use only</span>
      <a
        href="mailto:printsupport@mit.edu"
        className="hover:underline"
      >
        Print Support
      </a>
    </div>
  </div>
</footer>

  )
}

export default Footer