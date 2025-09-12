import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  customId:{
    type:Number,
    unique:true,
  
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "assignedToType",
    required: true,
  },

  assignedToType: {
    type: String,
    enum: ["Department", "Market"],
    required: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical",""],
    default: "",
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved", "closed"],
    default: "open",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resolvedAt: {
    type: Date,
  },

  closedAt: {
    type: Date,
  },

  inProgressAt: {
    type: Date,
  },

  comments: [
    {
      comment: String,
      commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  images: {
    type: [String],
    default: [],
  },

  estimatedResolutionTime: {
    type: Date,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

},
{
  // include virtuals in API responses
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


ticketSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastTicket = await this.constructor.findOne({}, {}, { sort: { customId: -1 } });
    this.customId = lastTicket && lastTicket.customId ? lastTicket.customId + 1 : 1;
  }
  this.updatedAt = Date.now();
  next();
});

ticketSchema.virtual("resolvedIn").get(function () {
  const resolvedAt =
    this.resolvedAt instanceof Date
      ? this.resolvedAt
      : this.resolvedAt
      ? new Date(this.resolvedAt)
      : null;
  const inProgressAt =
    this.inProgressAt instanceof Date
      ? this.inProgressAt
      : this.inProgressAt
      ? new Date(this.inProgressAt)
      : null;

  if (!resolvedAt || !inProgressAt) return null;
  const diff = resolvedAt.getTime() - inProgressAt.getTime();
  return diff < 0 ? 0 : diff;
});

ticketSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "name assignedTo",
    populate: {
      path: "assignedTo",
      model: ["Department", "Market"],
    },
  })
    .populate("comments.commentedBy", "name")
    .populate({
      path: "assignedTo",
      model: ["Department", "Market"],
    })
    .sort({ createdAt: -1 });

  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
