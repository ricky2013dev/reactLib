import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, Smartphone, TrendingUp, MapPin, Globe } from 'lucide-react';

// 다국어 텍스트
const translations = {
  en: {
    title: "US Smartphone Market Analysis Dashboard",
    subtitle: "Analysis of monthly sales by major mobile companies by state",
    selectMonth: "Select Month",
    selectState: "Select State",
    selectCompany: "Select Company",
    allMonths: "All Months",
    allStates: "All States", 
    allCompanies: "All Companies",
    totalSales: "Total Sales",
    totalRevenue: "Total Revenue",
    activeStates: "Active States",
    brands: "Brands",
    units: "Units",
    million: "Million",
    states: "States",
    monthlyTrend: "Monthly Sales Trend",
    marketShare: "Market Share",
    stateMap: "State Sales Map",
    stateRanking: "State Sales Ranking",
    companyComparison: "Company Sales Comparison",
    detailData: "Detailed Data",
    month: "Month",
    state: "State",
    company: "Company",
    sales: "Sales",
    revenue: "Revenue",
    mapClickTip: "💡 Click on circles in the map to select/deselect specific states.",
    selected: "Selected",
    moreData: "additional data available.",
    salesVolume: "Sales Volume",
    low: "Low",
    high: "High"
  },
  ko: {
    title: "미국 스마트폰 시장 분석 대시보드",
    subtitle: "주요 모바일 회사의 주별 월간 판매량 분석",
    selectMonth: "월 선택",
    selectState: "주 선택", 
    selectCompany: "회사 선택",
    allMonths: "전체 월",
    allStates: "전체 주",
    allCompanies: "전체 회사",
    totalSales: "총 판매량",
    totalRevenue: "총 매출",
    activeStates: "활성 주",
    brands: "브랜드 수",
    units: "대",
    million: "백만 달러",
    states: "개 주",
    monthlyTrend: "월간 판매 트렌드",
    marketShare: "시장 점유율",
    stateMap: "주별 판매량 지도",
    stateRanking: "주별 판매량 순위",
    companyComparison: "회사별 판매량 비교",
    detailData: "상세 데이터",
    month: "월",
    state: "주",
    company: "회사",
    sales: "판매량",
    revenue: "매출",
    mapClickTip: "💡 지도의 원을 클릭하여 특정 주를 선택/해제할 수 있습니다.",
    selected: "선택됨",
    moreData: "개의 추가 데이터가 있습니다.",
    salesVolume: "판매량",
    low: "낮음",
    high: "높음"
  }
};

// 샘플 데이터 생성
const generateSalesData = () => {
  const companies = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Motorola'];
  const states = [
    'California', 'Texas', 'Florida', 'New York', 'Illinois', 
    'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
    'Arizona', 'Washington', 'Massachusetts', 'Virginia', 'Colorado',
    'Maryland', 'Tennessee', 'Indiana', 'Missouri', 'Wisconsin'
  ];
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
  
  const data = [];
  
  months.forEach(month => {
    states.forEach(state => {
      companies.forEach(company => {
        const baseSales = {
          'Apple': 15000,
          'Samsung': 12000,
          'Google': 8000,
          'OnePlus': 5000,
          'Motorola': 6000
        };
        
        const stateMultiplier = {
          'California': 1.8, 'Texas': 1.5, 'Florida': 1.3, 'New York': 1.6, 'Illinois': 1.1,
          'Pennsylvania': 1.0, 'Ohio': 0.9, 'Georgia': 0.8, 'North Carolina': 0.7, 'Michigan': 0.6,
          'Arizona': 0.9, 'Washington': 1.2, 'Massachusetts': 1.3, 'Virginia': 0.8, 'Colorado': 0.7,
          'Maryland': 0.9, 'Tennessee': 0.6, 'Indiana': 0.5, 'Missouri': 0.5, 'Wisconsin': 0.4
        };
        
        const monthIndex = parseInt(month.split('-')[1]);
        const seasonalFactor = 0.8 + 0.4 * Math.sin((monthIndex - 1) * Math.PI / 6);
        
        const sales = Math.floor(
          baseSales[company] * 
          stateMultiplier[state] * 
          seasonalFactor * 
          (0.9 + Math.random() * 0.2)
        );
        
        data.push({
          month,
          state,
          company,
          sales,
          revenue: sales * (company === 'Apple' ? 850 : company === 'Samsung' ? 720 : company === 'Google' ? 650 : company === 'OnePlus' ? 580 : 500)
        });
      });
    });
  });
  
  return data;
};

