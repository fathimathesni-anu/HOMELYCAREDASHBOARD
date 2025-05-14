
import { Appointment } from '../models/appoinmentmodel.js'; // Adjust the path if needed
import { Patient } from '../models/patientmodel.js'; // Needed for adding appointment to patient

// Create a new appointment
export const createAppointment = async (req, res, next) => {
  const { patientId, doctorId, appointmentDate, reason, status, notes } = req.body;

  try {
    const appointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
      reason,
      status,
      notes,
    });

    await appointment.save();

    // Optional: Add appointment to the patient's record
    await Patient.findByIdAndUpdate(patientId, {
      $push: { appointments: appointment._id }
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: 'Error creating appointment', error });
  }
};

// Get all appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.doctorId) {
      filter.doctorId = req.query.doctorId;

    } const appointments = await Appointment.find(filter)
      .populate('patientId')
      .populate('doctorId');

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment by ID:', error);
    res.status(500).json({ message: 'Error fetching appointment', error });
  }
};

// Update an appointment
export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Optional: Remove appointment reference from patient
    await Patient.findByIdAndUpdate(appointment.patientId, {
      $pull: { appointments: appointment._id }
    });

    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};
