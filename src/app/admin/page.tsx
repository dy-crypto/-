import { db } from '@/lib/db'
import { leads } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import LeadTable from './LeadTable'
import { logout } from './actions'

export default async function AdminPage() {
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt))

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">어드민</h1>
            <p className="text-sm text-gray-400 mt-1">총 {allLeads.length}개의 리드</p>
          </div>
          <form action={logout}>
            <button className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800">
              로그아웃
            </button>
          </form>
        </div>

        <LeadTable leads={allLeads} />
      </div>
    </main>
  )
}
