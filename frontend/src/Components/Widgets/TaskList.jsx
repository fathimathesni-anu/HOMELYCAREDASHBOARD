import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get('/task', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.tasks)
          ? res.data.tasks
          : [];

        setTasks(data.slice(0, 8)); // Only show 8 tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
        Task List
      </h2>
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No tasks available.
          </p>
        ) : (
          tasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center">
              <div className="flex items-center">
                {task.status === 'completed' || task.status === 'Completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {task.title}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  task.status === 'completed' || task.status === 'Completed'
                    ? 'text-green-500'
                    : 'text-yellow-500'
                }`}
              >
                {task.status}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;


