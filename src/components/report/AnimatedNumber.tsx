'use client';

import { useEffect, useState } from 'react';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 1000,
  decimals = 0
}: Props) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (value - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className="tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}
