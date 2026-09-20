import React from 'react';
import { Providers } from './app/providers';
import { ParallelOrchestrator } from './features/orchestrator/components/ParallelOrchestrator';

export default function App() {
  return (
    <Providers>
      <ParallelOrchestrator />
    </Providers>
  );
}
