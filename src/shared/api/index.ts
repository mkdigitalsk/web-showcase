import { client } from './client'
import { AuthApi } from './AuthApi'
import { UserApi } from './UserApi'

export { client } from './client'
export { BaseApiService } from './BaseApiService'
export { AuthApi } from './AuthApi'
export { UserApi } from './UserApi'

export const authApi = new AuthApi(client)
export const userApi = new UserApi(client)
