import Link from 'next/link';
import { ArrowLeft, Book, Briefcase, Star, Clock, AlertTriangle, Search } from 'lucide-react';
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SuggestedJobs from './SuggestedJobs'

export const dynamic = 'force-dynamic'

export default async function TutorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status')
    .eq('id', user.id)
    .single()

  const status = profile?.verification_status || 'pending'

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gia Sư</h1>
            <p className="text-slate-500 mt-1">Chào mừng bạn trở lại, hãy tìm kiếm lớp học phù hợp nhé!</p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>

        {status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Hồ sơ của bạn đang được ban quản trị kiểm duyệt</h3>
            <p className="text-amber-800 max-w-2xl">
              Tính năng nhận lớp sẽ được mở sau khi ảnh thẻ sinh viên của bạn được xác thực. Vui lòng kiên nhẫn, quá trình này thường mất từ 1-2 ngày làm việc.
            </p>
          </div>
        )}

        {status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Hồ sơ của bạn đã bị từ chối</h3>
            <p className="text-red-800 max-w-2xl">
              Có vẻ như ảnh thẻ sinh viên của bạn không hợp lệ hoặc bị mờ. Vui lòng cập nhật lại thông tin ở mục Cài đặt.
            </p>
          </div>
        )}
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 ${status !== 'approved' ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
              <Book className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium text-slate-500">Lớp đang dạy</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">0</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium text-slate-500">Đã ứng tuyển</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">0</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-3">
              <Star className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium text-slate-500">Đánh giá trung bình</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">--</div>
          </div>
        </div>

        <div className={`mb-8 ${status !== 'approved' ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Gợi ý cho bạn (Realtime)
            </h2>
            <Link href="/tutor/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Xem tất cả &rarr;
            </Link>
          </div>
          <SuggestedJobs tutorProfile={profile} />
        </div>
      </div>
    </div>
  );
}
