import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// --- SVG Icons ---
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyBxp92xbwWkjJcG6vX-G3lHS0mGQL_K5lI",
  authDomain: "attendance-tracker-b9190.firebaseapp.com",
  projectId: "attendance-tracker-b9190",
  storageBucket: "attendance-tracker-b9190.firebasestorage.app",
  messagingSenderId: "897410578052",
  appId: "1:897410578052:web:aa166dae7740423448b4d1",
};

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- Helper function to check for custom Saturday holidays ---
const isCustomSaturdayHoliday = (date, saturdayHolidays) => {
    if (date.getDay() !== 6 || !saturdayHolidays || saturdayHolidays.length === 0) return false;
    const weekOfMonth = Math.ceil(date.getDate() / 7);
    return saturdayHolidays.includes(weekOfMonth);
};

// --- Built-in list of Indian Public Holidays for 2024/2025 ---
const indianPublicHolidays = {
    2024: [ { date: "2024-01-26", name: "Republic Day" }, { date: "2024-03-25", name: "Holi" }, { date: "2024-03-29", name: "Good Friday" }, { date: "2024-04-11", name: "Eid-ul-Fitar" }, { date: "2024-08-15", name: "Independence Day" }, { date: "2024-10-02", name: "Gandhi Jayanti" }, { date: "2024-10-31", name: "Diwali" }, { date: "2024-12-25", name: "Christmas" } ],
    2025: [ { date: "2025-01-26", name: "Republic Day" }, { date: "2025-03-14", name: "Holi" }, { date: "2025-04-18", name: "Good Friday" }, { date: "2025-03-31", name: "Eid-ul-Fitar" }, { date: "2025-08-15", name: "Independence Day" }, { date: "2025-10-02", name: "Gandhi Jayanti" }, { date: "2025-10-20", name: "Diwali" }, { date: "2025-12-25", name: "Christmas" } ]
};

