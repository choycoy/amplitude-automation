import * as amplitude from '@amplitude/analytics-browser';
import OpenAI from 'openai';

interface EventProperties {
  [key: string]: string | number;
}

// OpenAI 클라이언트 초기화
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true,
    });
  }
  return openaiClient;
}

const translationCache = new Map<string, string>();

// 페이지의 모든 버튼/링크 텍스트를 한 번에 수집
function collectAllTexts(): string[] {
  const texts = new Set<string>();

  // 모든 버튼 텍스트 수집
  document.querySelectorAll('button').forEach((button) => {
    const text = button.textContent?.trim();
    if (text && text.length > 0) {
      texts.add(text);
    }
  });

  // 모든 링크 텍스트 수집
  document.querySelectorAll('a').forEach((link) => {
    const text = link.textContent?.trim();
    if (text && text.length > 0) {
      texts.add(text);
    }
  });

  return Array.from(texts);
}

// 여러 텍스트를 한 번에 배치로 번역 (OpenAI 1회 호출)
async function batchTranslateTexts(texts: string[]): Promise<void> {
  if (texts.length === 0) return;

  // 이미 캐시된 텍스트는 제외
  const textsToTranslate = texts.filter((text) => !translationCache.has(text));

  if (textsToTranslate.length === 0) {
    return;
  }

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that converts button/link text into snake_case event names for analytics.
            Rules:
            - Convert Korean or any language to English
            - Use lowercase snake_case format
            - Keep it concise (max 3-4 words)
            - Add "_clicked" suffix for buttons
            - Be consistent and semantic
            - Return ONLY a JSON object mapping each input text to its event name

            Example output format:
            {
              "회원가입": "signup_clicked",
              "저장하기": "save_clicked",
              "상품 목록": "product_list_clicked"
            }`,
        },
        {
          role: 'user',
          content: `Convert these texts to event names and return as JSON:\n${JSON.stringify(textsToTranslate)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return;
    }

    const translations = JSON.parse(content);

    // 캐시에 저장
    Object.entries(translations).forEach(([originalText, eventName]) => {
      translationCache.set(originalText, eventName as string);
    });
  } catch {}
}

// 캐시에서 이벤트 이름 가져오기 (동기)
function getEventNameFromCache(text: string): string {
  if (!text || text.trim() === '') {
    return 'button_clicked';
  }

  const trimmedText = text.trim();
  return translationCache.get(trimmedText) || 'button_clicked';
}

// 텍스트 기반 이벤트 이름 생성 (캐시에서 가져오기)
export function generateEventNameFromText(text: string): string {
  return getEventNameFromCache(text);
}

// Amplitude 초기화
export function initAmplitude() {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '', undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });

  // 자동 클릭 추적을 위한 이벤트 리스너 추가
  if (typeof window !== 'undefined') {
    // 페이지 로드 시 모든 버튼/링크 텍스트를 수집하고 배치 번역
    const initializeTranslations = async () => {
      const allTexts = collectAllTexts();
      await batchTranslateTexts(allTexts);
    };

    // 초기 번역 실행
    initializeTranslations();

    // 동적으로 추가되는 요소를 감지하기 위한 MutationObserver (선택사항)
    const observer = new MutationObserver(() => {
      const allTexts = collectAllTexts();
      batchTranslateTexts(allTexts); // 새로운 텍스트만 번역됨 (캐시 확인)
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 클릭 이벤트 리스너 (캐시에서 동기적으로 가져오기)
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      // 버튼 클릭 자동 추적 (캐시에서 즉시 가져오기)
      if (target.tagName === 'BUTTON') {
        const buttonText = target.textContent?.trim() || '';
        const buttonClass = target.className || '';

        // 캐시에서 이벤트 이름 가져오기 (동기)
        const eventName = getEventNameFromCache(buttonText);

        // logName: 영어 이벤트 이름, displayName: 한국어 원문
        handleTrackEvent(
          eventName,
          buttonText, // displayName은 한국어/원문 그대로
          {
            button_text: buttonText,
            button_class: buttonClass,
            element_id: target.id || '',
            element_type: 'button',
            text_length: buttonText.length,
          }
        );
      }

      // 링크 클릭 자동 추적 (캐시에서 즉시 가져오기)
      if (target.tagName === 'A') {
        const linkText = target.textContent?.trim() || '';
        const linkHref = (target as HTMLAnchorElement).href || '';

        // 캐시에서 이벤트 이름 가져오기 (동기)
        const eventName = getEventNameFromCache(linkText);

        // logName: 영어 이벤트 이름, displayName: 한국어 원문
        handleTrackEvent(
          eventName,
          linkText, // displayName은 한국어/원문 그대로
          {
            link_text: linkText,
            link_href: linkHref,
            element_id: target.id || '',
            element_type: 'link',
            text_length: linkText.length,
          }
        );
      }
    });
  }
}

// 이벤트 추적 헬퍼 (logName: 실제 이벤트 이름, displayName: 표시 이름)
export function handleTrackEvent(
  logName: string,
  displayName: string,
  customFields: Record<string, string | number> = {}
) {
  const eventData = {
    ...customFields,
    event_display_name: String(displayName || ''),
  };

  amplitude.track(logName, eventData);
}

// 텍스트 기반 이벤트 로깅 (캐시에서 이벤트 이름 가져오기)
export function logTextEvent(
  text: string,
  eventProperties: EventProperties = {}
) {
  const eventName = getEventNameFromCache(text);
  handleTrackEvent(eventName, text, {
    ...eventProperties,
    text: text,
  });
}
