import { useEffect } from 'react';
import authService from '../services/authService';

const SESSION_TIMEOUT_MINUTES = 30; // Session timeout in minutes
const WARNING_TIME_MINUTES = 5; // Show warning 5 minutes before timeout
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

export const useSessionTimeout = (onWarning, onExtend) => {
  useEffect(() => {
    let timeoutId = null;
    let warningTimeoutId = null;
    let countdownIntervalId = null;

    const handleLogout = () => {
      console.log('Session timeout - logging out user');
      authService.logout();
      window.location.href = '/';
    };

    const handleExtendSession = () => {
      console.log('Session extended by user');
      resetTimeout();
      if (onExtend) {
        onExtend();
      }
    };

    const resetTimeout = () => {
      // Clear existing timeouts and interval
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
      }
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        return;
      }

      const totalTimeMs = SESSION_TIMEOUT_MINUTES * 60 * 1000;
      const warningTimeMs = (SESSION_TIMEOUT_MINUTES - WARNING_TIME_MINUTES) * 60 * 1000;

      // Set warning timeout (5 minutes before actual timeout)
      warningTimeoutId = setTimeout(() => {
        console.log('Session warning - showing timeout warning');
        if (onWarning) {
          onWarning(true);
          // Start countdown
          let secondsRemaining = WARNING_TIME_MINUTES * 60;
          countdownIntervalId = setInterval(() => {
            secondsRemaining -= 1;
            if (onWarning) {
              onWarning(true, secondsRemaining);
            }
            if (secondsRemaining <= 0) {
              clearInterval(countdownIntervalId);
            }
          }, 1000);
        }
      }, warningTimeMs);

      // Set actual logout timeout
      timeoutId = setTimeout(() => {
        if (onWarning) {
          onWarning(false);
        }
        handleLogout();
      }, totalTimeMs);
    };

    const activityHandler = () => {
      resetTimeout();
    };

    // Add event listeners for user activity
    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    // Initialize timeout on mount
    resetTimeout();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
      }
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
      }
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, activityHandler);
      });
    };
  }, [onWarning, onExtend]);
}
