import { submitRole } from './actions'
import { BookOpen, User, GraduationCap } from 'lucide-react'

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const message = resolvedSearchParams?.message;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 text-blue-600 mb-6">
          <BookOpen className="w-8 h-8" />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">EduConnect</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Chọn vai trò của bạn
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Hãy cho chúng tôi biết bạn tham gia với tư cách là Phụ huynh hay Gia sư.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form className="space-y-6" action={submitRole}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-slate-300 hover:bg-slate-50 [&:has(input:checked)]:border-blue-500 [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-blue-500">
                <input type="radio" name="role" value="parent" className="sr-only" required />
                <span className="flex flex-1">
                  <span className="flex flex-col items-center justify-center w-full">
                    <User className="w-8 h-8 mb-2 text-blue-600" />
                    <span className="block text-sm font-medium text-slate-900">Phụ huynh</span>
                    <span className="mt-1 flex items-center text-xs text-slate-500 text-center">Tìm gia sư</span>
                  </span>
                </span>
              </label>

              <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-slate-300 hover:bg-slate-50 [&:has(input:checked)]:border-blue-500 [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-blue-500">
                <input type="radio" name="role" value="tutor" className="sr-only" required />
                <span className="flex flex-1">
                  <span className="flex flex-col items-center justify-center w-full">
                    <GraduationCap className="w-8 h-8 mb-2 text-emerald-600" />
                    <span className="block text-sm font-medium text-slate-900">Gia sư</span>
                    <span className="mt-1 flex items-center text-xs text-slate-500 text-center">Làm gia sư</span>
                  </span>
                </span>
              </label>
            </div>

            {message && (
              <p className="mt-4 p-4 bg-amber-50 text-amber-700 text-center text-sm rounded-md border border-amber-200">
                {message}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Tiếp tục
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
