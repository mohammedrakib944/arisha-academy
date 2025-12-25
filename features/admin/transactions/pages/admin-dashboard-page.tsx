import { Navbar } from '@/features/common/components/navbar'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { getTransactions } from '@/features/transactions/actions/transactions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TransactionList } from '@/features/admin/transactions/components/transaction-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user || !(await isAdmin())) {
    redirect('/')
  }

  const transactions = await getTransactions()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/courses">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle>Manage Courses</CardTitle>
                <CardDescription>Create, edit, and delete courses</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/books">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle>Manage Books</CardTitle>
                <CardDescription>Create, edit, and delete books</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/teachers">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle>Manage Teachers</CardTitle>
                <CardDescription>Create, edit, and delete teachers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>
      </main>
    </div>
  )
}

