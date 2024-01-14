import axios from 'axios';

const baseUrl = '/api/login';

const login = async (credential) => {
  const login = await axios.post(baseUrl, credential);
  return login.data;
};

export default { login };
