'use client';

import React, { useState } from 'react';
// 请确保您的引擎文件能够返回包含这些层级的趋势对象
import { calculateMacroTrend } from './Engine';
import { FUXI_60_SEQUENCE_NAMES, ALL_64_HEXAGRAMS } from './dictionaries';
import historyData from './historyData.json'


// --- 新增：60甲子数组与计算函数 ---
const YEAR_PILLARS_60 = ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉", "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未", "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳", "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯", "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"];

function getYearPillar(year: number): string {
    // 公元4年是甲子年。公元前1年是庚申年(没有公元0年)。
    const offset = year >= 1 ? year - 4 : year - 3; 
    const index = ((offset % 60) + 60) % 60; // 处理 JS 负数取模问题
    return YEAR_PILLARS_60[index];
}
// ---------------------------------

function formatYear(y: number): string {
    return y <= 0 ? `公元前${Math.abs(y - 1)}年` : `${y}年`;
}

// 模拟历史事件数据获取
function fetchHistoricalEvents(year: number): string[] {
  // 把数字年份转成字符串作为 Key 去匹配 JSON
  const yearKey = year.toString();
  
  // 检查 JSON 里有没有这一年的数据
  // 如果 TypeScript 报错 historyData 隐式具有 "any" 类型，可以把它断言为 Record<string, string[]>
  const events = (historyData as Record<string, string[]>)[yearKey];

  if (events && events.length > 0) {
    return events;
  } else {
    // 如果数据库里没有记录这一年，返回一个默认的占位提示
    return ["暂无该年份的具体历史大事件记录，待补充。"];
  }
}

// 定义搜索结果的数据结构
interface ScanResult {
    year: number;
    yearPillar: string;
    hex360: string;
    hex60: string;
    hex10: string;
    hexYearly: string;
    events: string[];
}

