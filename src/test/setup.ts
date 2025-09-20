import '@testing-library/jest-dom';

// 글로벌 테스트 설정
beforeEach(() => {
  // 각 테스트 전에 document.body를 정리
  document.body.innerHTML = '';
});
