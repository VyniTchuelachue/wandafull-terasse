import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const DataContext = createContext(null);

function useResource(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  const load = useCallback(() => {
    setState((s) => ({ ...s, error: null, loading: true }));
    api(path)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => setState({ data: null, error, loading: false }));
  }, [path]);

  useEffect(load, [load]);
  return { ...state, reload: load };
}

export function DataProvider({ children }) {
  const restaurant = useResource('/restaurant');
  const menu = useResource('/menu');
  return <DataContext.Provider value={{ restaurant, menu }}>{children}</DataContext.Provider>;
}

export function useRestaurant() {
  return useContext(DataContext).restaurant;
}

export function useMenu() {
  return useContext(DataContext).menu;
}
