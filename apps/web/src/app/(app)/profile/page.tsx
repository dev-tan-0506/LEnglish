import { ProfileForm } from "../../../components/profile/ProfileForm";

/** Renders the authenticated profile editing page. */
export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 md:p-10">
      <ProfileForm />
    </main>
  );
}
