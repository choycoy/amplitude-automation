'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { initAmplitude } from '../lib/amplitude';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  // Amplitude 초기화
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      initAmplitude();
    }
  }, []);

  const plans = [
    {
      name: '베이직',
      description: '개인 및 소규모 팀을 위한',
      price: isYearly ? 86000 : 10000,
      period: '월',
      buttonText: '시작하기',
      buttonStyle: 'primary',
      features: [
        '최대 10개 프로젝트',
        '100GB 저장공간',
        '이메일 지원',
        '기본 분석'
      ]
    },
    {
      name: '프로',
      description: '성장하는 조직을 위한',
      price: isYearly ? 280000 : 30000,
      period: '월',
      buttonText: '무료 체험 시작',
      buttonStyle: 'primary',
      featured: true,
      features: [
        '무제한 프로젝트',
        '500GB 저장공간',
        '우선 지원',
        '고급 분석',
        '팀 협업',
        'API 접근'
      ]
    },
    {
      name: '엔터프라이즈',
      description: '대규모 배포를 위한',
      price: isYearly ? 950000 : 100000,
      period: '월',
      buttonText: '영업팀에 문의',
      buttonStyle: 'secondary',
      features: [
        '프로 플랜의 모든 기능',
        '70TB 저장공간',
        '24/7 우선 지원',
        '커스텀 통합',
        '전담 매니저',
        'SLA 보장'
      ]
    }
  ];

  const faqs = [
    {
      question: '언제든지 플랜을 변경할 수 있나요?',
      answer: '네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 다음 청구 주기에 반영됩니다.'
    },
    {
      question: '무료 체험이 있나요?',
      answer: '네, 프로 플랜의 14일 무료 체험을 제공합니다. 신용카드 등록 불필요하며, 언제든지 취소 가능합니다.'
    },
    {
      question: '어떤 결제 방법을 지원하나요?',
      answer: '모든 주요 신용카드(Visa, MasterCard, Amex)를 지원하며, 엔터프라이즈 고객의 경우 PayPal도 지원합니다.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gray-900">BluePlan</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">기능</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">요금</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">소개</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">문의</a>
            </div>
            <div className="flex space-x-4">
              <button 
                type="button"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors cursor-pointer"
                onClick={() => console.log('Login clicked')}
                aria-label="로그인"
                data-button-type="login"
                data-location="navbar"
                data-section="header"
              >
                로그인
              </button>
              <button 
                type="button"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
                onClick={() => console.log('Sign up clicked')}
                aria-label="회원가입"
                data-button-type="signup"
                data-location="navbar"
                data-section="header"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            간단하고 투명한 요금제
          </h1>
          <p className="text-lg mb-8 opacity-90">
            필요에 맞는 완벽한 플랜을 선택하세요. 숨겨진 수수료 없음, 놀람 없음.<br />
            언제든지 취소 가능. <span className="underline cursor-pointer">자주 묻는 질문 보기</span>
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={!isYearly ? 'font-semibold' : ''}>월간</span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
              aria-label={`${isYearly ? '월간' : '연간'} 결제로 전환`}
              aria-pressed={isYearly}
              data-button-type="billing_toggle"
              data-location="hero_section"
              data-section="pricing_toggle"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={isYearly ? 'font-semibold' : ''}>연간</span>
            <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
              20% 할인
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-8 transition-transform hover:-translate-y-2 ${
                plan.featured ? 'border-2 border-indigo-600 md:scale-105' : ''
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold">{plan.price.toLocaleString()}원</span>
                <span className="text-gray-500 ml-2">/{plan.period}</span>
                <div className="text-sm text-gray-500 mt-1">사용자당</div>
              </div>

              <button
                type="button"
                className={`w-full py-3 rounded-md font-semibold mb-6 transition cursor-pointer ${
                  plan.buttonStyle === 'primary'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                onClick={() => console.log(`${plan.name} 플랜 클릭됨`)}
                aria-label={`${plan.name} 플랜 선택`}
                data-button-type="plan_selection"
                data-plan-name={plan.name}
                data-plan-price={plan.price}
                data-billing-period={isYearly ? 'yearly' : 'monthly'}
                data-plan-tier={plan.featured ? 'featured' : 'standard'}
                data-location="pricing_cards"
                data-section="plan_selection"
              >
                {plan.buttonText}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">
          자주 묻는 질문
        </h2>
        <p className="text-gray-600 text-center mb-12">
          요금제에 대해 알아야 할 모든 것
        </p>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">시작할 준비가 되셨나요?</h2>
          <p className="text-lg mb-8 opacity-90">
            우리를 신뢰하는 수천 개의 팀과 함께하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              type="button"
              className="bg-white text-indigo-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => console.log('무료 체험 시작 클릭됨')}
              aria-label="무료 체험 시작"
              data-button-type="cta_primary"
              data-action="free_trial"
              data-location="cta_section"
              data-section="conversion"
            >
              무료 체험 시작
            </button>
            <button 
              type="button"
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => console.log('영업팀 문의 클릭됨')}
              aria-label="영업팀에 문의하기"
              data-button-type="cta_secondary"
              data-action="contact_sales"
              data-location="cta_section"
              data-section="conversion"
            >
              영업팀 문의
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold mb-4">BluePlan</div>
              <p className="text-gray-400 text-sm mb-4">
                모든 사람을 위한 간단하고 효과적인 계획 수립
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">𝕏</a>
                <a href="#" className="text-gray-400 hover:text-white">in</a>
                <a href="#" className="text-gray-400 hover:text-white">f</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">제품</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">기능</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">요금</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">보안</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">로드맵</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">소개</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">채용</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">문의</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">블로그</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">도움말 센터</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">문서</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API 참조</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">상태</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2024 BluePlan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;

