import { useContext } from 'react';
import { AppContext } from './AppContextCore';

export const useApp = () => useContext(AppContext);
