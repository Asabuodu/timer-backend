// import { Request, Response } from "express";
// import ScheduleModel from "../models/Schedule";
// import { JwtPayload } from "jsonwebtoken";



// interface AuthRequest extends Request {
//   user?: JwtPayload;
// }


// // this creates a new schedule
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




// // this gets the user schedule
// export const getUserSchedules = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const schedules = await ScheduleModel.find({ userId }).sort({ createdAt: -1 });

//     res.status(200).json(schedules); // ✅ no need to return this
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch schedules", error });
//   }
// };


//   // this gets a specific schedule by id
// export const getScheduleById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const userId = req.user.id;

//   try {
//     const schedule = await ScheduleModel.findOne({ _id: id, userId });

//     if (!schedule) {
//       return res.status(404).json({ error: "Schedule not found" });
//     }

//     res.json(schedule);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };



import { Request, Response } from "express";
import ScheduleModel from "../models/Schedule";
import { JwtPayload } from "jsonwebtoken";

// Extend Request to include user field from auth middleware
interface AuthRequest extends Request {
  user?: JwtPayload & { id?: string };
}

// ✅ Create a new schedule
export const createSchedule = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const schedule = new ScheduleModel({ ...req.body, userId });
    await schedule.save();

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Failed to create schedule", error });
  }
};

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
