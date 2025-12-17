
import "./globals.css";
export const metadata = {
  title: "MITS PRINT ",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-fit min-h-screen">
      {children}
      </body>
    </html>
  );
}
