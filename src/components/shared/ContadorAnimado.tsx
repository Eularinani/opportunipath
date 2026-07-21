'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';
import { cn } from '@/lib/utils';

interface ContadorAnimadoProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function ContadorAnimado({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: ContadorAnimadoProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className={cn(className)}>
      {isInView ? (
        <CountUp end={end} duration={duration} suffix={suffix} prefix={prefix} />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}
