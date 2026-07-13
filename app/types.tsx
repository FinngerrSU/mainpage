// types/metaphysics.ts

export type YinYang = '阴' | '阳';

// You can use 'Element' or 'WuXing'. 'Element' is cleaner in English.
export type Element = '金' | '木' | '水' | '火' | '土';

export type Direction = 
  | '东' | '南' | '西' | '北' | '中' 
  | '东南' | '东北' | '西南' | '西北';

export type Season = '春' | '夏' | '秋' | '冬' | '四季末';

export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export type Trigram = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'; // BaGua

export type PalaceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// constants/relations.ts



export interface ElementRelation {
  generates: Element; // 生 (Sheng)
  overcomes: Element; // 克 (Ke)
}

// constants/stems-branches.ts

export interface BaseAttributes {
  yinYang: YinYang;
  element: Element;
  direction: Direction;
}



export interface BranchAttributes extends BaseAttributes {
  zodiac: string; // 生肖 (ShengXiao)
  hiddenStems: HeavenlyStem[]; // 藏干 (CangGan) - very important for BaZi
}

// constants/palaces.ts

export interface PalaceMapping {
  trigram: Trigram | null; // Center palace (5) has no primary trigram
  element: Element;
  direction: Direction;
  binary: string; // Yao lines representation (e.g., '111' for Qian)
}

