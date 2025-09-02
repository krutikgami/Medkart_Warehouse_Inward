import { useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

const Toast = ({ message, success, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white mb-2
        ${success? "bg-green-500" : "bg-red-500"}`}
    >
      {success ? (
        <CheckCircle className="w-5 h-5 cursor-pointer"  onClick={onClose}/>
      ) : (
        <XCircle className="w-5 h-5 cursor-pointer"  onClick={onClose}/>
      )}
      <span className="text-sm">{message}</span>
    </div>
  )
}

export default Toast
