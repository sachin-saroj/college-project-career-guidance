import { User, IUser } from '../models/User';
import { Profile } from '../../student/models/Profile';
import { AppError } from '../../../utils/AppError';
import { signAccessToken, signRefreshToken } from '../../../utils/jwt';

export class AuthService {
  
  static async registerUser(userData: any): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    // Create User
    const newUser = await User.create({ email, passwordHash: password });

    // Create Profile
    await Profile.create({
      userId: newUser._id,
      personal: {
        firstName,
        lastName,
      }
    });

    // Generate tokens
    const accessToken = signAccessToken({ userId: newUser._id.toString(), role: newUser.role });
    const refreshToken = signRefreshToken({ userId: newUser._id.toString(), role: newUser.role });

    // Save refresh token in DB
    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });

    // Remove passwordHash from return object
    newUser.passwordHash = undefined;

    return { accessToken, refreshToken, user: newUser };
  }

  static async loginUser(userData: any): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const { email, password } = userData;

    // Find user and explicitly select passwordHash
    const user = await User.findOne({ email }).select('+passwordHash');
    
    // Mitigate User Enumeration: return generic error
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    user.passwordHash = undefined;

    return { accessToken, refreshToken, user };
  }

  static async refreshAuthToken(token: string): Promise<{ accessToken: string }> {
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      throw new AppError('Invalid refresh token. Please login again.', 401);
    }

    const newAccessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    return { accessToken: newAccessToken };
  }

  static async logoutUser(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  static async getCurrentUserProfile(userId: string): Promise<any> {
    const user = await User.findById(userId);
    const profile = await Profile.findOne({ userId });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return { user, profile };
  }
}
