export default function GetContact({ showModal, isLoading, onGetContacts, onSkip }) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="modal modal-open">
        <div className="modal-box relative max-w-md">
          {/* Кнопка закрытия */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onSkip}
          >
            ✕
          </button>

          <div className="text-center">
            {/* Иконка */}
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2"></h3>
            <p className="text-gray-600 mb-4">
              Предоставьте доступ для лучшего взаимодействия с приложением
            </p>

            <div className="bg-base-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm py-1">
                <span className="flex items-center">
                  Телефон
                </span>
                <span className="badge badge-success badge-sm">Доступно</span>
              </div>
            </div>
          </div>

          <div className="modal-action flex flex-col gap-2">
            <button
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              onClick={onGetContacts}
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Разрешить доступ'}
            </button>

            <button
              className="btn btn-ghost w-full"
              onClick={onSkip}
            >
              Пропустить
            </button>
          </div>

          <div className="text-center mt-4 pt-3 border-t border-base-300">
            <div className="flex justify-center items-center gap-2 mb-2">
              <div className="badge badge-outline badge-xs">🔒</div>
              <div className="badge badge-outline badge-xs">SSL</div>
              <div className="badge badge-outline badge-xs">Secure</div>
            </div>
            <p className="text-xs text-gray-500">
              Ваши данные защищены и не передаются третьим лицам
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}