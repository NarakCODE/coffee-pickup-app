import { User, type IUser } from '../models/User.js';
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from '../utils/AppError.js';

interface UpdateProfileData {
  fullName?: string;
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
   * Requirements: 3.2
   */
  async updateProfile(userId: string, profileData: UpdateProfileData) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Cannot update inactive account');
    }

    // Update allowed fields
    if (profileData.fullName !== undefined) {
      user.fullName = profileData.fullName;
    }
    if (profileData.phoneNumber !== undefined) {
      user.phoneNumber = profileData.phoneNumber;
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
   * Delete user account (soft delete)
   * Requirements: 3.6
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

    // Soft delete
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
