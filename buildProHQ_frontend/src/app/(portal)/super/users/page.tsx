import { ManagerUsersListContainer } from "@/features/users/containers/ManagerUsersListContainer";
import { ROUTES } from "@/constants/routes";

export default function SuperUsersPage() {
  return <ManagerUsersListContainer addUserHref={ROUTES.SUPER_ADD_USER} editUserHref={(id) => `${ROUTES.SUPER_USERS}/${id}/edit`} />;
}

