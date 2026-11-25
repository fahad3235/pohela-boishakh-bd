// Pohela Boishakh BD — festival data.
// Pohela Boishakh (14 April) is the first day of the Bengali calendar year
// and a public holiday in Bangladesh. Bengali year = Gregorian year - 593
// (14 April 2026 = 1 Boishakh 1433). Mangal Shobhajatra was inscribed on
// UNESCO's Representative List of the Intangible Cultural Heritage of
// Humanity in 2016. Tradition/food notes are general cultural knowledge,
// labelled as a guide (not an official source) in the app + README.
'use strict';
const TRADITIONS = [
  { id: 'mangal-shobhajatra', en: 'Mangal Shobhajatra', bn: 'মঙ্গল শোভাযাত্রা', cat: 'parade', note: 'The colourful dawn procession of giant masks and motifs, organised by Dhaka University’s Faculty of Fine Art since 1989.', detail: 'UNESCO Intangible Cultural Heritage (2016). The procession starts from the Fine Art faculty in the morning and winds through Dhaka — join early, wear red and white, and carry water.' },
  { id: 'panta-ilish', en: 'Panta Bhat & Ilish', bn: 'পান্তা ভাত ও ইলিশ', cat: 'food', note: 'The signature Boishakh breakfast: leftover rice soaked overnight, served with fried hilsa, onion and green chilli.', detail: 'Soak cooked rice in water the night before; serve cool in the morning with fried ilish, raw onion, green chilli and a squeeze of lemon. Many families eat it together at home or at a fair.' },
  { id: 'halkhata', en: 'Halkhata', bn: 'হালখাতা', cat: 'custom', note: 'Traders open a fresh accounts ledger for the new year and welcome customers with sweets.', detail: 'Shopkeepers settle old dues, open a new red-bound khata (ledger) and offer mishti to customers — a centuries-old business ritual of the new year.' },
  { id: 'baishakhi-mela', en: 'Boishakhi Mela', bn: 'বৈশাখী মেলা', cat: 'fair', note: 'Open-air new-year fairs with handicrafts, clay toys, sweets, folk music and nagordola (ferris wheel).', detail: 'Fairs run in Dhaka (Ramna, Suhrawardy Udyan), Shilpakala Academy and in towns across the country. Go in the late afternoon for the liveliest crowds and the best light for photos.' },
  { id: 'alpana', en: 'Alpana', bn: 'আলপনা', cat: 'custom', note: 'White paste designs painted on floors and courtyards to welcome the new year.', detail: 'Traditionally rice-paste; today chalk or paint works too. Simple lotus, fish and sun motifs are the classic Boishakh patterns — children love to help draw them.' },
  { id: 'new-clothes', en: 'New Clothes', bn: 'নতুন জামা', cat: 'custom', note: 'Red-and-white is the day’s dress code: saree or panjabi, often bought new for the occasion.', detail: 'Red stands for the rising sun of the new year, white for peace. Markets stay open late the night before; buy early if you want a specific size or design.' },
  { id: 'boishakhi-songs', en: 'Boishakhi Songs', bn: 'বৈশাখী গান', cat: 'music', note: '“Esho he Boishakh” — Tagore’s welcome to the new year — opens the day at Ramna Batamul with Chhayanaut’s dawn concert.', detail: 'Chhayanaut has sung in the new year at Ramna Batamul every 14 April since 1967. The concert starts at dawn; arrive before 6 am for a spot under the banyan tree.' },
  { id: 'bhorta-feast', en: 'Bhorta Feast', bn: 'ভর্তা', cat: 'food', note: 'Mashed potato, aubergine, dried fish and lentil bhortas — the rustic, spicy heart of the Boishakh table.', detail: 'Make 3–4 kinds: alu bhorta, begun bhorta, shutki bhorta and dal bhorta. Serve with hot rice, mustard oil and green chilli — the hotter the better.' },
  { id: 'pitha', en: 'Pitha', bn: 'পিঠা', cat: 'food', note: 'Rice cakes — chitoi, patishapta, narkel naru — sold at every fair and made at home for guests.', detail: 'Chitoi pitha with jaggery syrup is the fair favourite; patishapta (coconut-filled crepes) is the home favourite. Both keep well for a day if covered.' },
  { id: 'family-visits', en: 'Visiting Family', bn: 'আত্মীয়স্বজনের বাড়ি', cat: 'custom', note: 'The day is for meeting parents, elders and friends, and wishing everyone “Shubho Noboborsho”.', detail: 'Call or visit elders first, then friends. Bring mishti when visiting — and expect to be fed panta-ilish at least twice before the day is over.' },
];

