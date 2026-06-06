'use client'

import { useActionState } from 'react'
import { submitLead } from './actions'

const initialState = { success: false, error: null }

export default function LeadForm() {
  const [state, action, pending] = useActionState(submitLead, initialState)

  if (state.success) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-3">✓</p>
        <p className="font-semibold text-white">제출이 완료됐습니다!</p>
        <p className="text-sm text-gray-400 mt-1">빠르게 연락드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">이름</label>
        <input
          name="name"
          type="text"
          placeholder="홍길동"
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">이메일</label>
        <input
          name="email"
          type="email"
          placeholder="example@email.com"
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">전화번호</label>
        <input
          name="phone"
          type="tel"
          placeholder="01012345678"
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-colors"
        />
      </div>

      {state.error && (
        <p className="text-xs text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 bg-white text-gray-950 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? '제출 중...' : '제출하기'}
      </button>
    </form>
  )
}
