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

    // 3. เริ่มกระบวนการ Grouping ข้อมูลด้วย .reduce()
    const groupedData = jsonArray.reduce((acc, currentItem) => {
      const { accountName, attributeValue } = currentItem;

      // ถ้ายังไม่เคยเจอ accountName นี้ในระบบมาก่อน ให้สร้างโครงสร้างเริ่มต้นไว้
      if (!acc[accountName]) {
        acc[accountName] = {
          accountName: accountName,
          attributeValue: []
        };
      }

      // นำ attributeValue ของไอเทมปัจจุบัน ยัดใส่เข้า Array ด้านใน
      // (ใส่ไอเดียเผื่อไว้: ใช้ !acc[accountName].attributeValue.includes(attributeValue) ถ้าไม่ต้องการค่าซ้ำด้านใน)
      if (attributeValue) {
        acc[accountName].attributeValue.push(attributeValue);
      }

      return acc;
    }, {}); // เริ่มต้นด้วย Object ว่าง {}

    // 4. แปลง Object ที่จับกลุ่มเสร็จแล้ว กลับมาเป็น Array ของผลลัพธ์
    const finalResult = Object.values(groupedData);

    // 5. ส่งผลลัพธ์กลับออกไปเป็น JSON Array
    return res.status(200).json(finalResult);

  } catch (error) {
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในระบบในการประมวลผลข้อมูล' });
  }
}