const FOODS = [
  { id: 'panta-bhat', en: 'Panta Bhat', bn: 'পান্তা ভাত', kind: 'main', ingredients: 'Cooked rice, water, salt', note: 'Rice soaked overnight in water; served cool. The dish that defines the Boishakh morning.' },
  { id: 'ilish-bhaja', en: 'Ilish Bhaja (Fried Hilsa)', bn: 'ইলিশ ভাজা', kind: 'main', ingredients: 'Hilsa, turmeric, salt, mustard oil', note: 'Fried golden in mustard oil. The national fish, and the star of the Boishakh plate.' },
  { id: 'alu-bhorta', en: 'Alu Bhorta', bn: 'আলু ভর্তা', kind: 'side', ingredients: 'Potato, onion, green chilli, mustard oil', note: 'Mashed potato with onion and chilli — the simplest bhorta, and the one everyone reaches for first.' },
  { id: 'begun-bhorta', en: 'Begun Bhorta', bn: 'বেগুন ভর্তা', kind: 'side', ingredients: 'Roasted aubergine, onion, garlic, chilli', note: 'Smoky roasted aubergine mashed with onion and garlic. Best made just before eating.' },
  { id: 'shutki-bhorta', en: 'Shutki Bhorta', bn: 'শুঁটকি ভর্তা', kind: 'side', ingredients: 'Dried fish, onion, garlic, dried chilli', note: 'Pungent dried-fish mash — the boldest flavour on the table. A little goes a long way.' },
  { id: 'dal-bhorta', en: 'Dal Bhorta', bn: 'ডাল ভর্তা', kind: 'side', ingredients: 'Lentils, onion, green chilli, mustard oil', note: 'Mashed spiced lentils. Mild, filling, and a good balance to the fiery shutki.' },
  { id: 'chitoi-pitha', en: 'Chitoi Pitha', bn: 'চিতই পিঠা', kind: 'sweet', ingredients: 'Rice flour, water, jaggery syrup', note: 'Soft griddle cakes eaten with jaggery syrup. The fair-stall favourite of Boishakh.' },
  { id: 'patishapta', en: 'Patishapta', bn: 'পাটিসাপটা', kind: 'sweet', ingredients: 'Rice flour, coconut, jaggery, milk', note: 'Thin crepes rolled around sweet coconut. The home-made pitha most families serve guests.' },
  { id: 'narkel-naru', en: 'Narkel Naru', bn: 'নারকেল নাড়ু', kind: 'sweet', ingredients: 'Coconut, jaggery, cardamom', note: 'Sweet coconut balls. Easy to make ahead and share — a classic new-year gift for neighbours.' },
  { id: 'mishti-doi', en: 'Mishti Doi', bn: 'মিষ্টি দই', kind: 'sweet', ingredients: 'Milk, sugar/jaggery', note: 'Sweetened set yoghurt. The cool, sweet finish to a spicy Boishakh meal.' },
];