export default function HistoryScanner() {
    const [startYear, setStartYear] = useState<number>(-56);
    const [endYear, setEndYear] = useState<number>(2103);

    const [target60, setTarget60] = useState<string>('');
    const [target10, setTarget10] = useState<string>('');
    const [targetYearly, setTargetYearly] = useState<string>('');

    const [results, setResults] = useState<ScanResult[] | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    // 新增状态：记录当前被点击选中的年份
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [targetYearPillar, setTargetYearPillar] = useState<string>('');

    const handleScan = () => {
        if (!target60 && !target10 && !targetYearly && !targetYearPillar) { 
            alert("请至少选择一个检索条件！");
            return;
        }
        setIsScanning(true);
        setSelectedYear(null); // 每次重新扫描时，重置选中状态

        setTimeout(() => {
            const matched: ScanResult[] = [];

            for (let year = startYear; year <= endYear; year++) {
                if (year === 0) continue;

                try {
                    const trend = calculateMacroTrend(year, 7, 1, 12, 0);
                    const yearPillar = getYearPillar(year);
                    const hex360 = trend.hexagrams.cycle360?.name || "天风姤 (示例)";
                    const hex60 = trend.hexagrams.cycle60.name;
                    const hex10 = trend.hexagrams.cycle10.name;
                    const hexYearly = trend.hexagrams.yearly.name;

                    const is60Match = target60 === '' || hex60 === target60;
                    const is10Match = target10 === '' || hex10 === target10;
                    const isYearlyMatch = targetYearly === '' || hexYearly === targetYearly;
                    const isYearPillarMatch = targetYearPillar === '' || yearPillar === targetYearPillar;
                    
                    if (is60Match && is10Match && isYearlyMatch && isYearPillarMatch) {
                        
                        matched.push({
                            year,
                            yearPillar,
                            hex360,
                            hex60,
                            hex10,
                            hexYearly,
                            events: fetchHistoricalEvents(year)
                        });
                    }
                } catch (error) {
                    console.error(`年份 ${year} 计算出错:`, error);
                }
            }

            setResults(matched);
            setIsScanning(false);
        }, 100);
    };

    // 根据是否选中了特定年份，动态决定下方表格要渲染的数据
    const displayResults = selectedYear
        ? results?.filter(r => r.year === selectedYear)
        : results;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen font-sans">
            <div className="text-center mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold text-slate-800 tracking-widest mb-2">皇极经世 · 历史同态扫描仪</h1>
                <p className="text-slate-500">调用底层天文引擎，检索历史长河中的时空共振年份</p>
            </div>

            {/* 参数配置区 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h2 className="font-bold text-slate-700 mb-4 flex items-center">
                    <span className="w-2 h-5 bg-blue-600 mr-2 rounded-sm"></span> 设定检索条件 (可留空)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="text-sm text-slate-500 mb-1 font-bold">目标 60年大运卦</label>
                        <select value={target60} onChange={e => setTarget60(e.target.value)} className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50">
                            <option value="">-- 不限 --</option>
                            {ALL_64_HEXAGRAMS.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-slate-500 mb-1 font-bold">目标 10年正运卦</label>
                        <select value={target10} onChange={e => setTarget10(e.target.value)} className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50">
                            <option value="">-- 不限 --</option>
                            {ALL_64_HEXAGRAMS.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 font-bold text-slate-500">目标 流年卦</label>
                        <select value={targetYearly} onChange={e => setTargetYearly(e.target.value)} className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50">
                            <option value="">-- 不限 --</option>
                            {FUXI_60_SEQUENCE_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 font-bold text-slate-500">目标 年柱</label>
                        <select value={targetYearPillar} onChange={e => setTargetYearPillar(e.target.value)} className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50">
                            <option value="">-- 不限 --</option>
                            {YEAR_PILLARS_60.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap items-end gap-4 border-t pt-6">
                    <div className="flex flex-col">
                        <label className="text-xs text-slate-400 mb-1">起始年份</label>
                        <input type="number" value={startYear} onChange={e => setStartYear(Number(e.target.value))} className="border px-3 py-2 rounded-md w-24 text-center" />
                    </div>
                    <span className="text-slate-300 pb-2">至</span>
                    <div className="flex flex-col">
                        <label className="text-xs text-slate-400 mb-1">结束年份</label>
                        <input type="number" value={endYear} onChange={e => setEndYear(Number(e.target.value))} className="border px-3 py-2 rounded-md w-24 text-center" />
                    </div>
                    <button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="ml-auto bg-slate-800 text-white px-8 py-3 rounded-lg font-bold tracking-widest hover:bg-blue-700 transition-colors shadow-md disabled:bg-slate-400"
                    >
                        {isScanning ? '扫描中...' : '启动时空扫描'}
                    </button>
                </div>
            </div>

            {/* 结果展示区 */}
            {results && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300 mb-12">

                    {/* 上半部分：年份徽章 (始终保持在顶部，作为过滤开关) */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                    <span className="text-2xl mr-2">🎯</span> 共匹配 {results.length} 个年份
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    点击下方年份可单独查看详情，再次点击恢复显示全部。
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto p-4 border border-slate-100 rounded-md bg-slate-50/50">
                            {results.length > 0 ? (
                                results.map(row => {
                                    const isSelected = selectedYear === row.year;
                                    return (
                                        <button
                                            key={row.year}
                                            // 保持逻辑：点击选中，再点取消
                                            onClick={() => setSelectedYear(isSelected ? null : row.year)}
                                            // 提取了公共的形状和动画：全圆角(rounded-full)、弹起动画等
                                            className={`px-4 py-2 rounded-full border text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md
                        ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-700 scale-105' // 选中状态：深蓝高亮
                                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400' // 未选中：你想要的纯白胶囊+浅蓝悬浮效果
                                                }`}
                                        >
                                            {formatYear(row.year)}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="w-full text-center py-10 text-slate-400 text-sm">
                                    在所选时间段内，未发现符合当前组合的年份。
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 下半部分：数据列表/表格 */}
                    {results.length > 0 && displayResults && (
                        <div className="overflow-x-auto max-h-150 overflow-y-auto relative">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 z-10 shadow-sm border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">特定年份</th>
                                        <th className="px-6 py-4 font-bold text-red-700">干支年柱</th>
                                        <th className="px-6 py-4 font-bold text-purple-700">360年正运卦</th>
                                        <th className="px-6 py-4 font-bold text-blue-700">60年大运卦</th>
                                        <th className="px-6 py-4 font-bold text-emerald-700">10年正运卦</th>
                                        <th className="px-6 py-4 font-bold text-amber-700">单年流年卦</th>
                                        <th className="px-6 py-4 font-bold w-1/3">历史大事件映射</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {displayResults.map((row) => (
                                        <tr
                                            key={row.year}
                                            className={`transition-colors ${selectedYear === row.year ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
                                        >
                                            <td className="px-6 py-4 font-bold text-slate-800 text-base">
                                                {formatYear(row.year)}
                                            </td>
                                            <td className="px-6 py-4 text-red-700 bg-red-50/10 font-bold">{row.yearPillar}</td>
                                            <td className="px-6 py-4 text-purple-700 bg-purple-50/10">{row.hex360}</td>
                                            <td className="px-6 py-4 text-blue-700 bg-blue-50/10">{row.hex60}</td>
                                            <td className="px-6 py-4 text-emerald-700 bg-emerald-50/10">{row.hex10}</td>
                                            <td className="px-6 py-4 text-amber-700 bg-amber-50/10 font-bold">{row.hexYearly}</td>
                                            <td className="px-6 py-4 whitespace-normal text-slate-600 min-w-75">
                                                <ul className="space-y-1.5">
                                                    {row.events.map((event, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <span className="text-slate-400 mr-2 mt-0.5">•</span>
                                                            <span className="leading-snug">{event}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}