// --- Main App Component ---
function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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
        setPage('dashboard');
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsub = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            const initialData = {
              timetable: [],
              semesterStartDate: '',
              semesterEndDate: '',
              holidays: [],
              saturdayHolidays: [2, 4],
              conductedClasses: 0,
              attendedClasses: 0,
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        });
        setLoading(false);
        return () => unsub();
      } else {
        setPage('home');
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, provider).catch((error) => console.error("Authentication Error: ", error));
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Sign Out Error: ", error));
  };

  const renderPage = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen w-full text-white">Loading...</div>;
    }
    switch (page) {
      case 'dashboard':
        return <Dashboard user={user} userData={userData} />;
      case 'settings':
        return <Settings user={user} userData={userData} />;
      default:
        return <HomePage handleLogin={handleLogin} />;
    }
  };

  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-500`}>
      {user && <Sidebar user={user} setPage={setPage} currentPage={page} handleLogout={handleLogout} toggleTheme={toggleTheme} theme={theme} />}
      <main className="flex-1 transition-all duration-300">
        {renderPage()}
      </main>
    </div>
  );
}

// --- Sidebar Component ---
function Sidebar({ user, setPage, currentPage, handleLogout, toggleTheme, theme }) {
  const NavItem = ({ icon, text, pageName }) => (
    <button
      onClick={() => setPage(pageName)}
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
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col transition-colors duration-500 p-4">
      <div className="py-6 px-4">
        <img src="/logo.png" alt="Attxenz Logo" className="w-32 h-auto mx-auto" />
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem icon={<HomeIcon />} text="Dashboard" pageName="dashboard" />
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
                <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
                <span className="ml-3 font-semibold text-gray-700 dark:text-gray-200 truncate">{user.displayName}</span>
            </div>
        </div>
      </div>
    </aside>
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

  const calculateAttendance = useCallback((targetDate, skipDayCount, skipClassCount) => {
    if (!userData || !userData.semesterStartDate || !userData.semesterEndDate || !userData.timetable.length) {
      return { currentPercent: 0, futurePercent: 0, totalClasses: 0, attendedClasses: 0, conductedClasses: 0 };
    }

    const { semesterStartDate, semesterEndDate, timetable, holidays, saturdayHolidays, conductedClasses, attendedClasses } = userData;
    const startDate = new Date(semesterStartDate);
    const endDate = new Date(semesterEndDate);
    const todayDate = new Date();
    const target = new Date(targetDate);
    
    const year = startDate.getFullYear();
    const publicHolidays = indianPublicHolidays[year] || [];
    const allHolidays = [...(holidays || []), ...publicHolidays.map(h => h.date)];
    
    let totalSemesterClasses = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        const dateString = d.toISOString().split('T')[0];
        const isHoliday = allHolidays.includes(dateString) || dayOfWeek === 0 || isCustomSaturdayHoliday(new Date(d), saturdayHolidays);
        if (!isHoliday) {
            totalSemesterClasses += timetable.filter(c => c.day === dayOfWeek.toString()).length;
        }
    }
    
    const numConducted = Number(conductedClasses) || 0;
    const numAttended = Number(attendedClasses) || 0;
    const currentPercent = numConducted > 0 ? (numAttended / numConducted) * 100 : 0;
    
    let futureClassesInPeriod = 0;
    let classesSkippedFromDays = 0;
    let workingDaysCounted = 0;

    for (let d = new Date(todayDate); d <= target; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        const dateString = d.toISOString().split('T')[0];
        const isHoliday = allHolidays.includes(dateString) || dayOfWeek === 0 || isCustomSaturdayHoliday(new Date(d), saturdayHolidays);
        
        if (!isHoliday) {
            const classesOnThisDay = timetable.filter(c => c.day === dayOfWeek.toString()).length;
            futureClassesInPeriod += classesOnThisDay;
            if (workingDaysCounted < (Number(skipDayCount) || 0)) {
                classesSkippedFromDays += classesOnThisDay;
                workingDaysCounted++;
            }
        }
    }

    const totalClassesToSkip = classesSkippedFromDays + (Number(skipClassCount) || 0);
    const futureAttended = futureClassesInPeriod - totalClassesToSkip;
    const overallAttended = numAttended + futureAttended;
    const overallConducted = numConducted + futureClassesInPeriod;
    const futurePercent = overallConducted > 0 ? (overallAttended / overallConducted) * 100 : 0;

    return { 
        currentPercent: currentPercent.toFixed(2), 
        futurePercent: futurePercent.toFixed(2),
        totalClasses: totalSemesterClasses, 
        attendedClasses: numAttended,
        conductedClasses: numConducted,
    };
  }, [userData]);
  
  const { currentPercent, futurePercent, totalClasses, attendedClasses, conductedClasses } = calculateAttendance(predictionDate, daysToSkip, classesToSkip);

  if (!userData) return <div className="p-8 text-gray-800 dark:text-gray-200">Loading user data...</div>;

  return (
    <div className="p-4 md:p-8 text-gray-800 dark:text-gray-200 h-full overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {user.displayName}!</h1>
      <p className="text-md text-gray-500 dark:text-gray-400 mb-8">Here's your attendance overview.</p>

      {(!userData.semesterStartDate || !userData.timetable.length) && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-md mb-8" role="alert">
          <p className="font-bold">Get Started</p>
          <p>Please go to Settings to add your timetable and semester dates.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Current Attendance" value={`${currentPercent}%`} description={`Attended ${attendedClasses} of ${conductedClasses} classes`} color="blue" />
        <StatCard title="Total Semester Classes" value={totalClasses} description="Estimated for the whole semester" color="green" />
        <StatCard title="Attended Classes (So Far)" value={attendedClasses} description="Based on your input in settings" color="purple" />
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Advanced Attendance Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Calculate on date:</label>
                  <input type="date" value={predictionDate} onChange={e => setPredictionDate(e.target.value)} className="input-style mt-1" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Working days I'll skip:</label>
                  <input type="number" value={daysToSkip} onChange={e => setDaysToSkip(e.target.value)} className="input-style mt-1" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Extra classes I'll skip:</label>
                  <input type="number" value={classesToSkip} onChange={e => setClassesToSkip(e.target.value)} className="input-style mt-1" />
              </div>
              <div className="text-center md:text-left bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-lg font-semibold">Predicted Attendance:</p>
                  <p className="font-bold text-3xl text-orange-500">{futurePercent}%</p>
              </div>
          </div>
      </div>
      
      <WeekAtAGlance userData={userData} />
    </div>
  );
}

function StatCard({ title, value, description, color }) {
    const colors = {
        blue: 'from-blue-400 to-blue-600',
        green: 'from-green-400 to-green-600',
        purple: 'from-purple-400 to-purple-600',
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300`}>
            <p className="text-sm font-medium uppercase opacity-80">{title}</p>
            <p className="text-4xl font-bold">{value}</p>
            <p className="text-sm opacity-80 mt-2">{description}</p>
        </div>
    );
}

function WeekAtAGlance({ userData }) {
    const { timetable = [], saturdayHolidays = [] } = userData;
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }

    const year = today.getFullYear();
    const publicHolidays = (indianPublicHolidays[year] || []).map(h => h.date);
    const allHolidays = [...(userData.holidays || []), ...publicHolidays];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Week at a Glance</h2>
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
                                        <div key={c.id} className="bg-white dark:bg-gray-800 p-1.5 rounded text-xs text-center">
                                            <p className="font-semibold truncate">{c.name}</p>
                                            <p className="text-gray-500">{c.time}</p>
                                        </div>
                                    )) : <p className="text-center text-xs text-gray-400 mt-4">No Classes</p>}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

