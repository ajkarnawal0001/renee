import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities';

@Injectable()
export class UserService {
  /**
   * @author
   * @param {string} email - user 's email
   * @returns {object} UserEntity
   * @description find user by email
   */
  constructor(
    @InjectRepository(UserEntity)
    private usersEntity: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.usersEntity.findOne({
      where: {
      email,
      },
    });
  }

  async findByPhone(phone: string): Promise<UserEntity | undefined> {
    return this.usersEntity.findOne({
      where: {
      phone,
      },
    });
  }

  /**
   * @author
   * @param {string} id - user id
   * @returns {object} UserEntity
   * @description find user by id
   */
  async findById(id: string): Promise<UserEntity | undefined> {
    return this.usersEntity.findOne({
      where: {
      id,
      },
    });
  }
}
