import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Providers from "./providers";

export default function Layout({ children }) {
  return (

     <Providers>
       
    <div className="bg-[#f2f2f2] min-h-screen w-full">
      <Navbar />
      {children}
    </div>

      </Providers>
  );
}
