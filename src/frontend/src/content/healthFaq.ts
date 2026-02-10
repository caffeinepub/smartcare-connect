export interface FAQEntry {
  keywords: string[];
  answer: string;
}

export const healthFAQ: FAQEntry[] = [
  {
    keywords: ['medication', 'medicine', 'pill', 'dose', 'take'],
    answer: 'Always take medications exactly as prescribed by your doctor. Set reminders to help you remember. If you miss a dose, take it as soon as you remember unless it\'s almost time for the next dose. Never double up on doses. Contact your doctor if you have questions about your medications.'
  },
  {
    keywords: ['wound', 'incision', 'cut', 'stitches', 'bandage'],
    answer: 'Keep your wound clean and dry. Change bandages as instructed by your healthcare team. Watch for signs of infection: increased redness, swelling, warmth, pus, or fever. If you notice any of these signs, contact your doctor immediately.'
  },
  {
    keywords: ['pain', 'hurt', 'ache', 'sore'],
    answer: 'Some pain after discharge is normal, but it should gradually improve. Take pain medication as prescribed. Use ice or heat as recommended. If pain worsens, becomes severe, or doesn\'t improve with medication, contact your doctor.'
  },
  {
    keywords: ['water', 'drink', 'hydration', 'fluid'],
    answer: 'Staying hydrated is important for recovery. Aim to drink 6-8 glasses of water daily unless your doctor has given you different instructions. Signs of dehydration include dark urine, dizziness, and dry mouth.'
  },
  {
    keywords: ['exercise', 'activity', 'walk', 'movement'],
    answer: 'Follow your doctor\'s activity guidelines carefully. Start slowly and gradually increase activity as approved. Walking is often encouraged for recovery. Avoid heavy lifting or strenuous activity until cleared by your doctor.'
  },
  {
    keywords: ['diet', 'food', 'eat', 'nutrition'],
    answer: 'Eat a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains. Follow any dietary restrictions given by your doctor. Small, frequent meals may be easier to tolerate initially. Stay hydrated and avoid alcohol unless approved.'
  },
  {
    keywords: ['fever', 'temperature', 'hot', 'chills'],
    answer: 'A fever over 100.4°F (38°C) may indicate infection. Monitor your temperature if you feel warm or have chills. Contact your doctor if you develop a fever, especially if accompanied by other symptoms like increased pain or wound drainage.'
  },
  {
    keywords: ['sleep', 'rest', 'tired', 'fatigue'],
    answer: 'Rest is crucial for recovery. Get plenty of sleep and take naps if needed. Fatigue is common after medical procedures. Gradually increase activity as you feel stronger. If extreme fatigue persists, discuss with your doctor.'
  },
  {
    keywords: ['emergency', 'urgent', 'serious', 'help'],
    answer: 'Seek immediate medical attention for: severe chest pain, difficulty breathing, severe bleeding, signs of stroke, loss of consciousness, or severe allergic reactions. Use the SOS button in your patient dashboard or call emergency services (911).'
  },
  {
    keywords: ['blood pressure', 'bp', 'hypertension'],
    answer: 'Monitor your blood pressure as directed. Normal blood pressure is typically below 120/80. Take readings at the same time each day. Record all readings in your vitals log. Contact your doctor if readings are consistently high or if you experience symptoms like severe headache or vision changes.'
  },
  {
    keywords: ['glucose', 'blood sugar', 'diabetes'],
    answer: 'If you\'re monitoring blood sugar, check it as directed by your doctor. Keep a log of your readings. Normal fasting glucose is typically 70-100 mg/dL. Contact your doctor if readings are consistently outside your target range or if you experience symptoms of high or low blood sugar.'
  },
  {
    keywords: ['device', 'monitor', 'equipment', 'measure'],
    answer: 'Use your monitoring devices as instructed. Keep them clean and charged. Record measurements regularly in your patient dashboard. If a device isn\'t working properly or gives unusual readings, contact your healthcare team.'
  }
];

export const fallbackResponse = 'I\'m not sure about that specific question. For personalized medical advice, please contact your doctor or healthcare provider. If this is an emergency, use the SOS button or call emergency services immediately.';
