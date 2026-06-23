/**
 * 息壤種子資料 — 6 位資深亞裔藝術家
 * 用法：node scripts/seed.mjs
 */

export const artists = [
  {
    _type: 'artist',
    _id: 'artist-chen-yuming',
    name: '陳玉明',
    nameEn: 'Chen Yu-Ming',
    slug: { _type: 'slug', current: 'chen-yu-ming' },
    index: 1,
    featured: true,
    medium: ['水墨', '書法'],
    yearsActive: 52,
    birthYear: 1943,
    location: '臺灣・臺南',
    quote: '墨色是時間的刻度，每一筆都是與自身的對話。',
    bio: [
      {
        _type: 'block',
        _key: 'bio-cym-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-1',
            text: '陳玉明，1943 年生於臺南鹽埕，自幼隨外祖父習書，十八歲入臺灣師範大學美術系，師從溥心畬嫡傳弟子莊嚴。其畫風承繼宋元文人畫脈絡，以筆墨留白見長，晚年尤致力於探索「氣韻」與「空白」的辯證關係。',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio-cym-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-2',
            text: '曾任國立臺灣藝術大學水墨畫研究所所長逾二十年，作品典藏於國立故宮博物院、香港藝術館及大英博物館亞洲館。2010 年榮獲行政院文化獎，為臺灣水墨畫界最高榮譽。',
          },
        ],
      },
    ],
    timeline: [
      { _key: 't1', year: 1961, title: '入讀師大美術系', description: '師從莊嚴，奠定傳統書畫根基' },
      { _key: 't2', year: 1975, title: '旅居京都三年', description: '研習室町時代水墨，深受禪畫影響' },
      { _key: 't3', year: 1988, title: '首次個展於國立歷史博物館', description: '展出「留白系列」六十件，轟動藝壇' },
      { _key: 't4', year: 2010, title: '榮獲行政院文化獎', description: '臺灣藝術最高榮譽' },
      { _key: 't5', year: 2019, title: '大英博物館典藏', description: '〈江山無盡卷〉入藏亞洲館永久典藏' },
    ],
  },
  {
    _type: 'artist',
    _id: 'artist-lin-huizhen',
    name: '林惠珍',
    nameEn: 'Lin Hui-Chen',
    slug: { _type: 'slug', current: 'lin-hui-chen' },
    index: 2,
    featured: false,
    medium: ['纖維', '裝置藝術'],
    yearsActive: 44,
    birthYear: 1951,
    location: '臺灣・臺北',
    quote: '織物是最古老的語言，每一根線都記得手的溫度。',
    bio: [
      {
        _type: 'block',
        _key: 'bio-lhz-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-1',
            text: '林惠珍以傳統苧麻織造技術為基礎，創造出跨越傳統工藝與當代裝置的纖維藝術作品。1951 年生於苗栗客家庄，祖母為當地知名手工染織師，自幼浸淫於藍染、苧麻編織的生活傳統。',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio-lhz-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-2',
            text: '2003 年創辦「苧」工作室，致力推廣客家藍染復育。其大型裝置作品〈根系〉以 12,000 條手染苧麻線懸吊於空間，曾展出於威尼斯雙年展臺灣館（2015）及上海當代藝術館（2018），被譽為「將記憶物質化的纖維詩人」。',
          },
        ],
      },
    ],
    timeline: [
      { _key: 't1', year: 1979, title: '赴日研習染織', description: '於京都傳統染織研究所修業三年' },
      { _key: 't2', year: 2003, title: '創辦「苧」工作室', description: '苗栗客家藍染復育基地成立' },
      { _key: 't3', year: 2015, title: '威尼斯雙年展', description: '代表臺灣參展，獲評審特別提及' },
      { _key: 't4', year: 2021, title: '國家工藝成就獎', description: '文化部頒發最高工藝榮譽' },
    ],
  },
  {
    _type: 'artist',
    _id: 'artist-wang-daolin',
    name: '王道林',
    nameEn: 'Wang Dao-Lin',
    slug: { _type: 'slug', current: 'wang-dao-lin' },
    index: 3,
    featured: false,
    medium: ['油彩', '版畫'],
    yearsActive: 48,
    birthYear: 1947,
    location: '香港',
    quote: '我在油彩裡尋找記憶，在版畫裡刻下時間。',
    bio: [
      {
        _type: 'block',
        _key: 'bio-wdl-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-1',
            text: '王道林，1947 年生於廣州，1968 年隨家人移居香港。先後就讀香港理工大學設計系、英國皇家藝術學院版畫科，是香港戰後移民世代最具代表性的藝術家之一。',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio-wdl-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-2',
            text: '其作品以油彩大幅畫布記錄香港城市景觀的歷史變遷，疊加版畫印刷紋理，形成獨特的「層疊記憶」視覺語言。作品典藏於香港藝術館、M+ 博物館及泰德現代藝術館。',
          },
        ],
      },
    ],
    timeline: [
      { _key: 't1', year: 1968, title: '移居香港', description: '文化大革命期間隨家人南下' },
      { _key: 't2', year: 1976, title: '英國皇家藝術學院', description: '取得版畫科碩士學位' },
      { _key: 't3', year: 1997, title: '「回歸前夕」系列', description: '記錄香港移交前城市面貌，引發廣泛共鳴' },
      { _key: 't4', year: 2022, title: 'M+ 博物館典藏展', description: '「城市層疊」個展於 M+ 舉行' },
    ],
  },
  {
    _type: 'artist',
    _id: 'artist-suzuki-michiko',
    name: '鈴木道子',
    nameEn: 'Suzuki Michiko',
    slug: { _type: 'slug', current: 'suzuki-michiko' },
    index: 4,
    featured: false,
    medium: ['陶藝', '雕刻'],
    yearsActive: 41,
    birthYear: 1954,
    location: '日本・京都',
    quote: '土是最誠實的材料，它記得每一次觸碰。',
    bio: [
      {
        _type: 'block',
        _key: 'bio-sm-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-1',
            text: '鈴木道子，1954 年生於京都陶工世家，是日本重要無形文化財「信樂燒」傳承家系第五代。東京藝術大學陶藝科畢業後赴義大利法恩扎陶藝中心研修，將亞平寧半島的赤陶技法融入日本傳統燒製工藝。',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio-sm-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-2',
            text: '其代表作「無言系列」以生命週期中的靜默時刻為主題，大型陶塑呈現沉思、老去、告別等人生命題。曾獲日本陶藝展大獎（1998）、義大利法恩扎國際陶藝雙年展金獎（2006），被《陶藝年鑑》列為「二十一世紀最具影響力陶藝家」之一。',
          },
        ],
      },
    ],
    timeline: [
      { _key: 't1', year: 1976, title: '東京藝術大學畢業', description: '以優等成績完成陶藝科學業' },
      { _key: 't2', year: 1982, title: '義大利法恩扎研修', description: '歐洲傳統與亞洲技法的首次融合' },
      { _key: 't3', year: 1998, title: '日本陶藝展大獎', description: '「無言系列」首展大獲好評' },
      { _key: 't4', year: 2006, title: '法恩扎國際雙年展金獎', description: '亞洲藝術家首次獲此殊榮' },
      { _key: 't5', year: 2019, title: '京都國立近代美術館個展', description: '回顧展集四十年創作精華' },
    ],
  },
  {
    _type: 'artist',
    _id: 'artist-kim-sooyeon',
    name: '金秀妍',
    nameEn: 'Kim Soo-Yeon',
    slug: { _type: 'slug', current: 'kim-soo-yeon' },
    index: 5,
    featured: false,
    medium: ['水彩', '膠彩'],
    yearsActive: 38,
    birthYear: 1957,
    location: '韓國・首爾',
    quote: '顏色是情感最直接的語言，我用色彩說我說不出口的話。',
    bio: [
      {
        _type: 'block',
        _key: 'bio-ksy-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-1',
            text: '金秀妍，1957 年生於首爾，韓國國立首爾大學美術學院西洋畫系畢業後赴法，於巴黎美術學院師從抽象表現主義大師喬治・馬修。回韓後融合朝鮮傳統民畫色彩體系與西方抽象語彙，發展出其獨樹一幟的「彩韻畫」風格。',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio-ksy-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-2',
            text: '2008 年起擔任首爾大學客座教授，長期致力於推動亞洲女性藝術家的國際能見度。其「四季花開系列」被韓國文化體育觀光部指定為重要文化遺產，作品現為盧浮宮亞洲藝術典藏之一。',
          },
        ],
      },
    ],
    timeline: [
      { _key: 't1', year: 1979, title: '旅法求學', description: '巴黎美術學院研修，深受抽象表現主義影響' },
      { _key: 't2', year: 1992, title: '「彩韻畫」正式確立', description: '東西融合的個人風格成熟期' },
      { _key: 't3', year: 2008, title: '首爾大學客座教授', description: '開始系統性培育亞洲女性藝術家' },
      { _key: 't4', year: 2016, title: '盧浮宮典藏', description: '「春暉」入藏盧浮宮亞洲藝術館' },
    ],
  },
  {
    _type: 'artist',
    _id: 'artist-huang-mingzhi',
    name: '黃明志',
    nameEn: 'Huang Ming-Zhi',
    slug: { _type: 'slug', current: 'huang-ming-zhi' },
    index: 6,
    featured: false,
    medium: ['攝影', '裝置藝術'],
    yearsActive: 35,
    birthYear: 1960,
    location: '馬來西亞・吉隆坡',
    quote: '攝影不是捕捉瞬間，是與時間的對話。',
    bio: [
      {
        _type: 'block',
        _key: 'bio-hmz-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-1',
            text: '黃明志，1960 年生於馬來西亞怡保，馬來亞大學文學系畢業後轉習攝影，先後於紐約國際攝影中心及英國約克大學視覺藝術學院進修。以馬來西亞華人社群的日常生活為長期拍攝主題，深刻記錄南洋華人文化的流變與堅韌。',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'bio-hmz-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-2',
            text: '其「南洋系列」歷時二十年，累計超過 4,000 幀紀實影像，被《TIME》雜誌評為「記錄東南亞華人社群最重要的攝影師」。2014 年創辦「南洋攝影節」，成為東南亞最具規模的攝影藝術節，年吸引逾十萬觀眾。',
          },
        ],
      },
    ],
    timeline: [
      { _key: 't1', year: 1988, title: '紐約國際攝影中心', description: '確立紀實攝影方向' },
      { _key: 't2', year: 1995, title: '「南洋系列」啟動', description: '二十年長期拍攝計劃正式展開' },
      { _key: 't3', year: 2014, title: '南洋攝影節創辦', description: '東南亞最大攝影藝術節' },
      { _key: 't4', year: 2023, title: 'TIME 雜誌年度攝影師', description: '「南洋系列」完整首展於吉隆坡國家美術館' },
    ],
  },
]

