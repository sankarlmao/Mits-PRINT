import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Layout({ children }) {
  return (
    <div className="bg-[#f2f2f2] min-h-screen w-full">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
