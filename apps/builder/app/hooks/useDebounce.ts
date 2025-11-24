import { useEffect, useState } from "react";

/**
 * Hook untuk debounce value
 * Berguna untuk search input agar tidak terlalu banyak request ke server
 *
 * @param value - Value yang akan di-debounce
 * @param delay - Delay dalam milliseconds (default: 500ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout untuk update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timeout jika value berubah sebelum delay selesai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
