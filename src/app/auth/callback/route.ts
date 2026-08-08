import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // Lấy next url, nếu không có mặc định về trang chủ
  const next = searchParams.get('next') ?? '/'
  
  // Dùng helper để lấy origin an toàn trên môi trường Vercel
  const origin = getURL()
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Lấy thông tin user để kiểm tra role
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Kiểm tra xem user có role trong bảng profiles chưa
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        const role = profile?.role

        if (!role) {
          // User mới chưa có role, chuyển hướng đến trang onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        } else {
          // User đã có role, chuyển hướng đến dashboard tương ứng
          if (role === 'admin') return NextResponse.redirect(`${origin}/admin/dashboard`)
          if (role === 'parent') return NextResponse.redirect(`${origin}/parent/dashboard`)
          if (role === 'tutor') return NextResponse.redirect(`${origin}/tutor/dashboard`)
        }
        
        // Mặc định trả về trang chủ (hoặc URL 'next' nếu có)
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Fallback redirect nếu có lỗi xảy ra
  return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent('Đăng nhập thất bại')}`)
}
