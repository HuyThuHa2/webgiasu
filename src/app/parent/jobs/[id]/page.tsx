import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ApplicationActions from './ApplicationActions'

export const dynamic = 'force-dynamic'

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Lấy thông tin bài đăng
  const { data: job } = await supabase
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!job) {
    redirect('/parent/dashboard')
  }

  // Lấy danh sách ứng viên
  const { data: applications } = await supabase
    .from('job_applications')
    .select(`
      id,
      status,
      created_at,
      tutor:profiles (
        id,
        full_name,
        email,
        university,
        major,
        student_id_card_url,
        verification_status
      )
    `)
    .eq('job_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link href="/parent/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
        </Link>

        {/* Thông tin bài đăng */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-slate-900">{job.subject} - {job.grade_level}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400">Khu vực</div>
                <div className="font-medium text-slate-900">{job.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400">Mức lương</div>
                <div className="font-medium text-slate-900">{job.salary}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400">Lịch học</div>
                <div className="font-medium text-slate-900">{job.schedule}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Yêu cầu thêm:</h3>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{job.requirements || 'Không có yêu cầu thêm.'}</p>
          </div>
        </div>

        {/* Danh sách ứng viên */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Danh sách ứng viên ({applications?.length || 0})</h2>
        
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {!applications || applications.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Chưa có gia sư nào ứng tuyển cho lớp học này.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="p-4">Gia sư</th>
                  <th className="p-4">Trường Đại học</th>
                  <th className="p-4 text-center">Trạng thái GS</th>
                  <th className="p-4 text-center">Trạng thái Apply</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{app.tutor?.full_name}</div>
                      <div className="text-sm text-slate-500">{app.tutor?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-900">{app.tutor?.university || 'N/A'}</div>
                      <div className="text-sm text-slate-500">{app.tutor?.major || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${app.tutor?.verification_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {app.tutor?.verification_status === 'approved' ? 'Đã duyệt' : 'Chưa duyệt'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${app.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                        ${app.status === 'pending' ? 'bg-blue-100 text-blue-700' : ''}
                      `}>
                        {app.status === 'accepted' ? 'Đã chấp nhận' : app.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {app.tutor?.student_id_card_url && (
                          <a 
                            href={app.tutor.student_id_card_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-700 p-2"
                            title="Xem thẻ sinh viên"
                          >
                            <ImageIcon className="w-5 h-5" />
                          </a>
                        )}
                        {app.status === 'pending' && job.status === 'open' && (
                          <ApplicationActions applicationId={app.id} jobId={job.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
