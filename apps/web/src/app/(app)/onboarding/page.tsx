import { OnboardingScoreSelector } from "../../../components/profile/OnboardingScoreSelector";

/** Renders the onboarding route that captures target TOEIC score in one step. */
export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 md:p-10">
      <OnboardingScoreSelector />
    </main>
  );
}
