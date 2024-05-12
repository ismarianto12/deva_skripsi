import { useEffect } from "react";
import { deleteCookie } from "src/@core/utils/encp";

const logout = () => {

  useEffect(() => {
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    deleteCookie('token')
    router.push('/login')
  }, []);
}

export default logout
