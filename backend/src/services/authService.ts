import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../utils/AppError.js';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new user
 * @param data - User registration data
 * @returns User object with tokens
 * @throws BadRequestError if email already exists
 */
export const registerUser = async (
  data: RegisterInput
): Promise<AuthResponse> => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email is already registered');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate tokens
  const userId = String(user._id);
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, 'device-info');

  return {
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login user with email and password
 * @param data - Login credentials
 * @returns User object with tokens
 * @throws UnauthorizedError if credentials are invalid
 */
export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const { email, password } = data;

  // Find user with password field (normally excluded)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const userId = String(user._id);
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, 'device-info');

  return {
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Get user profile by ID
 * @param userId - User ID
 * @returns User object
 * @throws NotFoundError if user not found
 */
export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
