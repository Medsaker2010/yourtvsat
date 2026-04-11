export const metadata = {
  title: 'YourTVSat VIP',
  description: 'Interface Prestige IPTV',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#050505' }}>{children}</body>
    </html>
  )
}
