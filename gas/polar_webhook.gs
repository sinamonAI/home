/**
 * SnapQuant - Polar 웹훅 수신 (Google Apps Script)
 *
 * 이 스크립트를 GAS 프로젝트에 복사하고 웹 앱으로 배포하세요.
 * 배포 URL을 Polar 웹훅 엔드포인트로 설정합니다.
 *
 * 필요 설정:
 * 1. WEBHOOK_SECRET: Polar 대시보드에서 생성한 웹훅 시크릿
 * 2. FIREBASE_PROJECT_ID: Firebase 프로젝트 ID
 * 3. SERVICE_ACCOUNT_EMAIL: Firebase 서비스 계정 이메일
 * 4. SERVICE_ACCOUNT_KEY: 서비스 계정 비공개 키 (PEM 형식)
 */

// ===== 설정 =====
const CONFIG = {
  WEBHOOK_SECRET: PropertiesService.getScriptProperties().getProperty('POLAR_WEBHOOK_SECRET') || '',
  FIREBASE_PROJECT_ID: 'quantdrive-86982',
  // 서비스 계정은 스크립트 속성에서 로드
  SERVICE_ACCOUNT_EMAIL: PropertiesService.getScriptProperties().getProperty('SA_EMAIL') || '',
  SERVICE_ACCOUNT_KEY: PropertiesService.getScriptProperties().getProperty('SA_KEY') || '',
};

// ===== 웹훅 수신 (POST) =====
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const headers = e.parameter; // GAS에서는 헤더 접근이 제한적

    // 웹훅 이벤트 처리
    const eventType = payload.type;
    const data = payload.data;

    // 고객 이메일 추출
    const customerEmail = extractEmail(data);

    if (!customerEmail) {
      console.log('고객 이메일 없음: ' + eventType);
      return jsonResponse({ status: 'ok', message: '이메일 없음' });
    }

    console.log('[Polar 웹훅] 이벤트: ' + eventType + ', 이메일: ' + customerEmail);

    // Firestore 액세스 토큰 발급
    const accessToken = getFirestoreAccessToken();
    if (!accessToken) {
      console.error('Firestore 토큰 발급 실패');
      return jsonResponse({ status: 'error', message: '토큰 실패' });
    }

    // 이메일로 사용자 검색
    const userId = findUserByEmail(accessToken, customerEmail);
    if (!userId) {
      console.log('사용자 미발견: ' + customerEmail);
      return jsonResponse({ status: 'ok', message: '사용자 미발견' });
    }

    // 이벤트 타입별 처리
    processEvent(accessToken, userId, eventType, data);

    return jsonResponse({ status: 'ok' });

  } catch (err) {
    console.error('웹훅 처리 오류: ' + err.message);
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// GET 요청 처리 (테스트용)
function doGet(e) {
  return jsonResponse({
    status: 'ok',
    message: 'SnapQuant Polar Webhook Endpoint (GAS)',
    timestamp: new Date().toISOString()
  });
}

// ===== 이메일 추출 =====
function extractEmail(data) {
  if (!data) return null;

  // Polar 웹훅 페이로드에서 이메일 찾기
  if (data.customer && data.customer.email) return data.customer.email;
  if (data.subscription && data.subscription.customer && data.subscription.customer.email) {
    return data.subscription.customer.email;
  }
  if (data.email) return data.email;
  if (data.user && data.user.email) return data.user.email;

  return null;
}

// ===== 이벤트 처리 =====
function processEvent(accessToken, userId, eventType, data) {
  const now = new Date().toISOString();

  switch (eventType) {
    case 'subscription.created':
    case 'subscription.active': {
      // 구독 활성화 → Pro
      const updateData = {
        tier: 'pro',
        subscriptionStatus: 'active',
        subscribedAt: now,
        lastWebhookEvent: eventType,
        lastWebhookAt: now,
      };

      // 구독 ID 추출
      const subId = (data.subscription && data.subscription.id) || data.id;
      if (subId) updateData.subscriptionId = subId;

      // 현재 구독 기간 종료일
      const periodEnd = (data.subscription && data.subscription.current_period_end) || data.current_period_end;
      if (periodEnd) updateData.currentPeriodEnd = periodEnd;

      updateFirestoreUser(accessToken, userId, updateData);
      console.log('✅ Pro 활성화: ' + userId);
      break;
    }

    case 'subscription.updated': {
      // 구독 업데이트 — 상태 확인
      const status = (data.subscription && data.subscription.status) || data.status;

      if (status === 'active') {
        updateFirestoreUser(accessToken, userId, {
          tier: 'pro',
          subscriptionStatus: 'active',
          lastWebhookEvent: eventType,
          lastWebhookAt: now,
        });
        console.log('✅ Pro 유지: ' + userId);
      } else if (status === 'canceled' || status === 'revoked') {
        updateFirestoreUser(accessToken, userId, {
          tier: 'starter',
          subscriptionStatus: 'canceled',
          canceledAt: now,
          lastWebhookEvent: eventType,
          lastWebhookAt: now,
        });
        console.log('⚠️ 구독 취소: ' + userId);
      }
      break;
    }

    case 'subscription.canceled':
    case 'subscription.revoked': {
      // 구독 취소/해지 → Starter
      updateFirestoreUser(accessToken, userId, {
        tier: 'starter',
        subscriptionStatus: 'canceled',
        canceledAt: now,
        lastWebhookEvent: eventType,
        lastWebhookAt: now,
      });
      console.log('⚠️ 구독 취소: ' + userId);
      break;
    }

    default:
      console.log('미처리 이벤트: ' + eventType);
  }
}

// ===== Firestore REST API =====

// 이메일로 사용자 검색
function findUserByEmail(accessToken, email) {
  const url = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.FIREBASE_PROJECT_ID +
    '/databases/(default)/documents:runQuery';

  const query = {
    structuredQuery: {
      from: [{ collectionId: 'users' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'email' },
          op: 'EQUAL',
          value: { stringValue: email }
        }
      },
      limit: 1
    }
  };

  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(query),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const results = JSON.parse(response.getContentText());

  if (results && results.length > 0 && results[0].document) {
    // 문서 경로에서 UID 추출: projects/.../documents/users/{uid}
    const docPath = results[0].document.name;
    const parts = docPath.split('/');
    return parts[parts.length - 1];
  }

  return null;
}

