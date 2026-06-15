import { userApi } from '../api'

export const userService = {
  getUsers: () => userApi.getUsers(),
}
