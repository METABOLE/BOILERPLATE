import { useEffect, useState } from 'react';

export function DisableDraftMode() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window.top === window);
  }, []);

  return show ? <a href="/api/disable-draft">Disable Draft Mode</a> : null;
}
