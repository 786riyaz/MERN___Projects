const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/QalbIT")

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength : [3, "The title should be atleast 3 character long."]
    },
    priority: {
      type: String,
      required: true,
      enum : ["low", "medium", "high"]
    },
    status: {
      type: String,
      default: "open",
      enum : ["open", "closed"]
    },
    createdAt: {
      type: Date,
      default: Date.now, // Sets default value to the current date/time
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  },
);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;