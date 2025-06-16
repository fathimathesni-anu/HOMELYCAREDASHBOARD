import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/outline'; // ✅ Import icon

const StaffListWidget = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get('/staff');
        setStaffList(res.data);
      } catch (err) {
        console.error('Failed to fetch staff:', err);
        setError('Unable to fetch staff list');
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
        Staff Overview
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : staffList.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No staff found.</p>
      ) : (
        <>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {staffList.slice(0, 5).map((staff) => (
              <li
                key={staff._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-1"
              >
                <span className="font-medium">{staff.userId?.name || 'Unknown'}</span> — {staff.position} — {staff.department}
              </li>
            ))}
          </ul>

          {/* ✅ Replace "View full staff list" with Add New Staff button */}
          <div className="mt-4">
            <Link
              to="/admin/dashboard/staff"
              className="flex items-center text-blue-500 hover:underline"
            >
              <BriefcaseIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Add New Staff</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffListWidget;


