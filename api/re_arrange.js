export default async function handler(req, res) {
  const MY_SECRET_TOKEN = process.env.MY_API_TOKEN;
  const authHeader = req.headers['authorization'];

  // 1. ตรวจสอบการยืนยันตัวตน (Token Authentication)
  if (!authHeader || authHeader !== `Bearer ${MY_SECRET_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized: Token ไม่ถูกต้อง หรือไม่ได้ใส่ Token' });
  }

  // 2. ตรวจสอบ Method (รับเฉพาะ POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed (กรุณาใช้ POST เท่านั้น)' });
  }

  try {
    let jsonArray = req.body;

    // ตรวจสอบว่าเป็น JSON Array จริงไหม
    if (!Array.isArray(jsonArray)) {
      return res.status(400).json({ error: 'ข้อมูลที่ส่งมาไม่ใช่ JSON Array' });
    }

    // 💡 ปรับปรุง: ใช้ .flat() เพื่อรองรับ Array ซ้อน Array [[...]] ให้กลายเป็น Array ชั้นเดียว
    // หากข้อมูลเข้ามาเป็นชั้นเดียวอยู่แล้ว การทำ .flat() จะไม่มีผลเสียใดๆ ครับ
    const flatData = jsonArray.flat();

    // 3. เริ่มกระบวนการ Grouping ข้อมูลด้วย .reduce()
    const groupedData = flatData.reduce((acc, currentItem) => {
      const { accountName, attributeName, attributeValue } = currentItem;

      // 🎯 เงื่อนไขที่เพิ่มเข้ามา: ถ้าเจอ "attributeName": "role" ให้ข้าม (Skip) ไปเลย ไม่นำมาคิด
      if (attributeName === 'role') {
        return acc;
      }

      // ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น
      if (!accountName) {
        return acc;
      }

      // ถ้ายังไม่เคยเจอ accountName นี้ในระบบมาก่อน ให้สร้างโครงสร้างเริ่มต้นไว้
      if (!acc[accountName]) {
        acc[accountName] = {
          accountName: accountName,
          attributeValue: []
        };
      }

      // นำ attributeValue ของไอเทมปัจจุบัน ยัดใส่เข้า Array ด้านใน
      if (attributeValue !== undefined && attributeValue !== null) {
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