import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { hasPermission } from '../../helper/Permission';
import useAuth from '../../auth/useAuth';

const ManageStudentsPage = () => {
    const { user } = useAuth()

    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            toast.error('Failed to fetch students');
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (err) {
            toast.error('Failed to fetch courses');
        }
    };

    const startEditing = (student) => {
        if (editingStudentId === student._id) {
            // Cancel editing
            setEditingStudentId(null);
            setSelectedCourses([]); // Optional: Clear selection
        } else {
            // Start editing
            setEditingStudentId(student._id);
            setSelectedCourses(
                student.enrolledCourses.map(course => ({
                    value: course._id,
                    label: course.title
                }))
            );
        }
    };


    const handleCourseChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions);
    };

    const updateCourses = async () => {
        try {
            const courseIds = selectedCourses.map(course => course.value);  // Extract only the ids
            await api.put(`/students/${editingStudentId}`, { enrolledCourses: courseIds });
            toast.success('Courses updated successfully!');
            setEditingStudentId(null);
            setSelectedCourses([]);
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update courses');
        }
    };

    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        enrolledCourses: []
    });

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateCourseChange = (selectedOptions) => {
        setNewStudent(prev => ({
            ...prev,
            enrolledCourses: selectedOptions.map(opt => opt.value)
        }));
    };

    const createStudent = async () => {
        try {
            const roleRes = await api.get('/roles'); // or hardcode a student roleId if fixed
            const studentRole = roleRes.data.find(r => r.name === 'Student');
            await api.post('/students/create', {
                ...newStudent,
                roleId: studentRole._id
            });

            toast.success('Student created!');
            setNewStudent({ name: '', email: '', password: '', phone: '', address: '', enrolledCourses: [] });
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create student');
        }
    };


    return (
        <div className=" mx-auto space-y-6 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-lg">
            {/* Create New Student */}
            {hasPermission(user.permissions, 'student', 'create') && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 backdrop-blur-md bg-opacity-20">
                    <h3 className="text-2xl font-semibold text-white mb-4">Create New Student</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newStudent.name}
                            onChange={handleCreateChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newStudent.email}
                            onChange={handleCreateChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newStudent.password}
                            onChange={handleCreateChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={newStudent.phone}
                            onChange={handleCreateChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={newStudent.address}
                            onChange={handleCreateChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 sm:col-span-2"
                        />

                    </div>

                    {/* Course Selection */}
                    {hasPermission(user.permissions, 'course', 'view') && (
                        <div className="mt-4">
                            <label className="block mb-2 font-medium text-white">Select Courses</label>
                            <Select
                                isMulti
                                options={courses.map(course => ({
                                    value: course._id,
                                    label: course.title
                                }))}
                                onChange={handleCreateCourseChange}
                                className="text-black"
                            />
                        </div>
                    )}

                    <button
                        onClick={createStudent}
                        className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Create Student
                    </button>
                </div>
            )}

            {/* Manage Students */}
            <h2 className="text-3xl font-semibold text-white">Manage Students</h2>
            {students.map(student => (
                <div key={student._id} className="bg-white/10 backdrop-blur-md p-6 rounded-md shadow-lg mb-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div className="space-y-2">
                            <p className="text-xl font-semibold text-white">{student.userId.name}</p>
                            <p className="text-gray-300 text-sm">{student.userId.email}</p>
                            <p className="text-sm text-gray-300">
                                Enrolled: {student.enrolledCourses.map(c => c.title).join(', ') || 'None'}
                            </p>
                        </div>
                        {hasPermission(user.permissions, 'course', 'assign') && (
                            <button
                                onClick={() => startEditing(student)}
                                className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {editingStudentId === student._id ? 'Cancel' : 'Edit Courses'}
                            </button>
                        )}
                    </div>

                    {/* Edit Courses */}
                    {editingStudentId === student._id && (
                        <div className="mt-4">
                            <label className="block mb-2 font-medium text-white">Select Courses</label>
                            <Select
                                isMulti
                                options={courses.map(course => ({
                                    value: course._id,
                                    label: course.title
                                }))}
                                value={selectedCourses}
                                onChange={handleCourseChange}
                                className="w-full p-3 text-black"
                            />
                            <button
                                onClick={updateCourses}
                                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            >
                                Save Courses
                            </button>

                        </div>
                    )}
                </div>
            ))}
        </div>

    );
};

export default ManageStudentsPage;
