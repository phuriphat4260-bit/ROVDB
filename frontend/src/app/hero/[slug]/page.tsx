'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ItemSelectorModal from '@/components/ItemSelectorModal';
import RuneSelectorModal from '@/components/RuneSelectorModal';
import SpellSelectorModal from '@/components/SpellSelectorModal';
import EnchantmentSelectorModal from '@/components/EnchantmentSelectorModal';

export default function HeroProfile() {
  const params = useParams();
  const router = useRouter();
  const [hero, setHero] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;
    const fetchHeroData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/heroes/${params.slug}`);
        let heroData = res.data.data;
        
        // Fetch custom build if logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
             const buildRes = await axios.get(`http://localhost:5000/api/builds/${params.slug}`, {
               headers: { Authorization: `Bearer ${token}` }
             });
             if (buildRes.data.success && buildRes.data.data) {
               const customBuild = buildRes.data.data;
               if (customBuild.recommendedItems) heroData.recommendedItems = customBuild.recommendedItems;
               if (customBuild.runes) heroData.runes = customBuild.runes;
               if (customBuild.enchantments) heroData.enchantments = customBuild.enchantments;
               if (customBuild.challengerSkill) heroData.challengerSkill = customBuild.challengerSkill;
             }
          } catch(e) {
             console.log("No custom build or error fetching");
          }
        }
        
        setHero(heroData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHeroData();
  }, [params.slug]);

  const [activeTab, setActiveTab] = useState<'overview' | 'story'>('overview');
  const [activeSkinIdx, setActiveSkinIdx] = useState(0);
  
  // Spell modal state
  const [showSpellModal, setShowSpellModal] = useState(false);
  const [showSpellSelector, setShowSpellSelector] = useState(false);
  
  // Enchantment modal state
  const [showEnchantmentModal, setShowEnchantmentModal] = useState(false);
  const [activeEnchantment, setActiveEnchantment] = useState<any>(null);
  const [showEnchantmentSelector, setShowEnchantmentSelector] = useState(false);
  const [editingEnchantmentPath, setEditingEnchantmentPath] = useState<{type: 'main'|'sub', index: number} | null>(null);

  // Rune modal state
  const [showRuneModal, setShowRuneModal] = useState(false);
  const [activeRuneData, setActiveRuneData] = useState<any>(null);
  const [runeLoading, setRuneLoading] = useState(false);
  const [showRuneSelector, setShowRuneSelector] = useState(false);
  const [editingRuneIndex, setEditingRuneIndex] = useState<number | null>(null);

  const handleRuneClick = async (rune: any, index: number) => {
    setShowRuneModal(true);
    setActiveRuneData({ name: rune.name, icon: rune.icon, loading: true, originalIndex: index });
    setRuneLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/runes/by-name/${encodeURIComponent(rune.name)}`);
      if (res.data.success) {
        setActiveRuneData({ ...res.data.data, icon: rune.icon, originalIndex: index });
      } else {
        setActiveRuneData({ name: rune.name, icon: rune.icon, notFound: true, originalIndex: index });
      }
    } catch {
      setActiveRuneData({ name: rune.name, icon: rune.icon, notFound: true, originalIndex: index });
    } finally {
      setRuneLoading(false);
    }
  };

  // Item modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [activeItemData, setActiveItemData] = useState<any>(null);
  const [itemLoading, setItemLoading] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const nameToSlug = (name: string) =>
    name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const saveCustomBuild = async (newBuildData: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.put(`http://localhost:5000/api/builds/${params.slug}`, newBuildData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error("Failed to save custom build", e);
    }
  };

  const handleItemClick = async (item: any, index: number) => {
    setShowItemModal(true);
    setActiveItemData({ name: item.name, icon: item.icon, loading: true, originalIndex: index });
    setItemLoading(true);
    try {
      const slug = nameToSlug(item.name);
      const res = await axios.get(`http://localhost:5000/api/items/${slug}`);
      if (res.data.success) {
        setActiveItemData({ ...res.data.data, icon: item.icon, originalIndex: index });
      } else {
        setActiveItemData({ name: item.name, icon: item.icon, notFound: true, originalIndex: index });
      }
    } catch {
      setActiveItemData({ name: item.name, icon: item.icon, notFound: true, originalIndex: index });
    } finally {
      setItemLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Attack':  return { border: 'border-orange-500', shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]', badge: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: 'sword' };
      case 'Magic':   return { border: 'border-violet-500', shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.2)]', badge: 'text-violet-400 bg-violet-400/10 border-violet-400/30', icon: 'auto_awesome' };
      case 'Defense': return { border: 'border-sky-500',    shadow: 'shadow-[0_0_30px_rgba(14,165,233,0.2)]',  badge: 'text-sky-400 bg-sky-400/10 border-sky-400/30', icon: 'shield' };
      case 'Boots':   return { border: 'border-emerald-500',shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: 'directions_run' };
      case 'Jungle':  return { border: 'border-green-500',  shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]',  badge: 'text-green-400 bg-green-400/10 border-green-400/30', icon: 'forest' };
      default:        return { border: 'border-[#FBD366]',  shadow: 'shadow-[0_0_30px_rgba(251,211,102,0.2)]',badge: 'text-[#FBD366] bg-[#FBD366]/10 border-[#FBD366]/30', icon: 'inventory_2' };
    }
  };

  const spellData: Record<string, any> = {
    "Sprint": { unlock: "LV 0", cd: "100 วินาที", desc: "ลบสถานะลดความเร็วและได้รับความเร็วเคลื่อนที่เพิ่มขึ้น 70% (จะลดลงเรื่อยๆ ถึง 30%) เป็นเวลา 10 วินาที" },
    "Execute": { unlock: "LV 3", cd: "90 วินาที", desc: "สร้าง ความเสียหายจริง แก่ฮีโร่ฝ่ายตรงข้ามรอบบริเวณเป็นจำนวน 16% จากชีวิตของฮีโร่ฝ่ายตรงข้ามที่หายไป" },
    "Punish": { unlock: "LV 5", cd: "30 วินาที", desc: "สร้าง 800 ความเสียหายจริง แก่ครีป หรือมอนสเตอร์ป่าในบริเวณจากนั้นส่งผลให้ติดสถานะ สตั๊นเป็นเวลา 1 วินาที" },
    "Frostbite": { unlock: "LV 5 (ไอเทมป่า)", cd: "30 วินาที", desc: "สร้าง 800 ความเสียหายจริง แก่ครีป หรือมอนสเตอร์ป่าในบริเวณจากนั้นส่งผลให้ติดสถานะ สตั๊นเป็นเวลา 1 วินาที (อัปเกรดจาก Punish)" },
    "Roar": { unlock: "LV 7", cd: "60 วินาที", desc: "ฮีโร่จะได้รับความเร็วโจมตีเพิ่มขึ้น 60% และพลังโจมตีเพิ่มขึ้น 10% เป็นเวลา 5 วินาที" },
    "Heal": { unlock: "LV 9", cd: "120 วินาที", desc: "ฟื้นฟู HP 15% และความเร็วเคลื่อนที่ 15% ให้กับพันธมิตรรอบข้างเป็นเวลา 2 วินาที" },
    "Disturb": { unlock: "LV 11", cd: "60 วินาที", desc: "ยับยั้งการทำงานของป้อม 5 วินาที" },
    "Dazed": { unlock: "LV 13", cd: "90 วินาที", desc: "สตั๊นศัตรูรอบๆ 0.5 วินาที พร้อมกับลดพลังโจมตีลง 40% เป็นเวลา 2 วินาที" },
    "Purify": { unlock: "LV 15", cd: "120 วินาที", desc: "ล้างสถานะผิดปกติที่ส่งผลกับฮีโร่ของคุณทันที และต้านทานสถานะเหล่านั้นเป็นเวลา 1.5 วินาที" },
    "Flicker": { unlock: "LV 17", cd: "120 วินาที", desc: "เทเลพอร์ตไปยังเป้าหมาย" },
  };

  const enchantmentData: Record<string, any> = {
    'Shadow-Blade': { name: 'Shadow Blade', type: 'Lokheim', desc: 'พุ่งโจมตีจะสร้างโบนัสความเสียหายกายภาพและเวท' },
    'Deadly-Claw': { name: 'Deadly Claw', type: 'Lokheim', desc: 'ได้รับพลังโจมตีและพลังเวทเพิ่มขึ้นตามเลเวลของฮีโร่' },
    'Curse-of-Death': { name: 'Curse of Death', type: 'Lokheim', desc: 'สกิลหรือการโจมตีปกติโดนฮีโร่ศัตรู จะสร้างวงแหวนสะสมพลังและระเบิดสร้างความเสียหายรอบๆ' },
    'Devourer': { name: 'Devourer', type: 'Lokheim', desc: 'สังหารหรือช่วยเหลือ จะฟื้นฟู HP และ มานา' },
    'Reaper_s-Blessing': { name: 'Reaper\'s Blessing', type: 'Lokheim', desc: 'ป้องกันความตาย 1 ครั้ง (อมตะ 0.5 วิ) และวิ่งเร็วขึ้น (ใช้งานได้ครั้งเดียวต่อเกม)' },
    'Reging-Inferno': { name: 'Raging Inferno', type: 'Lokheim', desc: 'สร้างโบนัสความเสียหายเวทเพิ่มเติมเมื่อโจมตีศัตรู' },
    'Desperate-Duel': { name: 'Desperate Duel', type: 'Lokheim', desc: 'โจมตีศัตรูจะสะสมสแต็ค เพิ่มเจาะเกราะและความเร็วเคลื่อนที่ เมื่อครบ 10 สแต็คจะฟื้นฟู HP' },
    'Bone-Cutter': { name: 'Bone Cutter', type: 'Lokheim', desc: 'ได้รับความต้านทานสถานะ (Resistance) เพิ่มขึ้น' },
    'Devil_s-Awakening': { name: 'Devil\'s Awakening', type: 'Lokheim', desc: 'เมื่อใช้สกิล Ultimate จะลดคูลดาวน์สกิล 1 และ 2 ทันที และได้ลดความเสียหาย' },
    
    'Axe-of-Sacrifice': { name: 'Axe of Sacrifice', type: 'Veda', desc: 'พลังโจมตีและพลังเวทเพิ่มขึ้น แต่จะได้รับความเสียหายจากศัตรูแรงขึ้นเล็กน้อย' },
    'Holy-Verdict': { name: 'Holy Verdict', type: 'Veda', desc: 'ได้รับเจาะเกราะและเจาะเกราะเวทเพิ่มขึ้น' },
    'Sacred-Bead': { name: 'Sacred Bead', type: 'Veda', desc: 'ลดคูลดาวน์ของสกิล Challenger และลดคูลดาวน์ไอเทมกดใช้' },
    'Holy-Summoner': { name: 'Holy Summoner', type: 'Veda', desc: 'โจมตีปกติครบ 3 ครั้งจะเรียกภูติน้อยออกมาช่วยยิงโจมตีเจาะเกราะใส่ศัตรู' },
    'Holy-Thunder': { name: 'Holy Thunder', type: 'Veda', desc: 'ใช้สกิลโดนศัตรูจะสร้างสายฟ้าผ่าทำความเสียหายเวทเพิ่มเติม' },
    'Sacred-Protection': { name: 'Sacred Protection', type: 'Veda', desc: 'เมื่อรับความเสียหายหนัก จะสร้างโล่ป้องกันและฟื้นฟู HP พร้อมเพิ่มความเร็วเคลื่อนที่' },
    'Blessing': { name: 'Blessing', type: 'Veda', desc: 'ได้รับอัตราคริติคอลพลังเวท หรือ โบนัสอื่นๆ ในช่วงต้นเกม' },

    'River-Treader': { name: 'River Treader', type: 'Afata', desc: 'เมื่ออยู่ในแม่น้ำ ความเร็วเคลื่อนที่จะเพิ่มขึ้นและฟื้นฟู HP/Mana ต่อเนื่อง' },
    'Regrowth': { name: 'Regrowth', type: 'Afata', desc: 'ผลของการฟื้นฟู (Heal) และ โล่ (Shield) จะมีประสิทธิภาพเพิ่มขึ้น' },
    'Explosive-Shield': { name: 'Explosive Shield', type: 'Afata', desc: 'เมื่อรับความเสียหายครบกำหนด จะระเบิดวงกว้างสร้างความเสียหายและสตั๊นศัตรูรอบๆ' },
    'Nature_s-Gift': { name: 'Nature\'s Gift', type: 'Afata', desc: 'สังหารครีปหรือมอนสเตอร์ป่าจะเพิ่ม Max HP อย่างถาวร' },
    'Forest-Wanderer': { name: 'Forest Wanderer', type: 'Afata', desc: 'ออกจากการต่อสู้ระยะหนึ่ง การโจมตีปกติครั้งต่อไปจะสโลว์ศัตรูและลดพลังโจมตี' },
    'Nature_s-Rage': { name: 'Nature\'s Rage', type: 'Afata', desc: 'เมื่อใช้สกิลสถานะ (CC) ใส่ศัตรู จะสร้างรอยไหม้ทำความเสียหายเวทเพิ่มเติม' },
    
    'Mark-of-Frost': { name: 'Mark of Frost', type: 'League of Humans', desc: 'ได้รับสกิลพิเศษ เมื่อกดใช้จะเป็นน้ำแข็งอมตะ 2 วินาที (ใช้งานได้ครั้งเดียว)' },
    'Gunslinger': { name: 'Gunslinger', type: 'League of Humans', desc: 'สังหารหรือช่วยเหลือ จะได้รับสแต็คเพิ่มพลังโจมตีและพลังเวทถาวร' },
    'Arcane-Whisper': { name: 'Arcane Whisper', type: 'League of Humans', desc: 'ลดคูลดาวน์ของสกิล Challenger' },
    'Minion-Kill': { name: 'Minion Kill', type: 'League of Humans', desc: 'ได้รับสกิลพิเศษสำหรับสังหารครีปเพื่อรับโบนัสทองและ XP (ใช้แล้วจะหายไปเปลี่ยนเป็นสกิลปกติ)' },
    'Visceral-Boost': { name: 'Visceral Boost', type: 'League of Humans', desc: 'เริ่มต้นเกมที่เลเวล 2 ทันที แลกกับการได้รับ XP และทองลดลงชั่วคราว' },
    'Tower-Blessing': { name: 'Tower Blessing', type: 'League of Humans', desc: 'ได้รับโบนัสป้องกันเมื่ออยู่ใกล้ป้อมมิตร' },
    'Mana-Refill': { name: 'Mana Refill', type: 'League of Humans', desc: 'ฟื้นฟูมานาเมื่อใช้สกิลหรือโจมตีปกติ' },
    'Endless-Cycle': { name: 'Endless Cycle', type: 'League of Humans', desc: 'เมื่อตาย สามารถกดเพื่อเกิดใหม่ที่บ่อน้ำได้ทันที (ใช้งานได้ 2 ครั้งต่อเกม)' },
    'Backstabbing': { name: 'Backstabbing', type: 'League of Humans', desc: 'เมื่อโจมตีศัตรูจากด้านหลังหรือซ่อนในพุ่มไม้ จะสร้างความเสียหายจริงเพิ่มเติม' },
  };

  const getEnchantmentInfo = (iconUrl: string) => {
    if (!iconUrl) return null;
    const decoded = decodeURIComponent(iconUrl);
    const filename = decoded.split('/revision')[0].split('?')[0].split('/').pop()?.replace('.png', '');
    if (!filename) return null;
    
    if (enchantmentData[filename]) return enchantmentData[filename];
    
    const normalizedFilename = filename.toLowerCase().replace(/_/g, ' ').replace(/\(.*\)/g, '').trim();
    for (const [key, data] of Object.entries(enchantmentData)) {
      if (data.name.toLowerCase() === normalizedFilename) return data;
    }
    return null;
  };

  const currentSpellInfo = hero?.challengerSkill ? spellData[hero.challengerSkill.name] : null;

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!hero) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl text-on-surface mb-4">Hero not found</h1>
        <button onClick={() => router.push('/')} className="text-primary hover:underline">Return to Gallery</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-7xl mx-auto px-4 pb-20 pt-8"
    >
      {/* Back Button */}
      <button 
        onClick={() => router.push('/')}
        className="mb-6 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors relative z-20"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="font-bold tracking-widest uppercase text-xs">Back to Heroes</span>
      </button>

      {/* Top Section: Overview & Splash Art */}
      <div className="flex flex-col xl:flex-row gap-8 min-h-[600px] mb-16">
        
        {/* Left Column: Overview / Story / Skills */}
        <div className="w-full xl:w-[450px] flex-shrink-0 bg-[#1c1f2e] rounded-xl border border-white/5 shadow-2xl flex flex-col relative z-20">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            <div 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 text-center py-5 font-['Bebas_Neue'] text-2xl tracking-widest cursor-pointer transition-colors ${activeTab === 'overview' ? 'text-[#FBD366] border-b-2 border-[#FBD366] bg-white/5' : 'text-white/30 hover:text-white/50'}`}
            >
              Overview
            </div>
            <div 
              onClick={() => setActiveTab('story')}
              className={`flex-1 text-center py-5 font-['Bebas_Neue'] text-2xl tracking-widest cursor-pointer transition-colors ${activeTab === 'story' ? 'text-[#FBD366] border-b-2 border-[#FBD366] bg-white/5' : 'text-white/30 hover:text-white/50'}`}
            >
              Story
            </div>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            {activeTab === 'overview' ? (
              <>
                {/* Role Box */}
                <div className="flex items-center gap-4 border border-white/10 p-4 rounded bg-black/20 shadow-inner">
                   <img src={hero.avatar} className="w-14 h-14 rounded border border-white/20 object-cover" alt={hero.name} />
                   <div>
                     <div className="text-white/50 text-[10px] font-black italic mb-1 uppercase tracking-widest">Role</div>
                     <div className="text-[#FBD366] font-['Bebas_Neue'] text-2xl tracking-widest italic drop-shadow-md">
                       {hero.classes.join(' X ')}
                     </div>
                   </div>
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-5 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                  {hero.skills.map((skill: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start border-b border-white/5 pb-5 last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-full border-[3px] border-[#38bdf8] overflow-hidden flex-shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] bg-[#0d1017]">
                        {skill.icon ? (
                          <img src={skill.icon} className="w-full h-full object-cover scale-110" alt={skill.name}/>
                        ) : (
                          <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white font-bold">
                            {skill.type?.[0] || 'S'}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-[#FBD366] font-bold text-sm mb-1">{skill.name}</div>
                        <div className="text-white/70 text-[11px] leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">{skill.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <h3 className="text-[#FBD366] font-black text-xl mb-4">ประวัติ</h3>
                <div className="text-white/80 text-sm leading-loose whitespace-pre-wrap overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                  {hero.story || "No story data available for this hero."}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hero Splash Art */}
        <div className="flex-1 relative flex flex-col justify-end items-center min-h-[500px] xl:min-h-0 overflow-hidden rounded-2xl group">
           {/* Background Hero Name Text */}
           <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
             <span className="text-[150px] md:text-[250px] font-['Bebas_Neue'] text-white/[0.03] tracking-tighter leading-none whitespace-nowrap">
               {hero.name.toUpperCase()}
             </span>
           </div>
           
           <img 
             src={hero.skins && hero.skins.length > 0 ? (hero.skins[activeSkinIdx]?.image_banner || hero.skins[activeSkinIdx]?.image) : (hero.splashArt || hero.avatar)} 
             alt={hero.skins?.[activeSkinIdx]?.name || hero.name} 
             className="w-full h-full object-cover object-top absolute inset-0 z-10 brightness-90 transition-all duration-500" 
           />
           {/* Gradient Overlay for blending */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/20 to-transparent z-10 pointer-events-none"></div>

           {/* Skin Name */}
           <div className="relative z-20 w-full px-8 pb-4 text-left">
             <h2 className="text-3xl md:text-4xl text-[#FBD366] font-['Bebas_Neue'] tracking-widest italic drop-shadow-lg uppercase">
               {hero.skins && hero.skins.length > 0 ? hero.skins[activeSkinIdx]?.name : 'Default'}
             </h2>
           </div>

           {/* Skin Selector */}
           {hero.skins && hero.skins.length > 0 && (
             <div className="relative z-20 mb-8 bg-[#11131c]/90 px-6 py-3 rounded flex flex-wrap justify-center gap-5 items-center border border-white/10 backdrop-blur-md shadow-2xl max-w-[90%]">
               {hero.skins.map((skin: any, idx: number) => (
                 <span 
                   key={idx} 
                   onClick={() => setActiveSkinIdx(idx)}
                   className={`font-['Bebas_Neue'] tracking-widest cursor-pointer transition-colors px-2 py-1 ${activeSkinIdx === idx ? 'text-white border border-white/30 bg-white/5 text-lg' : 'text-white/40 text-sm hover:text-white'}`}
                 >
                   {idx === 0 ? 'Default' : idx}
                 </span>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* Advanced Gameplay Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 relative z-20">
        
        {/* Left Col: Items & Runes */}
        <div className="flex flex-col gap-12">
          
          {/* Items */}
          {hero.recommendedItems && hero.recommendedItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#FBD366] mb-6">ไอเทมแนะนำ</h2>
              <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 shadow-2xl">
                <div className="text-white/50 text-xs font-bold mb-4 uppercase tracking-widest">แนะนำ</div>
                <div className="flex flex-wrap gap-3">
                  {hero.recommendedItems.map((item: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => handleItemClick(item, i)}
                      className="relative group cursor-pointer"
                      title={item.name}
                    >
                      <div className="w-16 h-16 border-[2px] border-[#FBD366] relative overflow-hidden shadow-[0_0_15px_rgba(251,211,102,0.2)] hover:scale-110 hover:shadow-[0_0_25px_rgba(251,211,102,0.5)] transition-all duration-200">
                        <img src={(item.icon || '').includes('?') ? item.icon + '&v=2' : item.icon + '?v=2'} referrerPolicy="no-referrer" alt={item.name} className="w-full h-full object-cover group-hover:brightness-125" />
                        <div className="absolute inset-0 bg-[#FBD366]/0 group-hover:bg-[#FBD366]/10 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">info</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
                        {item.name.length > 12 ? item.name.slice(0,12)+'...' : item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Runes */}
          {hero.runes && hero.runes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#FBD366] mb-6">รูน</h2>
              <div className="flex flex-col gap-4">
                {hero.runes.map((rune: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => handleRuneClick(rune, i)}
                    className="flex items-center gap-6 p-4 bg-[#1c1f2e] rounded-xl border border-white/5 shadow-xl hover:bg-[#252a3d] transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <img src={(rune.icon || '').includes('?') ? rune.icon + '&v=2' : rune.icon + '?v=2'} referrerPolicy="no-referrer" alt={rune.name} className="w-16 h-16 rounded-full border-2 border-[#FBD366] shadow-[0_0_15px_rgba(251,211,102,0.3)]" />
                      <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] px-1.5 rounded-sm font-black border border-white/20">III</div>
                    </div>
                    <span className="font-['Bebas_Neue'] text-3xl text-white tracking-widest italic drop-shadow-md">{rune.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Challenger & Enchantments */}
        <div className="flex flex-col gap-12">
          
          {/* Challenger Skill */}
          {hero.challengerSkill && hero.challengerSkill.name && (
            <div>
              <h2 className="text-2xl font-bold text-[#FBD366] mb-6">สกิลชาเลนเจอร์</h2>
              <div 
                onClick={() => currentSpellInfo && setShowSpellModal(true)}
                className={`flex items-center gap-6 p-6 bg-[#1c1f2e] border border-white/5 rounded-xl shadow-2xl transition-colors ${currentSpellInfo ? 'hover:bg-[#252a3d] cursor-pointer' : ''}`}
              >
                <div className="w-20 h-20 rounded-full border-[3px] border-[#d946ef] overflow-hidden shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                  <img src={(hero.challengerSkill.icon || '').includes('?') ? hero.challengerSkill.icon + '&v=2' : hero.challengerSkill.icon + '?v=2'} referrerPolicy="no-referrer" alt={hero.challengerSkill.name} className="w-full h-full object-cover scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="font-['Bebas_Neue'] text-4xl text-white tracking-widest italic drop-shadow-lg">{hero.challengerSkill.name}</span>
                  {currentSpellInfo && <span className="text-white/40 text-xs mt-1 uppercase tracking-widest">Click for details</span>}
                </div>
              </div>
            </div>
          )}

          {/* Enchantments */}
          {hero.enchantments && hero.enchantments.main && (
            <div>
              <h2 className="text-2xl font-bold text-[#FBD366] mb-6">พลังแฝง</h2>
              <div className="flex flex-col gap-10 p-8 bg-[#1c1f2e] border border-white/5 rounded-xl shadow-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBD366]/5 rounded-full blur-3xl -z-10"></div>
                
                {/* Main Path */}
                <div className="flex items-center gap-6 relative z-10">
                  <div className="absolute top-1/2 left-10 w-64 h-1 bg-red-600/40 -z-10 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                  {hero.enchantments.main.map((icon: string, i: number) => {
                    const info = getEnchantmentInfo(icon);
                    return (
                      <div 
                        key={i} 
                        onClick={() => { if(info) { setActiveEnchantment({ icon, ...info, path: { type: 'main', index: i } }); setShowEnchantmentModal(true); } }}
                        className={`rounded-full border-[3px] border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] overflow-hidden bg-black/80 hover:scale-110 transition-transform ${i === 2 ? 'w-24 h-24 border-[4px]' : 'w-14 h-14'} ${info ? 'cursor-pointer' : ''}`}
                      >
                        <img src={(icon || '').includes('?') ? icon + '&v=2' : icon + '?v=2'} referrerPolicy="no-referrer" className="w-full h-full object-cover scale-125" alt="Main Enchantment" />
                      </div>
                    );
                  })}
                </div>
                {/* Sub Path */}
                <div className="flex items-center gap-6 relative z-10">
                  <div className="absolute top-1/2 left-10 w-40 h-1 bg-green-500/40 -z-10 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  {hero.enchantments.sub.map((icon: string, i: number) => {
                    const info = getEnchantmentInfo(icon);
                    return (
                      <div 
                        key={i} 
                        onClick={() => { if(info) { setActiveEnchantment({ icon, ...info, path: { type: 'sub', index: i } }); setShowEnchantmentModal(true); } }}
                        className={`w-14 h-14 rounded-full border-[3px] border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.6)] overflow-hidden bg-black/80 hover:scale-110 transition-transform ${info ? 'cursor-pointer' : ''}`}
                      >
                        <img src={(icon || '').includes('?') ? icon + '&v=2' : icon + '?v=2'} referrerPolicy="no-referrer" className="w-full h-full object-cover scale-125" alt="Sub Enchantment" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spell Modal */}
      <AnimatePresence>
        {showSpellModal && currentSpellInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSpellModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1c1f2e] border border-[#d946ef]/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(217,70,239,0.15)] relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowSpellModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
                <div className="w-20 h-20 rounded-full border-[3px] border-[#d946ef] overflow-hidden shadow-[0_0_20px_rgba(217,70,239,0.5)] flex-shrink-0">
                  <img src={(hero.challengerSkill.icon || '').includes('?') ? hero.challengerSkill.icon + '&v=2' : hero.challengerSkill.icon + '?v=2'} referrerPolicy="no-referrer" alt={hero.challengerSkill.name} className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                  <h3 className="font-['Bebas_Neue'] text-4xl text-[#d946ef] tracking-widest italic drop-shadow-md">{hero.challengerSkill.name}</h3>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="text-[#FBD366] text-xs font-bold bg-[#FBD366]/10 px-2 py-1 rounded inline-block w-fit border border-[#FBD366]/20">ปลดล็อค: {currentSpellInfo.unlock}</div>
                    <div className="text-[#38bdf8] text-xs font-bold bg-[#38bdf8]/10 px-2 py-1 rounded inline-block w-fit border border-[#38bdf8]/20">คูลดาวน์: {currentSpellInfo.cd}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">รายละเอียด (Description)</h4>
                <p className="text-white/90 leading-relaxed text-sm bg-black/20 p-4 rounded-lg border border-white/5 mb-4">
                  {currentSpellInfo.desc}
                </p>
                <button 
                  onClick={() => { setShowSpellModal(false); setShowSpellSelector(true); }}
                  className="w-full py-3 bg-[#d946ef]/20 hover:bg-[#d946ef]/40 text-[#d946ef] font-bold rounded-lg border border-[#d946ef]/30 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">swap_horiz</span>
                  เปลี่ยนสกิลชาเลนเจอร์
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showEnchantmentModal && activeEnchantment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEnchantmentModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1c1f2e] border border-[#FBD366]/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(251,211,102,0.15)] relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowEnchantmentModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
                <div className={`w-20 h-20 rounded-full border-[3px] overflow-hidden flex-shrink-0 bg-black/80 ${activeEnchantment.type === 'Lokheim' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : activeEnchantment.type === 'Veda' ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : activeEnchantment.type === 'Afata' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]'}`}>
                  <img src={(activeEnchantment.icon || '').includes('?') ? activeEnchantment.icon + '&v=2' : activeEnchantment.icon + '?v=2'} referrerPolicy="no-referrer" alt={activeEnchantment.name} className="w-full h-full object-cover scale-125" />
                </div>
                <div>
                  <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-widest italic drop-shadow-md">{activeEnchantment.name}</h3>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className={`text-xs font-bold px-2 py-1 rounded inline-block w-fit border ${activeEnchantment.type === 'Lokheim' ? 'text-red-400 bg-red-400/10 border-red-400/20' : activeEnchantment.type === 'Veda' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : activeEnchantment.type === 'Afata' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                      เซ็ต: {activeEnchantment.type}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">รายละเอียด (Description)</h4>
                <p className="text-white/90 leading-relaxed text-sm bg-black/20 p-4 rounded-lg border border-white/5 mb-4">
                  {activeEnchantment.desc}
                </p>
                <button 
                  onClick={() => { setShowEnchantmentModal(false); setEditingEnchantmentPath(activeEnchantment.path); setShowEnchantmentSelector(true); }}
                  className="w-full py-3 bg-[#FBD366]/20 hover:bg-[#FBD366]/40 text-[#FBD366] font-bold rounded-lg border border-[#FBD366]/30 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">swap_horiz</span>
                  เปลี่ยนพลังแฝง
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ===== ITEM MODAL ===== */}
        {showItemModal && activeItemData && (() => {
          const colors = getCategoryColor(activeItemData.category || '');
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setShowItemModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`bg-[#13161f] border ${colors.border} rounded-2xl w-full max-w-lg ${colors.shadow} relative overflow-hidden`}
                onClick={e => e.stopPropagation()}
              >
                {/* Decorative glow top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60 ${colors.badge.split(' ')[0]}`} />

                {/* Close button */}
                <button
                  onClick={() => setShowItemModal(false)}
                  className="absolute top-4 right-4 z-10 text-white/40 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>

                {itemLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-12 h-12">
                      {activeItemData.icon && <img src={(activeItemData.icon || '').includes('?') ? activeItemData.icon + '&v=2' : activeItemData.icon + '?v=2'} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover opacity-50" />}
                    </div>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FBD366]"></div>
                    <span className="text-white/40 text-xs uppercase tracking-widest">กำลังโหลด...</span>
                  </div>
                ) : activeItemData.notFound ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 border-2 border-white/20 overflow-hidden">
                      {activeItemData.icon && <img src={(activeItemData.icon || '').includes('?') ? activeItemData.icon + '&v=2' : activeItemData.icon + '?v=2'} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover" />}
                    </div>
                    <h3 className="text-white font-['Bebas_Neue'] text-2xl tracking-widest mb-2">{activeItemData.name}</h3>
                    <p className="text-white/40 text-sm mb-6">ไม่พบข้อมูลไอเทมนี้ในฐานข้อมูล</p>
                    <button
                      onClick={() => { setShowItemModal(false); setEditingItemIndex(activeItemData.originalIndex); setShowItemSelector(true); }}
                      className={`w-full py-3 ${colors.badge} hover:bg-white/10 font-bold rounded-lg border transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2`}
                    >
                      <span className="material-symbols-outlined text-[12px]">swap_horiz</span>
                      เปลี่ยนไอเทม
                    </button>
                  </div>
                ) : (
                  <div className="p-7">
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-6 pb-5 border-b border-white/8">
                      <div className={`w-20 h-20 border-[3px] ${colors.border} overflow-hidden flex-shrink-0 relative ${colors.shadow}`}>
                        {activeItemData.icon && (
                          <img src={(activeItemData.icon || '').includes('?') ? activeItemData.icon + '&v=2' : activeItemData.icon + '?v=2'} referrerPolicy="no-referrer" alt={activeItemData.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-widest leading-tight mb-2">
                          {activeItemData.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {activeItemData.category && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${colors.badge} uppercase tracking-widest`}>
                              {activeItemData.category}
                            </span>
                          )}
                          {activeItemData.price && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full border text-[#FBD366] bg-[#FBD366]/10 border-[#FBD366]/30 flex items-center gap-1 uppercase tracking-widest">
                              <span className="material-symbols-outlined text-[11px]">toll</span>
                              {activeItemData.price.toLocaleString()} โกลด์
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    {activeItemData.stats && (
                      <div className="mb-5">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[12px]">monitoring</span>
                          คุณสมบัติ
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                          {activeItemData.stats.split('\n').filter(Boolean).map((stat: string, i: number) => (
                            <div key={i} className="text-white/85 text-sm leading-relaxed py-0.5">
                              {stat.trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Passive */}
                    {activeItemData.passive && activeItemData.passive !== '-' && activeItemData.passive.length > 2 && (
                      <div className="mb-5">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[12px]">flash_on</span>
                          สกิลติดตัว
                        </div>
                        <div className={`bg-black/30 rounded-xl p-4 border ${colors.border} border-opacity-30`}>
                          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{activeItemData.passive}</p>
                        </div>
                      </div>
                    )}

                    {/* Components */}
                    {activeItemData.components && activeItemData.components.length > 0 && (
                      <div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[12px]">construction</span>
                          ส่วนผสม
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeItemData.components.map((comp: string, i: number) => (
                            <span key={i} className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[11px] text-[#FBD366]/60">circle</span>
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                      {/* Wiki source note */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[11px] text-white/20">info</span>
                          <span className="text-[10px] text-white/20">ข้อมูลจาก Arena of Valor Wiki (Fandom)</span>
                        </div>
                        <button 
                          onClick={() => { setShowItemModal(false); setEditingItemIndex(activeItemData.originalIndex); setShowItemSelector(true); }}
                          className={`px-3 py-1.5 rounded border ${colors.badge} hover:bg-white/10 text-xs font-bold transition-colors flex items-center gap-1`}
                        >
                          <span className="material-symbols-outlined text-[12px]">swap_horiz</span>
                          เปลี่ยนไอเทม
                        </button>
                      </div>
                    </div>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Rune Modal */}
      <AnimatePresence>
        {showRuneModal && activeRuneData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowRuneModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`bg-[#1c1f2e] border ${activeRuneData.color === 'red' ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.15)]' : activeRuneData.color === 'purple' ? 'border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.15)]' : activeRuneData.color === 'green' ? 'border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.15)]' : 'border-[#FBD366]/50 shadow-[0_0_50px_rgba(251,211,102,0.15)]'} rounded-2xl p-8 max-w-md w-full relative overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowRuneModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10">
                <span className="material-symbols-outlined">close</span>
              </button>

              {activeRuneData.loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-white/60">กำลังโหลดข้อมูลรูน...</p>
                </div>
              ) : activeRuneData.notFound ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-red-500/50 mb-4">error</span>
                  <h3 className="text-xl text-white font-bold mb-2">ไม่พบข้อมูล</h3>
                  <p className="text-white/60 mb-6">ไม่พบข้อมูลรูนนี้ในฐานข้อมูล (จาก Fandom)</p>
                  <button 
                    onClick={() => { setShowRuneModal(false); setEditingRuneIndex(activeRuneData.originalIndex); setShowRuneSelector(true); }}
                    className="w-full py-3 bg-[#FBD366]/20 hover:bg-[#FBD366]/40 text-[#FBD366] font-bold rounded-lg border border-[#FBD366]/30 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">swap_horiz</span>
                    เปลี่ยนรูน
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
                    <div className={`w-20 h-20 rounded-full border-[3px] flex-shrink-0 bg-black/50 ${activeRuneData.color === 'red' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : activeRuneData.color === 'purple' ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : activeRuneData.color === 'green' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-[#FBD366] shadow-[0_0_20px_rgba(251,211,102,0.3)]'}`}>
                      <img src={(activeRuneData.icon || '').includes('?') ? activeRuneData.icon + '&v=2' : activeRuneData.icon + '?v=2'} referrerPolicy="no-referrer" alt={activeRuneData.name} className="w-full h-full object-cover scale-110" />
                    </div>
                    <div>
                      <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-widest italic drop-shadow-md">{activeRuneData.name.replace(/LV\s*[1-3]:\s*/i, '')}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${activeRuneData.color === 'red' ? 'text-red-400 bg-red-400/10 border-red-400/20' : activeRuneData.color === 'purple' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : activeRuneData.color === 'green' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-[#FBD366] bg-[#FBD366]/10 border-[#FBD366]/20'}`}>
                          เลเวล: {activeRuneData.level || 3}
                        </span>
                        {activeRuneData.color && (
                          <span className={`text-xs font-bold px-2 py-1 rounded border capitalize ${activeRuneData.color === 'red' ? 'text-red-400 bg-red-400/10 border-red-400/20' : activeRuneData.color === 'purple' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                            {activeRuneData.color}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">insights</span>
                        ค่าสถานะ
                      </h4>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2 mb-4">
                        {activeRuneData.stats?.split('\n').filter(Boolean).map((stat: string, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-[#FBD366] font-medium">{stat.split('+')[0]}</span>
                            <span className="text-white/80">+{stat.split('+')[1]}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => { setShowRuneModal(false); setEditingRuneIndex(activeRuneData.originalIndex); setShowRuneSelector(true); }}
                        className="w-full py-3 bg-[#FBD366]/20 hover:bg-[#FBD366]/40 text-[#FBD366] font-bold rounded-lg border border-[#FBD366]/30 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">swap_horiz</span>
                        เปลี่ยนรูน
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selectors */}
      {showItemSelector && (
        <ItemSelectorModal 
          onClose={() => setShowItemSelector(false)} 
          onSelect={(newItem) => {
            if (editingItemIndex !== null) {
              const updatedItems = [...hero.recommendedItems];
              updatedItems[editingItemIndex] = {
                name: newItem.name,
                icon: newItem.imageFile || newItem.icon
              };
              setHero({ ...hero, recommendedItems: updatedItems });
              saveCustomBuild({ recommendedItems: updatedItems });
            }
            setShowItemSelector(false);
          }} 
        />
      )}

      {showRuneSelector && (
        <RuneSelectorModal 
          onClose={() => setShowRuneSelector(false)} 
          onSelect={(newRune) => {
            if (editingRuneIndex !== null) {
              const updatedRunes = [...hero.runes];
              updatedRunes[editingRuneIndex] = {
                name: newRune.name,
                icon: newRune.imageFile || newRune.icon
              };
              setHero({ ...hero, runes: updatedRunes });
              saveCustomBuild({ runes: updatedRunes });
            }
            setShowRuneSelector(false);
          }} 
        />
      )}

      {showSpellSelector && (
        <SpellSelectorModal 
          spellData={spellData}
          onClose={() => setShowSpellSelector(false)} 
          onSelect={(spellName, icon) => {
            const updatedSpell = { name: spellName, icon };
            setHero({ ...hero, challengerSkill: updatedSpell });
            saveCustomBuild({ challengerSkill: updatedSpell });
            setShowSpellSelector(false);
          }} 
        />
      )}

      {showEnchantmentSelector && editingEnchantmentPath && (
        <EnchantmentSelectorModal 
          enchantmentData={enchantmentData}
          allowedType={editingEnchantmentPath.type === 'main' && editingEnchantmentPath.index === 2 ? undefined : undefined} // For now, allow any type
          onClose={() => setShowEnchantmentSelector(false)} 
          onSelect={(iconPath) => {
            const updatedEnchantments = { ...hero.enchantments };
            updatedEnchantments[editingEnchantmentPath.type][editingEnchantmentPath.index] = iconPath;
            setHero({ ...hero, enchantments: updatedEnchantments });
            saveCustomBuild({ enchantments: updatedEnchantments });
            setShowEnchantmentSelector(false);
          }} 
        />
      )}

    </motion.div>
  );
}
