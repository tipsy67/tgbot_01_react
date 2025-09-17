import { useState, useCallback } from "react";
import { ENDPOINTS } from "../constants/apiEndpoints";


export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState(0);
  const [status, setStatus] = useState(false);
  const [requiredChannels, setRequiredChannels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async (tg_user) => {
    if (!tg_user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userUrl = ENDPOINTS.USER(tg_user.id);
      const ticketsUrl = ENDPOINTS.TICKETS(tg_user.id);
      const statusUrl = ENDPOINTS.STATUS(tg_user.id);

      const [userResponse, ticketsResponse, statusResponse] = await Promise.all([
        fetch(userUrl),
        fetch(ticketsUrl),
        fetch(statusUrl)
      ]);

      const user = userResponse.ok ? await userResponse.json() : null;
      const userTickets = ticketsResponse.ok ? (await ticketsResponse.json()).tickets : 0;
      const statusData = statusResponse.ok ? await statusResponse.json() : null;

      // Устанавливаем все состояния
      setUserData({
        id: tg_user.id,
        firstName: tg_user.first_name,
        lastName: tg_user.last_name,
        username: tg_user.username,
        language_code: tg_user.language_code,
        entrant_id: user?.entrant_id || null,
        phone_number: user?.phone_number || null,
        last_activity: user?.last_activity || null,
        user_uuid: user?.user_uuid || null,
        is_staff: user?.is_staff || false, // Исправлено на boolean
        is_admin: user?.is_admin || false,  // Исправлено на boolean
      });
      
      setTickets(userTickets);
      setStatus(statusData?.status || false);
      setRequiredChannels(statusData?.required_channels || []);
      
      // Проверяем номер телефона для показа модалки
      setShowModal(!user?.phone_number);

      console.log('db data:', user);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция для обновления данных
  const refreshData = useCallback(() => {
    if (userData?.id) {
      fetchUserData({ id: userData.id });
    }
  }, [userData?.id, fetchUserData]);

  return {
    userData,
    tickets,
    status,
    requiredChannels,
    showModal,
    loading,
    error,
    fetchUserData,
    refreshData,
    setShowModal
  };
};