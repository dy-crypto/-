'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createLead, updateLead, deleteLead } from './actions'
import type { Lead } from '@/lib/schema'

type EditState = {
  id: number
  name: string
  email: string
  phone: string
}

export default function LeadTable({ leads }: { leads: Lead[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<EditState | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '' })
  const [createError, setCreateError] = useState<string | null>(null)

  function openCreate() {
    setNewLead({ name: '', email: '', phone: '' })
    setCreateError(null)
    setCreating(true)
  }

  function closeCreate() {
    setCreating(false)
    setCreateError(null)
  }

  function handleCreate() {
    startTransition(async () => {
      const result = await createLead(newLead)
      if (result.error) {
        setCreateError(result.error)
      } else {
        setCreating(false)
        setCreateError(null)
        router.refresh()
      }
    })
  }

  function openEdit(lead: Lead) {
    setEditing({ id: lead.id, name: lead.name, email: lead.email, phone: lead.phone })
    setEditError(null)
  }

  function closeEdit() {
    setEditing(null)
    setEditError(null)
  }

  function handleDelete(id: number, name: string) {
    if (!confirm(`"${name}" 리드를 삭제하시겠습니까?`)) return
    startTransition(async () => {
      await deleteLead(id)
      router.refresh()
    })
  }

  function handleSave() {
    if (!editing) return
    startTransition(async () => {
      const result = await updateLead(editing.id, {
        name: editing.name,
        email: editing.email,
        phone: editing.phone,
      })
      if (result.error) {
        setEditError(result.error)
      } else {
        setEditing(null)
        setEditError(null)
        router.refresh()
      }
    })
  }

  const tableContent = leads.length === 0 ? (
    <div className="text-center py-20 text-gray-500">아직 접수된 리드가 없습니다.</div>
  ) : (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">이름</th>
              <th className="text-left px-5 py-3 font-medium">이메일</th>
              <th className="text-left px-5 py-3 font-medium">전화번호</th>
              <th className="text-left px-5 py-3 font-medium">접수일시</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr
                key={lead.id}
                className={`border-b border-gray-800/50 last:border-0 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'}`}
              >
                <td className="px-5 py-3.5 text-white font-medium">{lead.name}</td>
                <td className="px-5 py-3.5 text-gray-300">{lead.email}</td>
                <td className="px-5 py-3.5 text-gray-300">{lead.phone}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openEdit(lead)}
                      className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id, lead.name)}
                      disabled={isPending}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-950 disabled:opacity-40"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="bg-white text-gray-950 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          + 리드 추가
        </button>
      </div>

      {tableContent}

      {creating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-6">리드 추가</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">이름</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="홍길동"
                  autoFocus
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">이메일</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="example@email.com"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">전화번호</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="01012345678"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
                />
              </div>

              {createError && <p className="text-xs text-red-400">{createError}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeCreate}
                className="flex-1 bg-gray-800 text-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="flex-1 bg-white text-gray-950 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-6">리드 수정</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">이름</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">이메일</label>
                <input
                  type="email"
                  value={editing.email}
                  onChange={e => setEditing({ ...editing, email: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">전화번호</label>
                <input
                  type="tel"
                  value={editing.phone}
                  onChange={e => setEditing({ ...editing, phone: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
                />
              </div>

              {editError && <p className="text-xs text-red-400">{editError}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEdit}
                className="flex-1 bg-gray-800 text-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 bg-white text-gray-950 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
