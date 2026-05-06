import { HOME_HEALTH_COPY } from "./home-health-copy";

export default function Home() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="home-title">
        <p className="eyebrow">{HOME_HEALTH_COPY.eyebrow}</p>
        <h1 id="home-title">{HOME_HEALTH_COPY.title}</h1>
        <p className="summary">
          Workspace foundation is ready for the upcoming authentication screens,
          profile onboarding, and TOEIC learning flows.
        </p>
        <nav className="links" aria-label="Future routes">
          <a href={HOME_HEALTH_COPY.authLink}>Auth routes coming soon</a>
          <a href={HOME_HEALTH_COPY.profileLink}>Profile routes coming soon</a>
        </nav>
      </section>
    </main>
  );
}
