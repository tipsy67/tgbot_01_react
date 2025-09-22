import { ENDPOINTS } from "../../constants/apiEndpoints";
import { useState, useEffect } from "react";

export default function TicketInfo({
    tg_user,
    showModal,
    onClose
}) {
    if (!showModal) return null;

    const [ticketsInfo, setTicketsInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = ENDPOINTS.TICKETS(tg_user.id);

    useEffect(() => {
        async function loadTickets() {
            try {
                setLoading(true);
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Ошибка загрузки билетов');

                const data = await response.json();
                setTicketsInfo(data);
                setError(null);
            } catch (error) {
                console.error('Ошибка загрузки билетов:', error);
                setError('Не удалось загрузить информацию о билетах');
            } finally {
                setLoading(false);
            }
        }

        if (showModal) {
            loadTickets();
        }
    }, [showModal, tg_user.id, apiUrl]);

    // Показываем заглушку во время загрузки
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="modal modal-open">
                    <div className="modal-box relative max-w-md flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Мои билеты</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
                        </div>
                        <div className="text-center py-8">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="mt-4 text-gray-600">Загрузка информации о билетах...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Показываем ошибку, если она есть
    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="modal modal-open">
                    <div className="modal-box relative max-w-md flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Мои билеты</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
                        </div>
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <p className="text-error">{error}</p>
                            <button className="btn btn-primary mt-4" onClick={onClose}>Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Если данные загружены, но их нет
    if (!ticketsInfo) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="modal modal-open">
                    <div className="modal-box relative max-w-md flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Мои билеты</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
                        </div>
                        <div className="text-center py-8">
                            <p className="text-gray-600">Нет данных о билетах</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="modal modal-open">
                <div className="modal-box relative max-w-md max-h-[90vh] flex flex-col">

                    {/* Заголовок и кнопка закрытия */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>
                    {/* Общее количество билетов */}
                    <div className="bg-base-200 rounded-lg p-3 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-500">Всего билетов</div>
                        </div>
                        <div className="text-2xl font-bold text-primary">{ticketsInfo.tickets || 0}</div>
                    </div>

                    {/* Прокручиваемый список билетов */}
                    <div className="bg-base-200 rounded-lg p-2 mb-4 flex-1 overflow-y-auto max-h-64">
                        <div className="space-y-3">
                            {ticketsInfo.detailed_tickets && ticketsInfo.detailed_tickets.length > 0 ? (
                                ticketsInfo.detailed_tickets.map((detail, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg border border-base-300">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>

                                            {/* Описание способа получения */}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate">{detail.name || 'Не указано'}</div>
<div className="text-xs text-gray-500">
    {detail.created_at ? new Date(detail.created_at).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) : 'Дата не указана'}
</div>
                                                {detail.username && (
                                                    <div className="text-xs text-gray-500">@{detail.username}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Количество полученных билетов */}
                                        <div className="flex-shrink-0 ml-3">
                                            <span className="badge badge-primary badge-lg gap-1">
                                                +{detail.tickets || 1}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    Нет информации о полученных билетах
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Правила получения билетов */}
                    <div className="collapse collapse-arrow bg-base-100 border border-base-300 mb-4">
                        <input type="checkbox" />
                        <div className="collapse-title text-sm font-medium">
                            Как получить больше билетов?
                        </div>
                        <div className="collapse-content">
                            <ul className="text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="badge badge-primary badge-sm mt-1">+2</span>
                                    <span>Покупка в нашем магазине</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="badge badge-primary badge-sm mt-1">+1</span>
                                    <span>Пригласить друга</span>
                                </li>
                            </ul>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}