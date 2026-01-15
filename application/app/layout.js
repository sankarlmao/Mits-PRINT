
import Script from "next/script";
import "./globals.css";
export const metadata = {
  title: "MITS Print",
  applicationName: "MITS Print",
  description: "Smart way to print lab records & project reports",
  
  icons: {
    
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-fit min-h-screen">
         <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      {children}
      </body>
    </html>
  );
}
