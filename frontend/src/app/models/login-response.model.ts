export interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    status: string;
  };
}
