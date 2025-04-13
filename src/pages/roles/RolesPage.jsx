import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { hasPermission } from '../../helper/Permission';
import useAuth from '../../auth/useAuth';

const AdminRolesPage = () => {
    const { user } = useAuth()
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await api.get('/roles');
            setRoles(res.data);
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Failed to fetch roles");

        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await api.get('/roles/permissions');
            setPermissions(res.data);
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Failed to fetch permissions");
        }
    };

    const handleRoleChange = (e) => {
        const role = roles.find((r) => r.name === e.target.value);
        setSelectedRole(role);
        setSelectedPermissions(role?.permissions?.map((p) => p._id) || []);
    };

    const togglePermission = (permId) => {
        if (selectedPermissions.includes(permId)) {
            setSelectedPermissions(selectedPermissions.filter((id) => id !== permId));
        } else {
            setSelectedPermissions([...selectedPermissions, permId]);
        }
    };

    const updateRolePermissions = async () => {
        if (!selectedRole) return;
        try {
            await api.put(`/roles/${selectedRole.name}`, {
                permissions: selectedPermissions,
            });
            toast.success('Permissions updated!');
            fetchRoles(); // Refresh roles
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update permissions');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-white">Manage Role Permissions</h2>

            <div className="flex flex-col gap-6">
                {/* Select Role */}
                {hasPermission(user.permissions, 'roles', 'view') && (
                    <select
                        className="w-full p-3 bg-white/10 text-white rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onChange={handleRoleChange}
                        defaultValue=""
                    >
                        <option value="" disabled className="text-gray-400">
                            Select Role
                        </option>
                        {roles.map((role) => (
                            <option key={role._id} value={role.name} className="text-black">
                                {role.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Permissions */}
                {selectedRole && (
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Permissions for <strong>{selectedRole.name}</strong>:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {permissions.map((perm) => (
                                <label key={perm._id} className="flex items-center space-x-2 text-white">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(perm._id)}
                                        onChange={() => togglePermission(perm._id)}
                                        className="text-indigo-400 focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm">{perm.action} <span className="font-medium">{perm.module}</span></span>
                                </label>
                            ))}
                        </div>

                        {hasPermission(user.permissions, 'roles', 'update') && (
                            <button
                                onClick={updateRolePermissions}
                                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
};

export default AdminRolesPage;
