import { useState, createContext, useContext } from "react"
import Toast from "./Toast"

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, success) => {
    const id = Date.now()
    setToasts([...toasts, { id, message, success }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            success={t.success}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
