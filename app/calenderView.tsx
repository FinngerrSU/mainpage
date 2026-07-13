import React, { useMemo } from 'react';
import { getMonthDailyPillars } from './calenderEngine';

interface CalendarViewProps {
  year: number;
  month: number;
  selectedDay: number; // <--- 新增：接收选中的天数
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const elementColors: Record<string, string> = {
  '木': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '火': 'text-red-600 bg-red-50 border-red-200',
  // 👇 改为橙色
  '土': 'text-orange-600 bg-orange-50 border-orange-200',
  '金': 'text-yellow-600 bg-yellow-50 border-yellow-200',
  '水': 'text-blue-600 bg-blue-50 border-blue-200',
  '未知': 'text-slate-500 bg-slate-50 border-slate-200'
};

export default function CalendarView({ year, month, selectedDay }: CalendarViewProps) {
  const calendarData = useMemo(() => getMonthDailyPillars(year, month), [year, month]);
  const emptyCells = Array.from({ length: calendarData.firstDayOfWeek }, (_, i) => i);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-8">
      <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center justify-center tracking-widest">
        {year} 年 {month} 月 · 日柱流转
      </h2>

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center font-bold text-slate-700 pb-2 border-b text-sm">
            周{day}
          </div>
        ))}

        {emptyCells.map(cell => (
          <div key={`empty-${cell}`} className="p-2 min-h-20 bg-slate-50/50 rounded-lg"></div>
        ))}

        {calendarData.days.map((info) => {
          // 判断当前渲染的天数是否是控制面板选中的那一天
          const isSelected = info.day === selectedDay;

          return (
            <div 
              key={info.day} 
              // 根据是否选中，动态切换样式（高亮时：加深边框，蓝色底色，轻微放大，加上阴影）
              className={`flex flex-col items-center justify-center p-2 min-h-20 rounded-lg transition-all cursor-default ${
                isSelected 
                  ? 'border-2 border-indigo-400 bg-indigo-50/50 shadow-md transform scale-105 z-10' 
                  : 'border border-slate-100 hover:shadow-md'
              }`}
            >
              <span className={`text-sm font-bold mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>
                {info.day}
              </span>
              <div className="flex gap-1">
                <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${elementColors[info.stemElement] || elementColors['未知']}`}>
                  {info.stem}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${elementColors[info.branchElement] || elementColors['未知']}`}>
                  {info.branch}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}