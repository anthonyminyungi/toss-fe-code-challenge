import { FormModalContent } from './components/FormModal';
import { ModalRenderer } from './components/ModalRenderer';
import { useModal } from './hooks/useModal';
import type { FormData } from './types/formSchema';
import type { ModalResult } from './types/modalResult';

// Promise resolve 함수들을 저장하는 Map
const resolveMap: { [key: string]: (result: ModalResult<FormData>) => void } =
  {};

const ModalFormPage = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const openFormModal = (options: {
    title: string;
    description?: string;
    initialData?: Partial<FormData>;
  }): Promise<ModalResult<FormData>> => {
    return new Promise((resolve) => {
      const modalId = openModal(FormModalContent, {
        title: options.title,
        description: options.description,
        initialData: options.initialData,
        onSubmit: (data: FormData) => {
          // 폼 제출 시 데이터와 함께 resolve
          const modalResolve = resolveMap[modalId];
          if (modalResolve) {
            modalResolve({
              data,
              cancelled: false,
            });
            delete resolveMap[modalId];
          }

          // 모달 닫기
          closeModal(modalId);
        },
        onClose: () => {
          // 취소 시 null과 함께 resolve
          const modalResolve = resolveMap[modalId];
          if (modalResolve) {
            modalResolve({
              data: null,
              cancelled: true,
            });
            delete resolveMap[modalId];
          }

          // 모달 닫기
          closeModal(modalId);
        },
      });

      // resolve 함수 저장
      resolveMap[modalId] = resolve;
    });
  };

  const handleOpenFormModal = async () => {
    try {
      const result = await openFormModal({
        title: '문의 폼',
        description: '궁금한 사항을 문의해 주세요.',
      });

      if (result.data && !result.cancelled) {
        alert(
          `문의가 접수되었습니다!\n이름: ${result.data.name}\n이메일: ${result.data.email}`,
        );
      }
    } catch (error) {
      console.error('Modal error:', error);
    }
  };

  return (
    <div className="modal-form-page">
      <header>
        <h1>접근성 친화적 모달 폼</h1>
        <p>ESC 키, 오버레이 클릭, 키보드 네비게이션이 모두 지원됩니다.</p>
      </header>

      <main>
        <section className="demo-section">
          <h2>폼 모달 데모</h2>
          <button
            type="button"
            onClick={handleOpenFormModal}
            className="open-modal-btn"
            data-testid="open-modal-trigger"
          >
            문의하기
          </button>

          {isOpen && (
            <p className="modal-status" aria-live="polite">
              모달이 열려있습니다.
            </p>
          )}
        </section>

        <section className="requirements-section">
          <h2>구현된 요구사항</h2>
          <ul>
            <li>✅ ESC 키와 오버레이 클릭으로 모달 닫기</li>
            <li>✅ 포커스 흐름 관리 (제목 → 트리거 버튼 복귀)</li>
            <li>✅ Tab/Shift+Tab 키보드 네비게이션</li>
            <li>✅ 포커스 트랩 (모달 내부에서만 순환)</li>
            <li>✅ 이메일 필드 유효성 검증</li>
            <li>✅ 스크린리더를 위한 오류 메시지 전달</li>
            <li>✅ 배경 스크롤 방지</li>
            <li>
              ✅ ARIA 속성 (aria-modal, aria-labelledby, aria-describedby)
            </li>
            <li>✅ prefers-reduced-motion 지원</li>
            <li>✅ 선언적 API (const result = await openFormModal())</li>
          </ul>
        </section>
      </main>

      {/* 전역 모달 렌더러 */}
      <ModalRenderer />
    </div>
  );
};

export default ModalFormPage;
