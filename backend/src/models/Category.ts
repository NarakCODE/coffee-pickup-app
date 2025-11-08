import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  parentCategoryId?: mongoose.Types.ObjectId;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, 'Display order cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v: __version, ...rest } = ret;
        return { id: _id, ...rest };
      },
    },
  }
);

// Index for efficient querying
categorySchema.index({ isActive: 1, displayOrder: 1 });
categorySchema.index({ parentCategoryId: 1, isActive: 1 });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
