import { AuthBackground } from "../../../components/auth/AuthBackground";
import { AuthCard } from "../../../components/auth/AuthCard";

/** Renders the combined login and signup auth experience. */
export default function LoginPage() {
  return (
    <AuthBackground>
      <AuthCard />
    </AuthBackground>
  );
}
