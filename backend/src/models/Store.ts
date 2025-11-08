import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  openingHours: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  specialHours?: Array<{
    date: Date;
    open: string;
    close: string;
    reason?: string;
  }>;
  isOpen: boolean;
  isActive: boolean;
  averagePrepTime: number;
  rating?: number;
  totalReviews: number;
  features: {
    parking: boolean;
    wifi: boolean;
    outdoorSeating: boolean;
    driveThrough: boolean;
  };
  managerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isOpenNow(): boolean;
  getPickupTimes(date?: Date): string[];
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Store slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: 'Cambodia',
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    openingHours: {
      type: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String },
      },
      required: [true, 'Opening hours are required'],
    },
    specialHours: [
      {
        date: { type: Date, required: true },
        open: { type: String, required: true },
        close: { type: String, required: true },
        reason: String,
      },
    ],
    isOpen: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averagePrepTime: {
      type: Number,
      default: 15,
      min: [1, 'Average prep time must be at least 1 minute'],
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative'],
    },
    features: {
      type: {
        parking: { type: Boolean, default: false },
        wifi: { type: Boolean, default: false },
        outdoorSeating: { type: Boolean, default: false },
        driveThrough: { type: Boolean, default: false },
      },
      default: {
        parking: false,
        wifi: false,
        outdoorSeating: false,
        driveThrough: false,
      },
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
storeSchema.index({ slug: 1 });
storeSchema.index({ latitude: 1, longitude: 1 });
storeSchema.index({ isActive: 1 });
storeSchema.index({ createdAt: 1 });

// Method to check if store is currently open
storeSchema.methods.isOpenNow = function (): boolean {
  const now = new Date();
  const dayOfWeek = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as keyof typeof this.openingHours;

  // Check special hours first
  if (this.specialHours && this.specialHours.length > 0) {
    const todaySpecial = this.specialHours.find((sh: any) => {
      const specialDate = new Date(sh.date);
      return (
        specialDate.getDate() === now.getDate() &&
        specialDate.getMonth() === now.getMonth() &&
        specialDate.getFullYear() === now.getFullYear()
      );
    });

    if (todaySpecial) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [openHour, openMin] = todaySpecial.open.split(':').map(Number);
      const [closeHour, closeMin] = todaySpecial.close.split(':').map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;

      return currentTime >= openTime && currentTime < closeTime;
    }
  }

  // Check regular hours
  const todayHours = this.openingHours[dayOfWeek];
  if (!todayHours || !todayHours.open || !todayHours.close) {
    return false;
  }

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  return currentTime >= openTime && currentTime < closeTime;
};

// Method to generate available pickup time slots
storeSchema.methods.getPickupTimes = function (date?: Date): string[] {
  const targetDate = date || new Date();
  const dayOfWeek = targetDate
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as keyof typeof this.openingHours;

  let openTime: string;
  let closeTime: string;

  // Check special hours first
  if (this.specialHours && this.specialHours.length > 0) {
    const specialHour = this.specialHours.find((sh: any) => {
      const specialDate = new Date(sh.date);
      return (
        specialDate.getDate() === targetDate.getDate() &&
        specialDate.getMonth() === targetDate.getMonth() &&
        specialDate.getFullYear() === targetDate.getFullYear()
      );
    });

    if (specialHour) {
      openTime = specialHour.open;
      closeTime = specialHour.close;
    } else {
      const todayHours = this.openingHours[dayOfWeek];
      if (!todayHours || !todayHours.open || !todayHours.close) {
        return [];
      }
      openTime = todayHours.open;
      closeTime = todayHours.close;
    }
  } else {
    const todayHours = this.openingHours[dayOfWeek];
    if (!todayHours || !todayHours.open || !todayHours.close) {
      return [];
    }
    openTime = todayHours.open;
    closeTime = todayHours.close;
  }

  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);

  const slots: string[] = [];
  const now = new Date();
  const isToday =
    targetDate.getDate() === now.getDate() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear();

  // Start time: either opening time or 15 minutes from now (whichever is later)
  let startMinutes = openHour * 60 + openMin;
  if (isToday) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + 15; // 15 minutes minimum
    startMinutes = Math.max(startMinutes, nowMinutes);
  }

  const endMinutes = closeHour * 60 + closeMin;

  // Generate 15-minute intervals
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 15) {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    slots.push(
      `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    );
  }

  return slots;
};

// Transform to exclude sensitive data from JSON responses
storeSchema.set('toJSON', {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Store = mongoose.model<IStore>('Store', storeSchema);
