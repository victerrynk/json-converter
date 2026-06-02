export default async function handler(req, res) {

  const MY_SECRET_TOKEN = process.env.MY_API_TOKEN;


  const authHeader = req.headers['authorization'];

 
  if (!authHeader || authHeader !== `Bearer ${MY_SECRET_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized: Token ไม่ถูกต้อง หรือไม่ได้ใส่ Token' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed (กรุณาใช้ POST เท่านั้น)' });
  }

  try {

    const jsonArray = req.body;


    if (!Array.isArray(jsonArray)) {
      return res.status(400).json({ error: 'ข้อมูลที่ส่งมาไม่ใช่ JSON Array' });
    }


    const cleanString = jsonArray.map(item => {

      if (typeof item === 'object' && item !== null) {
        return JSON.stringify(item);
      }
      return item;
    }).join(', ');


    return res.status(200).json({ 
      success: true,
      result: cleanString 
    });

  } catch (error) {

    return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในระบบในการประมวลผลข้อมูล' });
  }
}