import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '../store/modalStore';
import { ModalWrapper } from './ModalWrapper';

// 모달을 렌더링할 DOM 컨테이너 생성
const createModalContainer = (): HTMLDivElement => {
  const existingContainer = document.getElementById('modal-root');
  if (existingContainer) {
    return existingContainer as HTMLDivElement;
  }

  const container = document.createElement('div');
  container.id = 'modal-root';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-label', 'Modals');
  document.body.appendChild(container);

  return container;
};

// 전역 모달 상태를 구독하고 모든 모달을 Portal로 렌더링
export const ModalRenderer: React.FC = () => {
  const { modalStack } = useModalStore();
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    const container = createModalContainer();
    setPortalContainer(container);

    return () => {
      // cleanup 시 컨테이너 제거
      if (container?.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // 컨테이너가 준비되지 않았으면 렌더링하지 않음
  if (!portalContainer) {
    return null;
  }

  // 모달 스택이 비어있으면 렌더링하지 않음
  if (modalStack.length === 0) {
    return null;
  }

  return createPortal(
    <div className="modal-layer">
      {modalStack.map((modal, index) => {
        const ModalComponent = modal.component;

        // 각 모달을 ModalWrapper 컴포넌트로 래핑하여 렌더링
        return (
          <div
            key={modal.id}
            className="modal-stack-item"
            style={{
              zIndex: 1000 + index, // 스택 순서에 따른 z-index
            }}
            data-modal-id={modal.id}
            data-testid={`modal-${modal.id}`}
          >
            <ModalWrapper
              onClose={() => {
                // 모달 닫기 시 onClose 콜백 호출
                if (modal.onClose) {
                  modal.onClose();
                }
              }}
              className={`modal-${modal.id}`}
            >
              <ModalComponent
                {...(modal.props as unknown as Record<string, unknown>)}
              />
            </ModalWrapper>
          </div>
        );
      })}
    </div>,
    portalContainer,
  );
};

export default ModalRenderer;
