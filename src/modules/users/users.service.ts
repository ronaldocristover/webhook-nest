import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.create(createUserDto);
      return {
        success: true,
        message: 'User created successfully',
        content: {
          id: user.id,
          email: user.email,
          apiKey: user.apiKey,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          message: 'Email already exists',
        };
      }
      return {
        success: false,
        message: 'Failed to create user',
      };
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const result = await this.usersRepository.findAll(page, limit);
    return {
      success: true,
      content: result,
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    return {
      success: true,
      content: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.update(id, updateUserDto);
      return {
        success: true,
        message: 'User updated successfully',
        content: user,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          message: 'User not found',
        };
      }
      if (error.code === 'P2002') {
        return {
          success: false,
          message: 'Email already exists',
        };
      }
      return {
        success: false,
        message: 'Failed to update user',
      };
    }
  }

  async remove(id: string) {
    try {
      const user = await this.usersRepository.remove(id);
      return {
        success: true,
        message: 'User deleted successfully',
        content: user,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          message: 'User not found',
        };
      }
      return {
        success: false,
        message: 'Failed to delete user',
      };
    }
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
