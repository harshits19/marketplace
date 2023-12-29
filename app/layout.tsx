import { Roboto } from "next/font/google"
import Navbar from "@/components/Navbar"
import { ThemeProvider } from "@/components/ThemeProvider"
import Providers from "@/components/Providers"
import Footer from "@/components/Footer"
import { constructMetadata } from "@/lib/utils"
import { Toaster } from "sonner"
import "./globals.css"
import { cn } from "@/lib/utils"

const roboto = Roboto({ weight: ["400"], subsets: ["latin"] })

export const metadata = constructMetadata()

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
            <Providers>
              <Navbar />
              <div className="flex-1 flex-grow">{children}</div>
              <Footer />
            </Providers>
          </main>
        </ThemeProvider>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  )
}
export default RootLayout
