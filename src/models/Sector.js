import mongoose from 'mongoose';

const SectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  schedule: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  }
}, { timestamps: true });

export default mongoose.models.Sector || mongoose.model('Sector', SectorSchema);
