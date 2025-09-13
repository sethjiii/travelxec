// models/PopUpLead.js
import mongoose from 'mongoose';
import { number } from 'zod';

const PopUpLeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },

  destination : {
    type: String,
    required: true,
  },   

  budget : {
    type: number,
    required: true,
  },

  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PopUpLead || mongoose.model('PopUpLead', PopUpLeadSchema);
