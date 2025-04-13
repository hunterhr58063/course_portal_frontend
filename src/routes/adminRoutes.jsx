// routes/adminRoutes.jsx
import { Route, Routes } from 'react-router-dom';
import UsersPage from '../pages/user/UsersPage';
import CoursesPage from '../pages/course/CoursesPage';
import StudentsPage from '../pages/students/StudentsPage';
import RolesPage from '../pages/roles/RolesPage';
import ManageLogsPage from '../pages/logs/LogsPage';

const AdminRoutes = () => (
    <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/logs" element={<ManageLogsPage />} />
    </Routes>
);

export default AdminRoutes;
