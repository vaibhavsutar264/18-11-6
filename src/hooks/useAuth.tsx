import { useLayoutEffect, useState } from 'react'
import { useSelector as useAppSelector } from '../redux-sample/store'
import { setHttpToken } from '../utils/baseConfig/apiBase'

function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const { user } = useAppSelector((state: any) => state.auth)

  useLayoutEffect(() => {
    if (user) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
    setHttpToken(user?.token)
    setCheckingStatus(false)
  }, [user])
  return { loggedIn, checkingStatus }
}

export default useAuth
