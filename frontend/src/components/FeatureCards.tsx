import { useTranslation } from "react-i18next";

const icons = {
  visible: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  invisible: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
    </svg>
  ),
  metadata: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  ),
};

export default function FeatureCards() {
  const { t } = useTranslation();
  const features = [
    { key: "visible", icon: icons.visible, gradient: "from-brand-500/20 to-brand-600/10" },
    { key: "invisible", icon: icons.invisible, gradient: "from-accent-500/20 to-accent-600/10" },
    { key: "metadata", icon: icons.metadata, gradient: "from-purple-500/20 to-purple-600/10" },
  ] as const;

  return (
    <section className="relative z-10">
      <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
        <span className="gradient-text">{t("features.title")}</span>
      </h2>
      <div className="grid gap-5 sm:grid-cols-3">
        {features.map(({ key, icon, gradient }) => (
          <div
            key={key}
            className={`group relative overflow-hidden rounded-xl border border-white/[0.06] glass transition-all duration-300 hover:border-white/[0.1] hover:shadow-lg hover:shadow-brand-500/5`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
            <div className="relative p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-surface-100 text-brand-400">
                {icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-100">{t(`features.${key}.title`)}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t(`features.${key}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
