import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

/**
 * 초대 코드를 검증하고 유효하면 해당 커플 문서를 반환합니다.
 * Firestore 구조: /couples/{coupleId} { code, members: [uid1, uid2] }
 */
export async function validateInviteCode(code) {
  const ref = doc(db, 'inviteCodes', code.toUpperCase());
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * 커플 문서에 현재 유저 UID를 등록합니다.
 * members 배열이 이미 2명이면 에러를 던집니다.
 */
export async function joinCouple(coupleId, uid) {
  const ref = doc(db, 'couples', coupleId);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('커플 정보를 찾을 수 없습니다.');

  const data = snap.data();
  if (data.members && data.members.length >= 2 && !data.members.includes(uid)) {
    throw new Error('이미 2명이 가입된 커플입니다.');
  }

  await updateDoc(ref, {
    members: arrayUnion(uid),
  });

  return { id: snap.id, ...data };
}
