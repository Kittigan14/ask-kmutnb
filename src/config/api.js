const CORS_PROXIES = {
  allorigins: 'https://api.allorigins.win/raw?url=',
  corsproxy: 'https://corsproxy.io/?',
  thingproxy: 'https://thingproxy.freeboard.io/fetch/'
};

export const API_CONFIG = {
  N8N_WEBHOOK: 'https://n8n.r0und.xyz/webhook/9a9a560b-1ae9-4bcf-a3ce-3aac8b635830',
  
  USE_PROXY: false,
  
  PROXY: CORS_PROXIES.allorigins,
  
  getWebhookURL: function() {
    if (this.USE_PROXY) {
      return this.PROXY + encodeURIComponent(this.N8N_WEBHOOK);
    }
    return this.N8N_WEBHOOK;
  },
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  timeout: 30000,
  
  retry: {
    maxAttempts: 3,
    delay: 1000
  }
};

export const sendMessageToWebhook = async (message, sessionId, userId, attempt = 1) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    console.log('🚀 Sending message:', { message, sessionId, userId });
    
    const response = await fetch(API_CONFIG.getWebhookURL(), {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ 
        message: message,
        sessionId: sessionId,
        userId: userId 
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log('📄 Response text:', responseText);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response from server');
    }
    
    try {
      const data = JSON.parse(responseText);
      console.log('✅ Parsed data:', data);
      return data;
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return { output: responseText };
    }
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`❌ Attempt ${attempt} failed:`, error);
    
    if (attempt < API_CONFIG.retry.maxAttempts) {
      console.log(`🔄 Retrying in ${API_CONFIG.retry.delay * attempt}ms...`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retry.delay * attempt));
      return sendMessageToWebhook(message, sessionId, userId, attempt + 1);
    }
    
    throw error;
  }
};

export const parseWebhookResponse = (data) => {
  console.log('🔍 Parsing webhook response:', data);
  
  if (typeof data === 'string') {
    return data;
  }
  
  if (data.output) {
    return data.output;
  } 
  
  if (data.message) {
    return data.message;
  } 
  
  if (data.response) {
    return data.response;
  }
  
  if (data.text) {
    return data.text;
  }
  
  if (data.result) {
    return data.result;
  }
  
  if (Array.isArray(data)) {
    if (data.length > 0) {
      const firstItem = data[0];
      if (firstItem.output) return firstItem.output;
      if (firstItem.message) return firstItem.message;
      if (firstItem.response) return firstItem.response;
      if (firstItem.text) return firstItem.text;
    }
  }
  
  try {
    return JSON.stringify(data);
  } catch (e) {
    return 'ขอโทษ, ไม่สามารถประมวลผลได้';
  }
};

export const getErrorMessage = (error) => {
  console.error('💥 Error details:', error);
  
  if (error.name === 'AbortError') {
    return 'การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง';
  }
  
  if (error.message.includes('CORS') || error.message.includes('cors')) {
    return 'ไม่สามารถเชื่อมต่อได้เนื่องจาก CORS policy กรุณาตรวจสอบการตั้งค่า webhook';
  }
  
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed')) {
    return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
  }
  
  if (error.message.includes('500')) {
    return 'เซิร์ฟเวอร์เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง';
  }
  
  if (error.message.includes('404')) {
    return 'ไม่พบ endpoint ที่ระบุ กรุณาตรวจสอบ URL';
  }
  
  if (error.message.includes('Empty response')) {
    return 'เซิร์ฟเวอร์ส่งข้อมูลกลับมาว่างเปล่า กรุณาตรวจสอบการตั้งค่า webhook';
  }
  
  if (error.message.includes('JSON')) {
    return 'เกิดข้อผิดพลาดในการอ่านข้อมูลจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง';
  }
  
  return `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`;
};

export default API_CONFIG;