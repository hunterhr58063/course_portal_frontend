// routes/adminRoutes.jsx
import { Route, Routes } from 'react-router-dom';
import CoursesPage from '../pages/course/CoursesPage';

const StudentRoutes = () => (
    <Routes>
        <Route path="/courses" element={<CoursesPage />} />
    </Routes>
);

export default StudentRoutes;
