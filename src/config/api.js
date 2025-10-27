// src/config/api.js

/**
 * API Configuration สำหรับจัดการ CORS และ Webhook endpoints
 */

// CORS Proxy options (สำหรับ development)
const CORS_PROXIES = {
  allorigins: 'https://api.allorigins.win/raw?url=',
  corsproxy: 'https://corsproxy.io/?',
  thingproxy: 'https://thingproxy.freeboard.io/fetch/'
};

export const API_CONFIG = {
  // n8n Webhook URL
  N8N_WEBHOOK: 'https://n8n.r0und.xyz/webhook-test/9a9a560b-1ae9-4bcf-a3ce-3aac8b635830',
  
  // เปิด/ปิดการใช้ CORS Proxy
  USE_PROXY: true, // เปลี่ยนเป็น false เมื่อแก้ CORS ที่ server แล้ว
  
  // เลือก CORS Proxy
  PROXY: CORS_PROXIES.allorigins,
  
  // สร้าง URL สำหรับ request
  getWebhookURL: function() {
    if (this.USE_PROXY) {
      return this.PROXY + encodeURIComponent(this.N8N_WEBHOOK);
    }
    return this.N8N_WEBHOOK;
  },
  
  // Default headers
  headers: {
    'Content-Type': 'application/json'
  },
  
  // Timeout setting (milliseconds)
  timeout: 30000,
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    delay: 1000 // ms
  }
};

/**
 * ฟังก์ชันสำหรับส่ง request พร้อม retry mechanism
 */
export const sendMessageToWebhook = async (message, sessionId, userId, attempt = 1) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const response = await fetch(API_CONFIG.getWebhookURL(), {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ message, sessionId, userId }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Retry logic
    if (attempt < API_CONFIG.retry.maxAttempts) {
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retry.delay * attempt));
      return sendMessageToWebhook(message, sessionId, userId, attempt + 1);
    }
    
    throw error;
  }
};

/**
 * ฟังก์ชันแปลง response เป็นข้อความ
 */
export const parseWebhookResponse = (data) => {
  if (data.output) {
    return data.output;
  } else if (Array.isArray(data) && data[0]?.output) {
    return data[0].output;
  } else if (data.message) {
    return data.message;
  } else if (data.response) {
    return data.response;
  } else if (typeof data === 'string') {
    return data;
  }
  return 'ขอโทษ, ไม่สามารถประมวลผลได้';
};

/**
 * ฟังก์ชันสร้าง error message ที่เป็นมิตร
 */
export const getErrorMessage = (error) => {
  if (error.name === 'AbortError') {
    return 'การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง';
  }
  
  if (error.message.includes('CORS')) {
    return 'ไม่สามารถเชื่อมต่อได้เนื่องจาก CORS policy กรุณาตรวจสอบการตั้งค่า webhook';
  }
  
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
  }
  
  if (error.message.includes('500')) {
    return 'เซิร์ฟเวอร์เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง';
  }
  
  if (error.message.includes('404')) {
    return 'ไม่พบ endpoint ที่ระบุ กรุณาตรวจสอบ URL';
  }
  
  return 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง';
};

export default API_CONFIG;