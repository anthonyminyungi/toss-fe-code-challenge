import type React from "react";
import { useCallback, useEffect, useRef } from "react";

interface BaseModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

// 포커스 가능한 요소들의 선택자
const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input[type="text"]:not([disabled])',
  'input[type="radio"]:not([disabled])',
  'input[type="checkbox"]:not([disabled])',
  'input[type="email"]:not([disabled])',
  'input[type="password"]:not([disabled])',
  'input[type="submit"]:not([disabled])',
  'input[type="reset"]:not([disabled])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// 기본 ModalWrapper 컴포넌트 - 백드롭과 컨테이너만 담당
export const ModalWrapper: React.FC<BaseModalProps> = ({
  onClose,
  children,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 포커스 가능한 요소들 가져오기
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!modalRef.current) return [];

    const elements = modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS);
    return Array.from(elements).filter((element) => {
      const htmlElement = element as HTMLElement;
      // 숨겨진 요소나 display:none인 요소 제외
      return (
        htmlElement.offsetParent !== null &&
        !htmlElement.hasAttribute("hidden") &&
        htmlElement.getAttribute("aria-hidden") !== "true"
      );
    }) as HTMLElement[];
  }, []);

  // 포커스 트랩 처리
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = getFocusableElements();

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        // Shift + Tab (역방향)
        if (e.shiftKey) {
          if (
            activeElement === firstElement ||
            !focusableElements.includes(activeElement)
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        }
        // Tab (정방향)
        else {
          if (
            activeElement === lastElement ||
            !focusableElements.includes(activeElement)
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose, getFocusableElements]
  );

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // 배경 스크롤 잠금
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 오버레이 클릭 처리
  const handleOverlayClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleOverlayClick(e);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="모달 닫기"
      data-testid="modal-overlay"
    >
      <div
        ref={modalRef}
        className={`modal-container ${className || ""}`}
        role="dialog"
        aria-modal="true"
        data-testid="modal-container"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
