import '../styles/globals.css'

export const metadata = {
  title: 'Dream Palaces',
  description: 'Interactive visualization of cinema data',
}

import { Open_Sans, Roboto_Mono, Sansation } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  //👇 Add variable to our object
  variable: '--font-opensans',
})

//👇 Configure the object for our second font
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

const sansation = Sansation({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sansation',
  weight: '400',
})



export default function RootLayout({ children }) {
  return (
    <html lang="en"
      className={`${openSans.variable} ${robotoMono.variable} ${sansation.variable} font-sans`}
    >
      <body>
        {children}
      </body>
    </html>
  )
}
