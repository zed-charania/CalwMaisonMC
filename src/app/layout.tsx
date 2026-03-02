import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/useTheme";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw — Mission Control",
  description: "The command center for your autonomous AI agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='light'?false:(t==='dark'?true:(t==='system'?window.matchMedia('(prefers-color-scheme:dark)').matches:true));if(d)document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
