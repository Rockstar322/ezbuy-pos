import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FerrePro El Maestro | Distribuidora Ferretera y Materiales de Construcción",
  description: "Ferretería mayorista y minorista en Perú. Venta de tuberías PVC Pavco, herramientas DeWalt y Stanley, cemento Sol, fierro Arequipa, electricidad Indeco. Pagos con Yape, Plin, Tarjeta y Contra Entrega.",
  keywords: "ferretería perú, tubos pvc pavco, cemento sol, herramientas stanley, dewalt, indenco cables, ferrepro, lima",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#f97316" />
      </head>
      <body>{children}</body>
    </html>
  );
}
