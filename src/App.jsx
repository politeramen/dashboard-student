import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LayoutDashboard, GraduationCap, Calendar, User, CheckCircle, Target, BookOpen, Clock, AlertTriangle, ChevronDown, ChevronUp, Bell, MessageSquare, Briefcase, Settings } from 'lucide-react';

// NOTE: Chart.js and Tailwind CSS are assumed to be loaded.

// --- STATIC DATA FOR PARTH (LIGHT THEME) ---
const studentData = {
    name: "Parth",
    branch: "Information Technology",
    college: "Ramdeobaba College",
    email: "parth.it22@rknec.edu",
    rollNo: "43",
    currentSem: 7,
    cgpa: 9.7, // Updated high CGPA
    creditsEarned: 140,
    creditsTotal: 160,
    attendancePercentage: 92.8,
    pendingExams: 2, // Fewer pending exams
    academics: [ // Slightly different trajectory for uniqueness
        { sem: 1, cgpa: 9.2, status: 'Excellent' },
        { sem: 2, cgpa: 9.5, status: 'Excellent' },
        { sem: 3, cgpa: 9.8, status: 'Outstanding' },
        { sem: 4, cgpa: 9.6, status: 'Excellent' },
        { sem: 5, cgpa: 9.9, status: 'Outstanding' },
        { sem: 6, cgpa: 9.7, status: 'Outstanding' },
        { sem: 7, cgpa: 9.7, status: 'Outstanding' },
    ],
    subjects: [ // 7th semester subjects
        { name: "Software Architecture", code: "IT701", faculty: "Prof. Pratibha Kokardekar", attendance: 95, internalMarks: 48, status: 'Excellent' },
        { name: "IoT and Applications", code: "IT702", faculty: "Prof. S. Rathi", attendance: 85, internalMarks: 40, status: 'Good' },
        { name: "DevOps & Cloud Native", code: "IT703", faculty: "Dr. C. Pande", attendance: 90, internalMarks: 45, status: 'Excellent' },
        { name: "Elective: Data Mining", code: "IT704", faculty: "Prof. R. Zade", attendance: 82, internalMarks: 35, status: 'Needs Focus' },
        { name: "Major Project Phase I", code: "IT705", faculty: "Dr. J. Singh", attendance: 98, internalMarks: 50, status: 'Excellent' },
    ],
    events: [
        { type: 'Exam', title: 'AI Final Theory Exam', date: '2025-11-20', time: '10:00 AM', detail: 'Room No. 302, Check seating plan.', color: 'text-red-600 bg-red-50' },
        { type: 'Event', title: 'StartUp Pitch Competition', date: '2025-11-22', time: '5:00 PM', detail: 'Register your team by tomorrow.', color: 'text-blue-600 bg-blue-50' },
        { type: 'Notice', title: 'Scholarship Application Window', date: '2025-11-15', time: '9:00 AM', detail: 'Deadline approaching for Merit-cum-Means.', color: 'text-amber-600 bg-amber-50' },
        { type: 'Exam', title: 'DevOps Practical Viva', date: '2025-11-25', time: '2:00 PM', detail: 'Lab 4. Prepare CI/CD pipeline demos.', color: 'text-red-600 bg-red-50' },
        { type: 'Event', title: 'Industry Guest Lecture', date: '2025-11-28', time: '4:30 PM', detail: 'Speaker from Google on Microservices.', color: 'text-blue-600 bg-blue-50' },
        { type: 'Notice', title: 'Major Project Submission Deadline', date: '2025-12-05', time: '4:00 PM', detail: 'Phase I final report submission to department head.', color: 'text-amber-600 bg-amber-50' },
    ]
};

// --- UTILITY FUNCTIONS ---

// Utility function to get status color based on percentage (Teal/Cyan focus for light theme)
const getStatusColor = (value, goodThreshold = 85, criticalThreshold = 75) => {
    if (value >= 90) return 'text-cyan-600'; // Outstanding
    if (value >= goodThreshold) return 'text-teal-600'; // Good
    if (value >= criticalThreshold) return 'text-amber-600'; // Warning
    return 'text-red-600'; // Critical
};

