import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Welcome to Course Portal</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
                Empowering education with role-based access for Admins, Managers, Telecallers, and Students.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition"
                >
                    Login
                </Link>
            </div>

            <section id="features" className="mt-16 w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <div className="bg-white/10 p-6 rounded-lg shadow-md text-white">
                        <h3 className="text-xl font-semibold mb-2">Role-Based Dashboard</h3>
                        <p>Each user role gets a customized dashboard with the tools they need.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg shadow-md text-white">
                        <h3 className="text-xl font-semibold mb-2">Course Management</h3>
                        <p>Create, edit, and manage courses easily from the Admin panel.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg shadow-md text-white">
                        <h3 className="text-xl font-semibold mb-2">Student Enrollment</h3>
                        <p>Students can be enrolled manually or automatically with smooth workflows.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg shadow-md text-white">
                        <h3 className="text-xl font-semibold mb-2">Secure Login</h3>
                        <p>JWT-based authentication and secure routing for peace of mind.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
