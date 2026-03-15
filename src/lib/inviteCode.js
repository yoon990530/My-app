// Mock: 아무 코드나 허용
export async function validateInviteCode(code) {
  if (!code || code.trim() === '') return null;
  return { id: code.toUpperCase(), coupleId: 'demo-couple' };
}

export async function joinCouple(coupleId, uid) {
  return { id: coupleId, members: [uid] };
}
