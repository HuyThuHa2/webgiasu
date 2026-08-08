import Link from 'next/link'
import { ArrowLeft, Search, Clock, MapPin, DollarSign, Filter, Sparkles, List } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ApplyButton from './ApplyButton'
import SuggestedJobs from '../dashboard/SuggestedJobs'

export const dynamic = 'force-dynamic'

export default async function JobBoardPage({ searchParams }: { searchParams: Promise<{ q?: string, tab?: string }> }) {
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams?.q?.toLowerCase() || ''
  const tab = resolvedSearchParams?.tab || 'all'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // Lấy toàn bộ profile của tutor (cần subjects/location cho SuggestedJobs)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isApproved = profile?.verification_status === 'approved'

  // Lấy danh sách job open
  const { data: jobs } = await supabase
    .from('job_posts')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  // Lấy danh sách các lớp tutor ĐÃ ứng tuyển
  const { data: applications } = await supabase
    .from('job_applications')
    .select('job_id')
    .eq('tutor_id', user.id)

  const appliedJobIds = new Set(applications?.map(app => app.job_id) || [])

  // Lọc theo search (client-like behavior in server component)
  const filteredJobs = jobs?.filter(job => {
    if (!q) return true
    return (
      job.subject.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tìm Lớp Dạy</h1>
            <p className="text-slate-500 mt-1">Khám phá các lớp học mới nhất dành cho gia sư</p>
          </div>
          <Link href="/tutor/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
          </Link>
        </div>

        {/* Cảnh báo chưa duyệt */}
        {!isApproved && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800">
            <div className="bg-amber-100 p-1.5 rounded-full h-fit">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Tài khoản chưa được xác thực</h3>
              <p className="text-sm">Bạn cần chờ Quản trị viên duyệt hồ sơ và ảnh thẻ sinh viên để có thể nhận lớp. Trong lúc này bạn vẫn có thể xem danh sách lớp.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200 pb-px overflow-x-auto">
          <Link 
            href="?tab=all" 
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${tab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <List className="w-4 h-4" /> Tất cả lớp học
          </Link>
          <Link 
            href="?tab=suggested" 
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${tab === 'suggested' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Sparkles className="w-4 h-4" /> Gợi ý cho bạn
          </Link>
        </div>

        {tab === 'suggested' ? (
          <SuggestedJobs tutorProfile={profile} />
        ) : (
          <>
            {/* Thanh tìm kiếm cơ bản */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
              <form className="flex-1 relative">
                <input type="hidden" name="tab" value="all" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  name="q"
                  defaultValue={q}
                  placeholder="Tìm theo môn học hoặc khu vực (VD: Toán, Đà Nẵng...)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </form>
              <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" /> Lọc
              </button>
            </div>

            {/* Danh sách lớp */}
            <div className="grid gap-6">
              {!filteredJobs || filteredJobs.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Không tìm thấy lớp học phù hợp</h3>
                  <p className="text-slate-500">Hãy thử thay đổi từ khóa tìm kiếm nhé.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-slate-900">{job.subject}</h2>
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                            {job.grade_level}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <DollarSign className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-emerald-600">{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium">{job.schedule}</span>
                          </div>
                        </div>
                        
                        {job.requirements && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Yêu cầu thêm</h4>
                            <p className="text-sm text-slate-700">{job.requirements}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                        <ApplyButton 
                          jobId={job.id} 
                          isApproved={isApproved} 
                          hasApplied={appliedJobIds.has(job.id)} 
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
