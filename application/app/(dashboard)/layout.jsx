import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Providers from "./providers";

export default function Layout({ children }) {
  return (

     <Providers>
       
    <div className=" min-h-screen w-full relative">
      <Navbar />
      <div className="my-[90px] ">
              {children}

      </div>
    </div>

      </Providers>
  );
}
