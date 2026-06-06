'use client'

import { useActionState } from 'react'
import { login } from './actions'

const initialState = { error: null }

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState)

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">비밀번호</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoFocus
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
        {pending ? '확인 중...' : '로그인'}
      </button>
    </form>
  )
}
