import { HOME_HEALTH_COPY } from "./home-health-copy";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-start bg-[radial-gradient(circle_at_20%_20%,rgb(124_58_237_/_18%),transparent_28rem),radial-gradient(circle_at_80%_0%,rgb(6_182_212_/_16%),transparent_24rem)] px-5 py-7 sm:place-items-center sm:p-8">
      <section className="w-full max-w-[680px]" aria-labelledby="home-title">
        <p className="mb-3 text-sm font-bold uppercase text-cyan-400">
          {HOME_HEALTH_COPY.eyebrow}
        </p>
        <h1 id="home-title" className="text-4xl font-bold leading-[1.05] sm:text-5xl">
          {HOME_HEALTH_COPY.title}
        </h1>
        <p className="mt-[18px] max-w-xl text-lg leading-relaxed text-slate-400">
          Workspace foundation is ready for the upcoming authentication screens,
          profile onboarding, and TOEIC learning flows.
        </p>
        <nav className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label="Future routes">
          <a
            className="min-h-11 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 px-[18px] py-3 font-bold text-slate-50 no-underline shadow-[0_4px_0_#5b21b6]"
            href={HOME_HEALTH_COPY.authLink}
          >
            Auth routes coming soon
          </a>
          <a
            className="min-h-11 rounded-full border border-slate-400/30 bg-slate-900/70 px-[18px] py-3 font-bold text-slate-50 no-underline"
            href={HOME_HEALTH_COPY.profileLink}
          >
            Profile routes coming soon
          </a>
        </nav>
      </section>
    </main>
  );
}
