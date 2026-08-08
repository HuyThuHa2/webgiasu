import Link from 'next/link';
import { ArrowLeft, Users, FileText, CheckCircle, ArrowRight, LayoutDashboard, Search } from 'lucide-react';
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Lấy số lượng hồ sơ đang chờ duyệt
  const { count: pendingCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'tutor')
    .eq('verification_status', 'pending')

  // Thống kê 1: Tổng số người dùng
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Thống kê 2: Tổng bài đăng đang mở
  const { count: openJobs } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  // Hoạt động gần đây: 5 bài đăng mới nhất
  const { data: recentJobs } = await supabase
    .from('job_posts')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Quản lý toàn bộ hệ thống TutorPlatform</p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Tổng người dùng</div>
            <div className="text-4xl font-extrabold text-slate-900 mt-1">{totalUsers || 0}</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-emerald-50 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Lớp học đang mở</div>
            <div className="text-4xl font-extrabold text-slate-900 mt-1">{openJobs || 0}</div>
          </div>

          {/* Card 3 */}
          <Link href="/admin/verifications" className="group bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block relative overflow-hidden">
            <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-500 text-amber-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-1">Hồ sơ chờ duyệt</div>
            <div className="text-4xl font-extrabold text-amber-900 mt-1">{pendingCount || 0}</div>
            <ArrowRight className="w-6 h-6 text-amber-500 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Bài đăng mới nhất</h2>
            <Link href="/admin/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Xem tất cả</Link>
          </div>
          
          {!recentJobs || recentJobs.length === 0 ? (
            <div className="text-slate-500 text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <div className="w-16 h-16 bg-white text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8" />
              </div>
              <p className="font-medium">Chưa có bài đăng nào trên hệ thống.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex flex-col md:flex-row justify-between md:items-center p-5 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all duration-300 group">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{job.subject} - {job.grade_level}</h3>
                    <div className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-4">
                      <span>Khu vực: {job.location}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>Lương: <span className="text-emerald-600 font-semibold">{job.salary}</span></span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                    </span>
                    <button className="text-slate-400 hover:text-slate-700 transition-colors">
                       <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
