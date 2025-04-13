// routes/adminRoutes.jsx
import { Route, Routes } from 'react-router-dom';
import StudentsPage from '../pages/students/StudentsPage';

const TelecallerRoutes = () => (
    <Routes>
        <Route path="/students" element={<StudentsPage />} />
    </Routes>
);

export default TelecallerRoutes;
