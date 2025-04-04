import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {setAuthUser} from '../../redux/slices/authUserSlice';
import {ILoginForm, IRegisterForm} from '../interfaces/app';
import {
  authCheckStatus,
  authLogin,
  authRegister,
} from '../../actions/auth/auth';
import {StorageAdapter} from '../../config/adapters/storage-adapter';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async ({email, password}: ILoginForm) => {
    setError('');
    setLoading(true);

    try {
      const resp = await authLogin(email, password);
      if (!resp) {
        dispatch(
          setAuthUser({
            status: 'unauthenticated',
            token: undefined,
            user: undefined,
          }),
        );
        throw new Error('Usuario o contraseña incorrectos');
      }

      await StorageAdapter.setItem('token', resp.token);

      dispatch(
        setAuthUser({
          status: 'authenticated',
          token: resp.token,
          user: resp.user,
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

  const checkStatus = async () => {
    const resp = await authCheckStatus();
    if (!resp) {
      dispatch(
        setAuthUser({
          status: 'unauthenticated',
          token: undefined,
          user: undefined,
        }),
      );
      return;
    }
    await StorageAdapter.setItem('token', resp.token);
    dispatch(
      setAuthUser({
        status: 'authenticated',
        token: resp.token,
        user: resp.user,
      }),
    );
  };

  const logout = async () => {
    await StorageAdapter.removeItem('token');
    dispatch(
      setAuthUser({
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      }),
    );
    return true;
  };

  const register = async ({email, password, name}: IRegisterForm) => {
    setError('');
    setLoading(true);

    try {
      const resp = await authRegister(email, password, name);
      console.log({resp});
      if (!resp) {
        dispatch(
          setAuthUser({
            status: 'unauthenticated',
            token: undefined,
            user: undefined,
          }),
        );
        throw new Error('Error al intentar crear el nuevo usuario');
      }

      await StorageAdapter.setItem('token', resp.token);

      dispatch(
        setAuthUser({
          status: 'authenticated',
          token: resp.token,
          user: resp.user,
        }),
      );
      return true;
    } catch (err) {
      setError(err as string);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {loading, error, login, checkStatus, logout, register};
};
