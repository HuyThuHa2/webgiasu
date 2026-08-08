'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect(`/login?message=${encodeURIComponent('Email hoặc mật khẩu không chính xác')}`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role

  if (role === 'admin') redirect('/admin/dashboard')
  if (role === 'parent') redirect('/parent/dashboard')
  if (role === 'tutor') redirect('/tutor/dashboard')

  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        role: formData.get('role') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect(`/register?message=${encodeURIComponent('Lỗi khi đăng ký, vui lòng thử lại sau.')}`)
  }

  // Supabase mặc định yêu cầu email confirmation
  redirect(`/login?message=${encodeURIComponent('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')}`)
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000'
  
  // Đảm bảo có protocol (http/https)
  url = url.startsWith('http') ? url : `https://${url}`
  
  // Xóa dấu slash cuối nếu có
  url = url.endsWith('/') ? url.slice(0, -1) : url
  return url
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent('Lỗi khi đăng nhập bằng Google')}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithFacebook() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${getURL()}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent('Lỗi khi đăng nhập bằng Facebook')}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
