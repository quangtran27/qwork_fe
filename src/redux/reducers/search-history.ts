import { History } from '@/types/search-history.type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

const LOCAL_STORAGE_KEY = 'search-history'

const syncLocalStorage = (histories: History[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(histories))
}

const getLocalStorageData = (): History[] => {
  const jsonData = localStorage.getItem(LOCAL_STORAGE_KEY)
  let data: History[] = []

  try {
    data = JSON.parse(jsonData || '') as History[]
  } catch {}

  return data
}

export type SearchHistoryState = {
  histories: History[]
}

const initialState: SearchHistoryState = {
  histories: getLocalStorageData(),
}

const searchHistory = createSlice({
  name: 'search-history',
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = { ...action.payload }
      const existedHistory = state.histories.find((h) => h.key === key)
      if (existedHistory) {
        state.histories = [
          { key: existedHistory.key, values: [value, ...existedHistory.values.filter((v) => v !== value)] },
          ...state.histories.filter((h) => h.key !== existedHistory.key),
        ]
      } else {
        state.histories = [{ key: key, values: [value] }, ...state.histories]
      }
      syncLocalStorage(state.histories)
    },

    deleteHistory: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = { ...action.payload }
      const existedHistory = state.histories.find((h) => h.key === key)
      if (existedHistory) {
        state.histories = [
          { key: existedHistory.key, values: [...existedHistory.values.filter((v) => v !== value)] },
          ...state.histories.filter((h) => h.key !== existedHistory.key),
        ]
        syncLocalStorage(state.histories)
      }
    },
    clearHistories: (state, action: PayloadAction<string>) => {
      state.histories = [...state.histories.filter((h) => h.key !== action.payload)]
    },
  },
})

export const selectSearchHistories = (state: RootState) => state.searchHistory

export const { addHistory, deleteHistory, clearHistories } = searchHistory.actions

export default searchHistory.reducer
