import ExtendedDataList from "./data_list";
// Data updated to reflect the provided 2025/2026 table exactly
import { baseCountriesTop10,economyDataTop10,populationDataTop10,burdenDataTop10,developmentDataTop10,politicsDataTop10} from "./data_structure1-10";

export default function DataCenterCards() {
  const globalData2025: any[] = baseCountriesTop10.map((country: any) => {
      const name = country.name as string;
      
      // Merge base data with all specific properties from other objects
      return {
        ...country,
        ...(economyDataTop10[name] || {}),
        ...(populationDataTop10[name] || {}),
        ...(developmentDataTop10[name] || {}),
        ...(burdenDataTop10[name] || {}),
        ...(politicsDataTop10[name] || {})
      };
    });
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Earth <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">Online</span>
        </h1>
       
      </div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {globalData2025.map((country) => (
          <div 
            key={country.rank} 
            className="group relative bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 hover:border-indigo-500/80 hover:bg-slate-800/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:-translate-y-1"
          >
            {/* Rank Badge */}
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-4 border-slate-950 z-10">
              {country.rank}
            </div>

            {/* Header: Name & Flag */}
            <div className="flex justify-between items-center mb-6 pl-2 border-b border-slate-700 pb-4">
              <h2 className="text-2xl font-bold text-white tracking-wide">{country.name}</h2>
              <span className="text-3xl drop-shadow-md">{country.flag}</span>
            </div>

            {/* Section 1: Economy */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Economy</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700/50">
                  <span className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">Nominal GDP</span>
                  <span className="text-base font-bold text-emerald-400">{country.gdp}</span>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700/50">
                  <span className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">Per Capita</span>
                  <span className="text-base font-bold text-cyan-400">{country.gdpPerCapita}</span>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700/50">
                  <span className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">Debt-to-GDP</span>
                  <span className={`text-base font-bold ${parseInt(country.debt) > 100 ? 'text-rose-400' : 'text-white'}`}>{country.debt}</span>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700/50">
                  <span className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">Inflation</span>
                  <span className="text-base font-bold text-white">{country.inflation}</span>
                </div>
                {/* Annual Growth spans 2 columns at the bottom of the grid */}
                <div className="col-span-2 bg-slate-950/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">Annual Growth</span>
                  <span className={`text-base font-bold ${parseFloat(country.growth) > 2.0 ? 'text-emerald-400' : parseFloat(country.growth) > 0.5 ? 'text-blue-400' : 'text-amber-400'}`}>
                    +{country.growth}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Demographics & Complexity */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Demographics & Complexity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Population</span>
                  <span className="text-base font-semibold text-white">{country.population}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Birth Rate <span className="text-xs text-slate-400">(per 1k)</span></span>
                  <span className={`text-base font-semibold ${parseFloat(country.birthRate) < 10 ? 'text-amber-400' : 'text-white'}`}>{country.birthRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300" title="Economic Complexity Index">ECI Score</span>
                  <span className="text-base font-semibold text-blue-400">{country.eci}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300" title="Human Development Index">HDI</span>
                  <span className={`text-base font-semibold ${country.hdi >= 0.9 ? 'text-blue-400' : country.hdi >= 0.75 ? 'text-emerald-400' : 'text-amber-400'}`}>{country.hdi}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Governance */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Governance & Stability</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300" title="Wealth Inequality">Gini Coeff.</span>
                  <span className={`text-base font-semibold ${country.gini > 40 ? 'text-rose-400' : 'text-white'}`}>{country.gini}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300" title="Corruption Perceptions Index">Corruption (CPI)</span>
                  <span className={`text-base font-semibold ${country.corruption < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{country.corruption}/100</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/80">
                  <div>
                    <span className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">Democracy</span>
                    <span className="text-base font-semibold text-white">{country.democracy}/10</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">State Fragility</span>
                    <span className={`text-base font-semibold ${country.fsi > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{country.fsi}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
      <ExtendedDataList/>
      {/* Legend Footer */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs text-slate-400 text-center">
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">ECI:</strong> Higher = more complex</div>
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">HDI:</strong> Approaches 1.0</div>
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">Gini:</strong> &gt;40 = high inequality</div>
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">Corruption:</strong> 100 = clean</div>
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">Fragility:</strong> Lower = stable</div>
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">Democracy:</strong> Out of 10</div>
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">Growth:</strong> Annual % GDP</div>
        <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50"><strong className="text-slate-200">Inflation:</strong> Consumer Price Index</div>
      </div>

    </div>
  );
}