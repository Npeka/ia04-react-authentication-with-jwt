import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  JwtPayload,
  AuthResponse,
  RefreshResponse,
} from './interfaces/auth.interface';

// Mock user database - in real app, use a proper database
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$Ks6Qr2aFSEIEaJO5UQHzXe7oCLz2lKJHdOTqHoLiZEk4YhGjOyP3q', // password: 123456
    name: 'Admin User',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '$2a$10$Ks6Qr2aFSEIEaJO5UQHzXe7oCLz2lKJHdOTqHoLiZEk4YhGjOyP3q', // password: 123456
    name: 'Test User',
  },
];

// Store refresh tokens in memory (in real app, use Redis or database)
const refreshTokens = new Set<string>();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = users.find((u) => u.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<AuthResponse> {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // Short-lived access token
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Long-lived refresh token
    });

    // Store refresh token
    refreshTokens.add(refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    try {
      // Check if refresh token exists in our store
      if (!refreshTokens.has(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Generate new access token
      const newPayload: JwtPayload = {
        email: payload.email,
        sub: payload.sub,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // Remove refresh token from store
    refreshTokens.delete(refreshToken);
  }

  async getProfile(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, ...result } = user;
    return result;
  }
}
