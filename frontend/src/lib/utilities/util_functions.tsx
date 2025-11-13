import { useState, useEffect } from "react";

export const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) {
        setTimeLeft("Expired");
        return;
      }
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(
          `${days} Days ${hours} Hrs ${minutes} Mins ${seconds} Secs`
        );
      } else {
        setTimeLeft("Expired");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

export function calculateCountdown(endDate: string) {
  if (!endDate) return 'N/A';
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${mins}m`;
}
