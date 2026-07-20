import "./globals.css"

export const metadata = {
  title: "For You maam!",
  description: "A heartfelt surprise.. just for you.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black`}>{children}</body>
    </html>
  )
}
