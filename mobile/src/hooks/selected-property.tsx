import { createContext, type ReactNode, useContext, useState } from 'react';

import type { ProducerProperty } from '@/api/producer-app';
import { useProfile } from './use-profile';

type SelectedPropertyState = {
  property: ProducerProperty | null;
  properties: ProducerProperty[];
  select: (propertyId: string) => void;
};

const SelectedPropertyContext = createContext<SelectedPropertyState | null>(null);

// Produtor com mais de uma propriedade escolhe qual quer ver; as abas mostram sempre a escolhida.
export function SelectedPropertyProvider({ children }: { children: ReactNode }) {
  const { data } = useProfile();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const properties = data?.properties ?? [];
  const property = properties.find((item) => item.id === selectedId) ?? properties[0] ?? null;

  return (
    <SelectedPropertyContext.Provider value={{ property, properties, select: setSelectedId }}>
      {children}
    </SelectedPropertyContext.Provider>
  );
}

export function useSelectedProperty() {
  const context = useContext(SelectedPropertyContext);
  if (!context) throw new Error('useSelectedProperty precisa estar dentro de <SelectedPropertyProvider>.');
  return context;
}