// Firestore 사용자 문서 업데이트 (PATCH - merge)
function updateFirestoreUser(accessToken, userId, data) {
  const url = 'https://firestore.googleapis.com/v1/projects/' + CONFIG.FIREBASE_PROJECT_ID +
    '/databases/(default)/documents/users/' + userId;

  // 데이터를 Firestore REST API 형식으로 변환
  const fields = {};
  const fieldPaths = [];

  for (const key in data) {
    fieldPaths.push(key);
    const value = data[key];
    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      fields[key] = { integerValue: String(value) };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    }
  }

  const updateMask = fieldPaths.map(f => 'updateMask.fieldPaths=' + f).join('&');

  const options = {
    method: 'patch',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({ fields: fields }),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url + '?' + updateMask, options);
  const code = response.getResponseCode();

  if (code !== 200) {
    console.error('Firestore 업데이트 실패 (' + code + '): ' + response.getContentText());
  }

  return code === 200;
}

// ===== 인증: 서비스 계정 JWT → 액세스 토큰 =====
function getFirestoreAccessToken() {
  const email = CONFIG.SERVICE_ACCOUNT_EMAIL;
  const key = CONFIG.SERVICE_ACCOUNT_KEY;

  if (!email || !key) {
    console.error('서비스 계정 설정이 없습니다.');
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const headerB64 = Utilities.base64EncodeWebSafe(JSON.stringify(header));
  const claimB64 = Utilities.base64EncodeWebSafe(JSON.stringify(claim));
  const signatureInput = headerB64 + '.' + claimB64;

  // RSA-SHA256 서명
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeRsaSha256Signature(signatureInput, key)
  );

  const jwt = signatureInput + '.' + signature;

  // JWT로 액세스 토큰 교환
  const tokenResponse = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    },
    muteHttpExceptions: true,
  });

  const tokenData = JSON.parse(tokenResponse.getContentText());

  if (tokenData.access_token) {
    return tokenData.access_token;
  }

  console.error('토큰 발급 실패: ' + tokenResponse.getContentText());
  return null;
}

// ===== 헬퍼 =====
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== 테스트 함수 =====
function testWebhook() {
  // Firestore 연결 테스트
  const token = getFirestoreAccessToken();
  if (token) {
    console.log('✅ Firestore 토큰 발급 성공');

    // 테스트 이메일로 사용자 검색
    const userId = findUserByEmail(token, 'test@example.com');
    console.log('사용자 ID: ' + (userId || '미발견'));
  } else {
    console.log('❌ Firestore 토큰 발급 실패 - 서비스 계정 설정을 확인하세요');
  }
}
