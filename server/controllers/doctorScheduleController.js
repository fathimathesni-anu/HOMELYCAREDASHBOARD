import { Doctor } from '../models/doctormodel.js';


// Add a new schedule to a doctor
export const addScheduleToDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const scheduleData = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.schedule.push(scheduleData);
    await doctor.save();

    res.status(201).json({ message: 'Schedule added', schedule: doctor.schedule });
  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({ message: 'Failed to add schedule', error });
  }
};



// Update a specific schedule by index
export const updateDoctorSchedule = async (req, res) => {
  const { doctorId, scheduleIndex } = req.params;
  const updatedSchedule = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.schedule[scheduleIndex])
      return res.status(404).json({ message: 'Schedule not found' });

    doctor.schedule[scheduleIndex] = updatedSchedule;
    await doctor.save();

    res.json({ message: 'Schedule updated', schedule: doctor.schedule[scheduleIndex] });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Failed to update schedule', error });
  }
};

// Delete a specific schedule by index
export const deleteDoctorSchedule = async (req, res) => {
  const { doctorId, scheduleIndex } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.schedule[scheduleIndex])
      return res.status(404).json({ message: 'Schedule not found' });

    doctor.schedule.splice(scheduleIndex, 1);
    await doctor.save();

    res.json({ message: 'Schedule deleted', schedule: doctor.schedule });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Failed to delete schedule', error });
  }
};

