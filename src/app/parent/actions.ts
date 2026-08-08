'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createJobPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const subject = formData.get('subject') as string
  const grade_level = formData.get('grade_level') as string
  const requirements = formData.get('requirements') as string
  const salary = formData.get('salary') as string
  const location = formData.get('location') as string
  const schedule = formData.get('schedule') as string

  const { error } = await supabase
    .from('job_posts')
    .insert({
      parent_id: user.id,
      subject,
      grade_level,
      requirements,
      salary,
      location,
      schedule
    })

  if (error) {
    console.error('Error creating job post:', error)
    redirect(`/parent/jobs/new?error=${encodeURIComponent('Có lỗi xảy ra khi tạo tin đăng.')}`)
  }

  revalidatePath('/parent/jobs')
  revalidatePath('/tutor/jobs')
  redirect('/parent/dashboard?message=' + encodeURIComponent('Đăng tin thành công!'))
}

export async function acceptApplication(applicationId: string, jobId: string) {
  const supabase = await createClient()

  // 1. Chuyển status application thành accepted
  const { error: appError } = await supabase
    .from('job_applications')
    .update({ status: 'accepted' })
    .eq('id', applicationId)

  if (appError) {
    return { success: false, error: appError.message }
  }

  // 2. Chuyển status của job thành closed
  const { error: jobError } = await supabase
    .from('job_posts')
    .update({ status: 'closed' })
    .eq('id', jobId)

  // 3. (Tuỳ chọn) Từ chối các application khác
  await supabase
    .from('job_applications')
    .update({ status: 'rejected' })
    .eq('job_id', jobId)
    .neq('id', applicationId)

  revalidatePath(`/parent/jobs/${jobId}`)
  revalidatePath('/parent/dashboard')
  revalidatePath('/tutor/jobs')
  return { success: true }
}

export async function rejectApplication(applicationId: string, jobId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('job_applications')
    .update({ status: 'rejected' })
    .eq('id', applicationId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/parent/jobs/${jobId}`)
  return { success: true }
}
