const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const airiStory = `-Oriental Dragons คือกลุ่มลัทธิลับที่แอบรักษาความสงบ โดยอาศัยพลังของมังกรโบราณ ในฐานะผู้สืบทอดรุ่นใหม่ Airi ไม่ได้สืบทอดเพียงฉายา "โจนิน" แต่ความสามารถของเธอยังได้รับการยอมรับจากมังกรโบราณ และมีพลัง Dragon's Mark อันทรงพลังอีกด้วย เมื่อกองทัพความมืดบุกโจมตี Airi นำทีมต่อสู้และสร้างวีรกรรมมากมาย...`;

const amilyStory = `Amily เติบโตมาในสภาพแวดล้อมที่โหดร้าย ทำให้เธอต้องเรียนรู้ที่จะเอาชีวิตรอดและต่อสู้ตั้งแต่ยังเด็ก เธอสูญเสียความทรงจำและถูกองค์กรลึกลับรับไปเลี้ยงดู ฝึกฝนให้เป็นนักฆ่าที่เลือดเย็นและไร้ความปราณี...`;

async function seedStories() {
  await prisma.hero.updateMany({
    where: { slug: 'airi' },
    data: { story: airiStory }
  }).catch(()=>null);
  
  await prisma.hero.updateMany({
    where: { slug: 'amily' },
    data: { story: amilyStory }
  }).catch(()=>null);
  
  console.log('Stories seeded for Airi and Amily!');
}
seedStories().then(() => process.exit(0));
