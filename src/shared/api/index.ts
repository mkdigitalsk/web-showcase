import { client } from './client'
import { AuthApi } from './AuthApi'
import { NoteApi } from './NoteApi'
import { UserApi } from './UserApi'

export { client } from './client'
export { BaseApiService } from './BaseApiService'
export { httpStatus, requestErrorKey } from './requestError'
export { AuthApi } from './AuthApi'
export { NoteApi } from './NoteApi'
export { UserApi } from './UserApi'

export const authApi = new AuthApi(client)
export const userApi = new UserApi(client)
export const noteApi = new NoteApi(client)
