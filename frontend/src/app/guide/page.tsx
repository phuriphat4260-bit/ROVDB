'use client';
import { useState } from 'react';

export default function GuidePage() {
  const [expandedTech, setExpandedTech] = useState<number | null>(null);
  const roles = [
    {
      title: 'Dark Slayer Lane (ออฟเลน)',
      icon: 'swords',
      desc: 'เลนที่อยู่ด้านบนหรือล่าง (ขึ้นอยู่กับฝั่งที่เกิด) โดยปกติจะไปคนเดียว มีหน้าที่ยืนเลนและป้องกันป้อม ฮีโร่ที่นิยมใช้มักเป็น Fighter หรือ Tank ที่มีพลังชีวิตสูงและสามารถยืนแลกดาเมจได้ดี',
      link: 'https://guide.rov.in.th/role/dark-slayer'
    },
    {
      title: 'Jungle (ป่า)',
      icon: 'forest',
      desc: 'ผู้เล่นที่ทำหน้าที่ฟาร์มมอนสเตอร์ในป่าเพื่อให้ได้เลเวลและไอเทมที่รวดเร็ว มีหน้าที่คอยสร้างจังหวะ (Gank) ช่วยเพื่อนในเลนต่างๆ มักเป็นฮีโร่ประเภท Assassin หรือ Fighter ที่มีความคล่องตัวสูง',
      link: 'https://guide.rov.in.th/role/jungle'
    },
    {
      title: 'Mid Lane (เลนกลาง)',
      icon: 'auto_awesome',
      desc: 'เลนที่สั้นที่สุดและอยู่ตรงกลางแผนที่ ฮีโร่ที่เหมาะสมคือ Mage ซึ่งมีพลังเวทมนตร์สูง ทำดาเมจเป็นวงกว้างได้ดี และสามารถเดินไปเติมเกมช่วยเหลือเลนข้างเคียงได้สะดวก',
      link: 'https://guide.rov.in.th/role/mid-lane'
    },
    {
      title: 'Abyssal Dragon Lane (แครี่ / เลนมังกร)',
      icon: 'my_location',
      desc: 'เลนนี้จะอยู่ใกล้จุดเกิดของมังกร Abyssal Dragon ส่วนใหญ่จะเล่นเป็นคู่ (Carry และ Support) แครี่มีหน้าที่ทำดาเมจหลักในช่วงกลางถึงท้ายเกม แต่ช่วงแรกจะบอบบางและต้องการการปกป้อง',
      link: 'https://guide.rov.in.th/role/abyssal-dragon'
    },
    {
      title: 'Support / Roaming (ซัพพอร์ต / โรมมิ่ง)',
      icon: 'healing',
      desc: 'ทำหน้าที่สนับสนุนเพื่อนร่วมทีม ไม่ว่าจะเป็นการเดินเปิดวิสัยทัศน์ (Vision) ปกป้องแครี่ หรือสร้างจังหวะเปิดไฟต์ ฮีโร่สายนี้มักมีสกิลหยุดศัตรู หรือสกิลช่วยเหลือเพื่อน',
      link: 'https://guide.rov.in.th/role/support'
    }
  ];

  const techniques = [
    {
      title: '1. ทำความเข้าใจรูปแบบเกม (5v5 MOBA)',
      desc: 'ROV เป็นเกม MOBA แบบ 5v5 ที่เป้าหมายหลักคือการทำลายป้อมปราการ (Core) ของฝ่ายตรงข้ามให้ได้ก่อน การทำงานร่วมกันเป็นทีมจึงเป็นสิ่งสำคัญที่สุด',
      img: 'https://content.richmanshop.com/wp-content/uploads/2024/06/แนะเทคนิค-ROV-เล่นยังไงให้ชนะ-ได้เปรียบทุกตาที่เล่น-1024x614.jpeg'
    },
    {
      title: '2. ศึกษาแผนที่ก่อนเล่น (Map)',
      desc: 'การเข้าใจแผนที่เป็นสิ่งสำคัญ ควรรู้ว่าจุดไหนเป็นเลนอะไร จุดเกิดมังกรและบัฟอยู่ตรงไหน เพื่อให้สามารถเดินเกมได้อย่างมีประสิทธิภาพ',
      img: 'https://content.richmanshop.com/wp-content/uploads/2024/06/ศึกษาแผนที่ก่อนเล่น-Map-.jpeg'
    },
    {
      title: '3. รู้จักการแบ่งเลนในการเล่น (Lanes)',
      desc: 'แบ่งเป็น 3 เลนหลัก (Dark Slayer, Mid, Abyssal Dragon) และตำแหน่งป่ากับโรมมิ่ง แต่ละตำแหน่งมีหน้าที่และรูปแบบการเล่นที่ต่างกัน ควรเลือกให้เหมาะสม',
      img: 'https://content.richmanshop.com/wp-content/uploads/2024/06/รู้จักการแบ่งเลนในการเล่น-Lanes.jpeg'
    },
    {
      title: '4. การทำลายป้อม (Tower)',
      desc: 'ป้อมคือหัวใจของเกม การคิลศัตรูได้เยอะไม่เท่ากับการทำลายป้อมได้ ควรหาจังหวะดันป้อมเมื่อศัตรูเผลอหรือพลาด',
      img: 'https://content.richmanshop.com/wp-content/uploads/2024/06/การทำลายป้อม-Tower-.jpeg'
    },
    {
      title: '5. การฟาร์มเงินด้วยครีป (Creep)',
      desc: 'ครีปเป็นแหล่งเงินและเลเวลหลัก การลาสครีป (ฆ่าเป็นคนสุดท้าย) จะทำให้ได้เงินมากกว่าปกติ ช่วยให้ซื้อไอเทมได้ไวกว่าฝั่งตรงข้าม',
      img: 'https://content.richmanshop.com/wp-content/uploads/2024/06/การฟาร์มเงินด้วยครีป-Creep-.jpeg'
    },
    {
      title: '6. รับบัฟจากสัตว์ป่าในแผนที่ (Wild Monster)',
      desc: 'บัฟฟ้า บัฟแดง มังกร และ Dark Slayer ให้โบนัสพิเศษกับทีม การควบคุม objective เหล่านี้จะทำให้ทีมได้เปรียบมหาศาล',
      img: 'https://content.richmanshop.com/wp-content/uploads/2024/06/รับบัฟจากสัตว์ป่าในแผนที่-Wild-Monster-.jpeg'
    },
    {
      title: '7. ความสำคัญของไอเทมและสกิล (Items & Skill Challenge)',
      desc: 'การออกไอเทมแก้ทางศัตรูและการเลือกสกิลชาเลนเจอร์ (เช่น Flicker, Execute, Punish) ให้เหมาะกับฮีโร่และสถานการณ์จะช่วยพลิกเกมได้',
      img: 'https://content.richmanshop.com/wp-content/uploads/2024/06/ความสำคัญของไอเทมและสกิล-Items-Skill-Challenge-.jpeg'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="flex flex-col items-center mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-['Bebas_Neue'] text-primary tracking-widest mb-4">
          ROV BEGINNER'S GUIDE
        </h1>
        <p className="text-on-surface-variant font-['Kanit'] text-lg max-w-2xl">
          คู่มือสำหรับผู้เล่นมือใหม่ รวบรวมข้อมูลตำแหน่งการเล่นและเทคนิคพื้นฐานที่คุณควรรู้ เพื่อพัฒนาฝีมือและไต่แรงค์ได้อย่างมั่นใจ
        </p>
      </div>

      {/* Video Section */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-['Bebas_Neue'] text-white tracking-widest uppercase">VIDEO GUIDE</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>
        
        <div className="bg-surface/50 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/KzJBw94Etus?si=VBtIDYv9YrjZWgF8" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4 flex justify-between items-center px-2">
            <div className="font-['Kanit'] text-on-surface">
              <span className="text-primary font-bold mr-2">CREDIT:</span>
              ช่อง YouTube <strong>Qzadd</strong>
            </div>
            <a 
              href="https://youtu.be/KzJBw94Etus?si=VBtIDYv9YrjZWgF8" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-primary/10 transition-colors uppercase"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-['Bebas_Neue'] text-white tracking-widest uppercase">5 POSITIONS IN ROV</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, idx) => (
            <div key={idx} className="bg-surface/80 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-2xl">{role.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Kanit'] mb-3">{role.title}</h3>
              <p className="text-on-surface-variant font-['Kanit'] text-sm leading-relaxed mb-6 h-24">
                {role.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Map Positions Section */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-['Bebas_Neue'] text-white tracking-widest uppercase">MAP & POSITIONS</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>
        <div className="bg-surface/50 border border-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm text-center">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgEMGO2iO6xNyenZf5R2rKi9558SUqV0mPRph39C1xWn1JOI7c81ESwTs57j0O53Flyw0LbYmcPlSMo5solTst4d4vJP2xDCP31F2lZ2qU8Z99QgLKwlT1PqsIespR22Dm6XMEcjJHSAWwa/s1600/Map_of_MOBA-horz-1024x513.jpg" 
            alt="ROV Map Positions" 
            className="w-full max-w-4xl mx-auto rounded-lg mb-6 border border-white/10 shadow-[0_0_20px_rgba(251,211,102,0.15)]"
          />
          <p className="text-on-surface-variant font-['Kanit'] text-lg mb-4">
            แผนที่ในเกม ROV จะแบ่งออกเป็น 3 เลนหลัก และพื้นที่ป่า (Jungle) ซึ่งแต่ละตำแหน่งจะมีหน้าที่และเส้นทางการเดินเกมที่แตกต่างกัน
          </p>
          <p className="text-white/40 text-xs italic">
            ขอบคุณภาพจาก: guiderovthailand.blogspot.com
          </p>
        </div>
      </div>

      {/* 7 Techniques Section */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-['Bebas_Neue'] text-white tracking-widest uppercase">7 เทคนิคเล่นยังไงให้ได้เปรียบ</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techniques.map((tech, idx) => {
            const isExpanded = expandedTech === idx;
            return (
              <div 
                key={idx} 
                onClick={() => setExpandedTech(isExpanded ? null : idx)}
                className={`bg-surface-container border ${isExpanded ? 'border-primary' : 'border-white/10'} rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col cursor-pointer ${isExpanded ? 'md:col-span-2 lg:col-span-3 transform md:scale-[1.02] z-10 shadow-[0_10px_40px_rgba(251,211,102,0.15)]' : ''}`}
              >
                <div className={`overflow-hidden relative transition-all duration-500 ${isExpanded ? 'h-64 md:h-[400px]' : 'h-48'}`}>
                  <div className="absolute top-3 left-3 bg-black/80 text-primary w-10 h-10 flex items-center justify-center rounded-full font-['Bebas_Neue'] text-2xl z-10 border border-primary/30 shadow-lg backdrop-blur-sm">
                    {idx + 1}
                  </div>
                  <img src={tech.img} alt={tech.title} className={`w-full h-full object-cover transition-transform duration-700 ${isExpanded ? 'scale-100' : 'hover:scale-105'}`} />
                  
                  {/* Subtle gradient overlay to make image blend better with the card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col relative z-20 -mt-8">
                  <div className="flex justify-between items-center bg-surface-container/90 backdrop-blur-md p-4 rounded-lg border border-white/5 shadow-lg">
                    <h3 className={`font-bold font-['Kanit'] transition-colors duration-300 ${isExpanded ? 'text-primary text-xl md:text-2xl' : 'text-white text-lg'}`}>
                      {tech.title.replace(/^[0-9]+\.\s*/, '')}
                    </h3>
                    <span className="material-symbols-outlined text-primary/70 transition-transform duration-300 flex-shrink-0 ml-3" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      expand_more
                    </span>
                  </div>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-surface/50 p-4 md:p-6 rounded-lg border border-primary/20 border-l-4 border-l-primary">
                      <p className="text-on-surface-variant font-['Kanit'] text-base md:text-lg leading-relaxed">
                        {tech.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* External Resources */}
      <div className="mt-16 bg-black/30 p-6 rounded-xl border border-white/5 text-center">
        <p className="text-on-surface-variant font-['Kanit'] text-sm">
          เนื้อหาและข้อมูลอ้างอิงจาก <br />
          <a href="https://guide.rov.in.th/" target="_blank" rel="noreferrer" className="text-primary hover:underline mx-2">guide.rov.in.th</a> | 
          <a href="https://guiderovthailand.blogspot.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline mx-2">Guide ROV Thailand</a> | 
          <a href="https://content.richmanshop.com/how-to-play-rov/" target="_blank" rel="noreferrer" className="text-primary hover:underline mx-2">Richmanshop (เทคนิคการเล่น)</a>
        </p>
      </div>
    </div>
  );
}
