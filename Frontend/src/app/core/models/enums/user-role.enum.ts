

export enum UserRole {
  Admin = 0,
  Manager = 1,
  Employee = 2,
}

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: 'Administrator',
  [UserRole.Manager]: 'Menedżer',
  [UserRole.Employee]: 'Pracownik',
};