export const artworks = [
  {
    _type: 'artwork',
    _id: 'artwork-jiangshan',
    title: '江山無盡卷',
    slug: { _type: 'slug', current: 'jiangshan-wujin-juan' },
    artist: { _type: 'reference', _ref: 'artist-chen-yuming' },
    year: 2019,
    medium: '水墨・絹本',
    dimensions: '46 × 840 cm',
    series: '留白系列',
    status: 'not-for-sale',
    description: '以宋代全景山水為題，將江山萬里凝縮於一卷之中。構圖以「留白」為核心語法，山勢在虛實之間隱現，雲氣流動其間。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '這幅長卷歷時三年完成，是陳玉明對自身繪畫語言的一次總結。他說：「每一段山勢都是我走過的地方，但我畫的不是地方，是那個走過的人。」',
          },
        ],
      },
    ],
  },
  {
    _type: 'artwork',
    _id: 'artwork-liubai',
    title: '留白・秋',
    slug: { _type: 'slug', current: 'liubai-qiu' },
    artist: { _type: 'reference', _ref: 'artist-chen-yuming' },
    year: 2015,
    medium: '水墨・宣紙',
    dimensions: '135 × 68 cm',
    series: '留白系列',
    status: 'inquire',
    description: '秋山一角，以大面積留白暗示天地之闊。寥寥數筆勾勒山石，墨色在乾濕之間呈現時間的厚度。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '創作於陳玉明母親辭世後的秋天，以山的沉靜訴說難言的悲喜。「空白不是什麼都沒有，是什麼都有。」',
          },
        ],
      },
    ],
  },
  {
    _type: 'artwork',
    _id: 'artwork-gensystem',
    title: '根系',
    slug: { _type: 'slug', current: 'gen-xi' },
    artist: { _type: 'reference', _ref: 'artist-lin-huizhen' },
    year: 2015,
    medium: '手染苧麻・裝置',
    dimensions: '1200 × 800 × 600 cm（可變）',
    series: '根系列',
    status: 'not-for-sale',
    description: '12,000 條手工藍染苧麻線由天花板垂懸而下，觀者穿行其間，如同穿越一片無聲的雨林。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '這件作品源自林惠珍回鄉探視老母的一次記憶。「她的手還是那麼靈活，在織布機上走動，像根在土裡找水。我想把那個畫面做出來。」每一條麻線都由林惠珍親手染色，染液取自苗栗山上的山藍草。',
          },
        ],
      },
    ],
  },
  {
    _type: 'artwork',
    _id: 'artwork-lanzhuang',
    title: '藍妝',
    slug: { _type: 'slug', current: 'lan-zhuang' },
    artist: { _type: 'reference', _ref: 'artist-lin-huizhen' },
    year: 2021,
    medium: '藍染苧麻・木框',
    dimensions: '180 × 240 cm',
    status: 'available',
    description: '以傳統藍染工法創作的大型織物，深淺不一的藍色構成山嵐般的層次感，布面紋理如同高山稜線。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '「藍妝」是林惠珍工作室學員共同完成的協作作品，十二位學員各自染製一段，最後由林惠珍縫合成整體。「這就是客家女人的方式，大家一起，才能做成一件大事。」',
          },
        ],
      },
    ],
  },
  {
    _type: 'artwork',
    _id: 'artwork-citynight',
    title: '城市夜色・1997',
    slug: { _type: 'slug', current: 'city-night-1997' },
    artist: { _type: 'reference', _ref: 'artist-wang-daolin' },
    year: 1997,
    medium: '油彩・版畫疊印・畫布',
    dimensions: '200 × 300 cm',
    status: 'not-for-sale',
    description: '以香港回歸前夕的夜景為底，疊印九層版畫紋理，每一層都是一個即將消失的香港細節。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '1997 年 6 月，王道林在香港島最高處架起畫架，連續三十個夜晚描繪維多利亞港。「我不知道那個光還會不會在，但我想記住它的樣子。」',
          },
        ],
      },
    ],
  },
  {
    _type: 'artwork',
    _id: 'artwork-muyan',
    title: '無言・老',
    slug: { _type: 'slug', current: 'wuyan-lao' },
    artist: { _type: 'reference', _ref: 'artist-suzuki-michiko' },
    year: 2006,
    medium: '信樂燒・陶塑',
    dimensions: '68 × 42 × 38 cm',
    status: 'inquire',
    description: '以信樂燒土捏塑一位老婦人低頭的姿態，表面刻意保留手指的壓痕，以土的質地傳遞皮膚的記憶。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '鈴木道子的祖母在信樂山腳下的小屋獨居至九十三歲。「無言・老」以祖母晚年常有的低頭姿勢為原型，探索老去的靜默與尊嚴。「老年不是衰退，是一種積累。土知道。」',
          },
        ],
      },
    ],
  },
  {
    _type: 'artwork',
    _id: 'artwork-spring',
    title: '春暉',
    slug: { _type: 'slug', current: 'chun-hui' },
    artist: { _type: 'reference', _ref: 'artist-kim-sooyeon' },
    year: 2014,
    medium: '膠彩・韓紙',
    dimensions: '180 × 360 cm',
    status: 'not-for-sale',
    description: '以朝鮮傳統民畫的牡丹紋樣為底，層疊十七種礦物顏料，色彩從暖橘漸層至深靛，如春日將盡時分的天光。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '金秀妍的母親在首爾仁寺洞有間小花店，春天賣牡丹。「春暉」是金秀妍對母親的致敬，「她一輩子都在培育美麗的東西，卻從不覺得自己了不起。」',
          },
        ],
      },
    ],
  },
  {
    _type: 'artwork',
    _id: 'artwork-nanyang-market',
    title: '南洋系列・早市',
    slug: { _type: 'slug', current: 'nanyang-zaoshi' },
    artist: { _type: 'reference', _ref: 'artist-huang-mingzhi' },
    year: 2008,
    medium: '黑白銀鹽攝影',
    dimensions: '80 × 120 cm（版次 1/10）',
    status: 'available',
    description: '怡保老街早市，霧氣中的豆腐花攤販，身後是百年老屋的窗花。這是南洋系列第 847 幀，拍攝於 2008 年清晨五點。',
    story: [
      {
        _type: 'block',
        _key: 'story-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: '黃明志在這個攤位蹲守了三個月，每天早晨四點出門，等待光線和那個回家的老人相遇的那一刻。「好的照片不是搶來的，是等來的。」',
          },
        ],
      },
    ],
  },
]

