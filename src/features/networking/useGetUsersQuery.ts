import { queryOptions, useQuery } from '@tanstack/react-query'
import { userService } from '../../shared/services'

export const getUsersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: () => userService.getUsers(),
})

export function useGetUsersQuery() {
  return useQuery(getUsersQueryOptions)
}
