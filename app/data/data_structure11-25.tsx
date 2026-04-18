// 1. BASE DATA (Update only when rankings/countries change)
export const baseCountries: Record<string, any> = [
  { rank: 11, name: "Brazil", flag: "🇧🇷" },
  { rank: 12, name: "Spain", flag: "🇪🇸" },
  { rank: 13, name: "Mexico", flag: "🇲🇽" },
  { rank: 14, name: "South Korea", flag: "🇰🇷" },
  { rank: 15, name: "Australia", flag: "🇦🇺" },
  { rank: 16, name: "Türkiye", flag: "🇹🇷" },
  { rank: 17, name: "Indonesia", flag: "🇮🇩" },
  { rank: 18, name: "The Netherlands", flag: "🇳🇱" },
  { rank: 19, name: "Saudi Arabia", flag: "🇸🇦" },
  { rank: 20, name: "Poland", flag: "🇵🇱" },
  { rank: 21, name: "Switzerland", flag: "🇨🇭" },
  { rank: 22, name: "Taiwan", flag: "🇹🇼" },
  { rank: 23, name: "Belgium", flag: "🇧🇪" },
  { rank: 24, name: "Ireland", flag: "🇮🇪" },
  { rank: 25, name: "Argentina", flag: "🇦🇷" }
];

// 2. ECONOMY DATA (e.g., IMF / World Bank)
export const economyData: Record<string, any> = {
  "Brazil": { gdp: "$2.26T", gdpPerCapita: "$10,580", growth: "2.4%", inflation: "4.14%" },
  "Spain": { gdp: "$1.89T", gdpPerCapita: "$38,040", growth: "2.9%", inflation: "3.3%" },
  "Mexico": { gdp: "$1.86T", gdpPerCapita: "$13,970", growth: "1.0%", inflation: "4.59%" },
  "South Korea": { gdp: "$1.86T", gdpPerCapita: "$35,960", growth: "0.9%", inflation: "2.2%" },
  "Australia": { gdp: "$1.83T", gdpPerCapita: "$65,950", growth: "1.8%", inflation: "3.7%" },
  "Türkiye": { gdp: "$1.57T", gdpPerCapita: "$18,200", growth: "3.5%", inflation: "30.87%" },
  "Indonesia": { gdp: "$1.44T", gdpPerCapita: "$5,070", growth: "4.9%", inflation: "3.48%" },
  "The Netherlands": { gdp: "$1.32T", gdpPerCapita: "$73,170", growth: "1.4%", inflation: "2.7%" },
  "Saudi Arabia": { gdp: "$1.27T", gdpPerCapita: "$35,230", growth: "4.0%", inflation: "1.7%" },
  "Poland": { gdp: "$1.04T", gdpPerCapita: "$28,480", growth: "3.2%", inflation: "3.0%" }, 
  "Switzerland": { gdp: "$1.00T", gdpPerCapita: "$111,050", growth: "0.9%", inflation: "0.3%" },
  "Taiwan": { gdp: "$884.39B", gdpPerCapita: "$37,830", growth: "3.7%", inflation: "1.2%" }, 
  "Belgium": { gdp: "$716.98B", gdpPerCapita: "$60,420", growth: "1.1%", inflation: "1.65%" }, 
  "Ireland": { gdp: "$708.77B", gdpPerCapita: "$129,130", growth: "9.1%", inflation: "3.6%" }, 
  "Argentina": { gdp: "$683.37B", gdpPerCapita: "$14,360", growth: "4.5%", inflation: "33.1%" }
};

// 3. POPULATION DATA (e.g., UN / World Bank)
export const populationData: Record<string, any> = {
  "Brazil": { population: "216M", birthRate: "13.5" },
  "Spain": { population: "48M", birthRate: "7.1" },
  "Mexico": { population: "128M", birthRate: "14.5" },
  "South Korea": { population: "51M", birthRate: "0.7" },
  "Australia": { population: "26M", birthRate: "12.0" },
  "Türkiye": { population: "85M", birthRate: "14.5" },
  "Indonesia": { population: "278M", birthRate: "16.0" },
  "The Netherlands": { population: "17.7M", birthRate: "10.0" },
  "Saudi Arabia": { population: "36M", birthRate: "17.0" },
  "Poland": { population: "37M", birthRate: "8.0" },
  "Switzerland": { population: "8.8M", birthRate: "9.5" },
  "Taiwan": { population: "23.5M", birthRate: "7.5" },
  "Belgium": { population: "11.6M", birthRate: "10.0" },
  "Ireland": { population: "5.2M", birthRate: "11.5" },
  "Argentina": { population: "46M", birthRate: "13.5" }
};

