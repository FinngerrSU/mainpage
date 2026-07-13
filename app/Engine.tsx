import { Solar } from 'lunar-typescript'
import { STEM_MAPPINGS, BRANCH_MAPPINGS, HEXAGRAM_64_MAP, FUXI_60_SEQUENCE_NAMES } from './dictionaries';
import { HeavenlyStem, EarthlyBranch } from './types';

// ==============================================
// 皇极经世 - 元会运世宏观常数配置
// ==============================================
// 当前 2160年大周期起点：公元前 57 年 (天文纪年法中记为 -56)
const BASE_YEAR_2160 = -56; 
// 这 2160年的基座主卦：泽风大过 (下巽011，上兑110 -> 011110)
const BASE_HEX_2160_BINARY = '011110'; 

export interface MacroTrendResult {
  yearPillar: { stem: string; branch: string; stemElement: string; branchElement: string; fullName: string; };
  monthPillar: { stem: string; branch: string; stemElement: string; branchElement: string; fullName: string; };
  dayPillar: { stem: string; branch: string; stemElement: string; branchElement: string; fullName: string; };
  hexagrams: {
    cycle2160: { name: string; symbol: string; period: string }; // 新增：2160年周期
    cycle360: { name: string; symbol: string; period: string };  // 新增：360年周期
    cycle60: { name: string; symbol: string; period: string };
    cycle10: { name: string; symbol: string; period: string };
    yearly: { name: string; symbol: string; period: string };
  };
}

/**
 * 变爻函数：翻转 6位二进制字符串中的指定位置 (0=初爻, 5=上爻)
 */
function flipYao(binaryStr: string, yaoIndex: number): string {
  const chars = binaryStr.split('');
  chars[yaoIndex] = chars[yaoIndex] === '1' ? '0' : '1';
  return chars.join('');
}

/**
 * 年份格式化工具：将天文纪年 (含负数) 转换为友好的公元(前)显示
 * 0对应公元前1年，-1对应公元前2年，-56对应公元前57年
 */
function formatYear(y: number): string {
  return y <= 0 ? `公元前${Math.abs(y - 1)}年` : `${y}年`;
}

