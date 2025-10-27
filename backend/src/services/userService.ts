import { User, type IUser } from '../models/User.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';

export class UserService {
  async getAllUsers() {
    return await User.find().select('-password');
  }

  async getUserById(id: string) {
    return await User.findById(id).select('-password');
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async createUser(userData: {
    name: string;
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
      name: user.name,
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
