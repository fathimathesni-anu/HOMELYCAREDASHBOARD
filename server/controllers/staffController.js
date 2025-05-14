import { Staff } from '../models/staffmodel.js'; // Adjust the path if needed

// Create new staff
export const createStaff = async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find().populate('userId').populate('assignedTasks');
    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single staff member by ID
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('userId').populate('assignedTasks');
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff info
export const updateStaff = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedStaff) return res.status(404).json({ message: 'Staff member not found' });
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return res.status(404).json({ message: 'Staff member not found' });
    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

