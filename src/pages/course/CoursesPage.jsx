import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import useAuth from '../../auth/useAuth';
import { hasPermission } from '../../helper/Permission';

const ManageCoursesPage = () => {
    const { user } = useAuth()
    const [courses, setCourses] = useState([]);
    const [courseData, setCourseData] = useState({ title: '', description: '', duration: '' });
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to fetch courses");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData((prev) => ({ ...prev, [name]: value }));
    };

    const createOrUpdateCourse = async () => {
        const url = editingCourse ? `/courses/${editingCourse._id}` : '/courses';
        const method = editingCourse ? 'put' : 'post';
        try {
            const res = await api[method](url, courseData);
            toast.success(editingCourse ? 'Course updated!' : 'Course created!');
            fetchCourses();
            setCourseData({ title: '', description: '', duration: '' });
            setEditingCourse(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to process course");
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            await api.delete(`/courses/${courseId}`);
            toast.success('Course deleted!');
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete course");
        }
    };

    const enrollInCourse = async (courseId) => {
        try {
            await api.post('/courses/enroll', { courseId });
            toast.success('Enrolled successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Enrollment failed');
        }
    };


    return (
        <div className="space-y-6  mx-auto bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-lg ">
            <h2 className="text-3xl font-semibold text-white">Manage Courses</h2>

            {/* Create/Edit Course Form */}
            {(hasPermission(user.permissions, 'course', 'create') || hasPermission(user.permissions, 'course', 'update')) && (
                <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md shadow-xl mt-2">
                    <h3 className="text-2xl text-white font-semibold mb-4">
                        {editingCourse ? `Edit Course: ${editingCourse.title}` : 'Create New Course'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="title"
                            value={courseData.title}
                            onChange={handleInputChange}
                            placeholder="Course Title"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                        <input
                            type="text"
                            name="duration"
                            value={courseData.duration}
                            onChange={handleInputChange}
                            placeholder="Duration"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                        <input
                            type="text"
                            name="description"
                            value={courseData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 sm:col-span-2"
                        />
                    </div>
                    <button
                        onClick={createOrUpdateCourse}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {editingCourse ? 'Save Changes' : 'Create Course'}
                    </button>
                </div>
            )}

            {/* Courses List */}
            {hasPermission(user.permissions, 'course', 'view') && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Courses</h3>
                    <div className="space-y-6">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white/10 backdrop-blur-md p-6 rounded-md shadow-xl flex justify-between items-center"
                            >
                                <div>
                                    <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                                    <p className="text-white/80">{course.description}</p>
                                    <p className="text-sm text-white/70">Duration: {course.duration}</p>
                                </div>
                                <div className="space-x-4">
                                    {hasPermission(user.permissions, 'course', 'enroll') && (
                                        <button
                                            onClick={() => enrollInCourse(course._id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                        >
                                            Enroll
                                        </button>
                                    )}

                                    {hasPermission(user.permissions, 'course', 'update') && (
                                        <button
                                            onClick={() => {
                                                setEditingCourse(course);
                                                setCourseData({
                                                    title: course.title,
                                                    description: course.description,
                                                    duration: course.duration,
                                                });
                                            }}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {hasPermission(user.permissions, 'course', 'delete') && (
                                        <button
                                            onClick={() => deleteCourse(course._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    );
};

export default ManageCoursesPage;
