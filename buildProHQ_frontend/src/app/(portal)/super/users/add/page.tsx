import { ManagerAddUserContainer } from "@/features/users/containers/ManagerAddUserContainer";
import { ROUTES } from "@/constants/routes";

export default function SuperAddUserPage() {
  return <ManagerAddUserContainer redirectHref={ROUTES.SUPER_USERS} />;
}

