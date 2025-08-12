'use client';

import { useEffect } from 'react';

export default function TestComponent() {
  useEffect(() => {
    console.log('test');
  }, []);

  return <div>Test</div>;
}