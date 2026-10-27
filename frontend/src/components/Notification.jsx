import { useEffect } from 'react';

export default function Notification({ notification, onClose }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(timeout);
  }, [notification.id, onClose]);

  return (
    <div className={`notification notification-${notification.type}`} role={notification.type === 'error' ? 'alert' : 'status'}>
      <span className="notification-mark" aria-hidden="true">{notification.type === 'error' ? '!' : '✓'}</span>
      <span>{notification.message}</span>
      <button onClick={onClose} aria-label="Dismiss notification">×</button>
    </div>
  );
}