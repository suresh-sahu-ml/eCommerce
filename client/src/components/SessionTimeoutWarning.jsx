import React, { useEffect, useState } from 'react';

export default function SessionTimeoutWarning({ isVisible, secondsRemaining, onExtend, onLogout }) {
  const [displaySeconds, setDisplaySeconds] = useState(secondsRemaining);

  useEffect(() => {
    setDisplaySeconds(secondsRemaining);
  }, [secondsRemaining]);

  if (!isVisible) return null;

  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-warning text-[32px]">schedule</span>
          <h2 className="font-headline-md text-headline-md text-primary">Session Expiring</h2>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')} due to inactivity. Click below to continue your session.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 py-3 bg-surface-container text-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-dim transition-colors rounded"
          >
            Logout
          </button>
          <button
            onClick={onExtend}
            className="flex-1 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-secondary transition-colors rounded"
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
}
