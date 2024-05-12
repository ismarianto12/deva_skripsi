export default {
  meEndpoint: process.env.APP_API + 'getuser',
  loginEndpoint: process.env.APP_API + 'login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
