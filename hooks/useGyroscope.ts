import { useEffect, useState, useRef } from 'react';

interface Gyroscope {
  x: number | null;
  y: number | null;
  isActive: boolean;
}

export const useGyroscope = () => {
  const [value, setValue] = useState<Gyroscope>({
    x: null,
    y: null,
    isActive: false,
  });

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const requestPermission = async (): Promise<boolean> => {
      if (typeof DeviceOrientationEvent === 'undefined') {
        return false;
      }

      const DeviceOrientationEventConstructor = DeviceOrientationEvent as {
        requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
      };

      if (DeviceOrientationEventConstructor.requestPermission) {
        try {
          const state = await DeviceOrientationEventConstructor.requestPermission();
          return state === 'granted';
        } catch {
          return false;
        }
      }

      return true;
    };

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;

      setValue({
        x: event.beta, // [-180,180]
        y: event.gamma, // [-90,90]
        isActive: true,
      });
    };

    const handleFirstInteraction = async () => {
      if (hasRequestedRef.current) return;
      hasRequestedRef.current = true;

      const granted = await requestPermission();
      if (granted) {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchend', handleFirstInteraction);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchend', handleFirstInteraction);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchend', handleFirstInteraction);
    };
  }, []);

  return value;
};
