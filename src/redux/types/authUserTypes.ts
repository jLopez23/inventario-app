import { User } from 'src/domain/entities/user';
import { AuthStatus } from '../../infrastructure/interfaces/auth.status';
export interface AuthUserState {
  status?: AuthStatus;
  token?: string;
  user?: User;
}
