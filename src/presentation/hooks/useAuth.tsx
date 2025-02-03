import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {userLogin} from '../../helpers/userLogin';
import {comparePasswords} from '../../helpers/encryptPassword';
import {setAuthUser} from '../../redux/slices/authUserSlice';
import {ILoginForm} from '../interfaces/app';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async ({email, password}: ILoginForm) => {
    setError('');
    setLoading(true);

    try {
      const user = await userLogin(email);
      if (typeof user === 'string') {
        throw new Error(user);
      }

      const matchingPasswords = await comparePasswords(password, user.password);
      if (typeof matchingPasswords === 'string') {
        throw new Error(matchingPasswords);
      }

      dispatch(
        setAuthUser({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      );

      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {loading, error, login};
};
