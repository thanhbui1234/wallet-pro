import React, { useCallback } from "react";

export const useDebounce = <
  T extends (...args: Parameters<T>) => ReturnType<T>
>(
  callback: T,
  delay: number
) => {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFunction;
};
