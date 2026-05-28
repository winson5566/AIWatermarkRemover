import { useTranslation } from "react-i18next";

interface TableRow {
  signalKey: string;
  layer: string;
  detection: string;
  removal: string;
}

export default function CapabilityTable() {
  const { t } = useTranslation();

  const rows: TableRow[] = [
    { signalKey: "gemini", layer: t("features.visible.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "doubao", layer: t("features.visible.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "c2pa", layer: t("features.metadata.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "exif", layer: t("features.metadata.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "png", layer: t("features.metadata.title"), detection: "✓", removal: t("table.free") },
    { signalKey: "synthid", layer: t("features.invisible.title"), detection: t("table.limited"), removal: t("table.comingSoon") },
  ];

  return (
    <section>
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
        {t("table.title")}
      </h2>
      <div className="overflow-x-auto rounded-card border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">
                {t("table.signal")}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">
                {t("table.layer")}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">
                {t("table.detection")}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">
                {t("table.removal")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.signalKey}
                className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                  idx === rows.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-slate-800 sm:px-6">
                  {t(`table.rows.${row.signalKey}`)}
                </td>
                <td className="px-4 py-3 text-slate-500 sm:px-6">{row.layer}</td>
                <td className="px-4 py-3 sm:px-6">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      row.detection === "✓"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {row.detection}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      row.removal === t("table.free")
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {row.removal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
