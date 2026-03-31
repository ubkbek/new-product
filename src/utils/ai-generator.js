/**
 * AI Service for generating product technical specifications
 * Supports Uzbek and Russian product names.
 * Version: 7.0 (Flash-Latest-Stable)
 */
console.log('--- AI Generator Utility Loaded: v7.0 (Flash-Latest-Stable) ---');

// Placeholder for Gemini API Key
// Users can get a free key at https://aistudio.google.com/
const GEMINI_API_KEY = 'AIzaSyDbvpEb08aBFw4Se9S53lIssFq_xTsXouE'; 

/**
 * Generates technical specifications based on product titles.
 * @param {string} titleUz - Product title in Uzbek
 * @param {string} titleRu - Product title in Russian
 * @param {boolean} mock - Whether to return a mock response for testing
 * @returns {Promise<{uz: string, ru: string}>}
 */
export async function generateProductSpecs(titleUz, titleRu, forceMock = false) {
  if (forceMock || !GEMINI_API_KEY) {
    if (forceMock) {
      console.log('AI Generation: Forcing mock data');
    } else {
      console.log('AI Generation: Using mock data (No API Key provided)');
    }
    return simulateAIResponse(titleUz, titleRu);
  }

  const prompt = `
    Quyidagi mahsulot nomi asosida 2 xil texnik parametrlar variantini yaratib ber.
    Har bir variantda O'zbek va Rus tillarida ma'lumot bo'lsin.
    Ma'lumotlar mantiqiy guruhlarga bo'lingan bo'lsin (masalan: Displey, Kamera, Akkumulyator va hk).
    
    Mahsulot nomi (O'zbek): ${titleUz}
    Mahsulot nomi (Rus): ${titleRu}
    
    Javobni FAQAT quyidagi JSON formatida qaytar (boshqa matn qo'shma):
    [
      {
        "id": 1,
        "uz": { "groups": [ { "icon": "📱", "title": "Guruh nomi", "items": ["parametr 1", "parametr 2"] } ] },
        "ru": { "groups": [ { "icon": "📱", "title": "Название группы", "items": ["параметр 1", "параметр 2"] } ] }
      },
      {
        "id": 2,
        "uz": { "groups": [ { "icon": "🚀", "title": "Guruh nomi", "items": ["parametr 1", "parametr 2"] } ] },
        "ru": { "groups": [ { "icon": "🚀", "title": "Название группы", "items": ["параметр 1", "параметр 2"] } ] }
      }
    ]
  `;

  try {
    // Using v1beta as it is confirmed to have gemini-flash-latest available for this key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    console.log('AI Request URL:', url.replace(GEMINI_API_KEY, 'REDACTED'));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('AI kutilgan formatda javob bermadi');
    }

    let text = data.candidates[0].content.parts[0].text;
    
    // Clean JSON from potential markdown blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const variants = JSON.parse(text);
      return variants;
    } catch (e) {
      console.error('JSON Parsing Error:', e, text);
      throw new Error('AI ma\'lumotlarini o\'qishda xatolik yuz berdi (JSON format xatosi)');
    }
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Diagnostic: Try to list models to check API key permissions
    try {
      const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
      const listData = await listResponse.json();
      console.log('Available Models for this key:', listData);
    } catch (e) {
      console.error('Could not list models:', e);
    }

    throw new Error('AI orqali ma\'lumot olishda xatolik yuz berdi. API Key huquqlarini tekshiring.');
  }
}

/**
 * Simulates an AI response for demonstration purposes.
 */
function simulateAIResponse(titleUz, titleRu) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockVariants = [
        {
          id: 1,
          uz: {
            groups: [
              { icon: '⚡', title: 'Asosiy xususiyatlar', items: [`${titleUz} - 2024 model`, "Yuqori sifat", "1 yil kafolat"] }
            ]
          },
          ru: {
            groups: [
              { icon: '⚡', title: 'Основные характеристики', items: [`${titleRu} - модель 2024`, "Высокое качество", "1 год гарантии"] }
            ]
          }
        },
        {
          id: 2,
          uz: {
            groups: [
              { icon: '🚀', title: 'Premium xususiyatlar', items: [`${titleUz} PRO`, "Premium material", "2 yil kafolat"] }
            ]
          },
          ru: {
            groups: [
              { icon: '🚀', title: 'Premium характеристики', items: [`${titleRu} PRO`, "Премиум материал", "2 года гарантии"] }
            ]
          }
        }
      ];
      resolve(mockVariants);
    }, 1500);
  });
}
