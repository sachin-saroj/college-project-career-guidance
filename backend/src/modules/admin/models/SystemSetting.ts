import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemSetting extends Document {
  key: string;
  value: any;
  description: string;
  updatedBy: mongoose.Types.ObjectId;
}

const systemSettingSchema = new Schema<ISystemSetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const SystemSetting = mongoose.model<ISystemSetting>('SystemSetting', systemSettingSchema);