// --- CHART COMPONENT ---
const AttendanceChart = ({ attendance }) => {
    const chartId = "attendance-chart-parth";

    useEffect(() => {
        let chartInstance = null;

        const initializeChart = () => {
            if (typeof window.Chart === 'undefined') {
                setTimeout(initializeChart, 100);
                return;
            }
            
            const ctx = document.getElementById(chartId);
            if (chartInstance) {
                chartInstance.destroy();
            }
            if (!ctx) return;

            const target = 75;
            const data = {
                labels: ['Your Attendance', 'Target Minimum', 'Max Capacity'],
                datasets: [{
                    label: 'Attendance',
                    data: [attendance, target, 100],
                    backgroundColor: [
                        'rgba(20, 184, 166, 0.9)', // Teal-500
                        'rgba(59, 130, 246, 0.5)',  // Blue-500 (Target)
                        'rgba(200, 200, 200, 0.2)', // Light gray background
                    ],
                    borderColor: [
                        'rgb(20, 184, 166)',
                        'rgb(59, 130, 246)',
                        'rgb(200, 200, 200)',
                    ],
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            };

            const options = {
                indexAxis: 'y', // Horizontal bars for a different look
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Overall Attendance Analysis',
                        color: '#4b5563', // Gray-600 for light theme
                    }
                },
                scales: {
                    y: {
                        grid: { display: false },
                        ticks: { color: '#4b5563' },
                    },
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
                        ticks: { color: '#4b5563' },
                    }
                }
            };

            chartInstance = new window.Chart(ctx, {
                type: 'bar',
                data: data,
                options: options
            });
        };

        initializeChart();

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [attendance]);

    return (
        <div className="h-64 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <canvas id={chartId}></canvas>
        </div>
    );
};

// ----------------------------------------------------
// --- CORE COMPONENTS (PAGES) ---
// ----------------------------------------------------

// Custom Card for Summary Metrics (Unique Design)
const SummaryCard = ({ title, value, icon: Icon, colorClass, link, navigate }) => (
    <div 
        className="p-5 flex flex-col justify-between h-full bg-white rounded-xl shadow-lg border-b-4 border-teal-500 transition duration-300 transform hover:shadow-xl hover:scale-[1.02] cursor-pointer"
        onClick={() => navigate(link)}
    >
        <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500 uppercase">{title}</p>
            <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <p className={`text-3xl font-extrabold ${colorClass} mt-2`}>{value}</p>
        <p className="text-xs text-gray-400 mt-2">Click for details &rarr;</p>
    </div>
);

// Unique Element: Circular Progress Bar (for Dashboard)
const CircularProgress = ({ value, label, size = 120, color = 'cyan' }) => {
    // size is now direct pixel diameter (e.g., 120, 140, etc.)
    const radius = (size / 2) - 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth="10"
                    className="text-gray-200"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`text-${color}-600`}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold text-${color}-600`}>{value}%</span>
                <span className="text-sm text-gray-500 mt-1">{label}</span>
            </div>
        </div>
    );
};

// 1. Dashboard Page
const Dashboard = ({ navigate }) => {
    const { cgpa, attendancePercentage, creditsEarned, creditsTotal, pendingExams, events } = studentData;

    const cardData = [
        { title: "Current CGPA", value: cgpa.toFixed(2), icon: GraduationCap, color: getStatusColor(cgpa * 10, 90, 80), link: 'academics' },
        { title: "Overall Attendance", value: `${attendancePercentage.toFixed(1)}%`, icon: Target, color: getStatusColor(attendancePercentage), link: 'academics' },
        { title: "Credits Earned", value: `${creditsEarned} / ${creditsTotal}`, icon: BookOpen, color: getStatusColor((creditsEarned / creditsTotal) * 100, 90, 70), link: 'academics' },
        { title: "Pending Exams", value: pendingExams, icon: Clock, color: pendingExams > 2 ? 'text-red-600' : 'text-amber-600', link: 'schedule' },
    ];

    const upcomingEvents = events.slice(0, 5);

    return (
        <div className="space-y-8 p-4">
            {/* Header / Greeting */}
            <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-3 border-gray-200">
                Hi, <span className="text-teal-600">{studentData.name}</span>!
                <p className="text-sm font-medium text-gray-500 mt-1">Information Technology | Sem {studentData.currentSem}</p>
            </h1>

            {/* Unique Card Layout: Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardData.map((card, index) => (
                    <SummaryCard key={index} {...card} navigate={navigate} />
                ))}
            </div>

            {/* Main Content: Chart, Circular Progress, and Events Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section 1: Attendance Chart */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><Target className="w-5 h-5 mr-2 text-teal-600" /> Attendance Overview</h2>
                    <AttendanceChart attendance={attendancePercentage} />
                </div>
                
                {/* Section 2: Quick Stats with Circular Progress */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-cyan-600" /> Quick Snapshot</h2>
                    <div className="flex justify-around items-center">
<CircularProgress value={Math.round(cgpa * 10)} label="CGPA Score" color="cyan" size={160} />
<CircularProgress value={Math.round((creditsEarned / creditsTotal) * 100)} label="Credit Completion" color="teal" size={160} />
                    </div>
                    <div className="text-sm text-gray-600 border-t pt-4 mt-4 border-gray-200">
                        <p>You have an **Outstanding** overall academic record. Keep it up!</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Events (New Style) */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><Bell className="w-5 h-5 mr-2 text-red-600" /> Upcoming Deadlines & Notices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingEvents.map((event, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg shadow-md transition duration-200 cursor-pointer border-l-4 border-teal-500 hover:bg-gray-50 ${event.color}`}
                            onClick={() => navigate('schedule')}
                        >
                            <p className="text-xs font-semibold uppercase">{event.type}</p>
                            <p className="font-bold text-gray-800 my-1">{event.title}</p>
                            <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 2. Academics Page
