import { Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

export const metadata = {
  title: "Mountain Goat Travel - Homestay, Phòng & Tour Trải Nghiệm Cao Cấp",
  description: "Khám phá các homestay, phòng nghỉ dưỡng và tour trekking kỳ vĩ cùng Mountain Goat Travel.",
  icons: {
    icon: "/assets/logo_sharp.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`}>
      <body>{children}</body>
    </html>
  );
}