export const exhibitions = [
  {
    _type: 'exhibition',
    _id: 'exhibition-current',
    title: '息壤・開幕首展',
    titleEn: 'Xirang — Inaugural Exhibition',
    slug: { _type: 'slug', current: 'xirang-inaugural' },
    type: 'group',
    status: 'current',
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    description: '六位來自臺灣、香港、日本、韓國、馬來西亞的資深亞裔藝術家，跨越半個世紀的創作歷程，在「息壤」共同呈現一場關於記憶、時間與土地的視覺對話。',
    curatorNote: '息壤，古籍中記載一種能自動生長的神土。我們以此命名，是因為我們相信：每一位資深藝術家的作品，都是一種永恆生長的生命物質。當代藝術世界往往崇尚年輕與速度，但真正的藝術深度需要時間浸養。這六位藝術家，合計超過兩百五十年的創作歷程，他們的作品如同土壤，安靜、厚實、生生不息。',
    artists: [
      { _type: 'reference', _ref: 'artist-chen-yuming' },
      { _type: 'reference', _ref: 'artist-lin-huizhen' },
      { _type: 'reference', _ref: 'artist-wang-daolin' },
      { _type: 'reference', _ref: 'artist-suzuki-michiko' },
      { _type: 'reference', _ref: 'artist-kim-sooyeon' },
      { _type: 'reference', _ref: 'artist-huang-mingzhi' },
    ],
    works: [
      { _type: 'reference', _ref: 'artwork-jiangshan' },
      { _type: 'reference', _ref: 'artwork-gensystem' },
      { _type: 'reference', _ref: 'artwork-citynight' },
      { _type: 'reference', _ref: 'artwork-muyan' },
      { _type: 'reference', _ref: 'artwork-spring' },
      { _type: 'reference', _ref: 'artwork-nanyang-market' },
    ],
  },
]
