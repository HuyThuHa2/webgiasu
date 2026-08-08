import Link from 'next/link'
import { ArrowLeft, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import VerificationActions from './VerificationActions'

export const dynamic = 'force-dynamic'

export default async function VerificationsPage() {
  const supabase = await createClient()

  // Lấy danh sách các tài khoản đang chờ duyệt
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'tutor')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Kiểm duyệt hồ sơ Gia sư</h1>
            <p className="text-slate-500 mt-1">Danh sách sinh viên đang chờ xác thực thẻ sinh viên.</p>
          </div>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="p-4">Sinh viên</th>
                  <th className="p-4">Trường Đại học</th>
                  <th className="p-4">Chuyên ngành</th>
                  <th className="p-4">Môn dạy</th>
                  <th className="p-4 text-center">Ảnh thẻ</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!profiles || profiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Không có hồ sơ nào đang chờ duyệt.
                    </td>
                  </tr>
                ) : (
                  profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{profile.full_name}</div>
                        <div className="text-sm text-slate-500">{profile.email}</div>
                      </td>
                      <td className="p-4 text-slate-700">{profile.university || 'N/A'}</td>
                      <td className="p-4 text-slate-700">{profile.major || 'N/A'}</td>
                      <td className="p-4 text-slate-700">{profile.subjects || 'N/A'}</td>
                      <td className="p-4 text-center">
                        {profile.student_id_card_url ? (
                          <a 
                            href={profile.student_id_card_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Xem ảnh thẻ"
                          >
                            <ImageIcon className="w-5 h-5" />
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">Chưa tải lên</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end">
                          <VerificationActions profileId={profile.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
