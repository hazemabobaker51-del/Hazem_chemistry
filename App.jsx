import { useState, useEffect } from "react";

const SUPABASE_URL = "https://cygqsyljdqvnibfmztbk.supabase.co";
const SUPABASE_KEY = "sb_publishable_ii939t32CnlVGcQkIYrXcg_PP8iWwyy";

const supabase = {
  async getStudents() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/students?select=*&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async getSubscriptions() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?select=*&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async addStudent(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async addSubscription(data) {
    await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }
};

const courses = [
  { id: 1, title: "الكيمياء العضوية", subtitle: "الصف الثالث الثانوي", lessons: 24, hours: 18, price: 299, badge: "الأكثر مبيعاً", badgeColor: "#f59e0b", topics: ["الهيدروكربونات", "المجموعات الوظيفية", "التفاعلات العضوية", "البوليمرات"], icon: "⚗️", color: "#10b981" },
  { id: 2, title: "الكيمياء غير العضوية", subtitle: "الصف الثاني الثانوي", lessons: 20, hours: 15, price: 249, badge: "جديد", badgeColor: "#3b82f6", topics: ["الجدول الدوري", "الروابط الكيميائية", "التفاعلات", "المحاليل"], icon: "🔬", color: "#6366f1" },
  { id: 3, title: "كيمياء أولى ثانوي", subtitle: "أساسيات الكيمياء", lessons: 16, hours: 12, price: 199, badge: "للمبتدئين", badgeColor: "#8b5cf6", topics: ["المادة وخواصها", "الذرة", "الجدول الدوري", "التفاعلات الأساسية"], icon: "⚛️", color: "#ec4899" },
];

const ADMIN_PASSWORD = "hazem2025";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [playingLesson, setPlayingLesson] = useState(null);
  const [toast, setToast] = useState(null);
  const [studentInfo, setStudentInfo] = useState({ name: "", phone: "", email: "" });
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminData, setAdminData] = useState({ students: [], subscriptions: [] });
  const [adminLoading, setAdminLoading] = useState(false);

  const showToast = (msg, color = "#10b981") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubscribe = (course) => {
    if (subscribedCourses.find((c) => c.id === course.id)) { showToast("أنت مشترك بالفعل!", "#f59e0b"); return; }
    setModalCourse(course);
    setShowModal(true);
  };

  const confirmSubscribe = async () => {
    if (!studentInfo.name || !studentInfo.phone) { showToast("ادخل الاسم والموبايل!", "#ef4444"); return; }
    try {
      let student = currentStudent;
      if (!student) {
        const res = await supabase.addStudent(studentInfo);
        student = Array.isArray(res) ? res[0] : res;
        setCurrentStudent(student);
      }
      await supabase.addSubscription({ student_id: student.id, course_id: modalCourse.id, course_name: modalCourse.title, price: modalCourse.price });
      setSubscribedCourses([...subscribedCourses, modalCourse]);
      setShowModal(false);
      showToast(`تم الاشتراك في ${modalCourse.title} بنجاح! 🎉`);
    } catch (e) {
      showToast("حصل خطأ، حاول تاني!", "#ef4444");
    }
  };

  const loadAdminData = async () => {
    setAdminLoading(true);
    const [students, subscriptions] = await Promise.all([supabase.getStudents(), supabase.getSubscriptions()]);
    setAdminData({ students, subscriptions });
    setAdminLoading(false);
  };

  const loginAdmin = () => {
    if (adminPass === ADMIN_PASSWORD) { setIsAdmin(true); loadAdminData(); }
    else showToast("كلمة السر غلط!", "#ef4444");
  };

  const totalRevenue = adminData.subscriptions.reduce((s, x) => s + (x.price || 0), 0);

  const lessons = selectedCourse
    ? Array.from({ length: selectedCourse.lessons }, (_, i) => ({
        id: i + 1,
        title: `${selectedCourse.topics[i % selectedCourse.topics.length]} - الجزء ${Math.floor(i / selectedCourse.topics.length) + 1}`,
        duration: `${25 + (i * 7) % 20} دقيقة`,
        locked: !subscribedCourses.find((c) => c.id === selectedCourse.id) && i > 1,
      }))
    : [];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    ::-webkit-scrollbar{width:6px;} ::-webkit-scrollbar-track{background:#0a0f1a;} ::-webkit-scrollbar-thumb{background:#10b981;border-radius:3px;}
    .nav-btn{background:none;border:none;cursor:pointer;color:#94a3b8;padding:8px 16px;border-radius:8px;font-family:inherit;font-size:15px;transition:all 0.2s;}
    .nav-btn:hover,.nav-btn.active{color:#10b981;background:rgba(16,185,129,0.1);}
    .course-card{background:#111827;border:1px solid #1f2937;border-radius:20px;padding:28px;transition:all 0.3s;cursor:pointer;position:relative;overflow:hidden;}
    .course-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--cc),transparent);}
    .course-card:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,0.4);}
    .btn-primary{background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;padding:12px 28px;border-radius:12px;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s;}
    .btn-primary:hover{transform:scale(1.03);box-shadow:0 8px 25px rgba(16,185,129,0.4);}
    .btn-secondary{background:transparent;color:#10b981;border:2px solid #10b981;padding:10px 24px;border-radius:12px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;}
    .btn-secondary:hover{background:rgba(16,185,129,0.1);}
    .input{background:#0a0f1a;border:1px solid #374151;border-radius:10px;padding:12px 16px;color:#f1f5f9;font-family:inherit;font-size:14px;width:100%;outline:none;transition:border 0.2s;}
    .input:focus{border-color:#10b981;}
    .lesson-row{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:12px;transition:background 0.2s;cursor:pointer;border:1px solid transparent;}
    .lesson-row:hover{background:#1f2937;border-color:#374151;}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;}
    .modal-box{background:#111827;border:1px solid #1f2937;border-radius:24px;padding:36px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;}
    .toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);padding:14px 28px;border-radius:14px;font-weight:700;font-size:15px;z-index:9999;animation:fadeUp 0.3s ease;white-space:nowrap;}
    @keyframes fadeUp{from{opacity:0;transform:translate(-50%,20px);}to{opacity:1;transform:translate(-50%,0);}}
    .grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;}
    .grid-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;}
    .stat-card{background:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px 20px;text-align:center;}
    .admin-table{width:100%;border-collapse:collapse;}
    .admin-table th{background:#1f2937;color:#94a3b8;padding:12px 16px;text-align:right;font-size:13px;}
    .admin-table td{padding:12px 16px;border-bottom:1px solid #1f2937;font-size:14px;color:#e2e8f0;}
    .admin-table tr:hover td{background:#1f2937;}
    @media(max-width:768px){.detail-grid{display:block!important;}.sidebar{margin-top:20px;position:static!important;}}
  `;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", fontFamily: "'Cairo','Segoe UI',sans-serif", color: "#e2e8f0", direction: "rtl" }}>
      <style>{css}</style>

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
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[["home","الرئيسية"],["courses","الدورات"],["my-courses",`دوراتي${subscribedCourses.length>0?` (${subscribedCourses.length})`:""}`],["admin","🔧 لوحة التحكم"]].map(([k,l])=>(
              <button key={k} className={`nav-btn${activeTab===k?" active":""}`} onClick={()=>{setActiveTab(k);setSelectedCourse(null);}}>{l}</button>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* HOME */}
        {activeTab === "home" && (
          <div>
            <div style={{ position: "relative", padding: "80px 0 60px", textAlign: "center", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)", top: -200, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-block", background: "rgba(16,185,129,0.12)", color: "#10b981", padding: "6px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>🎓 منصة تعليمية متخصصة في الكيمياء</div>
                <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20, color: "#f1f5f9" }}>
                  تعلم الكيمياء مع<br />
                  <span style={{ background: "linear-gradient(135deg,#10b981,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>مستر حازم</span>
                </h1>
                <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8 }}>حصص مسجلة بجودة عالية، شرح واضح ومبسط، متاح 24/7</p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setActiveTab("courses")}>استعرض الدورات</button>
                  <button className="btn-secondary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setActiveTab("courses")}>حصة مجانية</button>
                </div>
              </div>
            </div>

            <div className="grid-4" style={{ marginBottom: 60 }}>
              {[["1200+","طالب مشترك"],["60+","حصة مسجلة"],["98%","نسبة النجاح"],["4.9","تقييم المنصة"]].map(([v,l])=>(
                <div key={l} className="stat-card"><div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", marginBottom: 6 }}>{v}</div><div style={{ color: "#64748b", fontSize: 14 }}>{l}</div></div>
              ))}
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: "#f1f5f9" }}>الدورات المتاحة</h2>
            <div className="grid-3" style={{ marginBottom: 60 }}>
              {courses.map(c => (
                <div key={c.id} className="course-card" style={{ "--cc": c.color }} onClick={() => { setSelectedCourse(c); setActiveTab("courses"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 36 }}>{c.icon}</span>
                    <span style={{ background: c.badgeColor + "22", color: c.badgeColor, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.badge}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>{c.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>{c.subtitle}</p>
                  <div style={{ display: "flex", gap: 16, color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
                    <span>📹 {c.lessons} حصة</span><span>⏱️ {c.hours} ساعة</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.price} ج.م</span>
                    <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={e => { e.stopPropagation(); handleSubscribe(c); }}>
                      {subscribedCourses.find(s => s.id === c.id) ? "✓ مشترك" : "اشترك الآن"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES */}
        {activeTab === "courses" && !selectedCourse && (
          <div style={{ paddingTop: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32, color: "#f1f5f9" }}>جميع الدورات</h2>
            <div className="grid-3">
              {courses.map(c => (
                <div key={c.id} className="course-card" style={{ "--cc": c.color }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontSize: 42 }}>{c.icon}</span>
                    <span style={{ background: c.badgeColor + "22", color: c.badgeColor, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.badge}</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>{c.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>{c.subtitle}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    {c.topics.map(t => <span key={t} style={{ background: "#1f2937", color: "#94a3b8", padding: "4px 10px", borderRadius: 8, fontSize: 12 }}>{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 20, color: "#94a3b8", fontSize: 13, marginBottom: 24, borderTop: "1px solid #1f2937", paddingTop: 20 }}>
                    <span>📹 {c.lessons} حصة</span><span>⏱️ {c.hours} ساعة</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.price} <span style={{ fontSize: 14 }}>ج.م</span></span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => setSelectedCourse(c)}>الحصص</button>
                      <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => handleSubscribe(c)}>
                        {subscribedCourses.find(s => s.id === c.id) ? "✓ مشترك" : "اشترك"}
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
            <button onClick={() => setSelectedCourse(null)} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", fontSize: 15, fontFamily: "inherit", marginBottom: 28 }}>← العودة</button>
            <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
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
                  {lessons.map(lesson => (
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
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                      <h3 style={{ color: "#f1f5f9", fontWeight: 700 }}>▶ {playingLesson.title}</h3>
                      <button onClick={() => setPlayingLesson(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20 }}>✕</button>
                    </div>
                    <div style={{ background: "#0a0f1a", borderRadius: 12, height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, border: "1px solid #1f2937" }}>
                      <div style={{ fontSize: 56 }}>{selectedCourse.icon}</div>
                      <div style={{ color: "#94a3b8" }}>⏯️ جاري تشغيل الحصة...</div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>{playingLesson.duration}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="sidebar" style={{ position: "sticky", top: 80 }}>
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 20, padding: 28 }}>
                  <div style={{ fontSize: 34, fontWeight: 900, color: selectedCourse.color, marginBottom: 4 }}>{selectedCourse.price} ج.م</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>اشتراك مدى الحياة</div>
                  <button className="btn-primary" style={{ width: "100%", fontSize: 16, padding: 14 }} onClick={() => handleSubscribe(selectedCourse)}>
                    {subscribedCourses.find(c => c.id === selectedCourse.id) ? "✓ أنت مشترك" : "اشترك الآن"}
                  </button>
                  <div style={{ fontSize: 13, color: "#64748b", display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                    {[`📹 ${selectedCourse.lessons} حصة مسجلة`, `⏱️ ${selectedCourse.hours} ساعة محتوى`, "♾️ وصول مدى الحياة", "📱 متاح على كل الأجهزة", "🎓 شهادة إتمام"].map(f => <div key={f}>{f}</div>)}
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
              <div className="grid-3">
                {subscribedCourses.map(c => (
                  <div key={c.id} className="course-card" style={{ "--cc": c.color }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <span style={{ fontSize: 36 }}>{c.icon}</span>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9" }}>{c.title}</h3>
                        <p style={{ color: "#64748b", fontSize: 13 }}>{c.subtitle}</p>
                      </div>
                    </div>
                    <button className="btn-primary" style={{ width: "100%", fontSize: 14 }} onClick={() => { setSelectedCourse(c); setActiveTab("courses"); }}>▶ ابدأ التعلم</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN */}
        {activeTab === "admin" && (
          <div style={{ paddingTop: 40 }}>
            {!isAdmin ? (
              <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🔧</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>لوحة التحكم</h2>
                <p style={{ color: "#64748b", marginBottom: 32 }}>ادخل كلمة السر للدخول</p>
                <input className="input" type="password" placeholder="كلمة السر" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === "Enter" && loginAdmin()} style={{ marginBottom: 16, textAlign: "center" }} />
                <button className="btn-primary" style={{ width: "100%" }} onClick={loginAdmin}>دخول</button>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <h2 style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9" }}>🔧 لوحة التحكم</h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }} onClick={loadAdminData}>🔄 تحديث</button>
                    <button onClick={() => setIsAdmin(false)} style={{ background: "none", border: "1px solid #374151", color: "#64748b", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>خروج</button>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid-4" style={{ marginBottom: 32 }}>
                  {[
                    ["👥", adminData.students.length, "إجمالي الطلاب", "#10b981"],
                    ["📋", adminData.subscriptions.length, "إجمالي الاشتراكات", "#6366f1"],
                    ["💰", totalRevenue + " ج.م", "إجمالي الإيرادات", "#f59e0b"],
                    ["📹", courses.reduce((s,c)=>s+c.lessons,0), "إجمالي الحصص", "#ec4899"],
                  ].map(([icon, val, label, color]) => (
                    <div key={label} className="stat-card">
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color, marginBottom: 4 }}>{val}</div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* STUDENTS TABLE */}
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f2937" }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>👥 الطلاب المسجلين</h3>
                  </div>
                  {adminLoading ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>جاري التحميل...</div>
                  ) : adminData.students.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>لا يوجد طلاب بعد</div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table className="admin-table">
                        <thead><tr><th>الاسم</th><th>الموبايل</th><th>الإيميل</th><th>تاريخ التسجيل</th></tr></thead>
                        <tbody>
                          {adminData.students.map(s => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 600 }}>{s.name}</td>
                              <td>{s.phone || "—"}</td>
                              <td>{s.email || "—"}</td>
                              <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(s.created_at).toLocaleDateString("ar-EG")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* SUBSCRIPTIONS TABLE */}
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f2937" }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>📋 الاشتراكات</h3>
                  </div>
                  {adminData.subscriptions.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>لا يوجد اشتراكات بعد</div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table className="admin-table">
                        <thead><tr><th>الدورة</th><th>السعر</th><th>التاريخ</th></tr></thead>
                        <tbody>
                          {adminData.subscriptions.map(s => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 600 }}>{s.course_name}</td>
                              <td style={{ color: "#10b981", fontWeight: 700 }}>{s.price} ج.م</td>
                              <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(s.created_at).toLocaleDateString("ar-EG")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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

      {/* SUBSCRIBE MODAL */}
      {showModal && modalCourse && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{modalCourse.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>الاشتراك في الدورة</h3>
              <p style={{ color: "#64748b" }}>{modalCourse.title}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <input className="input" placeholder="الاسم الكامل *" value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} />
              <input className="input" placeholder="رقم الموبايل *" value={studentInfo.phone} onChange={e => setStudentInfo({...studentInfo, phone: e.target.value})} />
              <input className="input" placeholder="الإيميل (اختياري)" value={studentInfo.email} onChange={e => setStudentInfo({...studentInfo, email: e.target.value})} />
            </div>
            <div style={{ background: "#0a0f1a", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 14 }}>
              <span>قيمة الاشتراك</span>
              <span style={{ color: modalCourse.color, fontWeight: 700 }}>{modalCourse.price} ج.م</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={confirmSubscribe}>تأكيد الاشتراك ✓</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" style={{ background: toast.color, color: "white" }}>{toast.msg}</div>}
    </div>
  );
}
