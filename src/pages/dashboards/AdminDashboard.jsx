import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminRoutes from '../../routes/adminRoutes';
import api from '../../api/axios'; // Make sure this path matches where your axios instance is
import useAuth from '../../auth/useAuth';

const AdminDashboard = () => {
    const location = useLocation();
    const isBaseDashboard = location.pathname === '/admin';
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth()
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/admin');
                setStats(res.data);
            } catch (err) {
                setError('Failed to load dashboard stats.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (location.pathname === '/admin') {
            fetchStats();
        }
    }, [location.pathname]);

    const cards = [
        { title: 'Users', count: stats?.usersCount ?? '-', link: '/admin/users', linkText: 'Manage Users' },
        { title: 'Roles', count: stats?.rolesCount ?? '-', link: '/admin/roles', linkText: 'Manage Roles' },
        { title: 'Courses', count: stats?.coursesCount ?? '-', link: '/admin/courses', linkText: 'Manage Courses' },
        { title: 'Students', count: stats?.studentsCount ?? '-', link: '/admin/students', linkText: 'Manage Students' },
        { title: 'Logs', count: stats?.logsCount ?? '-', link: '/admin/logs', linkText: 'View Logs' },
    ];
    const navLinks = [
        { path: '/admin', label: 'Home' },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/roles', label: 'Roles' },
        { path: '/admin/courses', label: 'Courses' },
        { path: '/admin/students', label: 'Students' },
        { path: '/admin/logs', label: 'Logs' },
    ];
    return (
        <div className="min-h-screen text-white flex flex-col md:flex-row bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-blue-900/70 backdrop-blur-md p-6 space-y-6 shadow-2xl">
                <h2 className="text-3xl font-extrabold tracking-wide border-b border-white/20 pb-2 whitespace-nowrap text-ellipsis">
                    Admin Panel
                </h2>
                <nav className="space-y-3 pt-2">
                    {navLinks.map(link => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block px-6 py-3 rounded-xl text-lg transition-all duration-300 ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg font-semibold'
                                    : 'text-gray-200 hover:bg-indigo-500 hover:text-white hover:shadow-lg'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <button
                        type="button"
                        onClick={logout}
                        className="block text-start w-full px-6 py-3 mt-4 rounded-xl text-lg transition-all duration-300 text-gray-200 hover:bg-red-600 hover:text-white hover:shadow-lg"
                    >
                        Logout
                    </button>
                </nav>

            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {isBaseDashboard ? (
                    <>
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold tracking-tight">Welcome, {user.name} 👋</h1>
                            <p className="text-white/80 mt-1 text-lg">Here's a quick overview of your activity.</p>
                        </div>

                        {loading ? (
                            <p className="text-lg animate-pulse">Loading stats...</p>
                        ) : error ? (
                            <p className="text-red-300">{error}</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {cards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
                                    >
                                        <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
                                        <p className="text-5xl font-bold mb-3 text-white drop-shadow">{card.count}</p>
                                        <Link
                                            to={card.link}
                                            className="inline-block text-indigo-300 hover:text-white font-medium transition underline-offset-2 hover:underline"
                                        >
                                            {card.linkText}
                                        </Link>

                                        {/* Optional: Glow Effect */}
                                        <div className="absolute -inset-1 rounded-3xl opacity-30 blur-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 z-[-1]" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <AdminRoutes />
                )}
            </main>
        </div>


    );
};

export default AdminDashboard;
