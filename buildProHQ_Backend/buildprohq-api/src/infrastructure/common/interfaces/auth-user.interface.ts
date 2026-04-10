export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'manager' | 'field_user' | 'trade_user';
  userTypeCode?: string;
}
