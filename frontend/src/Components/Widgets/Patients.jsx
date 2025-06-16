import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Patients = ({ patients, loading, error }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Patients Overview</h2>
      <Link to="/admin/dashboard/patients" className="flex items-center text-blue-500 hover:underline mb-2">
        <UserGroupIcon className="h-5 w-5 mr-2" />
        <span>Add New Patient</span>
      </Link>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading patients...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : patients.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No patients found.</p>
      ) : (
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {patients.slice(0, 5).map((patient) => (
            <li key={patient._id} className="border-b border-gray-200 dark:border-gray-700 pb-1">
              <span className="font-medium">{patient.name}</span> — {patient.age} yrs — {patient.gender}
            </li>
          ))}
          {patients.length > 5 && (
            <li className="mt-2">
              <Link to="/admin/dashboard/patients" className="flex items-center text-blue-500 hover:underline">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                <span>View More Patients</span>
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Patients;

