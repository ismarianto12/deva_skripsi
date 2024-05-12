// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

import toast from 'react-hot-toast'
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { setCookie } from 'src/@core/utils/encp'
import Swal from 'sweetalert2'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const userData = window.localStorage.getItem('userData')
      if (storedToken) {
        setLoading(false)
        setUser(userData)
      } else {
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        setLoading(false)
        setUser(null)
        if (!router.pathname.includes('login')) {
          router.replace('/login')
        }
      }

      // }

      //   if (storedToken) {
      //     setLoading(true)
      //     await axios
      //       .get(authConfig.meEndpoint, {
      //         headers: {
      //           Authorization: storedToken
      //         }
      //       })
      //       .then(async response => {
      //         setLoading(false)
      //         setUser({ ...response.data.userData })
      //       })
      //       .catch(() => {
      //         localStorage.removeItem('userData')
      //         localStorage.removeItem('refreshToken')
      //         localStorage.removeItem('accessToken')
      //         setUser(null)
      //         setLoading(false)
      //       })
      //   } else {
      //     setLoading(false)
      //   }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // setLoading(false)
  }, [])

  const handleLogin = (params, errorCallback) => {
    Swal.fire({
      title: 'Login Success',
      allowOutsideClick: false,
      showCancelButton: false,
      timer: 3000,
      showConfirmButton: false,
    });
    Swal.showLoading();
    setLoading(true)

    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        setLoading(false)
        setCookie('token', response.data.accessToken, 7)

        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.userData })
        // document.cookie = response.data.accessToken
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        Swal.fire('Success', 'login succes', 'success')

        toast.success('Login Success')
        router.push('/home')
      })
      .catch(err => {
        setLoading(false)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
