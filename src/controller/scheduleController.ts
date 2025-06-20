
import { Request, Response } from "express";
import ScheduleModel from "../models/Schedule";
import { JwtPayload } from "jsonwebtoken";

// Extend Request to include user field from auth middleware
interface AuthRequest extends Request {
  user?: JwtPayload & { id?: string };
}


// ✅ Get all schedules for logged-in user
export const getUserSchedules = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const schedules = await ScheduleModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules", error });
  }
};

// ✅ Create a new schedule
// export const createSchedule = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const schedule = new ScheduleModel({ ...req.body, userId });
//     await schedule.save();

//     res.status(201).json(schedule);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create schedule", error });
//   }
// };



export const createSchedule = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id; // or `userId` depending on your token payload

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { title, categories, duration } = req.body;

    if (!title || !categories || !duration) {
      res.status(400).json({ message: "Missing title, categories, or duration" });
      return;
    }

    const schedule = new ScheduleModel({
      userId,
      title,
      categories,
      duration,
    });

    await schedule.save();

    res.status(201).json(schedule);
  } catch (error) {
    console.error("❌ Failed to create schedule:", error);
    res.status(500).json({ message: "Failed to create schedule" });
  }
};



// ✅ Get a specific schedule by ID (owned by the logged-in user)
export const getScheduleById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const schedule = await ScheduleModel.findOne({ _id: id, userId });

    if (!schedule) {
      res.status(404).json({ error: "Schedule not found" });
      return;
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
