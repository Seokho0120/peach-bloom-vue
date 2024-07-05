import type { FirebaseError } from 'firebase/app';

export function firebaseErrorTypeValidation(firebaseError: FirebaseError) {
  switch (firebaseError.code) {
    case 'auth/too-many-requests':
      return '계정 접근이 일시적으로 차단되었습니다. 잠시 후 다시 시도해 주세요.';
    case 'auth/invalid-credential':
      return '인증 절차에에 문제가 발생했습니다. 관리자에게 문의 부탁드립니다.';
    case 'auth/user-not-found':
      return '존재하지 않는 계정입니다.';
    case 'auth/wrong-password':
      return '비밀번호가 올바르지 않습니다.';
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/network-request-failed':
      return '네트워크 연결에 실패하였습니다.';
    case 'auth/internal-error':
      return '잘못된 요청입니다.';
    default:
      return '알 수 없는 오류가 발생했습니다. 관리자에게 문의 부탁드립니다.';
  }
}
