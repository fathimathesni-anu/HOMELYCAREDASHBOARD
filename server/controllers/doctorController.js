
import { Doctor } from '../models/doctormodel.js';
// Create a doctor
export const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(400).json({ message: 'Error creating doctor', error });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId patients appointments');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching doctors', error });
  }
};
 


// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId patients appointments');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching doctor', error });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    res.status(400).json({ message: 'Error updating doctor', error });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting doctor', error });
  }
};


