const initAuth = async () => {
  const { storedToken } = props
  if (storedToken) {
    setLoading(true)
    await axios
      .get(authConfig.meEndpoint, {
        headers: {
          Authorization: storedToken
        }
      })
      .then(async response => {
        setLoading(false)
        setUser({ ...response.data.userData })
      })
      .catch(() => {
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        setUser(null)
        setLoading(false)
        if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
          router.replace('/login')
        }
      })
  } else {
    setLoading(false)
  }
}
