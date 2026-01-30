import { getSession } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'
import { AdminLayout } from '@/shared'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  let userInfo = { naam: 'Gebruiker', email: '', rol: '', isAdmin: false }

  if (session) {
    const teamlid = await prisma.teamlid.findUnique({
      where: { id: session.userId },
      select: { voornaam: true, achternaam: true },
    })

    userInfo = {
      naam: teamlid ? `${teamlid.voornaam} ${teamlid.achternaam}` : session.email,
      email: session.email,
      rol: session.rol,
      isAdmin: session.isAdmin,
    }
  }

  return <AdminLayout userInfo={userInfo}>{children}</AdminLayout>
}
