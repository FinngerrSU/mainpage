'use client';

import React, { useState, useMemo, useEffect } from 'react';
// 假设您的 engine 文件名为 engine.ts，且在同级目录
import { calculateMacroTrend } from './Engine'; 
import CalendarView from './calenderView';
// ==========================================
// 1. 底层 UI 配置字典
// ==========================================
const ELEMENT_COLORS: Record<string, string> = {
  '木': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  '火': 'bg-red-100 text-red-800 border-red-300',
  // 👇 修改为 Orange
  '土': 'bg-orange-100 text-orange-800 border-orange-300',
  '金': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  '水': 'bg-blue-100 text-blue-800 border-blue-300',
  '未知': 'bg-slate-100 text-slate-800 border-slate-300'
};

const ELEMENT_BG_COLORS = {
  light: { 
    '木': '#a7f3d0', 
    '火': '#fecaca', 
    // 👇 orange-200
    '土': '#fed7aa', 
    '金': '#fef08a', 
    '水': '#bfdbfe', 
    '未知': '#e2e8f0' 
  },
  dark: { 
    '木': '#34d399', 
    '火': '#f87171', 
    // 👇 orange-400
    '土': '#fb923c', 
    '金': '#facc15', 
    '水': '#60a5fa', 
    '未知': '#94a3b8' 
  }
};

