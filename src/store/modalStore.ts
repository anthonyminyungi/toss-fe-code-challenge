import type { ComponentType } from 'react';
import { create } from 'zustand';

export interface ModalItem {
  id: string;
  component: ComponentType<unknown>;
  props: unknown;
  onClose?: () => void;
}

interface ModalState {
  modalStack: ModalItem[];
  previousActiveElement: HTMLElement | null;

  // Actions
  pushModal: (modal: Omit<ModalItem, 'id'>) => string;
  popModal: () => void;
  closeModal: (id: string) => void;
  clearAllModals: () => void;
  getCurrentModal: () => ModalItem | null;
  isModalOpen: () => boolean;
}

const generateId = (): string => {
  return `modal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useModalStore = create<ModalState>((set, get) => ({
  modalStack: [],
  previousActiveElement: null,

  pushModal: (modal: Omit<ModalItem, 'id'>) => {
    const { modalStack } = get();

    // 첫 번째 모달인 경우에만 현재 포커스 저장
    if (modalStack.length === 0) {
      const previousActiveElement = document.activeElement as HTMLElement;
      set({ previousActiveElement });
    }

    const id = generateId();
    const modalWithId: ModalItem = { ...modal, id };

    set((state) => ({
      modalStack: [...state.modalStack, modalWithId],
    }));

    return id;
  },

  popModal: () => {
    set((state) => {
      if (state.modalStack.length === 0) return state;

      const modalStack = [...state.modalStack];
      const removedModal = modalStack.pop();

      // onClose 콜백 실행
      if (removedModal?.onClose) {
        removedModal.onClose();
      }

      // 마지막 모달이 닫힌 경우 원래 포커스로 복귀
      if (modalStack.length === 0 && state.previousActiveElement) {
        state.previousActiveElement.focus();
        return { modalStack, previousActiveElement: null };
      }

      return { modalStack };
    });
  },

  closeModal: (id: string) => {
    set((state) => {
      const modalStack = state.modalStack.filter((modal) => {
        if (modal.id === id) {
          // onClose 콜백 실행
          if (modal.onClose) {
            modal.onClose();
          }
          return false;
        }
        return true;
      });

      // 모든 모달이 닫힌 경우 원래 포커스로 복귀
      if (modalStack.length === 0 && state.previousActiveElement) {
        state.previousActiveElement.focus();
        return { modalStack, previousActiveElement: null };
      }

      return { modalStack };
    });
  },

  clearAllModals: () => {
    const { modalStack, previousActiveElement } = get();

    // 모든 모달의 onClose 콜백 실행
    modalStack.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });

    // 원래 포커스로 복귀
    if (previousActiveElement) {
      previousActiveElement.focus();
    }

    set({ modalStack: [], previousActiveElement: null });
  },

  getCurrentModal: () => {
    const { modalStack } = get();
    return modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;
  },

  isModalOpen: () => {
    const { modalStack } = get();
    return modalStack.length > 0;
  },
}));
