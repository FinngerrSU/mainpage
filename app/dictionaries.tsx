// 文件路径: lib/metaphysics/dictionaries.ts

// 1. 引入同级目录 types.ts 中的所有相关类型图纸
import { 
  Element, 
  ElementRelation, 
  HeavenlyStem, 
  BaseAttributes, 
  EarthlyBranch, 
  BranchAttributes, 
  PalaceNumber, 
  PalaceMapping 
} from './types'

// ==========================================
// 五行生克关系字典
// ==========================================
export const ELEMENT_RELATIONS: Record<Element, ElementRelation> = {
  '木': { generates: '火', overcomes: '土' },
  '火': { generates: '土', overcomes: '金' },
  '土': { generates: '金', overcomes: '水' },
  '金': { generates: '水', overcomes: '木' },
  '水': { generates: '木', overcomes: '火' },
};

// ==========================================
// 天干映射字典
// ==========================================
export const STEM_MAPPINGS: Record<HeavenlyStem, BaseAttributes> = {
  '甲': { yinYang: '阳', element: '木', direction: '东' },
  '乙': { yinYang: '阴', element: '木', direction: '东' },
  '丙': { yinYang: '阳', element: '火', direction: '南' },
  '丁': { yinYang: '阴', element: '火', direction: '南' },
  '戊': { yinYang: '阳', element: '土', direction: '中' },
  '己': { yinYang: '阴', element: '土', direction: '中' },
  '庚': { yinYang: '阳', element: '金', direction: '西' },
  '辛': { yinYang: '阴', element: '金', direction: '西' },
  '壬': { yinYang: '阳', element: '水', direction: '北' },
  '癸': { yinYang: '阴', element: '水', direction: '北' },
};

// ==========================================
// 地支映射字典 (包含藏干)
// ==========================================
export const BRANCH_MAPPINGS: Record<EarthlyBranch, BranchAttributes> = {
  '子': { yinYang: '阳', element: '水', direction: '北', zodiac: '鼠', hiddenStems: ['癸'] },
  '丑': { yinYang: '阴', element: '土', direction: '东北', zodiac: '牛', hiddenStems: ['己', '癸', '辛'] },
  '寅': { yinYang: '阳', element: '木', direction: '东北', zodiac: '虎', hiddenStems: ['甲', '丙', '戊'] },
  '卯': { yinYang: '阴', element: '木', direction: '东', zodiac: '兔', hiddenStems: ['乙'] },
  '辰': { yinYang: '阳', element: '土', direction: '东南', zodiac: '龙', hiddenStems: ['戊', '乙', '癸'] },
  '巳': { yinYang: '阴', element: '火', direction: '东南', zodiac: '蛇', hiddenStems: ['丙', '戊', '庚'] },
  '午': { yinYang: '阳', element: '火', direction: '南', zodiac: '马', hiddenStems: ['丁', '己'] },
  '未': { yinYang: '阴', element: '土', direction: '西南', zodiac: '羊', hiddenStems: ['己', '丁', '乙'] },
  '申': { yinYang: '阳', element: '金', direction: '西南', zodiac: '猴', hiddenStems: ['庚', '壬', '戊'] },
  '酉': { yinYang: '阴', element: '金', direction: '西', zodiac: '鸡', hiddenStems: ['辛'] },
  '戌': { yinYang: '阳', element: '土', direction: '西北', zodiac: '狗', hiddenStems: ['戊', '辛', '丁'] },
  '亥': { yinYang: '阴', element: '水', direction: '西北', zodiac: '猪', hiddenStems: ['壬', '甲'] },
};

// ==========================================
// 九宫与后天八卦映射字典
// ==========================================
export const LATER_HEAVEN_PALACES: Record<PalaceNumber, PalaceMapping> = {
  1: { trigram: '坎', element: '水', direction: '北', binary: '010' },
  2: { trigram: '坤', element: '土', direction: '西南', binary: '000' },
  3: { trigram: '震', element: '木', direction: '东', binary: '001' },
  4: { trigram: '巽', element: '木', direction: '东南', binary: '011' },
  5: { trigram: null, element: '土', direction: '中', binary: '' }, 
  6: { trigram: '乾', element: '金', direction: '西北', binary: '111' },
  7: { trigram: '兑', element: '金', direction: '西', binary: '110' },
  8: { trigram: '艮', element: '土', direction: '东北', binary: '100' },
  9: { trigram: '离', element: '火', direction: '南', binary: '101' },
};

