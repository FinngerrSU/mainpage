import { baseCountries,economyData,populationData,burdenData,developmentData,politicsData} from "./data_structure11-25";



export default function ExtendedDataList() {
  const extendedData: any[] = baseCountries.map((country: any) => {
    const name = country.name as string;
    
    // Merge base data with all specific properties from other objects
    return {
      ...country,
      ...(economyData[name] || {}),
      ...(populationData[name] || {}),
      ...(developmentData[name] || {}),
      ...(burdenData[name] || {}),
      ...(politicsData[name] || {})
    };
  });
  return (
    <div className="w-full font-sans mt-16">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-6 px-4 md:px-0 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Ranks 11–25</h2>
       
      </div>

      {/* Main Data Table */}
      <div className="max-w-7xl mx-auto bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-lg">
      <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar-track]:rounded-b-xl [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600 transition-colors">
          <table className="w-full text-center text-sm border-collapse">
            
            {/* Table Headers */}
            <thead className="bg-slate-950 border-b border-slate-700 text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap sticky left-0 bg-slate-950 z-10 border-r border-slate-800">Country</th>
                <th className="p-4 whitespace-nowrap">Nominal GDP</th>
                <th className="p-4 whitespace-nowrap">PerCapita</th>
                <th className="p-4 whitespace-nowrap">GDP Growth</th>
                <th className="p-4 whitespace-nowrap">Debt</th>
                <th className="p-4 whitespace-nowrap">Inflation</th>
                <th className="p-4 whitespace-nowrap">Population</th>
                <th className="p-4 whitespace-nowrap">Birth Rate</th>
                <th className="p-4 whitespace-nowrap" title="Economic Complexity Index">ECI</th>
                <th className="p-4 whitespace-nowrap" title="Human Development Index">HDI</th>
                <th className="p-4 whitespace-nowrap" title="Gini Coefficient">Gini</th>
                <th className="p-4 whitespace-nowrap" title="Corruption Perceptions Index">Corrupt (CPI)</th>
                <th className="p-4 whitespace-nowrap" title="Democracy Index">Democracy</th>
                <th className="p-4 whitespace-nowrap" title="Fragile States Index">Fragility</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/50">
              {extendedData.map((country) => (
                <tr 
                  key={country.rank} 
                  className="hover:bg-slate-800/80 transition-colors duration-150 group"
                >
                  {/* Sticky Country Column */}
                  <td className="p-4 font-medium text-white flex items-center gap-3 whitespace-nowrap sticky left-0 bg-slate-900/90 group-hover:bg-slate-800 border-r border-slate-800 z-10">
                    <span className="text-indigo-400 font-bold text-xs w-5">{country.rank}</span>
                    <span className="text-xl drop-shadow-sm">{country.flag}</span>
                    {country.name}
                  </td>
                  
                  {/* Economy */}
                  <td className="p-4 whitespace-nowrap text-emerald-400 font-medium">{country.gdp}</td>
                  <td className="p-4 whitespace-nowrap text-cyan-400 font-medium">{country.gdpPerCapita}</td>
                  <td className={`p-4 whitespace-nowrap font-medium ${parseFloat(country.growth) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{country.growth}</td>
                  <td className={`p-4 whitespace-nowrap font-medium ${parseInt(country.debt) > 100 ? 'text-rose-400' : 'text-slate-300'}`}>{country.debt}</td>
                  <td className={`p-4 whitespace-nowrap font-medium ${parseFloat(country.inflation) > 10 ? 'text-rose-400' : 'text-slate-300'}`}>{country.inflation}</td>
                  
                  {/* Demographics & Output */}
                  <td className="p-4 whitespace-nowrap text-slate-200">{country.population}</td>
                  <td className={`p-4 whitespace-nowrap font-medium ${parseFloat(country.birthRate) < 10 ? 'text-amber-400' : 'text-slate-300'}`}>{country.birthRate}</td>
                  <td className="p-4 whitespace-nowrap text-blue-400 font-medium">{country.eci}</td>
                  <td className={`p-4 whitespace-nowrap font-bold ${country.hdi >= 0.9 ? 'text-blue-400' : country.hdi >= 0.75 ? 'text-emerald-400' : 'text-amber-400'}`}>{country.hdi}</td>
                  
                  {/* Governance */}
                  <td className={`p-4 whitespace-nowrap font-medium ${country.gini > 40 ? 'text-rose-400' : 'text-slate-300'}`}>{country.gini}</td>
                  <td className={`p-4 whitespace-nowrap font-medium ${country.corruption < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{country.corruption}</td>
                  <td className="p-4 whitespace-nowrap text-slate-300 font-medium">{country.democracy}</td>
                  <td className={`p-4 whitespace-nowrap font-medium ${country.fsi > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{country.fsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}