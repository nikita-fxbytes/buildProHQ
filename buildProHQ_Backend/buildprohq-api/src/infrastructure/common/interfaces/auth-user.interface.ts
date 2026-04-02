export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'manager' | 'field_user' | 'trade_user';
  userTypeCode?: string;
}
