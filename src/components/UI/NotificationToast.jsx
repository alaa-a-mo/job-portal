import { useDispatch, useSelector } from "react-redux";
import { notificationActions } from "../../store/notificationSlice";
import { useEffect } from "react";

export default function NotificationToast() {
  const notification = useSelector((state) => state.notification.notification);
  const isSuccess = notification?.status === "success";
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(notificationActions.hideNotification());
  }
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(notificationActions.hideNotification());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);
  if (!notification) {
    return null;
  }

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 text-white rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-4 duration-200 max-w-sm ${isSuccess ? "bg-emerald-600 shadow-emerald-600/20" : "bg-red-600 shadow-red-600/20"}`}
    >
      {/* Icon Badge */}
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white shrink-0">
        {isSuccess ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
      </div>

      {/* Message Copy */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-bold uppercase tracking-wider ${isSuccess ? "text-emerald-100" : "text-red-100"}`}
        >
          {notification.title}
        </p>
        <p className="text-xs font-medium text-white mt-0.5">
          {notification.message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        className={`p-1 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0 ${isSuccess ? "text-emerald-200" : "text-red-200"}`}
        aria-label="Dismiss notification"
        onClick={handleClose}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
