/**
 * Session token
 */
import { useState } from 'react';

export const useSessionToken = () => {
  const getSessionToken = () => {
    const sessionToken = localStorage.getItem('sessiontoken');
    const userToken = JSON.parse(sessionToken);
    return userToken;
  };

  const removeSessionToken = () => {
    localStorage.removeItem('sessiontoken');
    setTokenState(null);
  };

  const setSessionToken = userToken => {
    localStorage.setItem('sessiontoken', JSON.stringify(userToken));
    setTokenState(userToken);
  };

  const [ sessionToken, setTokenState ] = useState(getSessionToken());

  return { sessionToken, setSessionToken, removeSessionToken };
}