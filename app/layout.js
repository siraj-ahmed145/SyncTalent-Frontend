import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SyncTalent",
  description: "AI-driven candidate ranking and personalized job recommendations. Connecting the right talent with the right opportunities.",
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: 'any' }],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

const themeInitScript = `
(function(){
  try {
    var d = localStorage.getItem('darkMode');
    var t = localStorage.getItem('theme');
    var dark = (d === 'true' || t === 'dark');
    if ((d === null || d === '') && (t === null || t === '')) {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