// 미국 주별 좌표 (간소화된 SVG 지도용)
const stateCoordinates = {
  'California': { x: 50, y: 250, abbr: 'CA' },
  'Texas': { x: 300, y: 350, abbr: 'TX' },
  'Florida': { x: 450, y: 400, abbr: 'FL' },
  'New York': { x: 500, y: 150, abbr: 'NY' },
  'Illinois': { x: 350, y: 200, abbr: 'IL' },
  'Pennsylvania': { x: 480, y: 180, abbr: 'PA' },
  'Ohio': { x: 420, y: 200, abbr: 'OH' },
  'Georgia': { x: 430, y: 320, abbr: 'GA' },
  'North Carolina': { x: 460, y: 280, abbr: 'NC' },
  'Michigan': { x: 400, y: 160, abbr: 'MI' },
  'Arizona': { x: 180, y: 300, abbr: 'AZ' },
  'Washington': { x: 80, y: 50, abbr: 'WA' },
  'Massachusetts': { x: 520, y: 140, abbr: 'MA' },
  'Virginia': { x: 470, y: 250, abbr: 'VA' },
  'Colorado': { x: 250, y: 240, abbr: 'CO' },
  'Maryland': { x: 490, y: 210, abbr: 'MD' },
  'Tennessee': { x: 400, y: 280, abbr: 'TN' },
  'Indiana': { x: 380, y: 220, abbr: 'IN' },
  'Missouri': { x: 320, y: 260, abbr: 'MO' },
  'Wisconsin': { x: 350, y: 140, abbr: 'WI' }
};

