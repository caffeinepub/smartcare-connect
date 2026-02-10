import type { UserRole } from '../backend';

export function useRoleRouting() {
  const getRoleRoute = (role: UserRole): string => {
    if (role.__kind__ === 'patient') {
      return '/patient';
    } else if (role.__kind__ === 'doctor') {
      return '/doctor';
    } else if (role.__kind__ === 'familyMember') {
      return '/family';
    }
    return '/';
  };

  return { getRoleRoute };
}
