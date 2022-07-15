import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from '@utility';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { AuthResponse } from './models';
import { ROLES } from '../../core/constant/index';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @Role(ROLES.ADMIN)
  async login(@Args('input', { type: () => LoginDto }) data: LoginDto) {
    return this.authService.login(data);
  }
}
