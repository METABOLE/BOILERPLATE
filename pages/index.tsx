import Button from '@/components/ui/button';
import { useState } from 'react';

export default function Home() {
  const [state, setState] = useState('test');

  const handleClick = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = Math.floor(Math.random() * 9) + 2; // 2-10
    let str = '';
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setState(str);
  };
  return (
    <>
      <Button isResizable onClick={handleClick}>
        {state}
      </Button>
    </>
  );
}
