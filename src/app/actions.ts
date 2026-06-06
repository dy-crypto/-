'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/schema'

type State = { success: boolean; error: string | null }

export async function submitLead(prevState: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim().replace(/-/g, '')

  if (!name || !email || !phone) {
    return { success: false, error: '모든 항목을 입력해주세요.' }
  }

  try {
    await db.insert(leads).values({ name, email, phone })
    return { success: true, error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return { success: false, error: '이미 등록된 이메일입니다.' }
    }
    return { success: false, error: '오류가 발생했습니다. 다시 시도해주세요.' }
  }
}
