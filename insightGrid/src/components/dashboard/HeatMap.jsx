import React from "react";
import { useSelector } from "react-redux";

const intensityToColor = (val, min, max) => {
  if (val == null || min === max) return "#e5e7eb";
  const p = (val - min) / (max - min);
  const r = Math.round(99 + (79 - 99) * p);
  const g = Math.round(102 + (70 - 102) * p);
  const b = Math.round(241 + (230 - 241) * p);
  return `rgb(${r}, ${g}, ${b})`;
};

const HeatMap = () => {
  const heatMap = useSelector((state) => state.insights.heatMap) || [];

  if (heatMap.length === 0) {
    return <p className="text-gray-500 text-sm py-8">No data</p>;
  }

  const countries = [...new Set(heatMap.map((d) => d.country))].sort();
  const years = [...new Set(heatMap.map((d) => d.year))].filter(Boolean).sort((a, b) => a - b);

  const map = {};
  heatMap.forEach(({ country, year, avg_intensity }) => {
    if (!map[country]) map[country] = {};
    map[country][year] = avg_intensity ?? 0;
  });

  const allValues = heatMap.map((d) => d.avg_intensity).filter((v) => v != null);
  const min = allValues.length ? Math.min(...allValues, 0) : 0;
  const max = allValues.length ? Math.max(...allValues, 1) : 1;

  const displayCountries = countries.slice(0, 12);
  const displayYears = years.length > 10 ? years.filter((_, i) => i % Math.ceil(years.length / 10) === 0).slice(0, 10) : years;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `100px repeat(${displayYears.length}, minmax(24px, 1fr))` }}>
          <div className="text-xs text-gray-400 py-1.5" />
          {displayYears.map((y) => (
            <div key={y} className="text-xs text-gray-500 text-center py-1.5">{y}</div>
          ))}
          {displayCountries.map((country) => (
            <React.Fragment key={country}>
              <div className="text-xs text-gray-600 truncate py-1 pr-2">{country || "—"}</div>
              {displayYears.map((year) => {
                const val = map[country]?.[year];
                return (
                  <div
                    key={`${country}-${year}`}
                    className="rounded-sm min-w-[20px] min-h-[20px]"
                    style={{ backgroundColor: intensityToColor(val, min, max) }}
                    title={`${country} (${year}): ${val != null ? val.toFixed(1) : "—"}`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">Intensity:</span>
          <div className="flex-1 h-2 rounded overflow-hidden flex bg-gray-200">
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <div key={p} className="flex-1" style={{ backgroundColor: intensityToColor(min + p * (max - min), min, max) }} />
            ))}
          </div>
          <span className="text-xs text-gray-500">{min.toFixed(0)} - {max.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
