# Amplitude 자동 추적 with OpenAI 🚀

한국어 버튼/링크를 자동으로 추적하고, OpenAI로 영어 이벤트 이름을 생성하여 Amplitude에 전송하는 Next.js 라이브러리입니다.

## ✨ 핵심 특징

### 🎯 완전 자동화
```jsx
// 이것만 하면 끝!
<button>로그인</button>
<button>장바구니에 담기</button>
<button>상품 구매하기</button>

// Amplitude 이벤트 자동 생성:
// - login_clicked (displayName: "로그인")
// - add_to_cart_clicked (displayName: "장바구니에 담기")
// - purchase_product_clicked (displayName: "상품 구매하기")
```

### ⚡ 배치 번역 
- **페이지 로드 시 1회만 OpenAI API 호출**
- 페이지의 모든 버튼/링크 텍스트를 한 번에 번역
- 클릭 시 캐시에서 즉시 가져오기 (딜레이 0)

### 🧠 OpenAI 기반 스마트 번역
- GPT-4o-mini로 자연스러운 영어 이벤트 이름 생성
- 하드코딩된 매핑 불필요
- 모든 한국어 텍스트 자동 처리
- 일관된 snake_case 형식

### 🔄 동적 요소 자동 감지
- MutationObserver로 새로 추가된 버튼/링크도 자동 감지
- React, Next.js 등 모든 프레임워크 호환

## 🎬 작동 방식

```
📄 페이지 로드
    ↓
🔍 모든 버튼/링크 텍스트 수집
    ["로그인", "회원가입", "장바구니", "구매하기"]
    ↓
🤖 OpenAI API 배치 호출 (1회!)
    ↓
📦 결과를 캐시에 저장
    {
      "로그인": "login_clicked",
      "회원가입": "signup_clicked",
      "장바구니": "cart_clicked",
      "구매하기": "purchase_clicked"
    }
    ↓
👆 사용자가 버튼 클릭
    ↓
⚡ 캐시에서 즉시 이벤트 이름 가져오기
    ↓
📊 Amplitude로 전송
    - Event: "login_clicked"
    - event_display_name: "로그인"
```

## 📦 설치

프로젝트에 이미 필요한 패키지가 설치되어 있습니다:
- `@amplitude/analytics-browser`
- `openai`
- `next`

## ⚙️ 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Amplitude API Key
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_api_key

# OpenAI API Key
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-your_openai_api_key
```

**API 키 발급:**
- Amplitude: https://analytics.amplitude.com/
- OpenAI: https://platform.openai.com/api-keys

### 2. Amplitude 초기화

`app/layout.tsx` 또는 `app/page.tsx`에서 초기화:

```typescript
'use client';

import { useEffect } from 'react';
import { initAmplitude } from '@/lib/amplitude';

export default function RootLayout({ children }) {
  useEffect(() => {
    initAmplitude();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### 3. 끝! 🎉

이제 모든 버튼과 링크 클릭이 자동으로 추적됩니다.

## 💡 사용 예시

### 자동 추적 (권장)

```jsx
// 그냥 평범하게 버튼을 만들면 자동으로 추적됩니다!
function MyComponent() {
  return (
    <div>
      <button>로그인</button>
      {/* → Amplitude: "login_clicked" */}
      
      <button>회원가입</button>
      {/* → Amplitude: "signup_clicked" */}
      
      <button>장바구니에 담기</button>
      {/* → Amplitude: "add_to_cart_clicked" */}
      
      <a href="/products">상품 목록 보기</a>
      {/* → Amplitude: "view_product_list_clicked" */}
    </div>
  );
}
```


## 📚 API 문서

### `initAmplitude()`

Amplitude를 초기화하고 자동 추적을 시작합니다.

**수행 작업:**
1. Amplitude SDK 초기화
2. 페이지의 모든 버튼/링크 텍스트 수집
3. OpenAI API로 배치 번역 (1회)
4. 결과를 캐시에 저장
5. 클릭 이벤트 리스너 등록
6. MutationObserver로 동적 요소 감지

```typescript
initAmplitude();
```

### `generateEventNameFromText(text: string): string`

캐시에서 이벤트 이름을 가져옵니다 (동기).

```typescript
const eventName = generateEventNameFromText("로그인");
// → "login_clicked" (캐시에 있는 경우)
// → "button_clicked" (캐시에 없는 경우, 폴백)
```

### `handleTrackEvent(logName: string, displayName: string, customFields?: object)`

이벤트를 Amplitude로 전송합니다.

**파라미터:**
- `logName`: 영어 이벤트 이름 (Amplitude 로그용)
- `displayName`: 한국어 원문 (`event_display_name` 필드에 저장)
- `customFields`: 추가 속성 (선택사항)

```typescript
handleTrackEvent("login_clicked", "로그인", {
  button_class: "primary",
  page: "/home",
});
```

### `logTextEvent(text: string, eventProperties?: object)`

텍스트를 캐시에서 찾아 자동으로 이벤트를 로깅합니다.

```typescript
logTextEvent("장바구니에 담기", {
  product_id: "123",
  price: 29000,
});
// → Event: "add_to_cart_clicked"
// → event_display_name: "장바구니에 담기"
// → product_id: "123"
// → price: 29000
```

## 🔧 고급 설정

### 캐시 확인하기

```typescript
// 브라우저 콘솔에서 확인
console.log('현재 캐시된 번역:', translationCache);
```

### 동적 요소 감지 비활성화

MutationObserver를 비활성화하려면 `amplitude.ts` 파일에서 해당 부분을 주석 처리하세요.

```typescript
// const observer = new MutationObserver(() => {
//   const allTexts = collectAllTexts();
//   batchTranslateTexts(allTexts);
// });
// observer.observe(document.body, { childList: true, subtree: true });
```

## 📊 Amplitude에서 확인하기

### 이벤트 구조

```javascript
{
  event_type: "login_clicked",           // 영어 이벤트 이름
  event_properties: {
    event_display_name: "로그인",        // 한국어 원문
    button_text: "로그인",
    button_class: "btn-primary",
    element_id: "login-btn",
    element_type: "button",
    text_length: 3
  }
}
```

### 대시보드에서 활용

1. **이벤트 이름으로 그룹화**: `login_clicked`, `signup_clicked` 등
2. **디스플레이 이름으로 필터링**: `event_display_name = "로그인"`
3. **버튼 클래스별 분석**: `button_class = "primary"`

## 🎯 장점

✅ **완전 자동화** - 코드 추가 없이 모든 클릭 추적  
✅ **비용 효율** - 페이지당 1회 API 호출로 90% 비용 절감  
✅ **빠른 응답** - 클릭 시 캐시에서 즉시 가져오기 (딜레이 0)  
✅ **스마트 번역** - OpenAI가 문맥 고려하여 자연스러운 이벤트 이름 생성  
✅ **동적 요소 지원** - MutationObserver로 새로 추가된 버튼도 자동 감지  
✅ **일관성** - 모든 이벤트가 snake_case 형식으로 통일  

## 🛠️ 기술 스택

- **Next.js** 
- **Amplitude** 
- **OpenAI GPT-4o-mini** 
- **TypeScript** 

## 📝 라이센스

MIT


---

**만든이**: 자동화된 이벤트 추적으로 더 나은 데이터 분석을! 🚀
