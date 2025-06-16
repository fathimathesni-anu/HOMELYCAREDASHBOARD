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
          setStaff(res.data.slice(0, 8)); // Display first 8 only
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
              <span
                className={`text-sm font-medium ${
                  member.availability === 'Active'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {member.availability || 'Unknown'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Totalstaff;


