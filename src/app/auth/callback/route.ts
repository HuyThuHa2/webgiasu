import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Fetch user to check role
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has a role in the profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        const role = profile?.role

        if (!role) {
          // New user without role, redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        } else {
          // User already has a role, redirect to corresponding dashboard
          if (role === 'admin') return NextResponse.redirect(`${origin}/admin/dashboard`)
          if (role === 'parent') return NextResponse.redirect(`${origin}/parent/dashboard`)
          if (role === 'tutor') return NextResponse.redirect(`${origin}/tutor/dashboard`)
        }
      }
    }
  }

  // Fallback redirect if something went wrong
  return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent('Đăng nhập thất bại')}`)
}
