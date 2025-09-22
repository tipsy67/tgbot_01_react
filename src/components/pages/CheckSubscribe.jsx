export default function CheckSubscribe({ 
  showModal, 
  channels, 
  onClose, 
  onSubscribe 
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="modal modal-open">
        <div className="modal-box relative max-w-md max-h-[90vh] flex flex-col"> {/* Добавляем flex-col */}
          
          {/* Заголовок и кнопка закрытия - фиксированные */}
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-base-100 pb-4 z-20"> {/* Sticky header */}
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Прокручиваемый контент */}
          <div className="flex-1 overflow-y-auto"> {/* Основной контент с скроллом */}
            
            {/* Описание */}
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Для участия в розыгрыше необходимо подписаться на следующие каналы
              </p>
            </div>

            {/* Список каналов с скроллом */}
            <div className="bg-base-200 rounded-lg p-2 mb-4 max-h-64 overflow-y-auto"> {/* Уже имеет скролл */}
              <div className="space-y-3">
                {channels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg border border-base-300">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                    
                      {/* Название канала */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{channel.name}</div>
                        <div className="text-xs text-gray-500 truncate">@{channel.name}</div>
                      </div>
                    </div>

                    {/* Статус подписки */}
                    <div className="flex-shrink-0 ml-3">
                      {channel.subscribe ? (
                        <span className="badge badge-success badge-sm gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {/* Подписан */}
                        </span>
                      ) : (
                        <span className="badge badge-error badge-sm gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          {/* Не подписан */}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div> {/* Конец прокручиваемого контента */}

          {/* Кнопки действий - фиксированные внизу */}
          <div className="modal-action flex flex-col gap-2 sticky bottom-0 bg-base-100 pt-4 z-20"> {/* Sticky footer */}
            
            {/* Кнопка перехода в Telegram */}
            <button
              className="btn btn-primary w-full gap-2"
              onClick={() => {
                const unsubscribeChannels = channels.filter(ch => !ch.subscribe);
                unsubscribeChannels.forEach(channel => {
                  window.open(`https://t.me/${channel.name}`, '_blank');
                });
              }}
              disabled={channels.every(ch => ch.subscribe)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Перейти в Telegram
            </button>

            {/* Кнопка проверки подписок */}
            <button
              className="btn btn-secondary w-full gap-2"
              onClick={onSubscribe}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Проверить подписки
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}