const API_BASE = 'https://tftm86-212-3-159-241.ru.tuna.am/api/v1/users';

export const ENDPOINTS = {
  USER: (userId) => `${API_BASE}?tg_user_id=${userId}`,
  TICKETS: (userId) => `${API_BASE}/tickets?tg_user_id=${userId}`,
  STATUS: (userId) => `${API_BASE}/status?tg_user_id=${userId}`,
  PRIZES: (userId) => `${API_BASE}/prizes?tg_user_id=${userId}`,
};

export default {ENDPOINTS};
