
import "./globals.css";
import Providers from "./providers";
export const metadata = {
  title: "MITS PRINT ",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-fit min-h-screen">
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}
