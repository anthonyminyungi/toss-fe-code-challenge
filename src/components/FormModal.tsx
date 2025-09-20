import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useEffect, useId, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { type FormData, formSchema } from '../types/formSchema';

export interface FormModalContentProps {
  title: string;
  description?: string;
  onSubmit: (data: FormData) => void | Promise<void>;
  onClose: () => void;
  initialData?: Partial<FormData>;
}

// FormModal 내용 컴포넌트 - Modal의 children으로 사용됨
export const FormModalContent: React.FC<FormModalContentProps> = ({
  title,
  description,
  onSubmit,
  onClose,
  initialData = {},
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const uniqueId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData.email || '',
      name: initialData.name || '',
      message: initialData.message || '',
    },
  });

  // 모달 열릴 때 제목으로 포커스 이동
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData.email) setValue('email', initialData.email);
    if (initialData.name) setValue('name', initialData.name);
    if (initialData.message) setValue('message', initialData.message);
  }, [initialData, setValue]);

  const onFormSubmit = async (data: FormData) => {
    try {
      const result = onSubmit(data);

      // Promise인지 확인하고 처리
      if (result && typeof result.then === 'function') {
        await result;
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleFormError = () => {
    // 첫 번째 에러 필드로 포커스 이동
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
    }
  };

  return (
    <div className="form-modal-content">
      <header className="modal-header">
        <h2
          ref={titleRef}
          id={`modal-title-${uniqueId}`}
          className="modal-title"
          tabIndex={-1}
          aria-labelledby="modal-title"
        >
          {title}
        </h2>
        {description && (
          <p id={`modal-description-${uniqueId}`} className="modal-description">
            {description}
          </p>
        )}
      </header>

      <form
        onSubmit={handleSubmit(onFormSubmit, handleFormError)}
        data-testid="modal-form"
        noValidate
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div className="form-group">
          <label htmlFor={`email-${uniqueId}`} className="form-label">
            이메일 *
          </label>
          <input
            type="email"
            id={`email-${uniqueId}`}
            {...register('email')}
            className={`form-input ${errors.email ? 'error' : ''}`}
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
            data-testid="email-input"
          />
          {errors.email && (
            <div
              id={`email-error-${uniqueId}`}
              className="error-message"
              role="alert"
              aria-live="polite"
              data-testid="email-error"
            >
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={`name-${uniqueId}`} className="form-label">
            이름 *
          </label>
          <input
            type="text"
            id={`name-${uniqueId}`}
            {...register('name')}
            className={`form-input ${errors.name ? 'error' : ''}`}
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!errors.name}
            data-testid="name-input"
          />
          {errors.name && (
            <div
              id={`name-error-${uniqueId}`}
              className="error-message"
              role="alert"
              aria-live="polite"
              data-testid="name-error"
            >
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={`message-${uniqueId}`} className="form-label">
            메시지
          </label>
          <textarea
            id={`message-${uniqueId}`}
            {...register('message')}
            className={`form-textarea ${errors.message ? 'error' : ''}`}
            aria-describedby={errors.message ? 'message-error' : 'message-help'}
            aria-invalid={!!errors.message}
            data-testid="message-input"
            rows={4}
          />
          {errors.message && (
            <div
              id={`message-error-${uniqueId}`}
              className="error-message"
              role="alert"
              aria-live="polite"
              data-testid="message-error"
            >
              {errors.message.message}
            </div>
          )}
          {!errors.message && (
            <div id={`message-help-${uniqueId}`} className="field-help">
              선택사항입니다.
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel"
            disabled={isSubmitting}
            data-testid="cancel-button"
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
            data-testid="submit-button"
          >
            {isSubmitting ? '제출 중...' : '제출'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormModalContent;
