export interface ModalResult<T = unknown> {
  data: T | null;
  cancelled: boolean;
}
