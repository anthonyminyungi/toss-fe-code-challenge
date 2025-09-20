import type { ComponentType } from "react";
import { useModalStore } from "../store/modalStore";

export interface UseModalReturn {
  isOpen: boolean;
  openModal: <P = unknown>(component: ComponentType<P>, props?: P) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  getCurrentModal: () => unknown;
}

export const useModal = (): UseModalReturn => {
  const {
    pushModal,
    popModal,
    closeModal: storeCloseModal,
    clearAllModals,
    getCurrentModal,
    isModalOpen,
  } = useModalStore();

  const openModal = <P = unknown>(
    component: ComponentType<P>,
    props?: P
  ): string => {
    const modalId = pushModal({
      component: component as ComponentType<unknown>,
      props: props as unknown,
    });

    return modalId;
  };

  const closeModal = (id?: string) => {
    if (id) {
      storeCloseModal(id);
    } else {
      // ID가 없으면 최상위 모달 닫기
      popModal();
    }
  };

  const closeAllModals = () => {
    clearAllModals();
  };

  return {
    isOpen: isModalOpen(),
    openModal,
    closeModal,
    closeAllModals,
    getCurrentModal,
  };
};