const Academics = () => {
    const [expandedSubject, setExpandedSubject] = useState(null);

    useEffect(() => {
        let chartInstance = null;
        const initializeChart = () => {
            if (typeof window.Chart === 'undefined') {
                setTimeout(initializeChart, 100);
                return;
            }
            const ctx = document.getElementById('cgpa-chart-parth');
            if (chartInstance) { chartInstance.destroy(); }
            if (!ctx) return;

            const labels = studentData.academics.map(a => `Sem ${a.sem}`);
            const dataPoints = studentData.academics.map(a => a.cgpa);

            const data = {
                labels: labels,
                datasets: [{
                    label: 'CGPA',
                    data: dataPoints,
                    borderColor: '#06b6d4', // Cyan-500
                    backgroundColor: 'rgba(6, 190, 212, 0.2)',
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#06b6d4',
                    fill: true,
                }]
            };
            
            chartInstance = new window.Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            min: 8.5,
                            max: 10.0,
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { color: '#4b5563' },
                        },
                        x: {
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { color: '#4b5563' },
                        }
                    }
                }
            });
        };

        initializeChart();

        return () => {
            if (chartInstance) chartInstance.destroy();
        };
    }, []);

    const getSubjectStatus = (status) => {
        switch (status) {
            case 'Excellent': return 'bg-cyan-100 text-cyan-700';
            case 'Outstanding': return 'bg-teal-100 text-teal-700';
            case 'Good': return 'bg-blue-100 text-blue-700';
            case 'Needs Focus': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="space-y-8 p-4">
            <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-3 border-gray-200">
                Academic Progress (Sem {studentData.currentSem})
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* CGPA History Chart (Spans 3 columns) */}
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">CGPA Trend Over Semesters</h2>
                    <div className="h-80">
                        <canvas id="cgpa-chart-parth"></canvas>
                    </div>
                </div>

                {/* Subject Performance Accordion (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-teal-600" /> Current Semester Subjects</h2>
                    <div className="space-y-3">
                        {studentData.subjects.map((subject) => (
                            <div key={subject.code} className="border border-gray-200 rounded-lg">
                                <button
                                    className="flex justify-between items-center w-full p-4 text-left text-gray-800 hover:bg-gray-50 transition duration-200"
                                    onClick={() => setExpandedSubject(expandedSubject === subject.code ? null : subject.code)}
                                >
                                    <span className="font-medium text-lg">{subject.name}</span>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getSubjectStatus(subject.status)} hidden sm:inline`}>{subject.status}</span>
                                        {expandedSubject === subject.code ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                    </div>
                                </button>
                                {expandedSubject === subject.code && (
                                    <div className="p-4 pt-2 bg-gray-50 border-t border-gray-200 space-y-2">
                                        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Faculty:</span> {subject.faculty}</p>
                                        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Attendance:</span> <span className={getStatusColor(subject.attendance)}>{subject.attendance}%</span></p>
                                        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Internal Marks:</span> {subject.internalMarks} / 50</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. Schedule Page (Now focusing on a timeline view)
const Schedule = () => {
    const [activeTab, setActiveTab] = useState('All');

    const filteredEvents = useMemo(() => {
        if (activeTab === 'All') return studentData.events;
        return studentData.events.filter(e => e.type === activeTab.slice(0, -1));
    }, [activeTab]);

    const TimelineItem = ({ event, isLast }) => (
        <div className="flex">
            <div className="flex flex-col items-center mr-4">
                <div className={`w-4 h-4 rounded-full border-2 ${event.type === 'Exam' ? 'bg-red-500 border-red-700' : event.type === 'Event' ? 'bg-blue-500 border-blue-700' : 'bg-amber-500 border-amber-700'} z-10`} />
                {!isLast && <div className="w-px h-full bg-gray-300 -mt-px" />}
            </div>
            <div className={`p-4 mb-8 w-full rounded-lg shadow-md transition duration-200 hover:shadow-xl ${event.color}`}>
                <p className="text-xs font-semibold uppercase text-gray-500">{event.type}</p>
                <h3 className="text-lg font-bold text-gray-800 mt-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{new Date(event.date).toDateString()} at {event.time}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{event.detail}</p>
            </div>
        </div>
    );


    return (
        <div className="space-y-8 p-4">
            <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-3 border-gray-200">
                Academic & Campus Schedule
            </h1>

            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b border-gray-200">
                {['All', 'Exams', 'Events', 'Notices'].map(tab => (
                    <button
                        key={tab}
                        className={`py-2 px-4 text-sm font-medium transition duration-200 rounded-t-lg ${
                            activeTab === tab
                                ? 'border-b-2 border-teal-600 text-teal-600 bg-gray-50'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Timeline View (Unique Element) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Timeline ({activeTab} View)</h2>
                    <div className="relative p-4 bg-white rounded-xl shadow-lg border border-gray-200">
                        {filteredEvents.length === 0 ? (
                            <p className="text-gray-500 p-8 text-center">No {activeTab.toLowerCase()} scheduled right now. Enjoy the break!</p>
                        ) : (
                            filteredEvents.map((event, index) => (
                                <TimelineItem key={index} event={event} isLast={index === filteredEvents.length - 1} />
                            ))
                        )}
                    </div>
                </div>

                {/* Calendar Side Panel */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Calendar</h2>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-bold text-gray-700 mb-2">November 2025</p>
                        {/* Placeholder Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-teal-600 font-semibold">{d}</div>)}
                            {[...Array(6)].map((_, i) => <div key={`offset-${i}`}></div>)}
                            {[...Array(30).keys()].map(day => {
                                const date = day + 1;
                                const isCritical = date === 20 || date === 25;
                                
                                return (
                                    <div 
                                        key={date} 
                                        className={`p-1 rounded-md transition cursor-default ${isCritical ? 'bg-red-100 text-red-700 font-bold' : 'hover:bg-gray-100'}`}
                                    >
                                        {date}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};


// 4. Profile Page
const Profile = () => {
    const profileDetails = [
        { label: "Full Name", value: studentData.name, icon: User },
        { label: "Roll Number", value: studentData.rollNo, icon: BookOpen },
        { label: "Branch", value: studentData.branch, icon: GraduationCap },
        { label: "Email ID", value: studentData.email, icon: MessageSquare },
        { label: "College", value: studentData.college, icon: Briefcase },
        { label: "Current Semester", value: studentData.currentSem, icon: Clock },
    ];

    return (
        <div className="space-y-8 p-4">
            <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-3 border-gray-200">
                Student Profile Information
            </h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Card */}
                <div className="w-full lg:w-1/3 p-8 bg-white rounded-xl shadow-lg flex flex-col items-center border border-gray-200">
                    <div className="w-28 h-28 rounded-full bg-teal-500 flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-xl">
                        P
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{studentData.name}</h2>
                    <p className="text-md text-gray-600">{studentData.branch}</p>
                    <div className="mt-6 w-full text-center">
                        <span className="inline-block px-4 py-1 text-sm font-semibold rounded-full bg-cyan-500/10 text-cyan-700 border border-cyan-300">
                            High Performer (CGPA 9.7)
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileDetails.map((item, index) => (
                        <div key={index} className="p-5 bg-white rounded-xl shadow-md border border-gray-200 transition duration-150 hover:bg-gray-50">
                            <item.icon className="w-5 h-5 text-teal-600 mb-1" />
                            <p className="text-xs font-medium text-gray-500 uppercase">{item.label}</p>
                            <p className="text-lg font-semibold text-gray-800 truncate">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Action Buttons (New unique element) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex justify-end">
                <button className="px-5 py-2 text-sm font-medium bg-teal-600 rounded-lg text-white hover:bg-teal-700 transition duration-200 shadow-md flex items-center">
                    <Settings className="w-4 h-4 mr-2" /> Update Profile Settings
                </button>
            </div>
        </div>
    );
};


// ----------------------------------------------------
// --- MAIN APP COMPONENT ---
// ----------------------------------------------------

const Sidebar = ({ currentPage, navigate, navItems }) => (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white p-4 shadow-xl hidden lg:block border-r border-gray-200">
        <div className="flex items-center space-x-2 mb-8 p-2">
            <GraduationCap className="w-8 h-8 text-teal-600" />
            <h1 className="text-xl font-extrabold text-gray-800">RCOEM Portal</h1>
        </div>
        <ul className="space-y-2">
            {navItems.map(item => (
                <li key={item.path}>
                    <a
                        href={`#${item.path}`}
                        onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                        className={`flex items-center text-sm font-medium p-3 rounded-lg transition duration-200 ${
                            currentPage === item.path || (currentPage === '' && item.path === '/')
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </a>
                </li>
            ))}
        </ul>
    </nav>
);

const MobileHeader = ({ studentName, navigate }) => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm lg:hidden">
        <div className="px-4 py-3 flex justify-between items-center">
            {/* Logo/Title */}
            <h1 className="text-xl font-extrabold text-teal-600">RCOEM</h1>

            {/* Student Profile (Header Right) */}
            <div className="flex items-center space-x-3">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 hidden sm:block">{studentName}</p>
                    <p className="text-xs text-gray-500 hidden sm:block">{studentData.branch}</p>
                </div>
                <a
                    href="#profile"
                    onClick={(e) => { e.preventDefault(); navigate('profile'); }}
                    className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center text-white text-md font-bold cursor-pointer transition duration-200 hover:ring-2 ring-teal-400"
                >
                    P
                </a>
            </div>
        </div>
    </header>
);

const MobileNav = ({ currentPage, navigate, navItems }) => (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-2 shadow-2xl z-20 flex justify-around">
        {navItems.map(item => (
            <a
                key={item.path}
                href={`#${item.path}`}
                onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                className={`flex flex-col items-center text-xs p-1 rounded-lg transition duration-200 ${
                    currentPage === item.path || (currentPage === '' && item.path === '/')
                        ? 'text-teal-600'
                        : 'text-gray-500 hover:text-gray-800'
                }`}
            >
                <item.icon className="w-6 h-6" />
                {item.label}
            </a>
        ))}
    </nav>
);

const App = () => {
    const [currentPage, setCurrentPage] = useState(window.location.hash.substring(1) || '/');

    const navigate = useCallback((path) => {
        window.location.hash = path;
        setCurrentPage(path);
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPage(window.location.hash.substring(1) || '/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderPage = useMemo(() => {
        switch (currentPage) {
            case '/':
            case 'dashboard':
                return <Dashboard navigate={navigate} />;
            case 'academics':
                return <Academics />;
            case 'schedule':
                return <Schedule />;
            case 'profile':
                return <Profile />;
            default:
                return <Dashboard navigate={navigate} />;
        }
    }, [currentPage, navigate]);


    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: 'academics', label: 'Academics', icon: GraduationCap },
        { path: 'schedule', label: 'Schedule', icon: Calendar },
        { path: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <MobileHeader studentName={studentData.name} navigate={navigate} />
            <Sidebar currentPage={currentPage} navigate={navigate} navItems={navItems} />
            
            <main className="lg:ml-64 max-w-7xl mx-auto pb-16 lg:pb-4 pt-4">
                {renderPage}
            </main>
            
            <MobileNav currentPage={currentPage} navigate={navigate} navItems={navItems} />
        </div>
    );
};

export default App;