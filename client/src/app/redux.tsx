
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useRef } from "react";
import { Provider, useDispatch, useSelector} from 'react-redux'
import {persistStore,persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";
import createWebStorage from 'redux-persist/es/storage/createWebStorage';
import { PersistGate } from 'redux-persist/integration/react';
import { setupListeners } from '@reduxjs/toolkit/query';
import globalReducer from "@/state"
import { api } from "@/state/api";


/* REDUX PERSISTENCE */
const createNoopStorage = () => {
    return {
      getItem(_key: any) {
        return Promise.resolve(null);
      },
      setItem(_key: any, value: any) {
        return Promise.resolve(value);
      },
      removeItem(_key: any) {
        return Promise.resolve();
      },
    };
  };
  
  const storage =
    typeof window === "undefined"
      ? createNoopStorage()
      : createWebStorage("local");
  
const persistConfig = {
    key: "root",
    storage,
    whitelist:["global"]   
}

const rootReducer = combineReducers({
  global : globalReducer,
  [api.reducerPath]: api.reducer,
})

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware : (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

/* PROVIDER */
export default function StoreProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const storeRef = useRef<AppStore | undefined>(undefined); 

    if (!storeRef.current) {
      storeRef.current = makeStore();
      setupListeners(storeRef.current.dispatch);
    }
    const persistor = persistStore(storeRef.current);
  
    return (
      <Provider store={storeRef.current}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    );
  }
