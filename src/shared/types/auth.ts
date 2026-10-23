import type { components } from '../api/generated/schema'

type S = components['schemas']

export type SignInRequest = S['SignInRequestDTO']

export type SignUpRequest = S['SignUpRequestDTO']

export type AuthUser = S['AuthUserDTO']

/** The API's token stays with the proxy as the session cookie; the page receives only who signed in. */
export type AuthResponse = Omit<S['AuthResponseDTO'], 'token'>
