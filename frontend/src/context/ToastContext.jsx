import { createContext, useState, useContext } from 'react'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)

  const showToast = (msg) => {
    setMessage(msg)
    setShow(true)
    setTimeout(() => setShow(false), 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {show && <div className="toast show">{message}</div>}
    </ToastContext.Provider>
  )
}