// 지도 컴포넌트
const USMap = ({ stateData, onStateClick, selectedState, t }) => {
  const maxSales = Math.max(...stateData.map(d => d.sales));
  
  const getCircleSize = (sales) => {
    return 8 + (sales / maxSales) * 25;
  };
  
  const getCircleColor = (sales) => {
    const intensity = sales / maxSales;
    if (intensity > 0.8) return '#1e40af';
    if (intensity > 0.6) return '#3b82f6';
    if (intensity > 0.4) return '#60a5fa';
    if (intensity > 0.2) return '#93c5fd';
    return '#dbeafe';
  };
  
  return (
    <div className="w-full h-96 bg-gray-50 rounded-lg border relative overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 600 450" className="absolute inset-0">
        {/* 미국 본토 윤곽 (간소화) */}
        <path
          d="M100 100 L550 100 L550 380 L100 380 Z"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        
        {/* 주별 원형 마커 */}
        {stateData.map(({ state, sales }) => {
          const coord = stateCoordinates[state];
          if (!coord) return null;
          
          return (
            <g key={state}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r={getCircleSize(sales)}
                fill={getCircleColor(sales)}
                stroke={selectedState === state ? '#ef4444' : '#ffffff'}
                strokeWidth={selectedState === state ? 3 : 1}
                opacity={0.8}
                className="cursor-pointer hover:opacity-100 transition-all duration-200"
                onClick={() => onStateClick(state)}
              />
              <text
                x={coord.x}
                y={coord.y + 2}
                textAnchor="middle"
                className="text-xs font-medium fill-white pointer-events-none"
              >
                {coord.abbr}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <div className="text-xs font-medium text-gray-700 mb-2">{t.salesVolume}</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
            <span className="text-xs text-gray-600">{t.low}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span className="text-xs text-gray-600">{t.high}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmartphoneDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [language, setLanguage] = useState('en');
  
  const t = translations[language];
  const salesData = useMemo(() => generateSalesData(), []);
  
  const months = [...new Set(salesData.map(d => d.month))].sort();
  const states = [...new Set(salesData.map(d => d.state))].sort();
  const companies = [...new Set(salesData.map(d => d.company))].sort();
  
  // 필터링된 데이터
  const filteredData = salesData.filter(d => 
    (selectedMonth === 'All' || d.month === selectedMonth) &&
    (selectedState === 'All' || d.state === selectedState) &&
    (selectedCompany === 'All' || d.company === selectedCompany)
  );
  
  // 회사별 월간 트렌드 데이터
  const monthlyTrendData = months.map(month => {
    const monthData = { month: month.substring(5) };
    companies.forEach(company => {
      const companySales = salesData
        .filter(d => d.month === month && d.company === company)
        .reduce((sum, d) => sum + d.sales, 0);
      monthData[company] = companySales;
    });
    return monthData;
  });
  
  // 주별 판매량 데이터 (선택된 월)
  const stateData = states.map(state => {
    const stateSales = filteredData
      .filter(d => d.state === state)
      .reduce((sum, d) => sum + d.sales, 0);
    return {
      state: state,
      shortState: state.length > 8 ? state.substring(0, 8) + '...' : state,
      sales: stateSales
    };
  }).sort((a, b) => b.sales - a.sales);
  
  const handleStateClick = (stateName) => {
    setSelectedState(selectedState === stateName ? 'All' : stateName);
  };
  
  // 회사별 시장 점유율 (파이 차트)
  const marketShareData = companies.map(company => {
    const companySales = filteredData
      .filter(d => d.company === company)
      .reduce((sum, d) => sum + d.sales, 0);
    return {
      name: company,
      value: companySales
    };
  });
  
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
  
  const formatNumber = (num) => {
    return language === 'ko' ? 
      new Intl.NumberFormat('ko-KR').format(num) :
      new Intl.NumberFormat('en-US').format(num);
  };
  
  const totalSales = filteredData.reduce((sum, d) => sum + d.sales, 0);
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <Smartphone className="text-blue-600" />
                {t.title}
              </h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="text-gray-600 w-5 h-5" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="en">English</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>
        </header>
        
        {/* 필터 컨트롤 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                {t.selectMonth}
              </label>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">{t.allMonths}</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                {t.selectState}
              </label>
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">{t.allStates}</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                {t.selectCompany}
              </label>
              <select 
                value={selectedCompany} 
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">{t.allCompanies}</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* KPI 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.totalSales}</h3>
            <p className="text-3xl font-bold text-blue-600">{formatNumber(totalSales)}</p>
            <p className="text-sm text-gray-500">{t.units}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.totalRevenue}</h3>
            <p className="text-3xl font-bold text-green-600">${formatNumber(Math.floor(totalRevenue / 1000000))}M</p>
            <p className="text-sm text-gray-500">{t.million}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.activeStates}</h3>
            <p className="text-3xl font-bold text-purple-600">{selectedState === 'All' ? states.length : 1}</p>
            <p className="text-sm text-gray-500">{t.states}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.brands}</h3>
            <p className="text-3xl font-bold text-orange-600">{selectedCompany === 'All' ? companies.length : 1}</p>
            <p className="text-sm text-gray-500">{language === 'ko' ? '개 브랜드' : 'Brands'}</p>
          </div>
        </div>
        
        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 월간 트렌드 차트 */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.monthlyTrend}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => [formatNumber(value), '']} />
                <Legend />
                {companies.map((company, index) => (
                  <Line 
                    key={company} 
                    type="monotone" 
                    dataKey={company} 
                    stroke={colors[index]} 
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* 시장 점유율 파이 차트 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.marketShare}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value), t.sales]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 지도 및 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* 미국 지도 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-600" />
              {t.stateMap}
              {selectedState !== 'All' && (
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {selectedState} {t.selected}
                </span>
              )}
            </h3>
            <USMap 
              stateData={stateData} 
              onStateClick={handleStateClick}
              selectedState={selectedState}
              t={t}
            />
            <p className="text-sm text-gray-600 mt-2">
              {t.mapClickTip}
            </p>
          </div>

          {/* 주별 판매량 차트 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.stateRanking}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stateData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortState" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => [formatNumber(value), t.sales]} />
                <Bar dataKey="sales" fill="#8884d8">
                  {stateData.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.state === selectedState ? '#ef4444' : '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 회사별 비교 차트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.companyComparison}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketShareData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value) => [formatNumber(value), t.sales]} />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* 데이터 테이블 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.detailData}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">{t.month}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">{t.state}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">{t.company}</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">{t.sales}</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">{t.revenue}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 10).map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.month}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.state}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.company}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatNumber(item.sales)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">${formatNumber(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 10 && (
              <p className="text-center text-gray-500 mt-4">
                {formatNumber(filteredData.length - 10)} {t.moreData}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartphoneDashboard;
