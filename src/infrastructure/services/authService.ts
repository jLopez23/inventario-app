import {IUser, IRegisterForm} from '../../presentation/interfaces/app';
import {userLogin} from '../../helpers/userLogin';
import {userRegistration} from '../../helpers/userRegistration';
import {hashPassword} from '../../helpers/encryptPassword';

export class AuthService {
  static async register(userData: IRegisterForm): Promise<IUser | string> {
    const existingUser = await userLogin(userData.email);
    if (typeof existingUser !== 'string') {
      return 'El usuario ya existe';
    }

    const hashedPassword = hashPassword(userData.password);
    const createUser = await userRegistration({
      ...userData,
      password: hashedPassword,
    });

    if (typeof createUser === 'string') {
      return createUser;
    }

    return (await userLogin(userData.email)) as IUser;
  }
}
