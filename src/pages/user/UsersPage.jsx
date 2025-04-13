import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const initialForm = { name: '', email: '', password: '', roleName: '' };

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [selectedUserId, setSelectedUserId] = useState(null); // Track editing

    const fetchUsers = async () => {
        const res = await api.get('/users');
        setUsers(res.data);
    };

    const createUser = async () => {
        try {
            await api.post('/users', form);
            toast.success("User created successfully!");
            setForm(initialForm);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create user!");
        }
    };

    const updateUser = async () => {
        try {
            await api.put(`/users/${selectedUserId}`, form);
            toast.success("User updated successfully!");
            setForm(initialForm);
            setSelectedUserId(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user!");
        }
    };

    const deleteUser = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            toast.success("User deleted successfully!");
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user!");
        }
    };

    const handleEdit = (user) => {
        setForm({
            name: user.name,
            email: user.email,
            password: '', // Keep empty for security
            roleName: user.role.name
        });
        setSelectedUserId(user._id);
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="p-6 space-y-8 text-white bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 min-h-screen">
            <h2 className="text-3xl font-extrabold border-b border-white/20 pb-2">
                👥 Manage Users
            </h2>

            {/* Form */}
            <div className="grid gap-4 md:grid-cols-2 p-6 rounded-lg bg-white/10 backdrop-blur-md shadow-xl mt-2">
                <input
                    className="p-3 rounded-xl   placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    className="p-3 rounded-xl   placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    className="p-3 rounded-xl   placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <select
                    className="p-3 rounded-xl   placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none"
                    value={form.roleName}
                    onChange={(e) => setForm({ ...form, roleName: e.target.value })}
                >
                    <option value="" disabled className="text-gray-400">
                        Select Role
                    </option>
                    <option value="Admin" className="text-black">
                        Admin
                    </option>
                    <option value="Manager" className="text-black">
                        Manager
                    </option>
                    <option value="Telecaller" className="text-black">
                        Telecaller
                    </option>
                    <option value="Student" className="text-black">
                        Student
                    </option>
                </select>
                <div className="">

                    {selectedUserId ? (
                        <button
                            onClick={updateUser}
                            className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition font-semibold shadow-md"
                        >
                            ✏️ Update
                        </button>
                    ) : (
                        <button
                            onClick={createUser}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold shadow-md"
                        >
                            ➕ Create
                        </button>
                    )}
                </div>
            </div>

            {/* Button */}


            {/* Table */}
            <div className="overflow-x-auto  bg-white/10 shadow-xl rounded-lg border border-gray-300">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-xs uppercase tracking-wide text-white">
                        <tr>
                            <th className="p-4 text-left border-b border-white/20">Name</th>
                            <th className="p-4 text-left border-b border-white/20">Email</th>
                            <th className="p-4 text-left border-b border-white/20">Role</th>
                            <th className="p-4 text-left border-b border-white/20">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-white">
                        {users?.map((u) => (
                            <tr
                                key={u._id}
                                className="hover:bg-blue-300 transition duration-200"
                            >
                                <td className="p-3 ">{u.name}</td>
                                <td className="p-3 ">{u.email}</td>
                                <td className="p-3 ">{u.role?.name}</td>
                                <td className="p-3 space-x-4">
                                    <button
                                        onClick={() => handleEdit(u)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(u._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default UsersPage;
