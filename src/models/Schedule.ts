import mongoose from "mongoose";

const TimeSchema = new mongoose.Schema({
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
  seconds: { type: Number, required: true },
});

// const CategorySchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   name: { type: String, required: true },
//   duration: { type: TimeSchema, required: true },
// });

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true }, // ✅ was Number, must be String
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

// const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
const ScheduleModel = mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);

export default ScheduleModel;
