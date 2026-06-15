import type { User } from '../types'
import { BaseApiService } from './BaseApiService'

export class UserApi extends BaseApiService {
  protected readonly baseRoute = '/api/users'

  getUsers(): Promise<User[]> {
    return this._get<User[]>(this.baseRoute)
  }
}
