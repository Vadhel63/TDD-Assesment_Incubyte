import mongoose, { Document, Schema } from "mongoose";

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const SweetSchema = new Schema<ISweet>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const SweetModel = mongoose.model<ISweet>("Sweet", SweetSchema);
export default SweetModel;
