import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { User } from '@prisma/client';
import {
  UserResponse,
  PaginatedUsersResponse,
} from './types/user-response.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: { email: string; password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prismaService.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findOne(id: string): Promise<UserResponse | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUsersResponse> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          apiKey: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.user.count(),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    data: { email?: string; password?: string },
  ): Promise<UserResponse> {
    let updateData: any = { ...data };

    // Hash password if it's being updated
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string): Promise<UserResponse> {
    return this.prismaService.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
