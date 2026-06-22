import type { Metadata } from "next";
import localFont from "next/font/local";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const aramco = localFont({
  src: [
    {
      path: "../../Mj_Aramco/Mj_Aramco-Light.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../Mj_Aramco/Mj_Aramco-Bold.ttf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-aramco",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://paidaco.com"),
  title: {
    default: "Paidaco | پیدا کو",
    template: "%s | Paidaco"
  },
  description:
    "Find local businesses, services, shops, restaurants, doctors, schools, products, prices, reviews, and guides in Afghanistan.",
  alternates: {
    languages: {
      fa: "/fa",
      ps: "/ps",
      en: "/en"
    }
  },
  openGraph: {
    title: "Paidaco | پیدا کو",
    description: "Afghanistan's local discovery engine for businesses, services, places, prices, and reviews.",
    url: "https://paidaco.com",
    siteName: "Paidaco",
    locale: "fa_AF",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={aramco.variable}>
      <body>{children}</body>
    </html>
  );
}
