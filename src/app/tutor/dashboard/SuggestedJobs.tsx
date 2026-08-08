'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Users } from 'lucide-react';

export default function SuggestedJobs({ tutorProfile }: { tutorProfile: any }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 1. Lấy dữ liệu ban đầu
    const fetchInitialJobs = async () => {
      let query = supabase
        .from('job_posts')
        .select('*')
        .eq('status', 'open');

      // Lọc theo subject hoặc location của tutor nếu có
      if (tutorProfile?.teaching_subject && tutorProfile?.teaching_location) {
        query = query.or(`subject.ilike.%${tutorProfile.teaching_subject}%,location.ilike.%${tutorProfile.teaching_location}%`);
      } else if (tutorProfile?.teaching_subject) {
        query = query.ilike('subject', `%${tutorProfile.teaching_subject}%`);
      } else if (tutorProfile?.teaching_location) {
        query = query.ilike('location', `%${tutorProfile.teaching_location}%`);
      } else if (tutorProfile?.subject) {
        // Fallback to standard subject field if teaching_subject is not used
        query = query.ilike('subject', `%${tutorProfile.subject}%`);
      }

      const { data } = await query.order('created_at', { ascending: false }).limit(10);
      
      if (data) setJobs(data);
    };

    fetchInitialJobs();

    // 2. Lắng nghe Realtime
    const channel = supabase
      .channel('public:job_posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_posts' },
        (payload) => {
          console.log('Realtime payload:', payload);
          if (payload.eventType === 'INSERT') {
            const newJob = payload.new;
            if (newJob.status === 'open') {
              // Check filter manually for realtime
              let matches = true;
              if (tutorProfile?.teaching_subject || tutorProfile?.subject) {
                const subj = (tutorProfile.teaching_subject || tutorProfile.subject || '').toLowerCase();
                const loc = (tutorProfile.teaching_location || '').toLowerCase();
                const jobSubj = (newJob.subject || '').toLowerCase();
                const jobLoc = (newJob.location || '').toLowerCase();
                
                if (subj && loc) {
                  matches = jobSubj.includes(subj) || jobLoc.includes(loc);
                } else if (subj) {
                  matches = jobSubj.includes(subj);
                } else if (loc) {
                  matches = jobLoc.includes(loc);
                }
              }
              
              if (matches) {
                setJobs((prev) => [newJob, ...prev].slice(0, 10)); // Giữ tối đa 10 lớp mới nhất
              }
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedJob = payload.new;
            setJobs((prev) => {
              if (updatedJob.status !== 'open') {
                return prev.filter((job) => job.id !== updatedJob.id);
              }
              return prev.map((job) => (job.id === updatedJob.id ? updatedJob : job));
            });
          } else if (payload.eventType === 'DELETE') {
            setJobs((prev) => prev.filter((job) => job.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, tutorProfile]);

  if (jobs.length === 0) {
    return (
      <div className="text-slate-500 text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50">
        Chưa có lớp học nào phù hợp với môn học/khu vực của bạn. Hệ thống sẽ tự động cập nhật ngay khi có!
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <Link key={job.id} href={`/tutor/jobs/${job.id}`} className="block border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group bg-white">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {job.subject} - {job.grade_level}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  Mới
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mt-2">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> {job.salary}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {job.schedule}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm self-start md:self-auto group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Xem chi tiết
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
