import { useState } from "react";

const courses = [
  {
    id: 1,
    title: "الكيمياء العضوية",
    subtitle: "الصف الثالث الثانوي",
    lessons: 24,
    hours: 18,
    price: 299,
    badge: "الأكثر مبيعاً",
    badgeColor: "#f59e0b",
    topics: ["الهيدروكربونات", "المجموعات الوظيفية", "التفاعلات العضوية", "البوليمرات"],
    icon: "⚗️",
    color: "#10b981",
  },
  {
    id: 2,
    title: "الكيمياء غير العضوية",
    subtitle: "الصف الثاني الثانوي",
    lessons: 20,
    hours: 15,
    price: 249,
    badge: "جديد",
    badgeColor: "#3b82f6",
    topics: ["الجدول الدوري", "الروابط الكيميائية", "التفاعلات", "المحاليل"],
    icon: "🔬",
    color: "#6366f1",
  },
  {
    id: 3,
    title: "كيمياء أولى ثانوي",
    subtitle: "أساسيات الكيمياء",
    lessons: 16,
    hours: 12,
    price: 199,
    badge: "للمبتدئين",
    badgeColor: "#8b5cf6",
    topics: ["المادة وخواصها", "الذرة", "الجدول الدوري", "التفاعلات الأساسية"],
    icon: "⚛️",
    color: "#ec4899",
  },
];

const testimonials = [
  { name: "أحمد محمود", grade: "طالب ثانوي", text: "مستر حازم شرحه واضح جداً وبيخلي الكيمياء سهلة ومفهومة", avatar: "أ", stars: 5 },
  { name: "سارة علي", grade: "طالبة ثانوي", text: "بفضل المنصة دي اتحسنت درجاتي كتير وبقيت بحب الكيمياء", avatar: "س", stars: 5 },
  { name: "كريم حسن", grade: "طالب ثانوي", text: "الحصص المسجلة بتساعدني أراجع وقت ما أنا عايز وبالسرعة اللي أنا محتاجها", avatar: "ك", stars: 5 },
];

