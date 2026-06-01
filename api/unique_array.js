export default async function handler(req, res) {
  // 1. อนุญาตให้ใช้ Request แบบ POST เท่านั้น
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed (กรุณาใช้ POST เท่านั้น)' });
  }

  try {
    const jsonArray = req.body;

    // 2. ตรวจสอบว่าเป็น JSON Array จริงไหม
    if (!Array.isArray(jsonArray)) {
      return res.status(400).json({ error: 'ข้อมูลที่ส่งมาไม่ใช่ JSON Array' });
    }

    // 3. ใช้ new Set() กรองค่าซ้ำ และแปลงกลับเป็น Array เหมือนเดิมทันที
    const uniqueArray = [...new Set(jsonArray)];

    // 4. ส่งผลลัพธ์กลับออกไปเป็น JSON Array โดยตรง
    return res.status(200).json(uniqueArray);

  } catch (error) {
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในระบบในการประมวลผลข้อมูล' });
  }
}