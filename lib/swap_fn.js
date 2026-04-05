
// ── TEMPLATE SWAP ENGINE ─────────────────────────────────────────────
// Reads commerce.html template, swaps brand, colors, photos, products
// Called when intake completes on the product/commerce path

async function buildFromTemplate(intakeData) {
  const res = await fetch('/templates/commerce.html');
  let html = await res.text();

  const brand = (intakeData.name || 'Your Brand').trim();
  const desc = ((intakeData.desc || '') + ' ' + (intakeData.edge || '') + ' ' + (intakeData.name || '')).toLowerCase();

  // ── BRAND NAME ──────────────────────────────────────────────────────
  html = html.split('LOFTY AZUL').join(brand.toUpperCase());
  html = html.split('Lofty Azul').join(brand);
  html = html.split('lofty azul').join(brand.toLowerCase());
  html = html.split('lofty-azul').join(brand.toLowerCase().replace(/\s+/g,'-'));
  html = html.split('Lofty Azul Coffee').join(brand);
  html = html.split('LOFTY AZUL COFFEE').join(brand.toUpperCase());

  // ── TAGLINE ─────────────────────────────────────────────────────────
  if(intakeData.desc) {
    html = html.replace("Every bag comes from a farm we&#39;ve visited, a relationship we&#39;ve built.", intakeData.desc.slice(0,120));
    html = html.replace('Single-origin coffee sourced from the world&#39;s best farms. Roasted to order. Delivered fresh.', intakeData.desc.slice(0,100));
  }

  // ── COLOR SYSTEM — four vibe paths ──────────────────────────────────
  const vibes = {
    dark:    { cream:'#0B0D14',  warm:'#141820',  surface:'#1E2230', charcoal:'#E8E4D8', smoke:'rgba(232,228,216,0.5)', mist:'rgba(232,228,216,0.25)', border:'rgba(255,255,255,0.07)', azul:'#00E5FF',  azul2:'#00B8CC', azulg:'rgba(0,229,255,0.06)', amber:'#FFE8A8', green:'#00FF41' },
    light:   { cream:'#FAF8F4',  warm:'#F2EDE3',  surface:'#EEEAE1', charcoal:'#1A1814', smoke:'#6B6560',              mist:'#9A9590',               border:'rgba(26,24,20,0.1)',    azul:'#1B4B8A',  azul2:'#2E6BC4', azulg:'rgba(27,75,138,0.08)',  amber:'#C4622D', green:'#3D5A3E' },
    bold:    { cream:'#0A0A0A',  warm:'#111111',  surface:'#1A1A1A', charcoal:'#F0F0F0', smoke:'rgba(240,240,240,0.5)', mist:'rgba(240,240,240,0.3)', border:'rgba(255,255,255,0.08)', azul:'#C4622D',  azul2:'#E07840', azulg:'rgba(196,98,45,0.08)',  amber:'#FFE600', green:'#00FF41' },
    organic: { cream:'#FAF7F2',  warm:'#F0EBE0',  surface:'#E8E0D0', charcoal:'#1A1A14', smoke:'#6B6558',              mist:'#9A9588',               border:'rgba(26,26,20,0.1)',    azul:'#3D5A3E',  azul2:'#4D7A4E', azulg:'rgba(61,90,62,0.08)',   amber:'#C4A052', green:'#3D5A3E' },
  };
  const v = vibes[intakeData.vibe] || vibes.light;
  html = html.replace('--cream:#FAF8F4',    '--cream:'+v.cream);
  html = html.replace('--warm:#F2EDE3',     '--warm:'+v.warm);
  html = html.replace('--surface:#EEEAE1',  '--surface:'+v.surface);
  html = html.replace('--charcoal:#1A1814', '--charcoal:'+v.charcoal);
  html = html.replace('--smoke:#6B6560',    '--smoke:'+v.smoke);
  html = html.replace('--mist:#9A9590',     '--mist:'+v.mist);
  html = html.replace('--border:rgba(26,24,20,0.1)',  '--border:'+v.border);
  html = html.replace('--border2:rgba(26,24,20,0.2)', '--border2:'+v.border);
  html = html.replace('--azul:#1B4B8A',     '--azul:'+v.azul);
  html = html.replace('--azul2:#2E6BC4',    '--azul2:'+v.azul2);
  html = html.replace('--azulg:rgba(27,75,138,0.08)', '--azulg:'+v.azulg);
  html = html.replace('--amber:#C4622D',    '--amber:'+v.amber);
  html = html.replace('--green:#3D5A3E',    '--green:'+v.green);

  // ── PHOTO LIBRARY — 20 categories ───────────────────────────────────
  // All IDs verified Unsplash editorial quality
  const lib = {
    coffee:      { hero:'1447933601403-0c6688de566e', p:['1558618666-fcd25c85cd64','1509042239860-f550ce710b93','1495474472287-4d71bcdd2085','1514432324607-a09d9b4aefdd','1442512595331-e89e73853f31','1461023058943-07fcbe16d735'], craft:'1504630083234-14187a9df0f5' },
    food:        { hero:'1517248135467-2676a977c60d', p:['1565299624286-ebf6e29f9054','1414235077428-338989a2e8c0','1482049016688-2d3e1b311543','1476224203421-9ac39bcb3327','1504674900247-0877df9cc836','1466637574441-749d8453ba1e'], craft:'1424847651672-bf20a4b0982b' },
    fitness:     { hero:'1534258936128-61e4a7b01058', p:['1571902943202-507ec2618e8f','1518611540400-e8927de0e9f6','1546483875-ad9cc1750783','1540497077-93040c4e6bc3','1571019613454-1cb2f99b2d8b','1485827404703-89b55fcc595e'], craft:'1534258936128-61e4a7b01058' },
    sports:      { hero:'1546519638-68e109498ffc',    p:['1521537634081-0ae0cf821b66','1518611540400-e8927de0e9f6','1583500178450-b0d3f38e4a9b','1546483875-ad9cc1750783','1517466787897-4a0e22d9bcdf','1508345228704-f43f85e81c62'], craft:'1546519638-68e109498ffc' },
    fashion:     { hero:'1441986300917-64674bd600d8', p:['1515886657613-9f3515b0c78f','1509631179647-0177331693ae','1512436991641-6745cae1c527','1469334031218-e382a71b716b','1503342217505-b0a15ec3261c','1558618666-fcd25c85cd64'],   craft:'1441986300917-64674bd600d8' },
    beauty:      { hero:'1522335789203-aabd1fc54bc9', p:['1576426863848-c21f53d9cd9f','1571781926291-c477ebfd024b','1526045612212-70caf35c14df','1512496522827-f99b1b32647b','1522337360826-ede14a77c8cf','1583241800698-e8ab01830a26'], craft:'1522335789203-aabd1fc54bc9' },
    tech:        { hero:'1551288049-bebda4e38f71',    p:['1498050108023-c5249f4df085','1517245386807-bb43f82c33c4','1521737852567-6949f3f9f2b5','1460925895917-afdab827c52f','1484807352052-23338990820f','1496181133206-80ce9b88a853'], craft:'1551288049-bebda4e38f71' },
    art:         { hero:'1541367777-4adebd0e89d5',    p:['1513364776144-60967b0f800f','1561059488-8a9062c1c5e6','1549490349-8753a11b2161','1578926288207-a90a5366b673','1547826039-a8109324dc0e','1544967082-d9d25d867d66'], craft:'1541367777-4adebd0e89d5' },
    music:       { hero:'1511379938547-c1f69419868d', p:['1493225457124-a3eb161ffa5f','1510915361894-db8b60106cb1','1507838153414-b4b713384a76','1514320291840-2e0a9bf2a9ae','1598488035139-bdbb2231ce04','1520523839897-bd0b52f945a0'], craft:'1511379938547-c1f69419868d' },
    pets:        { hero:'1587300003388-59208cc962cb', p:['1548767797-d8c844163c4a','1601758228041-f3b0795be0e3','1537151625747-0d5cfd18d83c','1583511655826-05700d52f4d9','1415369629372-26f2fe60c467','1477884213360-7e9d7dcc1e48'], craft:'1587300003388-59208cc962cb' },
    home:        { hero:'1484101403633-562f891dc89a', p:['1555041469-db74b82d8e5c','1449844908441-895c1e4f1e93','1506439773649-6e0eb8cfb237','1493663284031-b7e3aefcae7c','1502005229762-cf1b2da7c5d6','1524758631624-e2822f4f6f7f'], craft:'1484101403633-562f891dc89a' },
    travel:      { hero:'1469854523086-cc02b9cb3031', p:['1488085061851-a5c9d2d0e625','1530521954074-e0a103ccc191','1476514525405-309f2c54e4d7','1507525428034-b723cf961d3e','1506905925346-21bda4d32df4','1501555728187-bf3b50b39636'], craft:'1469854523086-cc02b9cb3031' },
    education:   { hero:'1509062522246-fe9f81b9b5d6', p:['1427504494785-3a9ca7044f45','1456513080510-7bf3a84b82f8','1497633762265-9d909b81e29b','1503676260728-1c00da094a0b','1434030216411-0b793f4b6f1c','1524178232363-1fb2b075b655'], craft:'1509062522246-fe9f81b9b5d6' },
    health:      { hero:'1505576399279-565b52d4ac71', p:['1512290923902-8a9f81dc236c','1559757148-459f6d2e8b28','1498837167922-ddd27525d352','1490645935967-10de6ba17061','1571019614099-cf53ccfbe73d','1544367567-0f2fcb009e0b'], craft:'1505576399279-565b52d4ac71' },
    realestate:  { hero:'1560518883-ce09059eeffa',    p:['1484154218962-a197022b5858','1512917774080-9991f1c4c750','1464082354059-27db6ce50048','1567767775-31043cdd6d94','1558618666-fcd25c85cd64','1484101403633-562f891dc89a'], craft:'1560518883-ce09059eeffa' },
    automotive:  { hero:'1492144534655-ae79c964c9d7', p:['1549317661-cf369843-2c4','1552519507-da3b142916a1','1503736334-c99ad3a91f58','1542362567-bc4a6e905dc8','1519641471654-ac18d401b92c','1473445730015-841f29a9490b'], craft:'1492144534655-ae79c964c9d7' },
    events:      { hero:'1492684223066-81342ee5ff30', p:['1429962714451-bb934ecdc4ec','1464366400690-2eb80bf8fcc3','1504196606363-3b5ca5d13b76','1533174072545-7a4d277a2447','1519671282429-b44f9cbeacd4','1561489413-985b06da5bee'], craft:'1492684223066-81342ee5ff30' },
    finance:     { hero:'1611974789855-9c702a4b02f8', p:['1554224155-6726b3ff858f','1518186233592-c3b48975cd25','1579621970588-a35d0e7ab9b6','1565514020179-026b92b2d70b','1450101499163-c8848c66ca85','1507003211169-0a1dd7228f2d'], craft:'1611974789855-9c702a4b02f8' },
    nature:      { hero:'1441974231531-c6227db2b175', p:['1518020382113-a7e8fc38eac9','1465146344425-f00d5f5c8f07','1470071459604-3b5ec3a7fe05','1426604966848-d7adac402bff','1501854140801-50d01698950b','1444464666168-49d633b86797'], craft:'1441974231531-c6227db2b175' },
    general:     { hero:'1441986300917-64674bd600d8', p:['1509042239860-f550ce710b93','1495474472287-4d71bcdd2085','1514432324607-a09d9b4aefdd','1442512595331-e89e73853f31','1461023058943-07fcbe16d735','1504630083234-14187a9df0f5'], craft:'1441986300917-64674bd600d8' },
  };

  // Category detection — keyword matching on full user input
  let cat = 'general';
  if(desc.match(/coffee|cafe|roast|espresso|brew|barista|bean/)) cat = 'coffee';
  else if(desc.match(/restaurant|food|eat|meal|chef|cook|pizza|burger|sushi|bakery|catering|kitchen/)) cat = 'food';
  else if(desc.match(/fitness|gym|workout|training|crossfit|yoga|pilates|health club/)) cat = 'fitness';
  else if(desc.match(/sport|pool|billiard|cue|golf|tennis|soccer|basketball|baseball|hockey|bowling/)) cat = 'sports';
  else if(desc.match(/fashion|cloth|wear|apparel|dress|style|boutique|designer|accessories|bag|shoe/)) cat = 'fashion';
  else if(desc.match(/beauty|skin|hair|makeup|cosmetic|salon|spa|nail|lash|brow|wellness/)) cat = 'beauty';
  else if(desc.match(/tech|software|app|saas|digital|developer|code|startup|platform|tool|ai/)) cat = 'tech';
  else if(desc.match(/art|gallery|tattoo|design|creative|illustration|paint|sculpture|studio/)) cat = 'art';
  else if(desc.match(/music|band|concert|album|record|studio|instrument|dj|producer/)) cat = 'music';
  else if(desc.match(/pet|dog|cat|animal|grooming|veterinary|boarding|training/)) cat = 'pets';
  else if(desc.match(/home|furniture|interior|decor|garden|kitchen|living|bedroom|house/)) cat = 'home';
  else if(desc.match(/travel|hotel|resort|tour|vacation|adventure|trip|destination/)) cat = 'travel';
  else if(desc.match(/education|course|learn|school|tutor|training|certification|academy/)) cat = 'education';
  else if(desc.match(/health|medical|dental|therapy|mental|clinic|hospital|pharmacy/)) cat = 'health';
  else if(desc.match(/real estate|property|house|apartment|commercial|rent|lease|realtor/)) cat = 'realestate';
  else if(desc.match(/car|auto|vehicle|truck|motorcycle|dealer|repair|mechanic|detail/)) cat = 'automotive';
  else if(desc.match(/event|wedding|party|conference|venue|catering|photography|planner/)) cat = 'events';
  else if(desc.match(/finance|invest|money|insurance|accounting|tax|wealth|banking|crypto/)) cat = 'finance';
  else if(desc.match(/nature|outdoor|hiking|camping|garden|plant|flower|farm|organic/)) cat = 'nature';

  const photos = lib[cat];
  const base = 'https://images.unsplash.com/photo-';

  // Swap hero
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1447933601403-0c6688de566e\?w=1400[^"']*/g, base+photos.hero+'?w=1400&q=90&fit=crop&crop=center');
  // Swap craft/story section
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1442512595331-e89e73853f31\?w=1200[^"']*/g, base+photos.craft+'?w=1200&q=90&fit=crop');
  // Swap subscription background
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1504630083234-14187a9df0f5\?w=1400[^"']*/g, base+photos.craft+'?w=1400&q=80&fit=crop');
  // Swap product photos by position
  const oldIds = ['1558618666-fcd25c85cd64','1447933601403-0c6688de566e','1509042239860-f550ce710b93','1495474472287-4d71bcdd2085','1514432324607-a09d9b4aefdd','1611854779393-1b2da9d400fe','1442512595331-e89e73853f31','1504630083234-14187a9df0f5','1534778101976-62847782c213','1461023058943-07fcbe16d735'];
  oldIds.forEach(function(id, i) {
    const newId = photos.p[i % photos.p.length];
    const re = new RegExp('https://images\.unsplash\.com/photo-' + id + '\?w=600[^"']*', 'g');
    html = html.replace(re, base+newId+'?w=600&q=85&fit=crop');
    const reHi = new RegExp('https://images\.unsplash\.com/photo-' + id + '\?w=900[^"']*', 'g');
    html = html.replace(reHi, base+newId+'?w=900&q=90&fit=crop');
  });

  // ── PRODUCTS — swap JS array if user provided offers ─────────────────
  if(intakeData.offers && intakeData.offers.length > 0) {
    const catLabels = ['single-origin','single-origin','blend','blend','espresso','cold-brew'];
    const newProducts = intakeData.offers.slice(0,10).map(function(o, i) {
      const cleanName = (o.name||'Product '+(i+1)).replace(/"/g,"'");
      const cleanPrice = parseFloat((o.price||'').toString().replace(/[^0-9.]/g,'')) || (18 + i*4);
      const pid = photos.p[i % photos.p.length];
      return '{id:'+(i+1)
        +',name:"'+cleanName+'"'
        +',tag:"Premium quality."'
        +',cat:"'+catLabels[i % catLabels.length]+'"'
        +',price:'+cleanPrice
        +(i===2?',was:'+(cleanPrice+5):'')
        +',img:"'+base+pid+'?w=600&q=85&fit=crop"'
        +',imgHi:"'+base+pid+'?w=900&q=90&fit=crop"'
        +',roast:"Premium"'
        +',notes:"Quality crafted"'
        +',origin:"'+brand+'"'
        +',process:"Crafted"'
        +',altitude:"Premium"'
        +',badge:'+(i===0?'"new"':i===2?'"best"':'null')
        +'}';
    }).join(',
  ');
    html = html.replace(/var products = \[[\s\S]*?\];/, 'var products = [
  ' + newProducts + '
];');
  }

  // ── CTA TEXT — based on primary action ───────────────────────────────
  const ctaMap = {
    buy: 'Shop Now', subscribe: 'Subscribe', waitlist: 'Join Waitlist',
    book: 'Book Now', contact: 'Contact Us', learn: 'Learn More'
  };
  const cta = ctaMap[intakeData.action] || 'Shop Now';
  html = html.replace(/Shop the collection/g, cta);

  // ── FOOTER BRAND ─────────────────────────────────────────────────────
  html = html.replace(/&copy; 2026 Lofty Azul Coffee/g, '&copy; 2026 '+brand);

  return html;
}
