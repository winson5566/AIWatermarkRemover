import { useTranslation } from "react-i18next";

export default function CapabilityTable() {
  const { t } = useTranslation();

  const rows = [
    { signalKey: "gemini", layer: t("features.visible.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "doubao", layer: t("features.visible.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "c2pa", layer: t("features.metadata.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "exif", layer: t("features.metadata.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "png", layer: t("features.metadata.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "synthid", layer: t("features.invisible.title"), detection: t("table.limited"), removal: t("table.comingSoon") },
  ];

  return (
    <section className="relative z-10">
      <h2 className="mb-6 text-center text-2xl font-bold text-white sm:text-3xl">
        {t("table.title")}
      </h2>
      <div className="overflow-x-auto rounded-xl border border-white/[0.06] glass">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-surface-100/50">
              <th className="px-4 py-3.5 font-semibold text-slate-300 sm:px-6">{t("table.signal")}</th>
              <th className="px-4 py-3.5 font-semibold text-slate-300 sm:px-6">{t("table.layer")}</th>
              <th className="px-4 py-3.5 font-semibold text-slate-300 sm:px-6">{t("table.detection")}</th>
              <th className="px-4 py-3.5 font-semibold text-slate-300 sm:px-6">{t("table.removal")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.signalKey}
                className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                  idx === rows.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-slate-200 sm:px-6">{t(`table.rows.${row.signalKey}`)}</td>
                <td className="px-4 py-3 text-slate-400 sm:px-6">{row.layer}</td>
                <td className="px-4 py-3 sm:px-6">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.detection === "✓" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  }`}>{row.detection}</span>
                </td>
                <td className="px-4 py-3 sm:px-6">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.removal === t("table.free") ? "bg-emerald-500/10 text-emerald-400" : "bg-surface-200 text-slate-500"
                  }`}>{row.removal}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
