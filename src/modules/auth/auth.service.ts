import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CustomLoggerService } from '../shared/custom-logger/custom-logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private customLogger: CustomLoggerService,
  ) {}

  async register(email: string, password: string) {
    this.logger.log(`🆕 New user registration attempt: ${email}`);

    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        this.logger.warn(`⚠️  Registration failed - user already exists: ${email}`);
        throw new UnauthorizedException('User already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = this.generateToken(user.id, user.email);

      this.customLogger.log(`✅ User registered successfully`, {
        userId: user.id,
        email: user.email,
        registeredAt: user.createdAt,
      });

      this.logger.log(`✅ User registered: ${email} (${user.id})`);

      return {
        user,
        access_token: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.customLogger.error(`❌ Failed to register user`, {
        email,
        error: error.message,
        stack: error.stack,
      });

      this.logger.error(`❌ Registration failed for ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(email: string, password: string) {
    this.logger.log(`🔐 User login attempt: ${email}`);

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.logger.warn(`⚠️  Login failed - user not found: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(`⚠️  Login failed - invalid password: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken(user.id, user.email);

      this.customLogger.log(`✅ User logged in successfully`, {
        userId: user.id,
        email: user.email,
        lastLoginAt: new Date(),
      });

      this.logger.log(`✅ User logged in: ${email} (${user.id})`);

      return {
        user: {
          id: user.id,
          email: user.email,
        },
        access_token: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.customLogger.error(`❌ Failed to login user`, {
        email,
        error: error.message,
        stack: error.stack,
      });

      this.logger.error(`❌ Login failed for ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
