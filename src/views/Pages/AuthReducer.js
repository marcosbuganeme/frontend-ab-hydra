import { createSlice } from 'redux-starter-kit'
import axios from 'axios'

const initialState = {
  loggedIn: false,
  token: null,
  errorMessage: '',
}

const authSlice = createSlice({
  slice: 'auth',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.loggedIn = false
      state.token = ''
      state.errorMessage = ''
      return state
    },
    authFetch: (state, action) => {
      state.loggedIn = false
      state.token = ''
      state.errorMessage = ''
      return state
    },
    authSuccess: (state, action) => {
      if (action.payload.token) {
        state.token = action.payload.token
        state.loggedIn = true
      }
      return state
    },
    authError: (state, action) => {
      state.token = ''
      state.loggedIn = false
      state.errorMessage = 'Usuário ou senha incorreto, tente novamente.'
      return state
    },
    reset: (state, action) => initialState
  }
})

const { actions, reducer: authReducer } = authSlice

const authActions = {
  ...actions,
  login: ({ data }) => {
    return async dispatch => {
      try {
        dispatch(authActions.authFetch())
        const result = await axios.post('/auth', data)
        dispatch(authActions.authSuccess({ token: result.data.token.token }))
      } catch (e) {
        dispatch(authActions.authError())
      }
    }
  }
}

export {
  authActions,
  authReducer
}
