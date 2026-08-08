import Link from 'next/link';
import { ArrowLeft, Search, PlusCircle, BookOpen, Clock, MapPin, DollarSign, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ParentDashboard({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const message = resolvedSearchParams?.message;

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: jobs } = await supabase
    .from('job_posts')
    .select(`
      *,
      job_applications ( count )
    `)
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false })

  const openJobsCount = jobs?.filter(j => j.status === 'open').length || 0

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Phụ Huynh</h1>
            <p className="text-slate-500 mt-1">Quản lý bài đăng và tìm gia sư cho con em bạn</p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>

        {message && (
          <div className="p-4 mb-8 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-medium text-center">
            {message}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 p-6 md:p-8 rounded-2xl text-white shadow-lg shadow-blue-200 col-span-1 md:col-span-2 relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Đăng tin tìm gia sư mới</h2>
              <p className="text-blue-100 mb-6 max-w-sm">Hãy điền thông tin chi tiết về môn học, thời gian để các bạn gia sư có thể ứng tuyển.</p>
              <Link href="/parent/jobs/new" className="inline-flex bg-white text-blue-600 px-6 py-2.5 rounded-full font-bold text-sm items-center gap-2 hover:bg-blue-50 transition-colors shadow-sm">
                <PlusCircle className="w-4 h-4" /> Tạo bài đăng ngay
              </Link>
            </div>
            <BookOpen className="absolute -bottom-4 -right-4 w-48 h-48 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <div className="text-lg font-bold text-slate-900 mb-1">{openJobsCount} bài đăng đang mở</div>
            <div className="text-sm font-medium text-slate-500">Quản lý lớp học của bạn</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Bài đăng của tôi</h2>
          
          {!jobs || jobs.length === 0 ? (
            <div className="text-slate-500 text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              Bạn chưa có bài đăng nào. Hãy tạo bài đăng đầu tiên để bắt đầu!
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => {
                const applicantCount = job.job_applications?.[0]?.count || 0;
                
                return (
                  <Link key={job.id} href={`/parent/jobs/${job.id}`} className="block border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.subject} - {job.grade_level}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> {job.salary}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {job.schedule}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm self-start md:self-auto">
                        <Users className="w-4 h-4" />
                        {applicantCount} Ứng viên
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
