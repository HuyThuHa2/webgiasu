import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
  const isCallbackRoute = request.nextUrl.pathname.startsWith('/auth/callback')
  const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding')
  const isProtectedDashboardRoute = request.nextUrl.pathname.startsWith('/admin') || 
                                    request.nextUrl.pathname.startsWith('/parent') || 
                                    request.nextUrl.pathname.startsWith('/tutor')
  
  if (user) {
    const role = user.user_metadata?.role as string | undefined

    // 1. Logged in, NO role -> MUST go to /onboarding (except onboarding itself or auth callback)
    if (!role) {
      if (!isOnboardingRoute && !isCallbackRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }
    } 
    // 2. Logged in, HAS role -> Redirect away from auth routes and onboarding
    else {
      if (isAuthRoute || isOnboardingRoute) {
        const url = request.nextUrl.clone()
        if (role === 'admin') url.pathname = '/admin/dashboard'
        else if (role === 'parent') url.pathname = '/parent/dashboard'
        else if (role === 'tutor') url.pathname = '/tutor/dashboard'
        else url.pathname = '/'
        return NextResponse.redirect(url)
      }
      
      // 3. Logged in, HAS role -> Protect role-specific routes
      if (isProtectedDashboardRoute) {
        if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
          const url = request.nextUrl.clone()
          url.pathname = role === 'parent' ? '/parent/dashboard' : '/tutor/dashboard'
          return NextResponse.redirect(url)
        }
        if (request.nextUrl.pathname.startsWith('/parent') && role !== 'parent') {
          const url = request.nextUrl.clone()
          url.pathname = role === 'tutor' ? '/tutor/dashboard' : '/admin/dashboard'
          return NextResponse.redirect(url)
        }
        if (request.nextUrl.pathname.startsWith('/tutor') && role !== 'tutor') {
          const url = request.nextUrl.clone()
          url.pathname = role === 'parent' ? '/parent/dashboard' : '/admin/dashboard'
          return NextResponse.redirect(url)
        }
      }
    }
  } else {
    // NOT logged in -> protect dashboards and onboarding
    if (isProtectedDashboardRoute || isOnboardingRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