// --- Settings Component (UPDATED) ---
function Settings({ user, userData }) {
  const [timetable, setTimetable] = useState([]);
  const [semesterStartDate, setSemesterStartDate] = useState('');
  const [semesterEndDate, setSemesterEndDate] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [saturdayHolidays, setSaturdayHolidays] = useState([]);
  const [conductedClasses, setConductedClasses] = useState(0);
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTime, setNewClassTime] = useState('');
  const [newClassDay, setNewClassDay] = useState('1');
  const [newHoliday, setNewHoliday] = useState('');
  const [pasteData, setPasteData] = useState(''); // State for pasted text

  useEffect(() => {
    if (userData) {
      setTimetable(userData.timetable || []);
      setSemesterStartDate(userData.semesterStartDate || '');
      setSemesterEndDate(userData.semesterEndDate || '');
      setHolidays(userData.holidays || []);
      setSaturdayHolidays(userData.saturdayHolidays || [2, 4]);
      setConductedClasses(userData.conductedClasses || 0);
      setAttendedClasses(userData.attendedClasses || 0);
    }
  }, [userData]);

  const handleSaturdayChange = (week) => {
    setSaturdayHolidays(prev => 
        prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const handleSave = async () => {
    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, {
        timetable,
        semesterStartDate,
        semesterEndDate,
        holidays,
        saturdayHolidays,
        conductedClasses: Number(conductedClasses),
        attendedClasses: Number(attendedClasses),
      }, { merge: true });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings: ", error);
      alert('Failed to save settings.');
    }
  };
  
  const handleAddClass = () => {
      if (!newClassName || !newClassTime) {
          alert("Please enter class name and time.");
          return;
      }
      const newClass = { id: Date.now().toString(), name: newClassName, time: newClassTime, day: newClassDay };
      setTimetable([...timetable, newClass]);
      setNewClassName('');
      setNewClassTime('');
  };

  const handleRemoveClass = (id) => {
      setTimetable(timetable.filter(c => c.id !== id));
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

  const handleRemoveHoliday = (date) => {
      setHolidays(holidays.filter(h => h !== date));
  };
  
  // NEW: Function to handle pasted text
  const handleTimetablePaste = () => {
    if (!pasteData) {
        alert("Please paste your timetable text into the box first.");
        return;
    }
    try {
        const json = JSON.parse(pasteData);
        if (Array.isArray(json) && json.every(item => 'name' in item && 'time' in item && 'day' in item)) {
            const formattedJson = json.map(item => ({...item, id: Date.now().toString() + Math.random() }));
            setTimetable(formattedJson);
            setPasteData(''); // Clear the box
            alert("Timetable imported successfully! Don't forget to save.");
        } else {
            throw new Error("Invalid JSON format.");
        }
    } catch (error) {
        alert("Could not read the text. Please ensure you have copied the correct timetable JSON/text format.");
    }
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="p-4 md:p-8 text-gray-800 dark:text-gray-200 h-full overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Settings</h1>

      <div className="space-y-8 max-w-4xl mx-auto">
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

        <SettingsCard title="Attendance (To Date)">
            <p className="text-sm text-gray-500 mb-4">If your semester has already started, enter the total number of classes conducted and attended so far.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Classes Conducted So Far</label>
                    <input type="number" value={conductedClasses} onChange={e => setConductedClasses(e.target.value)} className="input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Classes You Attended So Far</label>
                    <input type="number" value={attendedClasses} onChange={e => setAttendedClasses(e.target.value)} className="input-style" />
                </div>
            </div>
        </SettingsCard>

        <SettingsCard title="Class Timetable">
            {/* UPDATED: Replaced file upload with a textarea */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paste Timetable Text</label>
                <textarea 
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    rows="5"
                    placeholder='[{"name":"Math","time":"10:00","day":"1"}, ...]'
                    className="input-style font-mono text-xs"
                ></textarea>
                <button onClick={handleTimetablePaste} className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Import from Text
                </button>
            </div>
            
            <div className="space-y-2 mb-6">
                {timetable.map(c => (
                    <div key={c.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                        <div>
                            <span className="font-semibold">{c.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{c.time} on {daysOfWeek[c.day]}</span>
                        </div>
                        <button onClick={() => handleRemoveClass(c.id)} className="text-red-500 hover:text-red-700">Remove</button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-t border-gray-200 dark:border-gray-700 pt-4">
                <input type="text" placeholder="Class Name" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="input-style" />
                <input type="time" placeholder="Time" value={newClassTime} onChange={e => setNewClassTime(e.target.value)} className="input-style" />
                <select value={newClassDay} onChange={e => setNewClassDay(e.target.value)} className="input-style">
                    {daysOfWeek.map((day, i) => <option key={i} value={i}>{day}</option>)}
                </select>
                <button onClick={handleAddClass} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Add Class</button>
            </div>
        </SettingsCard>

        <SettingsCard title="Holidays">
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
            </div>
        </SettingsCard>
        
        <div className="flex justify-end">
            <button onClick={handleSave} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                Save All Settings
            </button>
        </div>

      </div>
    </div>
  );
}

function SettingsCard({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h2>
            {children}
        </div>
    );
}

export default App;
