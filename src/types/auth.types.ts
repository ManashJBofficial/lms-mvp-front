export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  gender: string | undefined;
}

export interface LoginFormData {
  email: string;
  password: string;
}
