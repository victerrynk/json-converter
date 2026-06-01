export default async function handler(req, res) {
  // 1. ระบบความปลอดภัยพื้นฐาน: อนุญาตให้ใช้ Request แบบ POST เท่านั้น
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed (กรุณาใช้ POST เท่านั้น)' });
  }

  try {
    // 2. รับข้อมูล JSON Array ที่ส่งมาจากต้นทาง
    const jsonArray = req.body;

    // 3. ตรวจสอบว่าข้อมูลที่ส่งมาเป็นรูปแบบ Array จริงไหมเพื่อความปลอดภัยของระบบ
    if (!Array.isArray(jsonArray)) {
      return res.status(400).json({ error: 'ข้อมูลที่ส่งมาไม่ใช่ JSON Array' });
    }

    // 4. ประมวลผลดึง [ ] ออก โดยการแปลงแต่ละค่าใน Array แล้วเชื่อมด้วยเครื่องหมายจุลภาค (, )
    const cleanString = jsonArray.map(item => {
      // หากค่าด้านในเป็น Object ย่อย ให้แปลงเป็นข้อความก่อนเพื่อไม่ให้เกิดคำว่า [object Object]
      if (typeof item === 'object' && item !== null) {
        return JSON.stringify(item);
      }
      return item;
    }).join(', ');

    // 5. ส่งผลลัพธ์ที่แปลงเสร็จแล้วตอบกลับไป
    return res.status(200).json({ 
      success: true,
      result: cleanString 
    });

  } catch (error) {
    // ระบบป้องกันหากข้อมูลที่ส่งเข้ามาพัง หรือโครงสร้างไฟล์มีปัญหา
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในระบบในการประมวลผลข้อมูล' });
  }
}