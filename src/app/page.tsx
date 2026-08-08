import Link from 'next/link';
import { ArrowRight, BookOpen, Search, ShieldCheck, Star, Users, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">TutorPlatform</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <Link href="#how-it-works" className="hover:text-blue-600 transition-colors duration-300">Cách hoạt động</Link>
            <Link href="#features" className="hover:text-blue-600 transition-colors duration-300">Tính năng</Link>
            <Link href="#testimonials" className="hover:text-blue-600 transition-colors duration-300">Đánh giá</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-28 px-6 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/80 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none"></div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
            Nền tảng kết nối gia sư uy tín
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
            Tìm Gia Sư Chất Lượng <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Dễ Dàng Hơn Bao Giờ Hết
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Kết nối trực tiếp phụ huynh với mạng lưới sinh viên ưu tú từ các trường đại học hàng đầu. Minh bạch, uy tín và hoàn toàn miễn phí trung gian.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-md shadow-blue-200/50 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 group">
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Tìm gia sư ngay
            </Link>
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-2xl font-bold text-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2 group">
              Trở thành gia sư
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "5000+", label: "Sinh viên ưu tú" },
              { num: "10,000+", label: "Lớp đã kết nối" },
              { num: "4.9/5", label: "Đánh giá trung bình" },
              { num: "50+", label: "Trường Đại học" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">{stat.num}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Quy trình đơn giản & Minh bạch</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">Chỉ với 3 bước đơn giản, bạn có thể dễ dàng tìm được người hướng dẫn phù hợp cho con em mình.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 -z-0"></div>
            
            {[
              {
                icon: <Search className="w-8 h-8 text-blue-600" />,
                title: "1. Đăng yêu cầu",
                desc: "Phụ huynh tạo bài đăng tìm gia sư với các yêu cầu cụ thể về môn học, thời gian và học phí."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "2. Sinh viên ứng tuyển",
                desc: "Các bạn sinh viên có profile đã được xác thực sẽ xem xét và gửi yêu cầu nhận lớp."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
                title: "3. Lựa chọn & Bắt đầu",
                desc: "Phụ huynh xem hồ sơ, phỏng vấn và chọn gia sư phù hợp nhất. Hai bên thống nhất lịch học."
              }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-200">
                  <div className="group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Tại sao chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TutorPlatform?</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Hồ sơ được xác thực 100%",
                    desc: "Tất cả sinh viên đều phải cung cấp thẻ sinh viên và bảng điểm trước khi được nhận lớp.",
                    icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
                    bg: "bg-emerald-50"
                  },
                  {
                    title: "Đánh giá chân thực",
                    desc: "Hệ thống rating & review minh bạch sau mỗi khóa học giúp đảm bảo chất lượng giảng dạy.",
                    icon: <Star className="w-6 h-6 text-amber-500" />,
                    bg: "bg-amber-50"
                  },
                  {
                    title: "Không qua trung gian",
                    desc: "Kết nối trực tiếp, tiết kiệm chi phí trung gian (phí nhận lớp) cho cả phụ huynh và sinh viên.",
                    icon: <Users className="w-6 h-6 text-blue-500" />,
                    bg: "bg-blue-50"
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className={`flex-shrink-0 w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h4>
                      <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 transform rotate-3 rounded-[2.5rem] opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Students studying" 
                className="relative rounded-[2rem] shadow-2xl object-cover w-full h-[600px] border border-slate-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Bạn đã sẵn sàng?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Tham gia cộng đồng hàng chục nghìn phụ huynh và gia sư ngay hôm nay. 
            Nền tảng hoàn toàn miễn phí!
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/register" className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Đăng tin tìm gia sư
            </Link>
            <Link href="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg shadow-blue-500/20 hover:-translate-y-1">
              Đăng ký làm gia sư
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-slate-100 text-slate-500">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">TutorPlatform</span>
            </div>
            <p className="max-w-sm leading-relaxed">Nền tảng công nghệ giáo dục kết nối trực tiếp Phụ huynh và Gia sư, không qua trung gian, uy tín hàng đầu Việt Nam.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Liên kết</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Về chúng tôi</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Bảng giá</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Tuyển dụng</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-100 text-sm font-medium text-center">
          &copy; {new Date().getFullYear()} TutorPlatform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
