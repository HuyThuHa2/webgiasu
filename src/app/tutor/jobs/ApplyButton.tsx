'use client'

import { useState } from 'react'
import { applyForJob } from '../actions'
import { CheckCircle2, Loader2, Send } from 'lucide-react'

export default function ApplyButton({ jobId, isApproved, hasApplied }: { jobId: string, isApproved: boolean, hasApplied: boolean }) {
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(hasApplied)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!isApproved) return;
    setLoading(true)
    setError('')
    
    const res = await applyForJob(jobId)
    
    if (res.success) {
      setApplied(true)
    } else {
      setError(res.error || 'Có lỗi xảy ra')
    }
    setLoading(false)
  }

  if (applied) {
    return (
      <button disabled className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-lg font-bold text-sm cursor-not-allowed border border-emerald-200">
        <CheckCircle2 className="w-4 h-4" /> Đã ứng tuyển
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="relative group w-full sm:w-auto">
        <button
          onClick={handleApply}
          disabled={!isApproved || loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Nhận lớp ngay
        </button>
        
        {/* Tooltip khi chưa duyệt */}
        {!isApproved && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-10">
            Hồ sơ của bạn cần được Admin duyệt để nhận lớp
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  )
}
