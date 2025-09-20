import { z } from 'zod';

// Zod 스키마 정의
export const formSchema = z.object({
  email: z
    .string()
    .min(1, '이메일은 필수입니다.')
    .email('올바른 이메일 형식이 아닙니다.'),
  name: z
    .string()
    .min(1, '이름은 필수입니다.')
    .max(50, '이름은 50자 이하로 입력해주세요.'),
  message: z
    .string()
    .max(1000, '메시지는 1000자 이하로 입력해주세요.')
    .optional(),
});

export type FormData = z.infer<typeof formSchema>;
