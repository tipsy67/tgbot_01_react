export default function WarningWindow({ showWarning, onCloseApp, ...props}) {
  if (!showWarning) return null;

  return (        showWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Внимание!</h2>
                    <p className="text-gray-700 mb-4">
                        Это приложение предназначено для использования исключительно внутри Telegram.
                    </p>
                </div>
            </div>
        )
  )
}
