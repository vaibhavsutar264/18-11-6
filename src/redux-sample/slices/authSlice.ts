import { createSlice } from '@reduxjs/toolkit'
import { dispatch } from '../store'
// import * as services from '../../services/auth-service'
// import { setSession } from '../../utils/jwt'

import API_URL from '../../utils/baseConfig/apiBase'
import { getUserFromStorage } from '../../utils/baseConfig/userUtils'
import { UserLogin, AuthState } from '../../types/authType'
import {
  removeFromLocalStorage,
  setInLocalStorage,
  //   getFromLocalStorage,
} from '../../hooks/useLocalStorage'
import ApiRouteconstant from '../../services/apiRouteconstant'
// import axios from 'axios'

const { LOGIN, LOGOUT } = ApiRouteconstant
const user = getUserFromStorage()

const initialState: AuthState = {
  user: user ? user : null,
  profile: undefined,
  isError: false,
  isLoading: false,
  isSuccess: false,
  isAuthenticated: false,
  message: '',
}

//Interface and types should be in different file
// export interface AuthState {
//   isAuth: boolean
//   isSignup: boolean
//   isLoading: boolean
//   currentUser?: CurrentUser
//   error: null
// }

// //Interface and types should be in different file
// export interface CurrentUser {
//   userId: string
//   firstName: string
//   lastName: string
//   email: string
//   phoneNumber: number
// }

// //Interface and types should be in different file
// export const initialState: AuthState = {
//   isAuth: false,
//   isSignup: false,
//   isLoading: false,
//   error: null,
// }

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true
      state.isAuthenticated = false
    },
    hasError(state, action) {
      state.isLoading = false
      state.isError = true
      state.isAuthenticated = false
      state.message = action.payload as string
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.isError = false
      state.user = action.payload.data.token
      state.isAuthenticated = true
      state.message = action.payload.message
    },
    setPasswordSuccess: (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.message = action.payload.message as string
    },
    forgotPasswordSuccess: (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.message = action.payload.message as string
    },
    logOutSuccess: (state) => {
      state.isLoading = false
      state.user = null
      state.isAuthenticated = false
    },
  },
})

// reducers
export default userSlice.reducer

// actions
export const { startLoading, hasError } = userSlice.actions

// -----------------------------------------------------------------

export const login = (userData: UserLogin) => {
  dispatch(userSlice.actions.startLoading())
  return async () => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const response = await API_URL.post(LOGIN, userData, config)
      if (response.data) {
        setInLocalStorage('user', JSON.stringify(response.data.data.token))
        const token: any = response.data.data.token
        if (token) {
          //   API_URL.defaults.headers.common['Authorization'] = `Bearer ${token}`
          setInLocalStorage('token', token)
        }
      }
      dispatch(userSlice.actions.loginSuccess(response.data))
      return response.data
    } catch (error) {
      console.log(error)
      dispatch(userSlice.actions.hasError(error))
    }
  }
}

export const logout = () => {
  dispatch(userSlice.actions.startLoading())
  return async () => {
    try {
      removeFromLocalStorage('token')
      await API_URL.get(LOGOUT)
      dispatch(userSlice.actions.logOutSuccess())
    } catch (error) {
      console.log(error)
      dispatch(userSlice.actions.hasError(error))
    }
  }
}

// export const updatePassword = async (passwordData: Password) => {
//   dispatch(userSlice.actions.startLoading())
//   try {
//     const token = await getFromLocalStorage('token')
//     if (token) {
//       API_URL.defaults.headers.common['Authorization'] = `Bearer ${token}`
//     }
//     const response = await API_URL.patch(SETPASSWORD, passwordData)
//     dispatch(userSlice.actions.setPasswordSuccess(response))
//     return response.data
//   } catch (error) {
//     console.log(error)
//     dispatch(userSlice.actions.hasError(error))
//   }
// }

// export const forgotPassword = async (userEmail: Email) => {
//   //   dispatch(userSlice.actions.startLoading())
//   try {
//     const config = { headers: { 'Content-Type': 'application/json' } }
//     const { data } = await API_URL.post(FORGOTPASSWORD, userEmail, config)
//     // const { data } = await axios.post(
//     //   `/api/v1/password/forgot`,
//     //   emailData,
//     //   config
//     // )

//     // dispatch(userSlice.actions.forgotPasswordSuccess(data))
//     return data.data
//   } catch (error) {
//     console.log(error)
//     // dispatch(userSlice.actions.hasError(error))
//   }
// }
