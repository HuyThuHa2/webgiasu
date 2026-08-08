'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveProfile(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ verification_status: 'approved' })
    .eq('id', id)

  if (error) {
    console.error('Error approving profile:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/verifications')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function rejectProfile(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ verification_status: 'rejected' })
    .eq('id', id)

  if (error) {
    console.error('Error rejecting profile:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/verifications')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