// 4. DEVELOPMENT DATA (e.g., Harvard Growth Lab / UNDP)
export const developmentData: Record<string, any> = {
  "Brazil": { eci: "0.37", hdi: 0.786 },
  "Spain": { eci: "0.82", hdi: 0.918 },
  "Mexico": { eci: "0.94", hdi: 0.789 },
  "South Korea": { eci: "1.56", hdi: 0.937 },
  "Australia": { eci: "0.12", hdi: 0.958 },
  "Türkiye": { eci: "0.70", hdi: 0.853 }, // Mapped from "Turkey"
  "Indonesia": { eci: "0.23", hdi: 0.728 },
  "The Netherlands": { eci: "0.95", hdi: 0.955 }, // Mapped from "Netherlands"
  "Saudi Arabia": { eci: "0.50", hdi: 0.9 },
  "Poland": { eci: "0.99", hdi: 0.906 },
  "Switzerland": { eci: "1.58", hdi: 0.97 },
  "Taiwan": { eci: "1.57", hdi: 0.936 }, 
  "Belgium": { eci: "0.99", hdi: 0.951 },
  "Ireland": { eci: "1.18", hdi: 0.949 },
  "Argentina": { eci: "-0.01", hdi: 0.865 }
};
// 5. BURDEN DATA (e.g., World Bank)
export const burdenData: Record<string, any> = {
  "Brazil": { debt: "76.5%", gini: 51.6 },
  "Spain": { debt: "101%", gini: 33.4 }, 
  "Mexico": { debt: "45.4%", gini: 43.5 },
  "South Korea": { debt: "46.8%", gini: 32.9 },
  "Australia": { debt: "43.8%", gini: 33.8 },
  "Türkiye": { debt: "24.7%", gini: 44.5 },
  "Indonesia": { debt: "38.8%", gini: 34.9 },
  "The Netherlands": { debt: "43.7%", gini: 25.7 }, 
  "Saudi Arabia": { debt: "31.7%", gini: 45.6 }, 
  "Poland": { debt: "59.7%", gini: 28.5 }, 
  "Switzerland": { debt: "15.5%", gini: 33.8 }, 
  "Taiwan": { debt: "20.91%", gini: 34.1 }, 
  "Belgium": { debt: "104%", gini: 26.8 }, 
  "Ireland": { debt: "32.9%", gini: 29 }, 
  "Argentina": { debt: "78.4%", gini: 42.4 }
};


export const politicsData: Record<string, any> = {
  "Brazil": { corruption: 36, democracy: 6.76, fsi: 70.3 },
  "Spain": { corruption: 60, democracy: 8.20, fsi: 44.0 },
  "Mexico": { corruption: 31, democracy: 5.40, fsi: 69 }, 
  "South Korea": { corruption: 63, democracy: 7.75, fsi: 29.8 }, 
  "Australia": { corruption: 75, democracy: 8.85, fsi: 19.6 }, 
  "Türkiye": { corruption: 34, democracy: 4.26, fsi: 84 }, 
  "Indonesia": { corruption: 34, democracy: 6.37, fsi: 63.7 }, 
  "The Netherlands": { corruption: 79, democracy: 8.93, fsi: 19.5 }, 
  "Saudi Arabia": { corruption: 52, democracy: 2.08, fsi: 63.2 }, 
  "Poland": { corruption: 54, democracy: 7.65, fsi: 41.7 }, 
  "Switzerland": { corruption: 82, democracy: 9.32, fsi: 16.2 }, 
  "Taiwan": { corruption: 67, democracy: 8.78, fsi: 25.0 },
  "Belgium": { corruption: 73, democracy: 7.77, fsi: 30.3 }, 
  "Ireland": { corruption: 77, democracy: 9.33, fsi: 18.6 },
  "Argentina": { corruption: 37, democracy: 6.89, fsi: 44.2 }  
};