export const HEXAGRAM_64_MAP: Record<string, { name: string; symbol: string }> = {
  // 上乾 (111)
  '111111': { name: '乾为天', symbol: '䷀' },
  '110111': { name: '天泽履', symbol: '䷉' },
  '101111': { name: '天火同人', symbol: '䷌' },
  '100111': { name: '天雷无妄', symbol: '䷘' },
  '011111': { name: '天风姤', symbol: '䷫' },
  '010111': { name: '天水讼', symbol: '䷅' },
  '001111': { name: '天山遁', symbol: '䷠' },
  '000111': { name: '天地否', symbol: '䷋' },
  // 上兑 (110)
  '111110': { name: '泽天夬', symbol: '䷪' },
  '110110': { name: '兑为泽', symbol: '䷹' },
  '101110': { name: '泽火革', symbol: '䷰' },
  '100110': { name: '泽雷随', symbol: '䷐' },
  '011110': { name: '泽风大过', symbol: '䷛' },
  '010110': { name: '泽水困', symbol: '䷮' },
  '001110': { name: '泽山咸', symbol: '䷞' },
  '000110': { name: '泽地萃', symbol: '䷬' },
  // 上离 (101)
  '111101': { name: '火天大有', symbol: '䷍' },
  '110101': { name: '火泽睽', symbol: '䷥' },
  '101101': { name: '离为火', symbol: '䷝' },
  '100101': { name: '火雷噬嗑', symbol: '䷔' },
  '011101': { name: '火风鼎', symbol: '䷱' },
  '010101': { name: '火水未济', symbol: '䷿' },
  '001101': { name: '火山旅', symbol: '䷷' },
  '000101': { name: '火地晋', symbol: '䷢' },
  // 上震 (100)
  '111100': { name: '雷天大壮', symbol: '䷡' },
  '110100': { name: '雷泽归妹', symbol: '䷵' },
  '101100': { name: '雷火丰', symbol: '䷶' },
  '100100': { name: '震为雷', symbol: '䷲' },
  '011100': { name: '雷风恒', symbol: '䷟' },
  '010100': { name: '雷水解', symbol: '䷧' },
  '001100': { name: '雷山小过', symbol: '䷽' },
  '000100': { name: '雷地豫', symbol: '䷏' },
  // 上巽 (011)
  '111011': { name: '风天小畜', symbol: '䷈' },
  '110011': { name: '风泽中孚', symbol: '䷼' },
  '101011': { name: '风火家人', symbol: '䷤' },
  '100011': { name: '风雷益', symbol: '䷩' },
  '011011': { name: '巽为风', symbol: '䷸' },
  '010011': { name: '风水涣', symbol: '䷺' },
  '001011': { name: '风山渐', symbol: '䷴' },
  '000011': { name: '风地观', symbol: '䷓' },
  // 上坎 (010)
  '111010': { name: '水天需', symbol: '䷄' },
  '110010': { name: '水泽节', symbol: '䷻' },
  '101010': { name: '水火既济', symbol: '䷾' },
  '100010': { name: '水雷屯', symbol: '䷂' },
  '011010': { name: '水风井', symbol: '䷯' },
  '010010': { name: '坎为水', symbol: '䷜' },
  '001010': { name: '水山蹇', symbol: '䷦' },
  '000010': { name: '水地比', symbol: '䷇' },
  // 上艮 (001)
  '111001': { name: '山天大畜', symbol: '䷙' },
  '110001': { name: '山泽损', symbol: '䷨' },
  '101001': { name: '山火贲', symbol: '䷕' },
  '100001': { name: '山雷颐', symbol: '䷚' },
  '011001': { name: '山风蛊', symbol: '䷑' },
  '010001': { name: '山水蒙', symbol: '䷃' },
  '001001': { name: '艮为山', symbol: '䷳' },
  '000001': { name: '山地剥', symbol: '䷖' },
  // 上坤 (000)
  '111000': { name: '地天泰', symbol: '䷊' },
  '110000': { name: '地泽临', symbol: '䷒' },
  '101000': { name: '地火明夷', symbol: '䷣' },
  '100000': { name: '地雷复', symbol: '䷗' },
  '011000': { name: '地风升', symbol: '䷭' },
  '010000': { name: '地水师', symbol: '䷆' },
  '001000': { name: '地山谦', symbol: '䷎' },
  '000000': { name: '坤为地', symbol: '䷁' },
};
// 文件路径: lib/metaphysics/dictionaries.ts

export const FUXI_60_SEQUENCE_NAMES = [
  '地雷复', '山雷颐', '水雷屯', '风雷益', '震为雷', '火雷噬嗑', '泽雷随', '天雷无妄',
  '地火明夷', '山火贲', '水火既济', '风火家人', '雷火丰', '泽火革', '天火同人', 
  '地泽临', '山泽损', '水泽节', '风泽中孚', '雷泽归妹', '火泽睽', '兑为泽', '天泽履',
  '地天泰', '山天大畜', '水天需', '风天小畜', '雷天大壮', '火天大有', '泽天夬', 
  '天风姤', '泽风大过', '火风鼎', '雷风恒', '巽为风', '水风井', '山风蛊', '地风升',
  '天水讼', '泽水困', '火水未济', '雷水解', '风水涣', '山水蒙', '地水师', 
  '天山遁', '泽山咸', '火山旅', '雷山小过', '风山渐', '水山蹇', '艮为山', '地山谦',
  '天地否', '泽地萃', '火地晋', '雷地豫', '风地观', '水地比', '山地剥'
];

export const ALL_64_HEXAGRAMS = [
  '乾为天', '坤为地', '水雷屯', '山水蒙', '水天需', '天水讼', '地水师', '水地比',
  '风天小畜', '天泽履', '地天泰', '天地否', '天火同人', '火天大有', '地山谦', '雷地豫',
  '泽雷随', '山风蛊', '地泽临', '风地观', '火雷噬嗑', '山火贲', '山地剥', '地雷复',
  '天雷无妄', '山天大畜', '山雷颐', '泽风大过', '坎为水', '离为火', '泽山咸', '雷风恒',
  '天山遁', '雷天大壮', '火地晋', '地火明夷', '风火家人', '火泽睽', '水山蹇', '雷水解',
  '山泽损', '风雷益', '泽天夬', '天风姤', '泽地萃', '地风升', '泽水困', '水风井',
  '泽火革', '火风鼎', '震为雷', '艮为山', '风山渐', '雷泽归妹', '雷火丰', '火山旅',
  '巽为风', '兑为泽', '风水涣', '水泽节', '风泽中孚', '雷山小过', '水火既济', '火水未济'
];