import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// --- SVG Icons ---
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const CheckSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const PieChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- Helper Functions ---
const isCustomSaturdayHoliday = (date, saturdayHolidays = []) => {
    if (date.getDay() !== 6 || saturdayHolidays.length === 0) return false;
    const weekOfMonth = Math.ceil(date.getDate() / 7);
    return saturdayHolidays.includes(weekOfMonth);
};
const indianPublicHolidays = {
    2024: [ { date: "2024-01-26", name: "Republic Day" }, { date: "2024-03-25", name: "Holi" }, { date: "2024-03-29", name: "Good Friday" }, { date: "2024-04-11", name: "Eid-ul-Fitar" }, { date: "2024-08-15", name: "Independence Day" }, { date: "2024-10-02", name: "Gandhi Jayanti" }, { date: "2024-10-31", name: "Diwali" }, { date: "2024-12-25", name: "Christmas" } ],
    2025: [ { date: "2025-01-26", name: "Republic Day" }, { date: "2025-03-14", name: "Holi" }, { date: "2025-04-18", name: "Good Friday" }, { date: "2025-03-31", name: "Eid-ul-Fitar" }, { date: "2025-08-15", name: "Independence Day" }, { date: "2025-10-02", name: "Gandhi Jayanti" }, { date: "2025-10-20", name: "Diwali" }, { date: "2025-12-25", name: "Christmas" } ]
};
const subjectColors = [
    'bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700',
    'bg-blue-200 dark:bg-blue-800/50 text-blue-800 dark:text-blue-100 border border-blue-300 dark:border-blue-700',
    'bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-100 border border-green-300 dark:border-green-700',
    'bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700',
    'bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-100 border border-purple-300 dark:border-purple-700',
    'bg-pink-200 dark:bg-pink-800/50 text-pink-800 dark:text-pink-100 border border-pink-300 dark:border-pink-700',
    'bg-indigo-200 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-700',
    'bg-teal-200 dark:bg-teal-800/50 text-teal-800 dark:text-teal-100 border border-teal-300 dark:border-teal-700'
];
const getSubjectColor = (subjectName) => {
    if (!subjectName) return 'bg-gray-100 dark:bg-gray-700';
    let hash = 0;
    for (let i = 0; i < subjectName.length; i++) {
        hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return subjectColors[Math.abs(hash % subjectColors.length)];
};

// --- Main App Component ---
function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsub = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            const initialData = {
              timetable: [], semesterStartDate: '', semesterEndDate: '',
              holidays: [], saturdayHolidays: [2, 4],
              attendanceLog: {}, // For subject-wise tracking
              cumulativeConducted: 0, // For cumulative tracking
              cumulativeAttended: 0, // For cumulative tracking
              attendanceGoal: 75,
              periodTimings: [
                  { start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' },
                  { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' },
                  { start: '13:00', end: '14:00' }, { start: '14:00', end: '15:00' },
                  { start: '15:00', end: '16:00' }, { start: '16:00', end: '17:00' }
              ]
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        });
        setLoading(false);
        return () => unsub();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  const handleLogin = () => signInWithPopup(auth, provider).catch(console.error);
  const handleLogout = () => signOut(auth).catch(console.error);
  const renderPage = () => {
    if (!user) {
        return <HomePage handleLogin={handleLogin} />;
    }
    switch (page) {
      case 'dashboard': return <Dashboard user={user} userData={userData} />;
      case 'timetable': return <TimetablePage user={user} userData={userData} />;
      case 'cumulative_log': return <CumulativeLogPage user={user} userData={userData} />;
      case 'subject_log': return <SubjectLogPage user={user} userData={userData} />;
      case 'subject_attendance': return <SubjectAttendancePage user={user} userData={userData} />;
      case 'holidays': return <HolidaysPage user={user} userData={userData} />;
      case 'settings': return <SettingsPage user={user} userData={userData} />;
      default: return <Dashboard user={user} userData={userData} />;
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }
 
  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans`}>
      {user && <Sidebar user={user} setPage={setPage} currentPage={page} handleLogout={handleLogout} toggleTheme={toggleTheme} theme={theme} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
      <main className="flex-1 flex flex-col transition-all duration-300">
        {user && <div className="md:hidden p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-300">
                <MenuIcon />
            </button>
            <img src="/logo.png" alt="Attxenz Logo" className="w-auto h-8" />
        </div>}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            {renderPage()}
        </div>
      </main>
    </div>
  );
}

// --- Sidebar Component ---
function Sidebar({ user, setPage, currentPage, handleLogout, toggleTheme, theme, isSidebarOpen, setIsSidebarOpen }) {
  const NavItem = ({ icon, text, pageName }) => (
    <button
      onClick={() => { setPage(pageName); setIsSidebarOpen(false); }}
      className={`flex items-center w-full px-4 py-3 text-left transition-all duration-300 rounded-lg ${
        currentPage === pageName
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{text}</span>
    </button>
  );
  return (
    <>
        <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 z-30`}>
          <div className="py-6 px-4">
            <img src="/logo.png" alt="Attxenz Logo" className="w-32 h-auto mx-auto" />
          </div>
          <nav className="flex-1 space-y-2">
            <NavItem icon={<HomeIcon />} text="Dashboard" pageName="dashboard" />
            <NavItem icon={<BookIcon />} text="My Timetable" pageName="timetable" />
            <NavItem icon={<CheckSquareIcon />} text="Cumulative Log" pageName="cumulative_log" />
            <NavItem icon={<CheckSquareIcon />} text="Subject Log" pageName="subject_log" />
            <NavItem icon={<PieChartIcon />} text="Subject Attendance" pageName="subject_attendance" />
            <NavItem icon={<CalendarIcon />} text="Holidays" pageName="holidays" />
            <NavItem icon={<SettingsIcon />} text="Settings" pageName="settings" />
          </nav>
          <div className="mt-auto space-y-2">
             <button onClick={toggleTheme} className="flex items-center w-full px-4 py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              <span className="ml-4 font-medium">Toggle Theme</span>
            </button>
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300">
              <LogOutIcon />
              <span className="ml-4 font-medium">Logout</span>
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <div className="flex items-center p-2">
                    <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
                    <span className="ml-3 font-semibold text-gray-700 dark:text-gray-200 truncate">{user.displayName}</span>
                </div>
            </div>
          </div>
        </aside>
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
    </>
  );
}

// --- Home Page (Login) Component ---
function HomePage({ handleLogin }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-black">
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
            <h1 className="text-5xl font-extrabold text-white mb-4 animate-fade-in-down">Welcome to Attxenz</h1>
            <p className="text-lg text-gray-200 mb-8 max-w-md mx-auto animate-fade-in-up">
                Your personal attendance tracker and predictor. Never miss a class goal again!
            </p>
            <button
                onClick={handleLogin}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center animate-bounce-slow"
            >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.9 0 6.9 1.6 9.1 3.7l6.9-6.9C35.9 2.5 30.5 0 24 0 14.9 0 7.3 5.4 4.1 12.9l7.6 5.9C13.3 12.5 18.2 9.5 24 9.5z"></path><path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.4-.5-5H24v9.5h12.5c-.5 3.1-2.1 5.7-4.5 7.5l7.3 5.7c4.3-4 6.9-10 6.9-17.7z"></path><path fill="#FBBC05" d="M11.7 28.9c-.4-1.2-.6-2.5-.6-3.9s.2-2.7.6-3.9l-7.6-5.9C1.6 19.3 0 23.5 0 28s1.6 8.7 4.1 12.7l7.6-5.8z"></path><path fill="#EA4335" d="M24 48c6.5 0 12-2.1 15.9-5.7l-7.3-5.7c-2.1 1.4-4.8 2.3-7.6 2.3-5.8 0-10.7-3.9-12.5-9.2l-7.6 5.9C7.3 42.6 14.9 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                Sign In with Google
            </button>
        </div>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard({ user, userData }) {
  const today = new Date().toISOString().split('T')[0];
  const [predictionDate, setPredictionDate] = useState(today);
  const [daysToSkip, setDaysToSkip] = useState(0);
  const [classesToSkip, setClassesToSkip] = useState(0);
  const { currentPercent, futurePercent, totalClasses, attendedClasses, conductedClasses, attendanceGoal, classesToGoal } = useCallback(() => {
    if (!userData || !userData.semesterStartDate || !userData.semesterEndDate || !userData.timetable) {
      return { currentPercent: 0, futurePercent: 0, totalClasses: 0, attendedClasses: 0, conductedClasses: 0, attendanceGoal: 75, classesToGoal: 0 };
    }
    const { semesterStartDate, semesterEndDate, timetable, holidays, saturdayHolidays, cumulativeConducted, cumulativeAttended, attendanceGoal } = userData;
    const startDate = new Date(semesterStartDate);
    const endDate = new Date(semesterEndDate);
    const todayDate = new Date();
    const target = new Date(predictionDate);
   
    const year = startDate.getFullYear();
    const publicHolidays = indianPublicHolidays[year] || [];
    const allHolidays = [...(holidays || []), ...publicHolidays.map(h => h.date)];
   
    let totalSemesterClasses = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        const dateString = d.toISOString().split('T')[0];
        const isHoliday = allHolidays.includes(dateString) || dayOfWeek === 0 || isCustomSaturdayHoliday(new Date(d), saturdayHolidays);
        if (!isHoliday) {
            totalSemesterClasses += (timetable || []).filter(c => c.day === dayOfWeek.toString()).length;
        }
    }
   
    const numConducted = Number(cumulativeConducted) || 0;
    const numAttended = Number(cumulativeAttended) || 0;
    const currentPercent = numConducted > 0 ? (numAttended / numConducted) * 100 : 0;
   
    let futureClassesInPeriod = 0;
    let classesSkippedFromDays = 0;
    let workingDaysCounted = 0;
    for (let d = new Date(todayDate); d <= target; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        const dateString = d.toISOString().split('T')[0];
        const isHoliday = allHolidays.includes(dateString) || dayOfWeek === 0 || isCustomSaturdayHoliday(new Date(d), saturdayHolidays);
       
        if (!isHoliday) {
            const classesOnThisDay = (timetable || []).filter(c => c.day === dayOfWeek.toString()).length;
            futureClassesInPeriod += classesOnThisDay;
            if (workingDaysCounted < (Number(daysToSkip) || 0)) {
                classesSkippedFromDays += classesOnThisDay;
                workingDaysCounted++;
            }
        }
    }
    const totalClassesToSkip = classesSkippedFromDays + (Number(classesToSkip) || 0);
    const futureAttended = futureClassesInPeriod - totalClassesToSkip;
    const overallAttended = numAttended + futureAttended;
    const overallConducted = numConducted + futureClassesInPeriod;
    const futurePercent = overallConducted > 0 ? (overallAttended / overallConducted) * 100 : 0;
    const goal = attendanceGoal || 75;
    const neededAttended = Math.ceil((goal / 100) * totalSemesterClasses);
    const classesToGoal = Math.max(0, neededAttended - numAttended);
    return {
        currentPercent: currentPercent.toFixed(2),
        futurePercent: futurePercent.toFixed(2),
        totalClasses: totalSemesterClasses,
        attendedClasses: numAttended,
        conductedClasses: numConducted,
        attendanceGoal: goal,
        classesToGoal
    };
  }, [userData, predictionDate, daysToSkip, classesToSkip])();
  if (!userData) return <div className="text-gray-800 dark:text-gray-200">Loading user data...</div>;
 
  const isBelowGoal = parseFloat(currentPercent) < attendanceGoal;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>
     
      {(!userData.semesterStartDate || !userData.timetable || userData.timetable.length === 0) && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-md" role="alert">
          <p className="font-bold">Get Started</p>
          <p>Please go to the other pages in the sidebar to add your semester dates and timetable.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Current Attendance" value={`${currentPercent}%`} description={`Attended ${attendedClasses} of ${conductedClasses}`} color={isBelowGoal ? 'red' : 'blue'} />
        <GoalProgressCard current={currentPercent} goal={attendanceGoal} classesToGoal={classesToGoal} />
        <StatCard title="Total Semester Classes" value={totalClasses} description="Estimated for the whole semester" color="green" />
      </div>
     
      <SettingsCard title="Advanced Attendance Prediction">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Calculate on date:</label>
                  <input type="date" value={predictionDate} onChange={e => setPredictionDate(e.target.value)} className="input-style mt-1" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Working days I'll skip:</label>
                  <input type="number" min="0" value={daysToSkip} onChange={e => setDaysToSkip(e.target.value)} className="input-style mt-1" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Extra classes I'll skip:</label>
                  <input type="number" min="0" value={classesToSkip} onChange={e => setClassesToSkip(e.target.value)} className="input-style mt-1" />
              </div>
              <div className="text-center md:text-left bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-lg font-semibold">Predicted Attendance:</p>
                  <p className={`font-bold text-3xl ${futurePercent >= attendanceGoal ? 'text-green-500' : 'text-red-500'}`}>{futurePercent}%</p>
              </div>
          </div>
      </SettingsCard>
     
      <WeekAtAGlance userData={userData} />
    </div>
  );
}

// --- TimetablePage Component ---
function TimetablePage({ user, userData }) {
    const [timetable, setTimetable] = useState([]);
    const [lunchStartTime, setLunchStartTime] = useState('12:00');
    const [lunchEndTime, setLunchEndTime] = useState('13:00');
    const [pasteData, setPasteData] = useState('');
    useEffect(() => {
        if (userData) {
            setTimetable(userData.timetable || []);
            setLunchStartTime(userData.lunchStartTime || '12:00');
            setLunchEndTime(userData.lunchEndTime || '13:00');
        }
    }, [userData]);
    const handleSave = async (newTimetable) => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { timetable: newTimetable }, { merge: true });
    };
    const handleTimetablePaste = () => {
        if (!pasteData) return alert("Please paste timetable text first.");
        try {
            const json = JSON.parse(pasteData);
            if (Array.isArray(json) && json.every(item => 'name' in item && 'time' in item && 'day' in item)) {
                const newTimetable = json.map(item => ({...item, id: Date.now().toString() + Math.random() }));
                setTimetable(newTimetable);
                handleSave(newTimetable);
                setPasteData('');
                alert("Timetable imported successfully!");
            } else {
                throw new Error("Invalid JSON format.");
            }
        } catch (error) {
            alert("Could not read the text. Please ensure it's in the correct JSON format.");
        }
    };
    const handleCellClick = (day, time) => {
        const existingClass = timetable.find(c => c.day === day && c.time.startsWith(time.slice(0,2)));
        if (existingClass) {
            if (window.confirm(`Delete "${existingClass.name}"?`)) {
                const newTimetable = timetable.filter(c => c.id !== existingClass.id);
                setTimetable(newTimetable);
                handleSave(newTimetable);
            }
        } else {
            const className = prompt(`Enter class name for this time slot:`);
            if (className) {
                const newClass = { id: Date.now().toString(), name: className, time: time, day: day };
                const newTimetable = [...timetable, newClass];
                setTimetable(newTimetable);
                handleSave(newTimetable);
            }
        }
    };
   
    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to delete the entire timetable?")) {
            setTimetable([]);
            handleSave([]);
        }
    };
    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(timetable, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "timetable.json";
        link.click();
    };
    const timeSlots = Array.from({ length: 9 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`); // 9 AM to 5 PM
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">My Timetable</h1>
            <SettingsCard title="Import / Export Timetable">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paste Timetable Text</label>
                <textarea
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    rows="5"
                    placeholder='[{"name":"Math","time":"10:00","day":"1"}, ...]'
                    className="input-style font-mono text-xs"
                ></textarea>
                <div className="flex space-x-2 mt-2">
                    <button onClick={handleTimetablePaste} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Import from Text
                    </button>
                    <button onClick={handleExport} className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                        Export as JSON
                    </button>
                </div>
            </SettingsCard>
            <SettingsCard title="Weekly Schedule">
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 dark:text-gray-300">
                        <div className="p-2">Time</div>
                        {daysOfWeek.map(day => <div key={day} className="p-2">{day}</div>)}
                    </div>
                    <div className="mt-1 space-y-1">
                        {timeSlots.map(time => (
                            <div key={time} className="grid grid-cols-7 gap-1 h-20">
                                <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-bold">{time}</div>
                                {daysOfWeek.map((day, dayIndex) => {
                                    const dayString = (dayIndex + 1).toString();
                                    const classInfo = timetable.find(c => c.day === dayString && c.time.startsWith(time.slice(0, 2)));
                                    const isLunch = time >= lunchStartTime && time < lunchEndTime;
                                   
                                    if (isLunch) {
                                        return <div key={day} className="flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-md text-sm font-medium">LUNCH</div>
                                    }
                                   
                                    return (
                                        <button key={day} onClick={() => handleCellClick(dayString, time)} className={`rounded-md p-1 flex flex-col items-center justify-center text-xs text-center transition-all duration-200 hover:ring-2 ring-blue-500 ${classInfo ? getSubjectColor(classInfo.name) : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                                            {classInfo && <span className="font-bold">{classInfo.name}</span>}
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={handleClearAll} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors text-sm">
                        Clear All
                    </button>
                </div>
            </SettingsCard>
        </div>
    );
}

// --- CumulativeLogPage Component ---
function CumulativeLogPage({ user, userData }) {
    const [conductedClasses, setConductedClasses] = useState(0);
    const [attendedClasses, setAttendedClasses] = useState(0);
    useEffect(() => {
        if(userData) {
            setConductedClasses(userData.cumulativeConducted || 0);
            setAttendedClasses(userData.cumulativeAttended || 0);
        }
    }, [userData]);
    const handleSave = async () => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            cumulativeConducted: Number(conductedClasses),
            cumulativeAttended: Number(attendedClasses)
        }, { merge: true });
        alert("Cumulative log saved!");
    };
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">Cumulative Log</h1>
            <SettingsCard title="Update Cumulative Attendance (To Date)">
                <p className="text-sm text-gray-500 mb-4">Update the total number of classes conducted and attended so far.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Classes Conducted So Far</label>
                        <input type="number" min="0" value={conductedClasses} onChange={e => setConductedClasses(e.target.value)} className="input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Classes You Attended So Far</label>
                        <input type="number" min="0" value={attendedClasses} onChange={e => setAttendedClasses(e.target.value)} className="input-style" />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        Save Log
                    </button>
                </div>
            </SettingsCard>
        </div>
    );
}

// --- SubjectLogPage Component ---
function SubjectLogPage({ user, userData }) {
    const [attendanceLog, setAttendanceLog] = useState({});
    const uniqueSubjects = [...new Set((userData?.timetable || []).map(c => c.name))];
    useEffect(() => {
        if (userData) {
            setAttendanceLog(userData.attendanceLog || {});
        }
    }, [userData]);
    const handleLogChange = (subject, type, value) => {
        setAttendanceLog(prev => ({
            ...prev,
            [subject]: {
                ...prev[subject],
                [type]: Number(value)
            }
        }));
    };
    const handleSave = async () => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { attendanceLog }, { merge: true });
        alert("Attendance log saved!");
    };
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">Subject Log</h1>
            <SettingsCard title="Log Subject-wise Attendance">
                <p className="text-sm text-gray-500 mb-4">Enter the number of classes conducted and attended for each subject so far.</p>
                <div className="space-y-4">
                    {uniqueSubjects.map(subject => (
                        <div key={subject} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <label className="font-semibold text-gray-700 dark:text-gray-300">{subject}</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Attended"
                                value={attendanceLog[subject]?.attended || ''}
                                onChange={e => handleLogChange(subject, 'attended', e.target.value)}
                                className="input-style"
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Conducted"
                                value={attendanceLog[subject]?.conducted || ''}
                                onChange={e => handleLogChange(subject, 'conducted', e.target.value)}
                                className="input-style"
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Goal %"
                                value={attendanceLog[subject]?.goal || ''}
                                onChange={e => handleLogChange(subject, 'goal', e.target.value)}
                                className="input-style"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        Save Log
                    </button>
                </div>
            </SettingsCard>
        </div>
    );
}

// --- SubjectAttendancePage Component ---
function SubjectAttendancePage({ user, userData }) {
    if (!userData || !userData.timetable || userData.timetable.length === 0) {
        return <div>Please set up your timetable first.</div>;
    }
   
    const uniqueSubjects = [...new Set(userData.timetable.map(c => c.name))];
    const attendanceLog = userData.attendanceLog || {};
   
    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">Subject-wise Attendance</h1>
            <SettingsCard title="Current Standing">
                <div className="space-y-4">
                    {uniqueSubjects.map(subject => {
                        const log = attendanceLog[subject] || { attended: 0, conducted: 0, goal: 75 };
                        const percentage = log.conducted > 0 ? ((log.attended / log.conducted) * 100) : 0;
                        const goal = log.goal || userData.attendanceGoal || 75;
                        const color = percentage >= goal ? 'bg-green-500' : 'bg-red-500';
                       
                        const totalClassesForSubject = (userData.timetable || []).filter(c => c.name === subject).length * 16; // Approximation
                        const neededAttended = Math.ceil((goal / 100) * totalClassesForSubject);
                        const classesToGoal = Math.max(0, neededAttended - log.attended);
                        return (
                            <div key={subject}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{subject}</span>
                                    <span className="font-mono text-gray-600 dark:text-gray-400">{percentage.toFixed(2)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {log.conducted > 0
                                        ? `Attend ${classesToGoal} more classes to reach ${goal}%.`
                                        : `No classes logged yet.`
                                    }
                                </p>
                            </div>
                        )
                    })}
                </div>
            </SettingsCard>
        </div>
    );
}

// --- HolidaysPage Component ---
function HolidaysPage({ user, userData }) {
    const [holidays, setHolidays] = useState([]);
    const [saturdayHolidays, setSaturdayHolidays] = useState([]);
    const [newHoliday, setNewHoliday] = useState('');
    const [holidayStartDate, setHolidayStartDate] = useState('');
    const [holidayEndDate, setHolidayEndDate] = useState('');
    useEffect(() => {
        if (userData) {
            setHolidays(userData.holidays || []);
            setSaturdayHolidays(userData.saturdayHolidays || [2, 4]);
        }
    }, [userData]);
    const handleSaturdayChange = (week) => {
        setSaturdayHolidays(prev =>
            prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
        );
    };
   
    const handleAddHoliday = () => {
      if (!newHoliday) return;
      if (holidays.includes(newHoliday)) {
          alert("This holiday is already in the list.");
          return;
      }
      setHolidays([...holidays, newHoliday].sort());
      setNewHoliday('');
    };
    const handleAddHolidayRange = () => {
        if (!holidayStartDate || !holidayEndDate) {
            alert("Please select both a start and end date for the holiday range.");
            return;
        }
        let newHolidays = [...holidays];
        let currentDate = new Date(holidayStartDate);
        const endDate = new Date(holidayEndDate);
        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            if (!newHolidays.includes(dateString)) {
                newHolidays.push(dateString);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setHolidays(newHolidays.sort());
        setHolidayStartDate('');
        setHolidayEndDate('');
    };
    const handleRemoveHoliday = (date) => {
      setHolidays(holidays.filter(h => h !== date));
    };
    const handleSave = async () => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { holidays, saturdayHolidays }, { merge: true });
        alert('Holiday settings saved!');
    };
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">Holidays</h1>
            <SettingsCard title="Holiday Configuration">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Automatic Holidays</h3>
                    <p className="text-sm text-gray-500 mb-2">Sundays and major public holidays are automatically included.</p>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select which Saturdays are holidays:</label>
                        <div className="flex flex-wrap gap-4">
                            {[1, 2, 3, 4].map(week => (
                                <label key={week} className="flex items-center space-x-2">
                                    <input type="checkbox" checked={saturdayHolidays.includes(week)} onChange={() => handleSaturdayChange(week)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span>{week}{week === 1 ? 'st' : week === 2 ? 'nd' : week === 3 ? 'rd' : 'th'} Saturday</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold mb-2">Add Custom Holidays</h3>
                     <div className="space-y-2 mb-6">
                        {holidays.map(h => (
                            <div key={h} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                <span>{h}</span>
                                <button onClick={() => handleRemoveHoliday(h)} className="text-red-500 hover:text-red-700">Remove</button>
                            </div>
                        ))}
                    </div>
                     <div className="flex items-center space-x-4">
                        <input type="date" value={newHoliday} onChange={e => setNewHoliday(e.target.value)} className="input-style flex-grow" />
                        <button onClick={handleAddHoliday} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Add Holiday</button>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                        <input type="date" value={holidayStartDate} onChange={e => setHolidayStartDate(e.target.value)} className="input-style flex-grow" />
                        <span className="text-gray-500">to</span>
                        <input type="date" value={holidayEndDate} onChange={e => setHolidayEndDate(e.target.value)} className="input-style flex-grow" />
                        <button onClick={handleAddHolidayRange} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Add Range</button>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        Save Holiday Settings
                    </button>
                </div>
            </SettingsCard>
        </div>
    );
}

// --- SettingsPage Component ---
function SettingsPage({ user, userData }) {
    const [semesterStartDate, setSemesterStartDate] = useState('');
    const [semesterEndDate, setSemesterEndDate] = useState('');
    const [attendanceGoal, setAttendanceGoal] = useState(75);
    const [lunchStartTime, setLunchStartTime] = useState('12:00');
    const [lunchEndTime, setLunchEndTime] = useState('13:00');
    useEffect(() => {
        if (userData) {
            setSemesterStartDate(userData.semesterStartDate || '');
            setSemesterEndDate(userData.semesterEndDate || '');
            setAttendanceGoal(userData.attendanceGoal || 75);
            setLunchStartTime(userData.lunchStartTime || '12:00');
            setLunchEndTime(userData.lunchEndTime || '13:00');
        }
    }, [userData]);
    const handleSave = async () => {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            semesterStartDate,
            semesterEndDate,
            attendanceGoal: Number(attendanceGoal),
            lunchStartTime,
            lunchEndTime
        }, { merge: true });
        alert('Settings saved!');
    };
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">App Settings</h1>
            <div className="space-y-8">
                <SettingsCard title="Semester Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester Start Date</label>
                            <input type="date" value={semesterStartDate} onChange={e => setSemesterStartDate(e.target.value)} className="input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester End Date</label>
                            <input type="date" value={semesterEndDate} onChange={e => setSemesterEndDate(e.target.value)} className="input-style" />
                        </div>
                    </div>
                </SettingsCard>
                <SettingsCard title="Preferences">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">My Attendance Goal (%)</label>
                        <input type="number" min="0" max="100" value={attendanceGoal} onChange={e => setAttendanceGoal(e.target.value)} className="input-style" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lunch Start Time</label>
                           <input type="time" value={lunchStartTime} onChange={e => setLunchStartTime(e.target.value)} className="input-style" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lunch End Time</label>
                           <input type="time" value={lunchEndTime} onChange={e => setLunchEndTime(e.target.value)} className="input-style" />
                        </div>
                    </div>
                </SettingsCard>
                <div className="flex justify-end">
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        Save All Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Helper component for Settings Cards ---
function SettingsCard({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-800 dark:text-gray-200">{title}</h2>
            {children}
        </div>
    );
}
// --- Helper component for Stat Cards ---
function StatCard({ title, value, description, color }) {
    const colors = {
        blue: 'from-blue-400 to-blue-600',
        green: 'from-green-400 to-green-600',
        purple: 'from-purple-400 to-purple-600',
        red: 'from-red-400 to-red-600',
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300`}>
            <p className="text-sm font-medium uppercase opacity-80">{title}</p>
            <p className="text-4xl font-bold">{value}</p>
            <p className="text-sm opacity-80 mt-2">{description}</p>
        </div>
    );
}

// --- Helper component for Goal Progress Card ---
function GoalProgressCard({ current, goal, classesToGoal }) {
    const progress = Math.min((current / goal) * 100, 100);
    const isSafe = current >= goal;
    const color = isSafe ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-medium uppercase opacity-80 text-gray-600 dark:text-gray-400">Attendance Goal</h3>
            <div className="flex justify-between items-baseline mt-2">
                <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{goal}%</p>
                <p className={`font-semibold ${isSafe ? 'text-green-500' : 'text-red-500'}`}>
                    {isSafe ? 'On Track' : 'Below Goal'}
                </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {isSafe ? 'Congratulations! You have reached your goal.' : `You need to attend ${classesToGoal} more classes to reach your goal.`}
            </p>
        </div>
    );
}

// --- Helper component for Week at a Glance ---
function WeekAtAGlance({ userData }) {
    const { timetable = [], saturdayHolidays = [], holidays = [] } = userData;
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }
    const year = today.getFullYear();
    const publicHolidays = (indianPublicHolidays[year] || []).map(h => h.date);
    const allHolidays = [...holidays, ...publicHolidays];
    return (
        <SettingsCard title="Week at a Glance">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {days.map(day => {
                    const dayOfWeek = day.getDay();
                    const dateString = day.toISOString().split('T')[0];
                    const isHoliday = allHolidays.includes(dateString) || dayOfWeek === 0 || isCustomSaturdayHoliday(day, saturdayHolidays);
                    const classesOnDay = timetable.filter(c => c.day === dayOfWeek.toString());
                    return (
                        <div key={day.toISOString()} className={`p-3 rounded-lg ${isHoliday ? 'bg-gray-100 dark:bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/30'}`}>
                            <p className="font-bold text-center text-gray-800 dark:text-gray-200">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className="text-xs text-center text-gray-500 mb-2">{day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                            {isHoliday ? (
                                <p className="text-center text-sm text-green-600 dark:text-green-400 font-semibold mt-4">Holiday</p>
                            ) : (
                                <div className="space-y-1">
                                    {classesOnDay.length > 0 ? classesOnDay.map(c => (
                                        <div key={c.id} className={`p-1.5 rounded text-xs text-center ${getSubjectColor(c.name)}`}>
                                            <p className="font-semibold truncate">{c.name}</p>
                                            <p className="opacity-80">{c.time}</p>
                                        </div>
                                    )) : <p className="text-center text-xs text-gray-400 mt-4">No Classes</p>}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </SettingsCard>
    );
}
export default App;
