import React, { useEffect, useState } from 'react';
import { DropletIcon } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const BloodBankInventoryWidget = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axiosInstance.get('/bloodbank');
        if (Array.isArray(res.data)) {
          // Optionally sort or filter if needed
          setInventory(res.data.slice(0, 8));
        } else {
          console.error('Unexpected response format:', res.data);
          setInventory([]);
        }
      } catch (error) {
        console.error('Error fetching blood bank inventory:', error);
      }
    };

    fetchInventory();
    const interval = setInterval(fetchInventory, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
        Blood Inventory
      </h2>
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {inventory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No inventory data available.
          </p>
        ) : (
          inventory.map((item) => (
            <li key={item._id} className="flex justify-between items-center">
              <div className="flex items-center">
                <DropletIcon className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {item.bloodGroup}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.availableUnits} units
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BloodBankInventoryWidget;

