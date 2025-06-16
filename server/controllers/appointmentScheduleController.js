import {AppointmentSchedule} from "../models/appoinmentschedulemodel.js"
import {Doctor} from "../models/doctormodel.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id; // Assuming authentication middleware adds this

    // Check if doctor is available
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if the time is within doctor's working hours
    if (time < doctor.startTime || time > doctor.endTime) {
      return res.status(400).json({ message: "Time not within doctor's working hours" });
    }

    // Check if an appointment already exists at the same time
    const existing = await AppointmentSchedule.findOne({ doctorId, date, time });
    if (existing) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const appointment = new AppointmentSchedule({ doctorId, patientId, date, time });
    await appointment.save();

    res.status(201).json({ message: "Appointment booked", data: appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await AppointmentSchedule.find({ patientId })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name", // Assuming 'name' is in Userole
        },
      });

    // Format response to include doctor name
    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      date: app.date,
      time: app.time,
      status: app.status,
      createdAt: app.createdAt,
      doctor: {
        id: app.doctorId?._id,
        name: app.doctorId?.userId?.name || "Unknown",
        specialization: app.doctorId?.specialization || "Not specified",
      },
    }));

    res.json({ appointments: formattedAppointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await AppointmentSchedule.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate("doctorId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Status updated", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// New: Update full appointment (date, time, doctorId, status, etc.)
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body; // Expect full or partial appointment fields here

    // Optional: Validate the updateData here (e.g. validate date, time, doctorId, status)

    // If doctorId is being updated, check doctor exists
    if (updateData.doctorId) {
      const doctor = await Doctor.findById(updateData.doctorId);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await AppointmentSchedule.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    ).populate("doctorId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// New: Delete appointment by ID
export const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await AppointmentSchedule.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 export const getTodaysAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const todaysAppointments = await AppointmentSchedule.find({
      patientId,
      date: todayISO,
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ time: 1 }); // Sort by time

    res.status(200).json({ appointments: todaysAppointments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get today\'s appointments', error: err.message });
  }
}; 