const stats = [
  { value: "1200+", label: "طالب مشترك" },
  { value: "60+", label: "حصة مسجلة" },
  { value: "98%", label: "نسبة النجاح" },
  { value: "4.9", label: "تقييم المنصة" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [playingLesson, setPlayingLesson] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = "#10b981") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubscribe = (course) => {
    if (subscribedCourses.find((c) => c.id === course.id)) {
      showToast("أنت مشترك بالفعل في هذه الدورة!", "#f59e0b");
      return;
    }
    setModalCourse(course);
    setShowModal(true);
  };

  const confirmSubscribe = () => {
    setSubscribedCourses([...subscribedCourses, modalCourse]);
    setShowModal(false);
    showToast(`تم الاشتراك في ${modalCourse.title} بنجاح! 🎉`);
    setModalCourse(null);
  };

  const lessons = selectedCourse
    ? Array.from({ length: selectedCourse.lessons }, (_, i) => ({
        id: i + 1,
        title: `${selectedCourse.topics[i % selectedCourse.topics.length]} - الجزء ${Math.floor(i / selectedCourse.topics.length) + 1}`,
        duration: `${25 + (i * 7) % 20} دقيقة`,
        locked: !subscribedCourses.find((c) => c.id === selectedCourse.id) && i > 1,
      }))
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", fontFamily: "'Cairo', 'Segoe UI', sans-serif", color: "#e2e8f0", direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 3px; }
        .nav-btn { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 8px 16px; border-radius: 8px; font-family: inherit; font-size: 15px; transition: all 0.2s; }
        .nav-btn:hover, .nav-btn.active { color: #10b981; background: rgba(16,185,129,0.1); }
        .course-card { background: #111827; border: 1px solid #1f2937; border-radius: 20px; padding: 28px; transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; }
        .course-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--card-color), transparent); }
        .course-card:hover { transform: translateY(-4px); border-color: #374151; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .btn-primary { background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px 28px; border-radius: 12px; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { transform: scale(1.03); box-shadow: 0 8px 25px rgba(16,185,129,0.4); }
        .btn-secondary { background: transparent; color: #10b981; border: 2px solid #10b981; padding: 10px 24px; border-radius: 12px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(16,185,129,0.1); }
        .lesson-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; transition: background 0.2s; cursor: pointer; border: 1px solid transparent; }
        .lesson-row:hover { background: #1f2937; border-color: #374151; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-box { background: #111827; border: 1px solid #1f2937; border-radius: 24px; padding: 40px; max-width: 420px; width: 100%; }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); padding: 14px 28px; border-radius: 14px; font-weight: 700; font-size: 15px; z-index: 9999; animation: fadeUp 0.3s ease; white-space: nowrap; }
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .hero-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%); pointer-events: none; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
        @media (max-width: 768px) {
          .course-detail-grid { display: block !important; }
          .course-detail-sidebar { margin-top: 24px; position: static !important; }
          .nav-label { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background: "rgba(10,15,26,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1f2937", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚗️</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#f1f5f9", lineHeight: 1.1 }}>مستر حازم</div>
              <div style={{ fontSize: 11, color: "#10b981" }}>منصة الكيمياء</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["home", "الرئيسية"], ["courses", "الدورات"], ["my-courses", `دوراتي${subscribedCourses.length > 0 ? ` (${subscribedCourses.length})` : ""}`]].map(([key, label]) => (
              <button key={key} className={`nav-btn ${activeTab === key ? "active" : ""}`} onClick={() => { setActiveTab(key); setSelectedCourse(null); }}>{label}</button>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* HOME */}
        {activeTab === "home" && (
          <div>
            <div style={{ position: "relative", padding: "80px 0 60px", overflow: "hidden", textAlign: "center" }}>
              <div className="hero-glow" style={{ top: -200, left: "50%", transform: "translateX(-50%)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-block", background: "rgba(16,185,129,0.12)", color: "#10b981", padding: "6px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                  🎓 منصة تعليمية متخصصة في الكيمياء
                </div>
                <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20, color: "#f1f5f9" }}>
                  تعلم الكيمياء مع<br />
                  <span style={{ background: "linear-gradient(135deg,#10b981,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>مستر حازم</span>
                </h1>
                <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8 }}>
                  حصص مسجلة بجودة عالية، شرح واضح ومبسط، متاح 24/7 — اشترك وابدأ رحلتك في الكيمياء
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setActiveTab("courses")}>استعرض الدورات</button>
                  <button className="btn-secondary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setActiveTab("courses")}>حصة مجانية</button>
                </div>
              </div>
            </div>

            <div className="grid-4" style={{ marginBottom: 60 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", marginBottom: 6 }}>{s.value}</div>
                  <div style={{ color: "#64748b", fontSize: 14 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: "#f1f5f9" }}>الدورات المتاحة</h2>
            <div className="grid-3" style={{ marginBottom: 60 }}>
              {courses.map((c) => (
                <div key={c.id} className="course-card" style={{ "--card-color": c.color }} onClick={() => { setSelectedCourse(c); setActiveTab("courses"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <span style={{ fontSize: 36 }}>{c.icon}</span>
                    <span style={{ background: c.badgeColor + "22", color: c.badgeColor, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.badge}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>{c.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>{c.subtitle}</p>
                  <div style={{ display: "flex", gap: 16, color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
                    <span>📹 {c.lessons} حصة</span>
                    <span>⏱️ {c.hours} ساعة</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.price} ج.م</span>
                    <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={(e) => { e.stopPropagation(); handleSubscribe(c); }}>
                      {subscribedCourses.find((sc) => sc.id === c.id) ? "✓ مشترك" : "اشترك الآن"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: "#f1f5f9" }}>آراء الطلاب</h2>
            <div className="grid-3" style={{ marginBottom: 60 }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 16, padding: 24 }}>
                  <div style={{ display: "flex", marginBottom: 10 }}>{[...Array(t.stars)].map((_, s) => <span key={s} style={{ color: "#f59e0b" }}>★</span>)}</div>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{t.grade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES LIST */}
        {activeTab === "courses" && !selectedCourse && (
          <div style={{ paddingTop: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: "#f1f5f9" }}>جميع الدورات</h2>
            <p style={{ color: "#64748b", marginBottom: 32 }}>اختار الدورة المناسبة ليك وابدأ التعلم فوراً</p>
            <div className="grid-3">
              {courses.map((c) => (
                <div key={c.id} className="course-card" style={{ "--card-color": c.color }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <span style={{ fontSize: 42 }}>{c.icon}</span>
                    <span style={{ background: c.badgeColor + "22", color: c.badgeColor, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.badge}</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>{c.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>{c.subtitle}</p>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>المواضيع:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {c.topics.map((t) => (
                        <span key={t} style={{ background: "#1f2937", color: "#94a3b8", padding: "4px 10px", borderRadius: 8, fontSize: 12 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 20, color: "#94a3b8", fontSize: 13, marginBottom: 24, borderTop: "1px solid #1f2937", paddingTop: 20 }}>
                    <span>📹 {c.lessons} حصة</span>
                    <span>⏱️ {c.hours} ساعة</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.price}<span style={{ fontSize: 14, fontWeight: 500 }}> ج.م</span></span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => setSelectedCourse(c)}>الحصص</button>
                      <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => handleSubscribe(c)}>
                        {subscribedCourses.find((sc) => sc.id === c.id) ? "✓ مشترك" : "اشترك"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSE DETAIL */}
        {activeTab === "courses" && selectedCourse && (
          <div style={{ paddingTop: 40 }}>
            <button onClick={() => setSelectedCourse(null)} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", fontSize: 15, fontFamily: "inherit", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
              ← العودة للدورات
            </button>
            <div className="course-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                  <span style={{ fontSize: 44 }}>{selectedCourse.icon}</span>
                  <div>
                    <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9" }}>{selectedCourse.title}</h2>
                    <p style={{ color: "#64748b" }}>{selectedCourse.subtitle}</p>
                  </div>
                </div>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>📋 قائمة الحصص</h3>
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-row" onClick={() => !lesson.locked && setPlayingLesson(lesson)}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: lesson.locked ? "#1f2937" : "rgba(16,185,129,0.15)", border: `2px solid ${lesson.locked ? "#374151" : "#10b981"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                        {lesson.locked ? "🔒" : playingLesson?.id === lesson.id ? "▶️" : "▷"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: lesson.locked ? "#475569" : "#e2e8f0" }}>حصة {lesson.id}: {lesson.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{lesson.duration}</div>
                      </div>
                      {lesson.id <= 2 && <span style={{ fontSize: 11, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 10 }}>مجاني</span>}
                    </div>
                  ))}
                </div>

                {playingLesson && (
                  <div style={{ background: "#111827", border: "1px solid #10b981", borderRadius: 16, padding: 28, marginTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <h3 style={{ color: "#f1f5f9", fontWeight: 700 }}>▶ {playingLesson.title}</h3>
                      <button onClick={() => setPlayingLesson(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20 }}>✕</button>
                    </div>
                    <div style={{ background: "#0a0f1a", borderRadius: 12, height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, border: "1px solid #1f2937" }}>
                      <div style={{ fontSize: 56 }}>{selectedCourse.icon}</div>
                      <div style={{ color: "#94a3b8", fontSize: 14 }}>⏯️ جاري تشغيل الحصة...</div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>{playingLesson.duration}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="course-detail-sidebar" style={{ position: "sticky", top: 80 }}>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 20, padding: 28 }}>
                  <div style={{ fontSize: 34, fontWeight: 900, color: selectedCourse.color, marginBottom: 4 }}>{selectedCourse.price} ج.م</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>اشتراك مدى الحياة</div>
                  <button className="btn-primary" style={{ width: "100%", fontSize: 16, padding: 14, marginBottom: 12 }} onClick={() => handleSubscribe(selectedCourse)}>
                    {subscribedCourses.find((c) => c.id === selectedCourse.id) ? "✓ أنت مشترك بالفعل" : "اشترك الآن"}
                  </button>
                  <div style={{ fontSize: 13, color: "#64748b", display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                    {["📹 " + selectedCourse.lessons + " حصة مسجلة", "⏱️ " + selectedCourse.hours + " ساعة محتوى", "♾️ وصول مدى الحياة", "📱 متاح على كل الأجهزة", "🎓 شهادة إتمام"].map(f => <div key={f}>{f}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY COURSES */}
        {activeTab === "my-courses" && (
          <div style={{ paddingTop: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: "#f1f5f9" }}>دوراتي</h2>
            {subscribedCourses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎓</div>
                <p style={{ color: "#64748b", fontSize: 18, marginBottom: 28 }}>لسه ما اشتركتش في أي دورة</p>
                <button className="btn-primary" onClick={() => setActiveTab("courses")}>استعرض الدورات</button>
              </div>
            ) : (
              <div>
                <p style={{ color: "#64748b", marginBottom: 32 }}>مشترك في {subscribedCourses.length} دورة</p>
                <div className="grid-3">
                  {subscribedCourses.map((c) => (
                    <div key={c.id} className="course-card" style={{ "--card-color": c.color }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                        <span style={{ fontSize: 36 }}>{c.icon}</span>
                        <div>
                          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9" }}>{c.title}</h3>
                          <p style={{ color: "#64748b", fontSize: 13 }}>{c.subtitle}</p>
                        </div>
                      </div>
                      <div style={{ background: "#0a0f1a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#94a3b8" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span>التقدم</span>
                          <span style={{ color: c.color }}>0/{c.lessons} حصة</span>
                        </div>
                        <div style={{ background: "#1f2937", borderRadius: 4, height: 6 }}>
                          <div style={{ background: c.color, borderRadius: 4, height: 6, width: "0%" }} />
                        </div>
                      </div>
                      <button className="btn-primary" style={{ width: "100%", fontSize: 14 }} onClick={() => { setSelectedCourse(c); setActiveTab("courses"); }}>
                        ▶ ابدأ التعلم
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1f2937", marginTop: 80, padding: "32px 24px", textAlign: "center", color: "#475569", fontSize: 14 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚗️</div>
            <span style={{ fontWeight: 800, color: "#94a3b8" }}>منصة مستر حازم للكيمياء</span>
          </div>
          <p>© 2025 جميع الحقوق محفوظة</p>
        </div>
      </footer>

      {showModal && modalCourse && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{modalCourse.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>تأكيد الاشتراك</h3>
              <p style={{ color: "#64748b" }}>{modalCourse.title}</p>
            </div>
            <div style={{ background: "#0a0f1a", borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 14, marginBottom: 12 }}>
                <span>قيمة الاشتراك</span>
                <span style={{ color: modalCourse.color, fontWeight: 700 }}>{modalCourse.price} ج.م</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 14 }}>
                <span>عدد الحصص</span>
                <span>{modalCourse.lessons} حصة</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={confirmSubscribe}>تأكيد ✓</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" style={{ background: toast.color, color: "white" }}>{toast.msg}</div>}
    </div>
  );
}
