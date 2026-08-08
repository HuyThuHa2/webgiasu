'use client'

import { useState } from 'react'
import { approveProfile, rejectProfile } from '../actions'
import { Check, X, Loader2 } from 'lucide-react'

export default function VerificationActions({ profileId }: { profileId: string }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async () => {
    setLoading('approve')
    await approveProfile(profileId)
    setLoading(null)
  }

  const handleReject = async () => {
    setLoading('reject')
    await rejectProfile(profileId)
    setLoading(null)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading !== null}
        className="flex items-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Duyệt
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        Từ chối
      </button>
    </div>
  )
}
