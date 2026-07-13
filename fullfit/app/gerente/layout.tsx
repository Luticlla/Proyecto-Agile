import GerenteAuthGuard from '@/components/gerente/GerenteAuthGuard'

export default function GerenteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <GerenteAuthGuard>{children}</GerenteAuthGuard>
}