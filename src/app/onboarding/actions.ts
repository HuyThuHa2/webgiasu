'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function submitRole(formData: FormData) {
  const supabase = await createClient()
  const role = formData.get('role') as string

  if (!role || !['parent', 'tutor'].includes(role)) {
    return redirect('/onboarding?message=Vui lòng chọn vai trò hợp lệ')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Update user metadata so the JWT and middleware are aware of the role
  await supabase.auth.updateUser({
    data: { role }
  })

  // Update the profiles table
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', user.id)

  if (error) {
    return redirect(`/onboarding?message=${encodeURIComponent('Có lỗi xảy ra khi lưu vai trò')}`)
  }

  // Redirect to respective dashboard
  if (role === 'parent') {
    redirect('/parent/dashboard')
  } else {
    redirect('/tutor/dashboard')
  }
}
