import { BloodBank } from '../models/bloodbankmodel.js';

// Create a blood bank entry
export const createBloodBankEntry = async (req, res) => {
  try {
    const bloodBank = new BloodBank(req.body);
    await bloodBank.save();
    res.status(201).json({ message: 'Blood bank entry created successfully', bloodBank });
  } catch (error) {
    res.status(400).json({ message: 'Error creating blood bank entry', error });
  }
};

// Get all blood bank entries
export const getAllBloodBankEntries = async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find();
    res.status(200).json(bloodBanks);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching blood bank entries', error });
  }
};

// Get blood bank entry by ID
export const getBloodBankEntryById = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(bloodBank);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching entry', error });
  }
};

// Update blood bank entry
export const updateBloodBankEntry = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bloodBank) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Blood bank entry updated successfully', bloodBank });
  } catch (error) {
    res.status(400).json({ message: 'Error updating entry', error });
  }
};

// Delete blood bank entry
export const deleteBloodBankEntry = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findByIdAndDelete(req.params.id);
    if (!bloodBank) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Blood bank entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting entry', error });
  }
};