/**
 * 安全的取模函数 (处理负数年份查表)
 */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function calculateMacroTrend(year: number, month: number, day: number, hour: number = 0, minute: number = 0): MacroTrendResult {
  const solarDate = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunarDate = solarDate.getLunar();

  // 1. 获取基础干支 
  const yearStem = lunarDate.getYearGanExact();
  const yearBranch = lunarDate.getYearZhiExact();
  const monthStem = lunarDate.getMonthGanExact();
  const monthBranch = lunarDate.getMonthZhiExact();

  const dayStem = lunarDate.getDayGanExact();
  const dayBranch = lunarDate.getDayZhiExact();
  let effectiveYear = year;
  
  // 生成当年 7 月 1 日作为“绝对已过立春”的参照锚点
  const midYearSolar = Solar.fromYmdHms(year, 7, 1, 12, 0, 0);
  const midYearLunar = midYearSolar.getLunar();
  
  // 如果当前日期的年柱，和当年7月份的年柱不同，说明当前时间还在立春之前 (比如1月、2月初)
  if (
    yearStem !== midYearLunar.getYearGanExact() || 
    yearBranch !== midYearLunar.getYearZhiExact()
  ) {
    effectiveYear = year - 1; // 气运拨回上一年
  }
  // ==============================================
  // 2. 皇极经世：五层嵌套全息算法 (2160年 -> 360年 -> 60年 -> 10年 -> 1年)
  // ==============================================
  // 距离公元前57年的绝对偏移年数
  const offset2160 = effectiveYear - BASE_YEAR_2160; 

  // (A) 2160 年卦 (硬编码当前大运为主基座)
  const hex2160Data = HEXAGRAM_64_MAP[BASE_HEX_2160_BINARY];
  const cycle2160Hexagram = {
    name: hex2160Data.name,
    symbol: hex2160Data.symbol,
    period: `${formatYear(BASE_YEAR_2160)} - ${formatYear(BASE_YEAR_2160 + 2159)}`
  };

  // (B) 360 年运卦 (由 2160年卦变爻而来)
  const block360 = Math.floor(offset2160 / 360);
  const yao360 = mod(block360, 6);
  const hex360Binary = flipYao(BASE_HEX_2160_BINARY, yao360);
  const hex360Data = HEXAGRAM_64_MAP[hex360Binary] || { name: '未知', symbol: '?' };
  const period360Start = BASE_YEAR_2160 + block360 * 360;
  
  const cycle360Hexagram = {
    name: hex360Data.name,
    symbol: hex360Data.symbol,
    period: `${formatYear(period360Start)} - ${formatYear(period360Start + 359)}`
  };

  // (C) 60 年大运卦 (由 360年卦变爻而来)
  const offset360 = mod(offset2160, 360);
  const block60 = Math.floor(offset360 / 60);
  const hex60Binary = flipYao(hex360Binary, block60);
  const hex60Data = HEXAGRAM_64_MAP[hex60Binary] || { name: '未知', symbol: '?' };
  const period60Start = period360Start + block60 * 60;

  const cycle60Hexagram = {
    name: hex60Data.name,
    symbol: hex60Data.symbol,
    period: `${formatYear(period60Start)} - ${formatYear(period60Start + 59)}`
  };

  // (D) 10 年正运卦 (由当前的 60年卦变爻而来)
  const offset60 = mod(offset360, 60);
  const block10 = Math.floor(offset60 / 10);
  const hex10Binary = flipYao(hex60Binary, block10);
  const hex10Data = HEXAGRAM_64_MAP[hex10Binary] || { name: '未知', symbol: '?' };
  const period10Start = period60Start + block10 * 10;

  const cycle10Hexagram = {
    name: hex10Data.name,
    symbol: hex10Data.symbol,
    period: `${formatYear(period10Start)} - ${formatYear(period10Start + 9)}`
  };

  // (E) 1 年流年卦 (圆图轮转算法 + 四正卦跳跃修正)
  let startIndex = FUXI_60_SEQUENCE_NAMES.indexOf(hex60Data.name);
  
  // 修正：依照先天64卦圆图，遇乾坤坎离，直接顺延至下一卦
  if (startIndex === -1) {
    if (hex60Data.name === '乾为天') startIndex = FUXI_60_SEQUENCE_NAMES.indexOf('天风姤');
    else if (hex60Data.name === '坤为地') startIndex = FUXI_60_SEQUENCE_NAMES.indexOf('地雷复');
    else if (hex60Data.name === '离为火') startIndex = FUXI_60_SEQUENCE_NAMES.indexOf('泽火革');
    else if (hex60Data.name === '坎为水') startIndex = FUXI_60_SEQUENCE_NAMES.indexOf('山水蒙');
  }

  // 计算当前年份在圆图中的绝对推演位置
  const yearlyIndex = (startIndex + offset60) % 60;
  const yearlyName = FUXI_60_SEQUENCE_NAMES[yearlyIndex];
  
  // 查表获取字符符号
  let yearlySymbol = '?';
  for (const key in HEXAGRAM_64_MAP) {
    if (HEXAGRAM_64_MAP[key].name === yearlyName) {
      yearlySymbol = HEXAGRAM_64_MAP[key].symbol;
      break;
    }
  }

  const yearlyHexagram = {
    name: yearlyName,
    symbol: yearlySymbol,
    period: formatYear(effectiveYear)
  };

  return {
    yearPillar: {
      stem: yearStem,
      branch: yearBranch,
      stemElement: STEM_MAPPINGS[yearStem as HeavenlyStem]?.element || '未知',
      branchElement: BRANCH_MAPPINGS[yearBranch as EarthlyBranch]?.element || '未知',
      fullName: `${yearStem}${yearBranch}`
    },
    monthPillar: {
      stem: monthStem,
      branch: monthBranch,
      stemElement: STEM_MAPPINGS[monthStem as HeavenlyStem]?.element || '未知',
      branchElement: BRANCH_MAPPINGS[monthBranch as EarthlyBranch]?.element || '未知',
      fullName: `${monthStem}${monthBranch}`
    },
    dayPillar: {
      stem: dayStem,
      branch: dayBranch,
      stemElement: STEM_MAPPINGS[dayStem as HeavenlyStem]?.element || '未知',
      branchElement: BRANCH_MAPPINGS[dayBranch as EarthlyBranch]?.element || '未知',
      fullName: `${dayStem}${dayBranch}`
    },
    hexagrams: {
      cycle2160: cycle2160Hexagram,
      cycle360: cycle360Hexagram,
      cycle60: cycle60Hexagram,
      cycle10: cycle10Hexagram,
      yearly: yearlyHexagram
    }
  };
}