// 64卦 -> [上卦五行, 下卦五行] 映射字典
const GUA_ELEMENTS: Record<string, [string, string]> = {
  '乾': ['金', '金'], '坤': ['土', '土'], '屯': ['水', '木'], '蒙': ['土', '水'],
  '需': ['水', '金'], '讼': ['金', '水'], '师': ['土', '水'], '比': ['水', '土'],
  '小畜': ['木', '金'], '履': ['金', '金'], '泰': ['土', '金'], '否': ['金', '土'],
  '同人': ['金', '火'], '大有': ['火', '金'], '谦': ['土', '土'], '豫': ['木', '土'],
  '随': ['金', '木'], '蛊': ['土', '木'], '临': ['土', '金'], '观': ['木', '土'],
  '噬嗑': ['火', '木'], '贲': ['土', '火'], '剥': ['土', '土'], '复': ['土', '木'],
  '无妄': ['金', '木'], '大畜': ['土', '金'], '颐': ['土', '木'], '大过': ['金', '木'],
  '坎': ['水', '水'], '离': ['火', '火'], '咸': ['金', '土'], '恒': ['木', '木'],
  '遁': ['金', '土'], '大壮': ['木', '金'], '晋': ['火', '土'], '明夷': ['土', '火'],
  '家人': ['木', '火'], '睽': ['火', '金'], '蹇': ['水', '土'], '解': ['木', '水'],
  '损': ['土', '金'], '益': ['木', '木'], '夬': ['金', '金'], '姤': ['金', '木'],
  '萃': ['金', '土'], '升': ['土', '木'], '困': ['金', '水'], '井': ['水', '木'],
  '革': ['金', '火'], '鼎': ['火', '木'], '震': ['木', '木'], '艮': ['土', '土'],
  '渐': ['木', '土'], '归妹': ['木', '金'], '丰': ['木', '火'], '旅': ['火', '土'],
  '巽': ['木', '木'], '兑': ['金', '金'], '涣': ['木', '水'], '节': ['水', '金'],
  '中孚': ['木', '金'], '小过': ['木', '土'], '既济': ['水', '火'], '未济': ['火', '水']
};
// ==========================================
// 2. 主 UI 组件 (Main Component)
// ==========================================
export default function MacroDashboard() {
  // 状态管理：初始化为 2026年2月4日 04:02（立春交节时刻）
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(2);
  const [day, setDay] = useState<number>(4); 
  const [hour, setHour] = useState<number>(4);     // 新增：小时状态
  const [minute, setMinute] = useState<number>(2); // 新增：分钟状态

  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1); // JS 的月份索引是 0-11，需要 +1
    setDay(now.getDate());
    setHour(now.getHours());
    setMinute(now.getMinutes());
  }, []);
  // 核心测算逻辑 (将时、分加入依赖数组，调用更新后的引擎)
  const calculationData = useMemo(() => {
    try {
      return calculateMacroTrend(year, month, day, hour, minute);
    } catch (error) {
      console.error("排盘引擎计算错误:", error);
      return null;
    }
  }, [year, month, day, hour, minute]);

  if (!calculationData) {
    return <div className="text-center p-10 text-red-500">计算引擎初始化失败或输入日期有误。</div>;
  }

  const { yearPillar, monthPillar, dayPillar, hexagrams } = calculationData;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center tracking-widest border-b pb-4">
        皇极经世·宏观周期趋势测算台
      </h1>

          {/* 控制面板 (Inputs) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4 items-center justify-center">
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-1 font-medium">选择年份 (含负数)</label>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 w-32 text-lg text-center font-bold text-slate-700"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-1 font-medium">选择月份</label>
          <select 
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 w-24 text-lg text-center font-bold text-slate-700"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m} 月</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-1 font-medium">选择日期</label>
          <select 
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 w-24 text-lg text-center font-bold text-slate-700"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d} 日</option>
            ))}
          </select>
        </div>
        {/* 新增控制项：小时 */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-1 font-medium">选择小时</label>
          <select 
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 w-24 text-lg text-center font-bold text-slate-700"
          >
            {Array.from({ length: 24 }, (_, i) => i).map(h => (
              <option key={h} value={h}>{h} 时</option>
            ))}
          </select>
        </div>
        {/* 新增控制项：分钟 */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-1 font-medium">选择分钟</label>
          <select 
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 w-24 text-lg text-center font-bold text-slate-700"
          >
            {Array.from({ length: 60 }, (_, i) => i).map(m => (
              <option key={m} value={m}>{m} 分</option>
            ))}
          </select>
        </div>
      </div>

      {/* 板块 1: 时空值年卦象 (五层嵌套) */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
          <span className="w-2 h-6 bg-slate-800 mr-3 rounded-sm"></span>
          皇极经世·全息周期卦象
        </h2>
        
        {/* 上层宏观周期 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <HexagramCard 
            title="2160年 会卦" 
            period={hexagrams.cycle2160.period} 
            guaName={hexagrams.cycle2160.name} 
            symbol={hexagrams.cycle2160.symbol} 
            theme="macro"
          />
          <HexagramCard 
            title="360年 运卦" 
            period={hexagrams.cycle360.period} 
            guaName={hexagrams.cycle360.name} 
            symbol={hexagrams.cycle360.symbol} 
            theme="macro"
          />
        </div>

        {/* 中微观周期 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HexagramCard 
            title="60年 世卦" 
            period={hexagrams.cycle60.period} 
            guaName={hexagrams.cycle60.name} 
            symbol={hexagrams.cycle60.symbol} 
          />
          <HexagramCard 
            title="10年 正卦" 
            period={hexagrams.cycle10.period} 
            guaName={hexagrams.cycle10.name} 
            symbol={hexagrams.cycle10.symbol} 
          />
          <HexagramCard 
            title="当年 流年卦" 
            period={hexagrams.yearly.period} 
            guaName={hexagrams.yearly.name} 
            symbol={hexagrams.yearly.symbol} 
            theme="highlight"
          />
        </div>
      </section>

      {/* 板块 2: 干支五行基本面 */}
      {/* 板块 2: 干支五行基本面 */}
      <section>
        <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
          <span className="w-2 h-6 bg-slate-800 mr-3 rounded-sm"></span>
          干支五行基本面 (底层环境)
        </h2>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-12 justify-center items-center">
          {/* 年柱 */}
          <div className="text-center">
            <h3 className="text-slate-600 font-bold mb-4 tracking-widest text-sm">【太岁年柱】</h3>
            <div className="flex gap-4">
              <ElementPill char={yearPillar.stem} element={yearPillar.stemElement} />
              <ElementPill char={yearPillar.branch} element={yearPillar.branchElement} />
            </div>
            <div className="mt-4 text-sm text-slate-500 font-medium">({yearPillar.fullName})</div>
          </div>

          <div className="hidden md:block w-px h-32 bg-slate-200"></div>

          {/* 月柱 */}
          <div className="text-center">
            <h3 className="text-slate-600 font-bold mb-4 tracking-widest text-sm">【月建月柱】</h3>
            <div className="flex gap-4">
              <ElementPill char={monthPillar.stem} element={monthPillar.stemElement} />
              <ElementPill char={monthPillar.branch} element={monthPillar.branchElement} />
            </div>
            <div className="mt-4 text-sm text-slate-500 font-medium">({monthPillar.fullName})</div>
          </div>

          {/* 新增：竖向分割线 */}
          <div className="hidden md:block w-px h-32 bg-slate-200"></div>

          {/* 新增：日柱 */}
          <div className="text-center">
            <h3 className="text-slate-600 font-bold mb-4 tracking-widest text-sm">【日辰日柱】</h3>
            <div className="flex gap-4">
              <ElementPill char={dayPillar.stem} element={dayPillar.stemElement} />
              <ElementPill char={dayPillar.branch} element={dayPillar.branchElement} />
            </div>
            <div className="mt-4 text-sm text-slate-500 font-medium">({dayPillar.fullName})</div>
          </div>

        </div>
      </section>
      <CalendarView year={year} month={month} selectedDay={day}/>
    </div>
  );
}

// ==========================================
// 3. 辅助展示组件 (Sub-components)
// ==========================================
interface HexagramCardProps {
  title: string;
  period: string;
  guaName: string;
  symbol: string;
  theme?: 'default' | 'highlight' | 'macro';
}

function HexagramCard({ title, period, guaName, symbol, theme = 'default' }: HexagramCardProps) {
  // 1. 匹配当前卦象的上卦和下卦五行
  const guaKey = Object.keys(GUA_ELEMENTS).find(k => guaName.includes(k)) || '未知';
  const [topElement, bottomElement] = GUA_ELEMENTS[guaKey] || ['未知', '未知'];

  // 2. 根据主题选择深浅色系
  const isDark = theme === 'highlight';
  const colorSet = isDark ? ELEMENT_BG_COLORS.dark : ELEMENT_BG_COLORS.light;
  
  // 3. 获取上下半区的独立颜色
  const topColor = colorSet[topElement as keyof typeof colorSet] || colorSet['未知'];
  const bottomColor = colorSet[bottomElement as keyof typeof colorSet] || colorSet['未知'];

  // 4. 配置基础样式 (新增 relative 和 overflow-hidden)
  let containerClass = "relative p-6 rounded-xl border flex flex-col items-center justify-center transition-all overflow-hidden ";
  
  if (theme === 'highlight') {
    containerClass += 'shadow-lg border-slate-700 scale-105';
  } else if (theme === 'macro') {
    containerClass += 'text-slate-700 border-slate-300 shadow-inner';
  } else {
    containerClass += 'text-slate-800 border-slate-200 shadow-sm';
  }

  return (
    <div 
      className={containerClass}
      style={{ 
        // 核心修改：使用 linear-gradient 实现50%硬切割双色背景
        background: `linear-gradient(to bottom, ${topColor} 50%, ${bottomColor} 50%)` 
      }}
    >
      {/* 新增：左侧上下角落淡入显示五行属性 */}
      <div className="absolute top-3 left-3 text-xs font-bold opacity-30 select-none">{topElement}</div>
      <div className="absolute bottom-3 left-3 text-xs font-bold opacity-30 select-none">{bottomElement}</div>

      {/* 修改：所有文字层增加 z-10 确保在背景之上，并调整了文字阴影使其更清晰 */}
      <div className={`text-sm mb-1 z-10 ${theme === 'highlight' ? 'opacity-90' : 'font-bold text-slate-600'}`}>
        {title}
      </div>
      <div className={`text-xs mb-4 z-10 ${theme === 'highlight' ? 'opacity-80' : 'text-slate-500'}`}>
        {period}
      </div>
      <div className="text-5xl tracking-widest font-serif mb-3 leading-none z-10 drop-shadow-md">{symbol}</div>
      <div className="text-2xl font-bold tracking-widest z-10 drop-shadow-sm">{guaName}</div>
    </div>
  );
}

function ElementPill({ char, element }: { char: string; element: string }) {
  const colorClass = ELEMENT_COLORS[element] || ELEMENT_COLORS['未知'];
  return (
    <div className={`w-16 h-24 flex flex-col items-center justify-center rounded border-2 shadow-sm ${colorClass}`}>
      <span className="text-3xl font-bold font-serif mb-1">{char}</span>
      <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 font-bold">{element}</span>
    </div>
  );
}