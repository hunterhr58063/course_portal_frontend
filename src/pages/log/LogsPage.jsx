import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const LogsPage = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/logs');
            setLogs(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch logs');
        }
    };

    return (
        <div className="mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">📝 Action Logs</h2>

            <div className="overflow-x-auto  bg-white/10 shadow-xl rounded-lg border border-gray-300">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-xs uppercase tracking-wide text-white">
                        <tr>
                            <th className="py-3 px-6">User</th>
                            <th className="py-3 px-6">Action</th>
                            <th className="py-3 px-6">Module</th>
                            <th className="py-3 px-6">Details</th>
                            <th className="py-3 px-6">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-white">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-blue-300 transition duration-200">
                                <td className="py-3 px-6 font-medium  whitespace-nowrap">{log.user?.name || 'N/A'}</td>
                                <td className="py-3 px-6 capitalize">{log.action}</td>
                                <td className="py-3 px-6 capitalize">{log.module}</td>
                                <td className="py-3 px-6">{log.details}</td>
                                <td className="py-3 px-6 ">{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {logs.length === 0 && (
                    <div className="p-4 text-center text-gray-500">No logs to display.</div>
                )}
            </div>
        </div>

    );
};

export default LogsPage;
