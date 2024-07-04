export function firebaseErrorTypeValidation(firebaseError: any) {
  if (firebaseError.code === 'auth/invalid-credential') {
    return '존재하지 않는 계정입니다.';
  } else if (firebaseError.code === 'auth/user-not-found' || 'auth/wrong-password') {
    return '이메일 혹은 비밀번호가 일치하지 않습니다.';
  } else if (firebaseError.code === 'uth/email-already-in-use') {
    return '이미 사용 중인 이메일입니다.';
  } else if (firebaseError.code === 'auth/network-request-failed') {
    return '네트워크 연결에 실패 하였습니다.';
  } else if (firebaseError.code === 'auth/internal-error') {
    return '잘못된 요청입니다.';
  }
}
