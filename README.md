# 접근성 친화적 모달 폼

최신 버전의 **Vitest**와 **React Testing Library**를 활용한 접근성 친화적인 모달 폼 구현 프로젝트입니다.

## 🎯 구현된 핵심 요구사항

### ✅ 모달 닫기

- ESC 키 입력으로 모달 닫기
- 바깥 영역(overlay) 클릭으로 모달 닫기
- 모달 내부 클릭 시에는 닫히지 않음

### ✅ 포커스 흐름 관리

- 모달 열릴 때 제목으로 포커스 이동
- 모달 닫힐 때 원래 트리거 버튼으로 포커스 복귀
- Tab/Shift+Tab 키보드 네비게이션
- 포커스 트랩 (모달 내부에서만 순환)

### ✅ 폼 사용성

- 키보드만으로 폼 입력 및 제출 가능
- 이메일 필드 유효성 검증
- 유효성 검증 실패 시 오류 메시지 스크린리더 전달
- 첫 번째 오류 필드로 자동 포커스 이동

### ✅ UI/UX

- 모달 열림 시 배경 스크롤 방지
- 모달 닫힘 시 배경 스크롤 복원
- 모달 내용이 길면 내부 스크롤 지원

### ✅ 접근성 (Accessibility)

- `aria-modal="true"` 속성
- `aria-labelledby`로 제목과 연결
- `aria-describedby`로 설명과 연결
- `role="alert"`와 `aria-live`로 오류 메시지 전달
- `prefers-reduced-motion` 지원

### ✅ 선언적 호출 API

- `const result = await openFormModal()` 패턴 지원
- 제출 완료 시 입력 데이터 반환
- 취소/닫기 시 null 반환

## 🏗️ 새로운 모달 시스템 아키텍처

### 전역 상태 관리 (Zustand)

- **modalStack**: 현재 열린 모달들의 배열
- 각 모달은 `{ id, component, props }` 구조
- 스택 방식으로 여러 모달 지원 가능

### 컴포넌트 분리

- **Modal**: 백드롭과 컨테이너만 담당하는 기본 모달
- **FormModalContent**: 실제 폼 내용을 담당하는 컴포넌트
- **ModalRenderer**: React Portal로 모든 모달 렌더링

### Hook 기반 API

- **useModal**: 모달 컨트롤러 메서드 제공
- **useFocusManagement**: 포커스 관리
- **useKeyboardNavigation**: 키보드 이벤트 처리

## 📦 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 테스트 실행
pnpm test

# 테스트 UI로 실행
pnpm test:ui

# 커버리지와 함께 테스트
pnpm test:coverage
```

## 🧪 테스트 구조

핵심 요구사항에 최적화된 통합 테스트 파일 구조:

```
src/test/
└── modal.test.tsx  # 모든 핵심 요구사항 테스트
```

### 테스트 커버리지

- 모달 닫기 기능 (ESC, 오버레이 클릭)
- 포커스 흐름 관리 (트리거 → 제목 → 트리거)
- 폼 사용성 (키보드 네비게이션, 유효성 검증)
- UI/UX (스크롤 잠금, 내부 스크롤)
- 접근성 (ARIA 속성, 스크린리더 지원)
- 선언적 API (Promise 기반 호출)
- 통합 시나리오 (완전한 사용자 플로우)

## 🚀 사용법

### 기본 사용법

```tsx
import { openFormModal } from "./utils/modalAPI";

const handleOpenModal = () => {
  openFormModal({
    title: "문의 폼",
    description: "궁금한 사항을 문의해 주세요.",
  }).then((result) => {
    if (result.data && !result.cancelled) {
      console.log("제출된 데이터:", result.data);
    }
  });
};
```

### Hook 사용법

```tsx
import { useModal } from "./hooks/useModal";
import { FormModalContent } from "./components/Modal/FormModal";

const MyComponent = () => {
  const { openModal, closeModal } = useModal();

  const handleOpenCustomModal = () => {
    const modalId = openModal(FormModalContent, {
      title: "커스텀 모달",
      onSubmit: (data) => console.log(data),
      onClose: () => console.log("모달 닫힘"),
    });
  };
};
```

## 📁 프로젝트 구조

```
src/
├── components/Modal/
│   ├── Modal.tsx              # 기본 모달 (백드롭 + 컨테이너)
│   ├── FormModal.tsx          # 폼 모달 내용
│   └── ModalRenderer.tsx      # Portal 기반 모달 렌더러
├── hooks/
│   ├── useModal.ts            # 모달 컨트롤러 훅
│   ├── useFocusManagement.ts  # 포커스 관리 훅
│   └── useKeyboardNavigation.ts # 키보드 네비게이션 훅
├── store/
│   └── modalStore.ts          # Zustand 모달 전역 상태
├── utils/
│   ├── modalAPI.ts            # 선언적 모달 API
│   └── accessibility.ts       # 접근성 유틸리티
├── types/
│   └── modal.ts               # 모달 관련 타입 정의
└── test/
    └── modal.test.tsx         # 통합 테스트
```

## 🔧 기술 스택

- **React 19.1.1** - 최신 React
- **TypeScript** - 타입 안정성
- **Zustand 5.0.2** - 전역 상태 관리
- **Vitest 3.0.4** - 최신 테스트 프레임워크
- **React Testing Library 16.2.0** - 컴포넌트 테스팅
- **User Event 14.5.2** - 사용자 상호작용 시뮬레이션

## ♿ 접근성 특징

- **키보드 네비게이션**: Tab, Shift+Tab, Enter, ESC 지원
- **스크린 리더 지원**: 적절한 ARIA 속성과 live region
- **포커스 관리**: 논리적 포커스 흐름 보장
- **모션 감소**: `prefers-reduced-motion` 설정 지원
- **시멘틱 HTML**: 올바른 역할과 속성 사용

## 🎨 커스터마이징

모달 시스템은 높은 확장성을 제공합니다:

1. **새로운 모달 타입**: 새 컴포넌트 작성 후 `useModal().openModal()` 사용
2. **커스텀 스타일**: CSS 클래스를 통한 스타일링 지원
3. **추가 기능**: 훅 시스템을 통한 기능 확장 가능

## 📈 성능 최적화

- **Portal 렌더링**: DOM 트리 외부 렌더링으로 성능 향상
- **스택 기반**: 여러 모달 지원하되 메모리 효율적 관리
- **이벤트 관리**: 적절한 cleanup으로 메모리 누수 방지
