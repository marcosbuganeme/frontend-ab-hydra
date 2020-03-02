import { save, load } from 'redux-localstorage-simple'
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { authReducer } from './views/Pages/AuthReducer'

const store = configureStore({
  reducer: { authReducer },
  middleware: [...getDefaultMiddleware(), save()],
  preloadedState: load(),
})

export default store

