import {authLogin} from '../../../actions/auth/auth';
import {setAuthUser} from '../../../redux/slices/authUserSlice';
import {useDispatch} from 'react-redux';

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const login = async (email: string, password: string) => {
    const resp = await authLogin(email, password);
    if (!resp) {
      dispatch(
        setAuthUser({
          status: 'unauthenticated',
          token: undefined,
          user: undefined,
        }),
      );
      return false;
    }

    dispatch(
      setAuthUser({
        status: 'authenticated',
        token: resp.token,
        user: resp.user,
      }),
    );
    return true;
  };

  return {
    login,
  };
};
