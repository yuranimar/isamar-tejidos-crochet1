import './globals.css'

export const metadata = {
  title: 'Isamar • Tejidos y Crochet',
  description: 'Piezas artesanales únicas tejidas a mano. Crochet, tejido y textiles artesanales.',
  openGraph: {
    title: 'Isamar • Tejidos y Crochet',
    description: 'Piezas artesanales únicas tejidas a mano.',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&family=Marcellus&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  )
}
