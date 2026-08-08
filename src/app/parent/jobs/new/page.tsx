import Link from 'next/link'
import { ArrowLeft, Briefcase } from 'lucide-react'
import { createJobPost } from '../../actions'

export default async function NewJobPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams
  const error = resolvedSearchParams?.error

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Đăng tin tìm Gia sư</h1>
            <p className="text-slate-500 mt-1">Điền đầy đủ thông tin để tìm được gia sư phù hợp nhất.</p>
          </div>
          <Link href="/parent/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <form action={createJobPost} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Môn học cần tìm</label>
                <input type="text" id="subject" name="subject" required placeholder="Ví dụ: Toán, Vật lý, Tiếng Anh..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all" />
              </div>
              <div>
                <label htmlFor="grade_level" className="block text-sm font-medium text-slate-700 mb-2">Lớp / Trình độ</label>
                <input type="text" id="grade_level" name="grade_level" required placeholder="Ví dụ: Lớp 10, Luyện thi đại học..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all" />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">Khu vực / Hình thức học</label>
              <input type="text" id="location" name="location" required placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội (Học trực tiếp tại nhà)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-slate-700 mb-2">Lịch học dự kiến</label>
                <input type="text" id="schedule" name="schedule" required placeholder="Ví dụ: Tối Thứ 3, Thứ 5 (2 tiếng/buổi)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all" />
              </div>
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-2">Mức lương đề xuất</label>
                <input type="text" id="salary" name="salary" required placeholder="Ví dụ: 150.000đ/buổi" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all" />
              </div>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 mb-2">Yêu cầu thêm đối với Gia sư</label>
              <textarea id="requirements" name="requirements" rows={4} placeholder="Ví dụ: Yêu cầu gia sư nữ, sinh viên năm 3 trở lên, có kinh nghiệm ôn thi học sinh giỏi..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all"></textarea>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
                {error}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5">
                <Briefcase className="w-5 h-5" />
                Đăng tin ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
