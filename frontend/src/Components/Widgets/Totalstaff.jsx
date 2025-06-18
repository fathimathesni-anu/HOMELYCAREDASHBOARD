import React, { useEffect, useState } from 'react';
import { User2Icon } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const Totalstaff = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get('/staff');
        if (Array.isArray(res.data)) {
          setStaff(res.data.slice(0, 8));
        } else {
          console.error('Unexpected staff response:', res.data);
          setStaff([]);
        }
      } catch (error) {
        console.error('Error fetching staff list:', error);
      }
    };

    fetchStaff();
    const interval = setInterval(fetchStaff, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleAvailability = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axiosInstance.put(`/staff/update/${id}`, { availability: newStatus });
      setStaff((prev) =>
        prev.map((member) =>
          member._id === id ? { ...member, availability: newStatus } : member
        )
      );
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
        Total Staff
      </h2>
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {staff.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No staff available.
          </p>
        ) : (
          staff.map((member) => (
            <li key={member._id} className="flex justify-between items-center">
              <div className="flex items-center">
                <User2Icon className="h-5 w-5 text-purple-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {member.userId?.name || 'Unnamed'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {member.position || member.role || 'No role'}
                  </span>
                </div>
              </div>
              {/* Alternative Toggle switch with animation */}
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={member.availability === 'Active'}
                  onChange={() => toggleAvailability(member._id, member.availability)}
                  className="absolute opacity-0 w-0 h-0 peer"
                />
                <span className="absolute inset-0 bg-gray-400 rounded-full transition-colors duration-300 peer-checked:bg-green-500"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-6"></span>
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Totalstaff;






