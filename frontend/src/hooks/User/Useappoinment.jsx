// src/hooks/User/useAppointment.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch doctor list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/doctors'); // Adjust API route as needed
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setMessage('Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Update selected doctor details
  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctors.find((doc) => doc.id === selectedDoctorId);
      setSelectedDoctor(doctor);
    } else {
      setSelectedDoctor(null);
    }
  }, [selectedDoctorId, doctors]);

  // Book appointment function
  const bookAppointment = async () => {
    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
      setMessage('Please fill all fields.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const payload = {
        doctorId: selectedDoctorId,
        date: appointmentDate,
        time: appointmentTime,
      };

      const response = await axios.post('/api/appointments', payload); // Adjust API route
      setMessage('Appointment booked successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  return {
    doctors,
    selectedDoctorId,
    setSelectedDoctorId,
    selectedDoctor,
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
    bookAppointment,
    message,
    loading,
  };
};

export default useAppointment;

