/**
 * Firebase Admin SDK로 초대 코드와 커플 문서를 초기화하는 스크립트
 * 실행: node scripts/init-firestore.js
 *
 * 사전 조건:
 *   npm install -D firebase-admin
 *   GOOGLE_APPLICATION_CREDENTIALS 환경변수에 서비스 계정 키 경로 설정
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS) });

const db = getFirestore();

async function init() {
  const INVITE_CODE = 'LOVEUS'; // 원하는 코드로 변경
  const COUPLE_ID = 'couple_01';

  // 커플 문서 생성
  await db.collection('couples').doc(COUPLE_ID).set({
    members: [],
    startDate: null,
    createdAt: new Date(),
  });

  // 초대 코드 문서 생성
  await db.collection('inviteCodes').doc(INVITE_CODE).set({
    coupleId: COUPLE_ID,
    createdAt: new Date(),
  });

  console.log(`✅ 초대 코드 [${INVITE_CODE}] 생성 완료`);
  console.log(`   커플 ID: ${COUPLE_ID}`);
  console.log(`   초대 코드를 파트너에게 공유하세요.`);
}

init().catch(console.error);
