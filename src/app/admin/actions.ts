'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createLead(data: { name: string; email: string; phone: string }) {
  const name = data.name.trim()
  const email = data.email.trim()
  const phone = data.phone.trim().replace(/-/g, '')

  if (!name || !email || !phone) {
    return { error: '모든 항목을 입력해주세요.' }
  }

  try {
    await db.insert(leads).values({ name, email, phone })
    revalidatePath('/admin')
    return { error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return { error: '이미 등록된 이메일입니다.' }
    }
    return { error: '오류가 발생했습니다.' }
  }
}

export async function updateLead(id: number, data: { name: string; email: string; phone: string }) {
  const name = data.name.trim()
  const email = data.email.trim()
  const phone = data.phone.trim().replace(/-/g, '')

  if (!name || !email || !phone) {
    return { error: '모든 항목을 입력해주세요.' }
  }

  try {
    await db.update(leads).set({ name, email, phone }).where(eq(leads.id, id))
    revalidatePath('/admin')
    return { error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return { error: '이미 등록된 이메일입니다.' }
    }
    return { error: '오류가 발생했습니다.' }
  }
}

export async function deleteLead(id: number) {
  await db.delete(leads).where(eq(leads.id, id))
  revalidatePath('/admin')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
