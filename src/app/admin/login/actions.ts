'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type State = { error: string | null }

export async function login(prevState: State, formData: FormData): Promise<State> {
  const password = (formData.get('password') as string)?.trim()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    return { error: '비밀번호가 올바르지 않습니다.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', adminPassword, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  redirect('/admin')
}
