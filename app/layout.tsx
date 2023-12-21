import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { ThemeProvider } from "@/components/ThemeProvider"

const roboto = Roboto({ weight: ["400"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Digital Marketplace",
  description: "Ecommerce website for trading NFTs",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={cn("relative h-full antialiased bg-background text-foreground", roboto.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="themeVal">
          <main className="relative flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex-grow">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
export default RootLayout
