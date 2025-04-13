import { Route, Routes } from 'react-router-dom';
import CoursesPage from '../pages/course/CoursesPage';
import StudentsPage from '../pages/students/StudentsPage';

const ManagerRoutes = () => (
    <Routes>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/students" element={<StudentsPage />} />
    </Routes>
);

export default ManagerRoutes;
