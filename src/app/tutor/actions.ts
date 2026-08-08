'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function applyForJob(jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Bạn phải đăng nhập để nhận lớp.' }
  }

  // 1. Lấy thông tin profile của tutor để check verification_status (Back-end validation)
  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status')
    .eq('id', user.id)
    .single()

  if (profile?.verification_status !== 'approved') {
    return { success: false, error: 'Hồ sơ của bạn chưa được duyệt. Không thể nhận lớp.' }
  }

  // 2. Insert application
  const { error } = await supabase
    .from('job_applications')
    .insert({
      job_id: jobId,
      tutor_id: user.id
    })

  if (error) {
    // Lỗi có thể do UNIQUE constraint (đã apply rồi)
    if (error.code === '23505') {
      return { success: false, error: 'Bạn đã ứng tuyển lớp này rồi!' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/tutor/jobs')
  revalidatePath('/parent/jobs/[id]', 'page')
  return { success: true }
}
