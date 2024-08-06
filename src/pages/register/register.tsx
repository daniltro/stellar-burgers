import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { postUser } from '../../services/register-slice';
import { useNavigate } from 'react-router-dom';
import { selectRegisterUser } from '../../services/register-slice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const user = useSelector(selectRegisterUser);

  useEffect(() => {
    if (user) {
      console.log('Registered user data:', user);
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData = {
      name: userName,
      email,
      password
    };
    dispatch(postUser(userData));
    // navigate('/login');
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
