
export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  age?: number | null;
  height?: number | null;
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  isLoaded: boolean;
}
