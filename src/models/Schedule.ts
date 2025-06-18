import mongoose from "mongoose";

const TimeSchema = new mongoose.Schema({
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
  seconds: { type: Number, required: true },
});

const CategorySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  duration: { type: TimeSchema, required: true },
});

const ScheduleSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    categories: [CategorySchema],
    duration: { type: TimeSchema, required: true },
  },
  { timestamps: true }
);

const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
export default ScheduleModel;

// export type ScheduleType = {
//   _id: string;
//   userId: string;
//   title: string;
//   categories: {
//     id: number;
//     name: string;
//     duration: {
//       hours: number;
//       minutes: number;
//       seconds: number;
//     };
//   }[];
//   duration: {
//     hours: number;
//     minutes: number;
//     seconds: number;
//   };
//   createdAt?: Date;
//   updatedAt?: Date;
// };