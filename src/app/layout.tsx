import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PrivyWrapper } from '@/lib/privy/provider'
import { Toaster } from 'sonner'
import FarcasterWrapper from "@/components/FarcasterWrapper";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
          >
            <PrivyWrapper>
              
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      
              <Toaster 
                theme="dark" 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'rgb(17, 24, 39)',
                    border: '1px solid rgb(139, 92, 246, 0.3)',
                    color: 'white',
                  },
                }}
              />
            </PrivyWrapper>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "Secure Crypto App",
        description: "Develop a privacy-centric dApp using FHEVM, React, and Solidity, ensuring secure and confidential transactions for crypto users. Ideal for enhancing privacy in blockchain applications.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_b15291ce-e6b2-4cb8-a060-1507129d54b6-2FFETOvZ1I2CooZpoGLzoM2DipO8xO","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Secure Crypto App","url":"https://word-donkey-122.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
