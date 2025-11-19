import { User, type IUser } from '../models/User.js';
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from '../utils/AppError.js';

interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
}

interface UpdateSettingsData {
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  language?: 'en' | 'km';
  currency?: 'USD' | 'KHR';
}

/**
 * Validate email format
 * Requirements: 18.5
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (international format)
 * Requirements: 18.5
 */
function validatePhoneNumber(phoneNumber: string): boolean {
  // Accepts formats like: +1234567890, +12 345 678 90, +12-345-678-90
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  // Remove spaces and dashes for validation
  const cleanedPhone = phoneNumber.replace(/[\s-]/g, '');
  return phoneRegex.test(cleanedPhone);
}

export class UserService {
  /**
   * Get user profile by ID
   * Requirements: 3.1
   */
  async getUserProfile(userId: string) {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status === 'deleted') {
      throw new NotFoundError('User account has been deleted');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedError('User account has been suspended');
    }

    return user;
  }

  /**
   * Update user profile information
   * Requirements: 3.2, 18.5
   */
  async updateProfile(userId: string, profileData: UpdateProfileData) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Cannot update inactive account');
    }

    // Validate email format if provided
    if (profileData.email !== undefined) {
      if (!validateEmail(profileData.email)) {
        throw new BadRequestError('Invalid email format');
      }
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: profileData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new BadRequestError('Email is already in use');
      }
      user.email = profileData.email;
    }

    // Validate phone number format if provided
    if (profileData.phoneNumber !== undefined) {
      if (!validatePhoneNumber(profileData.phoneNumber)) {
        throw new BadRequestError(
          'Invalid phone number format. Use international format (e.g., +1234567890)'
        );
      }
      user.phoneNumber = profileData.phoneNumber;
    }

    // Update allowed fields
    if (profileData.fullName !== undefined) {
      user.fullName = profileData.fullName;
    }
    if (profileData.dateOfBirth !== undefined) {
      user.dateOfBirth = profileData.dateOfBirth;
    }
    if (profileData.gender !== undefined) {
      user.gender = profileData.gender;
    }

    await user.save();

    return user;
  }

  /**
   * Update profile image
   * Requirements: 3.2
   */
  async updateProfileImage(userId: string, imageUrl: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Cannot update inactive account');
    }

    user.profileImage = imageUrl;
    await user.save();

    return { profileImage: user.profileImage };
  }

  /**
   * Upload avatar and update profile
   * Requirements: 18.3
   */
  async uploadAvatar(userId: string, filePath: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Cannot update inactive account');
    }

    // In a real application, you would upload to cloud storage (S3, Cloudinary, etc.)
    // For now, we'll store the file path
    user.profileImage = filePath;
    await user.save();

    return { profileImage: user.profileImage };
  }

  /**
   * Update user password
   * Requirements: 3.4
   */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Fetch user with password field
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Cannot update inactive account');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new BadRequestError(
        'New password must be at least 6 characters long'
      );
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  /**
   * Update user preferences/settings
   * Requirements: 3.5
   */
  async updateSettings(userId: string, settingsData: UpdateSettingsData) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Cannot update inactive account');
    }

    // Update preferences
    if (settingsData.notificationsEnabled !== undefined) {
      user.preferences.notificationsEnabled = settingsData.notificationsEnabled;
    }
    if (settingsData.emailNotifications !== undefined) {
      user.preferences.emailNotifications = settingsData.emailNotifications;
    }
    if (settingsData.smsNotifications !== undefined) {
      user.preferences.smsNotifications = settingsData.smsNotifications;
    }
    if (settingsData.pushNotifications !== undefined) {
      user.preferences.pushNotifications = settingsData.pushNotifications;
    }
    if (settingsData.language !== undefined) {
      user.preferences.language = settingsData.language;
    }
    if (settingsData.currency !== undefined) {
      user.preferences.currency = settingsData.currency;
    }

    await user.save();

    return user;
  }

  /**
   * Get user referral statistics
   * Requirements: 3.6
   */
  async getReferralStats(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Count users referred by this user
    const totalReferrals = await User.countDocuments({
      referredBy: user.referralCode,
    });

    // Calculate points earned from referrals (assuming 100 points per referral)
    const pointsEarned = totalReferrals * 100;

    return {
      referralCode: user.referralCode,
      totalReferrals,
      pointsEarned,
    };
  }

  /**
   * Delete user account with anonymization
   * Requirements: 18.4
   */
  async deleteAccount(userId: string, password: string, reason?: string) {
    // Fetch user with password field
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Password is incorrect');
    }

    // Anonymize user data
    const timestamp = Date.now();
    user.fullName = `Deleted User ${timestamp}`;
    user.email = `deleted_${timestamp}@deleted.local`;
    delete user.phoneNumber;
    delete user.profileImage;
    delete user.dateOfBirth;
    delete user.gender;

    // Clear preferences
    user.preferences = {
      notificationsEnabled: false,
      emailNotifications: false,
      smsNotifications: false,
      pushNotifications: false,
      language: 'en',
      currency: 'USD',
    };

    // Mark as deleted
    user.status = 'deleted';
    user.deletedAt = new Date();

    await user.save();

    return { message: 'Account deleted successfully', reason };
  }

  // Legacy methods for backward compatibility
  async getAllUsers() {
    return await User.find({ status: 'active' }).select('-password');
  }

  async getUserById(id: string) {
    return await User.findById(id).select('-password');
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async createUser(userData: {
    fullName: string;
    email: string;
    password: string;
  }) {
    const userExists = await this.getUserByEmail(userData.email);

    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    const user = await User.create(userData);
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    };
  }

  async updateUser(id: string, userData: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

export const userService = new UserService();