const GREETINGS = [
  { id: 'shubho-noboborsho', bn: 'শুভ নববর্ষ', en: 'Happy New Year', text: 'শুভ নববর্ষ! নতুন বছর আপনার জীবনে সুখ, শান্তি ও সমৃদ্ধি বয়ে আনুক।' },
  { id: 'shubho-pohela-boishakh', bn: 'শুভ পহেলা বৈশাখ', en: 'Happy Pohela Boishakh', text: 'শুভ পহেলা বৈশাখ! বাংলা নববর্ষের অনেক অনেক শুভেচ্ছা।' },
  { id: 'noboborsho-shubhechha', bn: 'নববর্ষের শুভেচ্ছা', en: 'New Year greetings', text: 'নববর্ষের আন্তরিক শুভেচ্ছা ও ভালোবাসা রইল। নতুন বছর হোক আনন্দময়।' },
  { id: 'esho-he-boishakh', bn: 'এসো হে বৈশাখ', en: 'Come, O Boishakh', text: 'এসো হে বৈশাখ, এসো এসো! পুরনো গ্লানি মুছে নতুন আশায় ভরে উঠুক জীবন। শুভ নববর্ষ!' },
  { id: 'notun-bochor', bn: 'নতুন বছরের শুভেচ্ছা', en: 'Wishes for the new year', text: 'নতুন বছরের শুভেচ্ছা! পুরনো বছরের সব দুঃখ ভুলে নতুন স্বপ্ন নিয়ে এগিয়ে যান।' },
  { id: 'shukho-shanti', bn: 'সুখ ও শান্তির নববর্ষ', en: 'A new year of joy and peace', text: 'নববর্ষে আপনার ও আপনার পরিবারের সুখ, শান্তি ও সুস্থতা কামনা করছি। শুভ নববর্ষ!' },
  { id: 'rongin-boishakh', bn: 'রঙিন বৈশাখ', en: 'A colourful Boishakh', text: 'রঙিন বৈশাখের শুভেচ্ছা! লাল-সাদার এই উৎসবে আপনার দিন হোক আনন্দে ভরা।' },
  { id: 'shopno-puron', bn: 'স্বপ্ন পূরণের বছর', en: 'A year of dreams fulfilled', text: 'নতুন বছর আপনার সব স্বপ্ন পূরণ করুক। শুভ নববর্ষ ও অনেক শুভকামনা!' },
];

const CHECKLIST_DEFAULTS = [
  { id: 'clothes', en: 'Buy new red-and-white clothes', bn: 'লাল-সাদা নতুন জামা কেনা' },
  { id: 'panta', en: 'Soak rice for panta bhat (night before)', bn: 'পান্তা ভাতের জন্য ভাত ভিজিয়ে রাখা' },
  { id: 'ilish', en: 'Buy ilish and bhorta ingredients', bn: 'ইলিশ ও ভর্তার উপকরণ কেনা' },
  { id: 'alpana', en: 'Prepare alpana colours', bn: 'আলপনার রং প্রস্তুত করা' },
  { id: 'mela', en: 'Plan the mela visit (time + place)', bn: 'মেলায় যাওয়ার পরিকল্পনা' },
  { id: 'family', en: 'Call or visit elders', bn: 'বড়দের ফোন করা বা দেখা করা' },
  { id: 'greetings', en: 'Send new-year greetings to friends', bn: 'বন্ধুদের নববর্ষের শুভেচ্ছা পাঠানো' },
  { id: 'camera', en: 'Charge phone / camera', bn: 'ফোন / ক্যামেরা চার্জ দেওয়া' },
  { id: 'cash', en: 'Keep small cash for the fair', bn: 'মেলার জন্য খুচরা টাকা রাখা' },
  { id: 'weather', en: 'Check the weather (April heat / rain)', bn: 'আবহাওয়া দেখে নেওয়া (গরম / বৃষ্টি)' },
];

const BoishakhDataApi = { TRADITIONS, FOODS, GREETINGS, CHECKLIST_DEFAULTS };
if (typeof module !== 'undefined' && module.exports) module.exports = BoishakhDataApi;
else if (typeof window !== 'undefined') window.BoishakhData = BoishakhDataApi;
