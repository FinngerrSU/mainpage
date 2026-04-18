// 1. BASE DATA (Top 10)
export const baseCountriesTop10: Record<string, any> = [
  { rank: 1, name: "United States", flag: "🇺🇸" },
  { rank: 2, name: "China", flag: "🇨🇳" },
  { rank: 3, name: "Germany", flag: "🇩🇪" },
  { rank: 4, name: "Japan", flag: "🇯🇵" },
  { rank: 5, name: "India", flag: "🇮🇳" },
  { rank: 6, name: "United Kingdom", flag: "🇬🇧" },
  { rank: 7, name: "France", flag: "🇫🇷" },
  { rank: 8, name: "Italy", flag: "🇮🇹" },
  { rank: 9, name: "Russia", flag: "🇷🇺" },
  { rank: 10, name: "Canada", flag: "🇨🇦" }
];

// 2. ECONOMY DATA
export const economyDataTop10: Record<string, any> = {
  "United States": { gdp: "$30.62T", gdpPerCapita: "$89,600", growth: "2.0%", inflation: "3.3%" },
  "China": { gdp: "$19.40T", gdpPerCapita: "$37,830", growth: "4.8%", inflation: "1.0%" },
  "Germany": { gdp: "$5.01T", gdpPerCapita: "$59,930", growth: "0.2%", inflation: "2.7%" },
  "Japan": { gdp: "$4.28T", gdpPerCapita: "$34,710", growth: "1.1%", inflation: "1.3%" },
  "India": { gdp: "$4.13T", gdpPerCapita: "$2,820", growth: "6.6%", inflation: "3.4%" },
  "United Kingdom": { gdp: "$3.96T", gdpPerCapita: "$56,660", growth: "1.3%", inflation: "3.0%" },
  "France": { gdp: "$3.36T", gdpPerCapita: "$48,980", growth: "0.7%", inflation: "1.7%" },
  "Italy": { gdp: "$2.54T", gdpPerCapita: "$43,160", growth: "0.5%", inflation: "1.7%" },
  "Russia": { gdp: "$2.54T", gdpPerCapita: "$17,450", growth: "0.6%", inflation: "5.9%" },
  "Canada": { gdp: "$2.28T", gdpPerCapita: "$54,930", growth: "1.2%", inflation: "1.8%" }
};

// 3. POPULATION DATA
export const populationDataTop10: Record<string, any> = {
  "United States": { population: "335M", birthRate: "10.55" },
  "China": { population: "1.41B", birthRate: "6.15" },
  "Germany": { population: "83.3M", birthRate: "8.8" },
  "Japan": { population: "124M", birthRate: "6.4" },
  "India": { population: "1.43B", birthRate: "15.76" },
  "United Kingdom": { population: "67.8M", birthRate: "10.0" },
  "France": { population: "68.1M", birthRate: "10.4" },
  "Italy": { population: "58.7M", birthRate: "6.5" },
  "Russia": { population: "143M", birthRate: "8.8" },
  "Canada": { population: "39M", birthRate: "9" }
};

// 4. DEVELOPMENT DATA
export const developmentDataTop10: Record<string, any> = {
  "United States": { eci: "1.11", hdi: 0.938 },
  "China": { eci: "1.26", hdi: 0.797 },
  "Germany": { eci: "1.36", hdi: 0.959 },
  "Japan": { eci: "1.69", hdi: 0.925 },
  "India": { eci: "0.72", hdi: 0.685 },
  "United Kingdom": { eci: "1.25", hdi: 0.946 },
  "France": { eci: "1.09", hdi: 0.92 },
  "Italy": { eci: "1.12", hdi: 0.915 },
  "Russia": { eci: "0.25", hdi: 0.832 },
  "Canada": { eci: "0.79", hdi: 0.939 }
};
// 5. BURDEN DATA
export const burdenDataTop10: Record<string, any> = {
  "United States": { debt: "123%", gini: 41.8 },
  "China": { debt: "88.3%", gini: 36.0 },
  "Germany": { debt: "62.2%", gini: 32.4 },
  "Japan": { debt: "237%", gini: 32.3 },
  "India": { debt: "81.92%", gini: 25.5 },
  "United Kingdom": { debt: "94.3%", gini: 32.4 },
  "France": { debt: "116%", gini: 31.5 },
  "Italy": { debt: "137%", gini: 34.3 },
  "Russia": { debt: "18.3%", gini: 33.0 },
  "Canada": { debt: "111%", gini: 31.7 }
};
// 6. POLITICS DATA
export const politicsDataTop10: Record<string, any> = {
  "United States": { corruption: 64, democracy: 7.65, fsi: 44.5 }, // Updated
  "China": { corruption: 43, democracy: 2.24, fsi: 64.4 }, 
  "Germany": { corruption: 77, democracy: 8.73, fsi: 24.0 },
  "Japan": { corruption: 71, democracy: 8.85, fsi: 30.2 }, // Updated
  "India": { corruption: 39, democracy: 6.96, fsi: 72.3 },
  "United Kingdom": { corruption: 70, democracy: 8.34, fsi: 40.8 }, // Updated
  "France": { corruption: 66, democracy: 8.05, fsi: 28.3 }, // Updated
  "Italy": { corruption: 53, democracy: 7.58, fsi: 41.1 }, // Updated
  "Russia": { corruption: 22, democracy: 2.03, fsi: 81.6 }, 
  "Canada": { corruption: 75, democracy: 9.08, fsi: 18.6 }  // Updated
};