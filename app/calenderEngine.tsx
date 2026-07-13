import { Solar } from 'lunar-typescript';
import { STEM_MAPPINGS, BRANCH_MAPPINGS } from './dictionaries';
import { HeavenlyStem, EarthlyBranch } from './types';

export interface DailyPillarInfo {
  day: number;
  stem: string;
  branch: string;
  stemElement: string;
  branchElement: string;
}

export interface MonthCalendarData {
  firstDayOfWeek: number; // 0代表周日，1-6代表周一到周六，用于前端日历对齐
  days: DailyPillarInfo[];
}

export function getMonthDailyPillars(year: number, month: number): MonthCalendarData {
  const days: DailyPillarInfo[] = [];
  
  // 利用原生 JS 获取该月的总天数 (month 是 1-12，new Date 的第0天即上个月最后一天)
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // 获取该月1号是星期几，用于 UI 占位空白
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  for (let d = 1; d <= daysInMonth; d++) {
    // 设定每天中午 12:00，避免早晚子时交界的干支争议
    const solarDate = Solar.fromYmdHms(year, month, d, 12, 0, 0);
    const lunarDate = solarDate.getLunar();
    
    const dayStem = lunarDate.getDayGanExact();
    const dayBranch = lunarDate.getDayZhiExact();

    days.push({
      day: d,
      stem: dayStem,
      branch: dayBranch,
      stemElement: STEM_MAPPINGS[dayStem as HeavenlyStem]?.element || '未知',
      branchElement: BRANCH_MAPPINGS[dayBranch as EarthlyBranch]?.element || '未知',
    });
  }

  return { firstDayOfWeek, days };
}