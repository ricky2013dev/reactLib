import React, { useState, useEffect } from 'react';
import { Search, Heart, MessageCircle, Clock, User, MapPin, Phone } from 'lucide-react';

const HealthQAApp = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "기침과 콧물이 나고 목이 아파요",
      answer: "**진단 의견:** 감기 증상으로 보입니다\n\n**권장사항:**\n1. 충분한 수분 섭취 (하루 8-10잔의 물)\n2. 따뜻한 차나 꿀차 마시기\n3. 충분한 휴식과 수면 (7-8시간)\n4. 실내 습도 유지 (50-60%)\n5. 증상이 7일 이상 지속되면 병원 방문\n\n**📍 근처 추천 병원 (10001):**\n🏥 **NewYork-Presbyterian Hospital**\n📞 (212) 746-5454\n📍 525 E 68th St, New York, NY 10065\n🔹 전문분야: General\n\n🏥 **Mount Sinai Hospital**\n📞 (212) 241-6500\n📍 1 Gustave L. Levy Pl, New York, NY 10029\n🔹 전문분야: Cardiology\n\n⚠️ **중요:** 이는 일반적인 건강 정보이며, 정확한 진단과 치료를 위해서는 반드시 의료 전문가와 상담하시기 바랍니다.",
      timestamp: "2시간 전",
      category: "일반 건강",
      severity: "mild",
      isTyping: false,
      displayText: "**진단 의견:** 감기 증상으로 보입니다\n\n**권장사항:**\n1. 충분한 수분 섭취 (하루 8-10잔의 물)\n2. 따뜻한 차나 꿀차 마시기\n3. 충분한 휴식과 수면 (7-8시간)\n4. 실내 습도 유지 (50-60%)\n5. 증상이 7일 이상 지속되면 병원 방문\n\n**📍 근처 추천 병원 (10001):**\n🏥 **NewYork-Presbyterian Hospital**\n📞 (212) 746-5454\n📍 525 E 68th St, New York, NY 10065\n🔹 전문분야: General\n\n🏥 **Mount Sinai Hospital**\n📞 (212) 241-6500\n📍 1 Gustave L. Levy Pl, New York, NY 10029\n🔹 전문분야: Cardiology\n\n⚠️ **중요:** 이는 일반적인 건강 정보이며, 정확한 진단과 치료를 위해서는 반드시 의료 전문가와 상담하시기 바랍니다.",
      hospitals: [
        { name: 'NewYork-Presbyterian Hospital', phone: '(212) 746-5454', address: '525 E 68th St, New York, NY 10065', specialty: 'General' },
        { name: 'Mount Sinai Hospital', phone: '(212) 241-6500', address: '1 Gustave L. Levy Pl, New York, NY 10029', specialty: 'Cardiology' }
      ]
    },
    {
      id: 2,
      question: "두통이 심하고 목과 어깨가 뻣뻣해요",
      answer: "**진단 의견:** 두통 증상으로 보입니다\n\n**권장사항:**\n1. 충분한 수분 섭취\n2. 목과 어깨 마사지\n3. 어두운 곳에서 휴식\n4. 규칙적인 수면 패턴 유지\n5. 스트레스 관리 (명상, 요가)\n6. 심한 두통이나 발열이 동반되면 즉시 병원 방문\n\n**📍 근처 추천 병원 (90210):**\n🏥 **Cedars-Sinai Medical Center**\n📞 (310) 423-3277\n📍 8700 Beverly Blvd, Los Angeles, CA 90048\n🔹 전문분야: General\n\n🏥 **UCLA Medical Center**\n📞 (310) 825-9111\n📍 757 Westwood Plaza, Los Angeles, CA 90095\n🔹 전문분야: Neurology\n\n⚠️ **중요:** 이는 일반적인 건강 정보이며, 정확한 진단과 치료를 위해서는 반드시 의료 전문가와 상담하시기 바랍니다.",
      timestamp: "5시간 전",
      category: "신경계",
      severity: "mild",
      isTyping: false,
      displayText: "**진단 의견:** 두통 증상으로 보입니다\n\n**권장사항:**\n1. 충분한 수분 섭취\n2. 목과 어깨 마사지\n3. 어두운 곳에서 휴식\n4. 규칙적인 수면 패턴 유지\n5. 스트레스 관리 (명상, 요가)\n6. 심한 두통이나 발열이 동반되면 즉시 병원 방문\n\n**📍 근처 추천 병원 (90210):**\n🏥 **Cedars-Sinai Medical Center**\n📞 (310) 423-3277\n📍 8700 Beverly Blvd, Los Angeles, CA 90048\n🔹 전문분야: General\n\n🏥 **UCLA Medical Center**\n📞 (310) 825-9111\n📍 757 Westwood Plaza, Los Angeles, CA 90095\n🔹 전문분야: Neurology\n\n⚠️ **중요:** 이는 일반적인 건강 정보이며, 정확한 진단과 치료를 위해서는 반드시 의료 전문가와 상담하시기 바랍니다.",
      hospitals: [
        { name: 'Cedars-Sinai Medical Center', phone: '(310) 423-3277', address: '8700 Beverly Blvd, Los Angeles, CA 90048', specialty: 'General' },
        { name: 'UCLA Medical Center', phone: '(310) 825-9111', address: '757 Westwood Plaza, Los Angeles, CA 90095', specialty: 'Neurology' }
      ]
    }
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('일반 건강');
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState('');

  // 미국 우편번호별 병원 데이터베이스 (샘플)
  const getHospitalsByZip = (zipCode) => {
    const hospitalDatabase = {
      '10001': [
        { name: 'NewYork-Presbyterian Hospital', phone: '(212) 746-5454', address: '525 E 68th St, New York, NY 10065', specialty: 'General' },
        { name: 'Mount Sinai Hospital', phone: '(212) 241-6500', address: '1 Gustave L. Levy Pl, New York, NY 10029', specialty: 'Cardiology' },
        { name: 'Bellevue Hospital', phone: '(212) 562-4141', address: '462 1st Ave, New York, NY 10016', specialty: 'Emergency' }
      ],
      '90210': [
        { name: 'Cedars-Sinai Medical Center', phone: '(310) 423-3277', address: '8700 Beverly Blvd, Los Angeles, CA 90048', specialty: 'General' },
        { name: 'UCLA Medical Center', phone: '(310) 825-9111', address: '757 Westwood Plaza, Los Angeles, CA 90095', specialty: 'Neurology' },
        { name: 'Beverly Hills Emergency Room', phone: '(310) 278-8896', address: '9201 Sunset Blvd, West Hollywood, CA 90069', specialty: 'Emergency' }
      ],
      '60601': [
        { name: 'Northwestern Memorial Hospital', phone: '(312) 926-2000', address: '251 E Huron St, Chicago, IL 60611', specialty: 'General' },
        { name: 'Rush University Medical Center', phone: '(312) 942-5000', address: '1653 W Congress Pkwy, Chicago, IL 60612', specialty: 'Orthopedics' },
        { name: 'University of Chicago Medical Center', phone: '(773) 702-1000', address: '5841 S Maryland Ave, Chicago, IL 60637', specialty: 'Cancer Care' }
      ],
      '33101': [
        { name: 'Jackson Memorial Hospital', phone: '(305) 585-1111', address: '1611 NW 12th Ave, Miami, FL 33136', specialty: 'Trauma' },
        { name: 'Baptist Hospital of Miami', phone: '(786) 596-1960', address: '8900 N Kendall Dr, Miami, FL 33176', specialty: 'Cardiology' },
        { name: 'Mount Sinai Medical Center', phone: '(305) 674-2121', address: '4300 Alton Rd, Miami Beach, FL 33140', specialty: 'General' }
      ],
      '75201': [
        { name: 'Baylor University Medical Center', phone: '(214) 820-0111', address: '3500 Gaston Ave, Dallas, TX 75246', specialty: 'General' },
        { name: 'UT Southwestern Medical Center', phone: '(214) 633-8000', address: '5323 Harry Hines Blvd, Dallas, TX 75390', specialty: 'Research' },
        { name: 'Methodist Dallas Medical Center', phone: '(214) 947-8181', address: '1441 N Beckley Ave, Dallas, TX 75203', specialty: 'Heart Surgery' }
      ]
    };

    return hospitalDatabase[zipCode] || [
      { name: 'Local Community Hospital', phone: '(555) 123-4567', address: 'Your local area', specialty: 'General' },
      { name: 'Regional Medical Center', phone: '(555) 234-5678', address: 'Nearby location', specialty: 'Emergency' },
      { name: 'Family Health Clinic', phone: '(555) 345-6789', address: 'Community center', specialty: 'Family Medicine' }
    ];
  };

  const getRecommendedHospitals = (severity, zipCode) => {
    const hospitals = getHospitalsByZip(zipCode);
    
    if (severity === 'severe' || severity === 'moderate') {
      return hospitals.filter(h => h.specialty === 'Emergency' || h.specialty === 'General').slice(0, 2);
    }
    
    return hospitals.slice(0, 3);
  };

  const categories = ['일반 건강', '소화기', '신경계', '정신 건강', '호흡기', '근골격계'];

  const analyzeSymptoms = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // 감기/독감 증상
    if (lowerQuestion.includes('기침') || lowerQuestion.includes('콧물') || lowerQuestion.includes('목아픔') || 
        lowerQuestion.includes('cough') || lowerQuestion.includes('runny nose') || lowerQuestion.includes('sore throat')) {
      return {
        diagnosis: "감기 증상으로 보입니다",
        recommendations: [
          "충분한 수분 섭취 (하루 8-10잔의 물)",
          "따뜻한 차나 꿀차 마시기",
          "충분한 휴식과 수면 (7-8시간)",
          "실내 습도 유지 (50-60%)",
          "증상이 7일 이상 지속되면 병원 방문"
        ],
        severity: "mild"
      };
    }
    
    // 두통 증상
    if (lowerQuestion.includes('두통') || lowerQuestion.includes('머리아픔') || lowerQuestion.includes('headache')) {
      return {
        diagnosis: "두통 증상으로 보입니다",
        recommendations: [
          "충분한 수분 섭취",
          "목과 어깨 마사지",
          "어두운 곳에서 휴식",
          "규칙적인 수면 패턴 유지",
          "스트레스 관리 (명상, 요가)",
          "심한 두통이나 발열이 동반되면 즉시 병원 방문"
        ],
        severity: "mild"
      };
    }
    
    // 복통 증상
    if (lowerQuestion.includes('복통') || lowerQuestion.includes('배아픔') || lowerQuestion.includes('stomach pain')) {
      return {
        diagnosis: "복통 증상으로 보입니다",
        recommendations: [
          "가벼운 음식 섭취 (죽, 바나나, 토스트)",
          "충분한 수분 섭취",
          "배를 따뜻하게 찜질",
          "기름진 음식과 카페인 피하기",
          "심한 복통, 발열, 구토가 동반되면 응급실 방문",
          "증상이 24시간 이상 지속되면 병원 진료"
        ],
        severity: "moderate"
      };
    }
    
    // 피로/스트레스 증상
    if (lowerQuestion.includes('피로') || lowerQuestion.includes('스트레스') || lowerQuestion.includes('tired') || lowerQuestion.includes('stress')) {
      return {
        diagnosis: "피로 및 스트레스 증상으로 보입니다",
        recommendations: [
          "규칙적인 운동 (주 3-4회, 30분)",
          "균형잡힌 영양 섭취",
          "충분한 수면 (7-8시간)",
          "명상이나 호흡 운동",
          "업무와 휴식의 균형 맞추기",
          "증상이 2주 이상 지속되면 전문의 상담"
        ],
        severity: "mild"
      };
    }
    
    // 기본 응답
    return {
      diagnosis: "증상에 대한 일반적인 건강 조언",
      recommendations: [
        "충분한 휴식과 수면",
        "균형잡힌 식단 유지",
        "적절한 수분 섭취",
        "규칙적인 운동",
        "증상이 지속되거나 악화되면 의료진 상담",
        "응급 증상 시 즉시 병원 방문"
      ],
      severity: "general"
    };
  };

  // 타이핑 애니메이션 훅
  const useTypewriter = (text, speed = 30) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      if (text) {
        setIsTyping(true);
        setDisplayText('');
        let i = 0;
        const timer = setInterval(() => {
          if (i < text.length) {
            setDisplayText(text.slice(0, i + 1));
            i++;
          } else {
            clearInterval(timer);
            setIsTyping(false);
          }
        }, speed);

        return () => clearInterval(timer);
      }
    }, [text, speed]);

    return { displayText, isTyping };
  };

  const TypingText = ({ text, isNewQuestion = false }) => {
    const { displayText, isTyping } = useTypewriter(isNewQuestion ? text : text, 20);
    
    return (
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {isNewQuestion ? displayText : text}
        {isTyping && (
          <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse"></span>
        )}
      </div>
    );
  };

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      const analysis = analyzeSymptoms(newQuestion);
      const recommendations = analysis.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n');
      
      // 병원 추천 추가
      const hospitals = zipCode ? getRecommendedHospitals(analysis.severity, zipCode) : [];
      const hospitalInfo = hospitals.length > 0 ? 
        `\n\n**📍 근처 추천 병원 (${zipCode}):**\n` + 
        hospitals.map(h => `🏥 **${h.name}**\n📞 ${h.phone}\n📍 ${h.address}\n🔹 전문분야: ${h.specialty}`).join('\n\n') : 
        zipCode ? '\n\n**📍 해당 지역의 병원 정보를 찾을 수 없습니다. 911에 전화하거나 가장 가까운 응급실로 가세요.**' :
        '\n\n**📍 정확한 병원 추천을 위해 우편번호를 입력해주세요.**';
      
      const fullAnswer = `**진단 의견:** ${analysis.diagnosis}\n\n**권장사항:**\n${recommendations}${hospitalInfo}\n\n⚠️ **중요:** 이는 일반적인 건강 정보이며, 정확한 진단과 치료를 위해서는 반드시 의료 전문가와 상담하시기 바랍니다.`;
      
      const newQ = {
        id: questions.length + 1,
        question: newQuestion,
        answer: fullAnswer,
        timestamp: "방금 전",
        category: selectedCategory,
        severity: analysis.severity,
        isTyping: true,
        displayText: '',
        isNewQuestion: true,
        hospitals: hospitals
      };
      setQuestions([newQ, ...questions]);
      setNewQuestion('');
      
      // 타이핑 완료 시간 계산
      setTimeout(() => {
        setQuestions(prev => prev.map(q => 
          q.id === newQ.id ? { ...q, isTyping: false, isNewQuestion: false } : q
        ));
      }, fullAnswer.length * 25);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Heart className="w-10 h-10 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">헬스케어 AI</h1>
          </div>
          <p className="text-gray-600 text-lg">증상을 입력하면 진단과 치료방법을 제안해드립니다</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="건강 관련 질문이나 증상을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm"
          />
        </div>

        {/* Ask Question Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-blue-500" />
            증상 진단 및 치료 추천
          </h2>
          <div>
            {/* 우편번호 입력 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                미국 우편번호 (Zip Code) - 근처 병원 추천을 위해
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="예: 10001, 90210, 60601..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                maxLength="5"
              />
              <p className="text-xs text-gray-500 mt-1">선택사항: 입력하시면 근처 병원을 추천해드립니다</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">증상 설명</label>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="어떤 증상이 있으신가요? 자세히 설명해주세요."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
              />
            </div>
            <div className="flex gap-4 mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={handleSubmitQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                진단 받기
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <strong>면책조항:</strong> 이는 교육 목적이며 전문 의료진의 진료를 대체할 수 없습니다.
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">검색 조건에 맞는 질문을 찾을 수 없습니다.</p>
            </div>
          ) : (
            filteredQuestions.map(qa => (
              <div key={qa.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
                      {qa.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {qa.question}
                    </h3>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm ml-4">
                    <Clock className="w-4 h-4 mr-1" />
                    {qa.timestamp}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <User className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-blue-700 text-sm">AI 건강 어시스턴트</span>
                    {qa.isTyping && (
                      <div className="ml-2 flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                    {qa.severity && !qa.isTyping && (
                      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                        qa.severity === 'mild' ? 'bg-green-100 text-green-700' :
                        qa.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {qa.severity === 'mild' ? '경미' : 
                         qa.severity === 'moderate' ? '중등도' : '일반'}
                      </span>
                    )}
                  </div>
                  <TypingText text={qa.answer} isNewQuestion={qa.isNewQuestion} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-xl shadow-sm">
          <p className="text-gray-600 mb-2">
            <strong>중요:</strong> 응급상황이나 심각한 증상의 경우 즉시 병원을 방문하세요.
          </p>
          <p className="text-sm text-gray-500">
            이 앱은 일반적인 건강 정보를 제공하며, 의학적 진단이나 치료에 사용되어서는 안됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthQAApp;
