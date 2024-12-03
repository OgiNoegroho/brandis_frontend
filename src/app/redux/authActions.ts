export const SET_TOKEN = 'SET_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';

export const setToken = (token: string) => ({
  type: SET_TOKEN,
  payload: token,
});

export const removeToken = () => ({
  type: REMOVE_TOKEN,
});
