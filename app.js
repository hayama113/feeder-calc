const APP_VERSION = '3.1.2';

const VERSIONS = {
  app: 'Web v3.1.2',
  ampacity: '2026.06-A',
  physical: '2026.06-A',
  form: '2026.06-A'
};

const STORAGE = {
  disclaimer: 'fc_disclaimer_v3',
  history: 'fc_history_v3',
  saved: 'fc_saved_v3',
  ui: 'fc_ui_v3',
  compare: 'fc_compare_v3',
  sort: 'fc_sort_v3'
};

const BREAKER_SIZES = [10,15,20,30,40,50,60,75,100,125,150,175,200,225,250,300,350,400,500,600,800];
const POWER_FACTOR_OPTIONS = ['0.5','0.55','0.6','0.65','0.7','0.75','0.8','0.85','0.9','0.95','1.0'];
const EFFICIENCY_OPTIONS = [...POWER_FACTOR_OPTIONS];
const BREAKER_MARGIN_RATIO_OPTIONS = [
  {value:'0.5', label:'50%（総負荷÷0.5）'},
  {value:'0.6', label:'60%（総負荷÷0.6）'},
  {value:'0.7', label:'70%（総負荷÷0.7）'},
  {value:'0.8', label:'80%（総負荷÷0.8）'},
  {value:'0.9', label:'90%（総負荷÷0.9）'},
  {value:'1.0', label:'100%（総負荷÷1.0）'}
];
const CABLE_SIZING_MODE_OPTIONS = [
  {value:'auto', label:'自動推奨'},
  {value:'manual', label:'手動指定'}
];
const DISPLAY_SCALE_OPTIONS = [
  {value:'0.7', label:'70%'},
  {value:'0.8', label:'80%'},
  {value:'0.9', label:'90%'},
  {value:'1.0', label:'100%'},
  {value:'1.1', label:'110%'},
  {value:'1.2', label:'120%'},
  {value:'1.3', label:'130%'}
];

const TEMP_COEF = {20:1.18,25:1.14,30:1.10,35:1.05,40:1.00,45:0.95,50:0.89};
const PARALLEL_COEF = {1:1.00,2:0.90,3:0.85,4:0.80,5:0.75,6:0.70};
const INSTALL_COEF = {
  '気中': {air:1.00,rack:1.00,pipe:1.00},
  'ラック': {air:1.00,rack:0.95,pipe:1.00},
  '配管': {air:1.00,rack:1.00,pipe:0.92}
};
const CONDITION_COEF = {'一般':1.00,'密集':0.90,'日射あり':0.95};
const DROP_LIMIT_PERCENT = 5.0;
const RACK_WIDTHS = [200,300,400,500,600,800];
const MAX_SAVED_ITEMS = 10;
const savedSortDefault = 'newest';
const compareModeDefault = 'major';

const kgPerM = (kg, m) => Number((kg / m).toFixed(3));
const innerByThickness = (outer, thickness) => Number((outer - 2 * thickness).toFixed(1));

const GROUND_RULES = [
  {groundType:'A種', wireType:'IV', maxBreaker:800, size:'60sq'},
  {groundType:'B種', wireType:'IV', maxBreaker:800, size:'38sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:100, size:'8sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:200, size:'14sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:400, size:'22sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:800, size:'38sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:100, size:'5.5sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:200, size:'8sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:400, size:'14sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:800, size:'22sq'},
  {groundType:'ELB', wireType:'IV', maxBreaker:200, size:'8sq'},
  {groundType:'ED', wireType:'IV', maxBreaker:400, size:'14sq'},
  {groundType:'EC', wireType:'IV', maxBreaker:800, size:'22sq'},
  {groundType:'A種', wireType:'CV', maxBreaker:800, size:'60sq'},
  {groundType:'B種', wireType:'CV', maxBreaker:800, size:'38sq'},
  {groundType:'C種', wireType:'CV', maxBreaker:200, size:'14sq'},
  {groundType:'D種', wireType:'CV', maxBreaker:200, size:'8sq'}
];

const CABLE_DATA = {
  'CV-1C': {
    3.5:{outerDiameter:7.0,massKgKm:74,resistance:5.20,ampacity:44},
    5.5:{outerDiameter:8.0,massKgKm:105,resistance:3.33,ampacity:58},
    8:{outerDiameter:8.6,massKgKm:130,resistance:2.31,ampacity:72},
    14:{outerDiameter:9.4,massKgKm:195,resistance:1.31,ampacity:100},
    22:{outerDiameter:11.0,massKgKm:280,resistance:0.832,ampacity:130},
    38:{outerDiameter:13.0,massKgKm:445,resistance:0.481,ampacity:190},
    60:{outerDiameter:15.5,massKgKm:655,resistance:0.305,ampacity:255},
    100:{outerDiameter:19.0,massKgKm:1100,resistance:0.183,ampacity:355},
    150:{outerDiameter:22.0,massKgKm:1550,resistance:0.122,ampacity:455},
    200:{outerDiameter:26.0,massKgKm:2050,resistance:0.0915,ampacity:545},
    250:{outerDiameter:28.0,massKgKm:2500,resistance:0.0739,ampacity:620},
    325:{outerDiameter:31.0,massKgKm:3200,resistance:0.0568,ampacity:725}
  },
  'CV-2C': {
    8:{outerDiameter:19.0,massKgKm:260,resistance:2.36,ampacity:66},
    14:{outerDiameter:19.0,massKgKm:375,resistance:1.34,ampacity:91},
    22:{outerDiameter:22.0,massKgKm:550,resistance:0.849,ampacity:120},
    38:{outerDiameter:26.0,massKgKm:865,resistance:0.491,ampacity:165},
    60:{outerDiameter:31.0,massKgKm:1330,resistance:0.311,ampacity:225},
    100:{outerDiameter:38.0,massKgKm:2130,resistance:0.187,ampacity:310},
    150:{outerDiameter:44.0,massKgKm:3030,resistance:0.124,ampacity:400},
    200:{outerDiameter:51.0,massKgKm:4040,resistance:0.0933,ampacity:490},
    250:{outerDiameter:56.0,massKgKm:4930,resistance:0.0754,ampacity:565},
    325:{outerDiameter:61.0,massKgKm:6300,resistance:0.0579,ampacity:670},
    400:{outerDiameter:67.0,massKgKm:8380,resistance:0.0471,ampacity:765},
    500:{outerDiameter:75.0,massKgKm:10470,resistance:0.0376,ampacity:880}
  },
  'CV-3C': {
    8:{outerDiameter:21.0,massKgKm:390,resistance:2.36,ampacity:62},
    14:{outerDiameter:24.0,massKgKm:560,resistance:1.34,ampacity:86},
    22:{outerDiameter:27.0,massKgKm:820,resistance:0.849,ampacity:110},
    38:{outerDiameter:32.0,massKgKm:1300,resistance:0.491,ampacity:155},
    60:{outerDiameter:37.0,massKgKm:1990,resistance:0.311,ampacity:210},
    100:{outerDiameter:45.0,massKgKm:3190,resistance:0.187,ampacity:290},
    150:{outerDiameter:52.0,massKgKm:4540,resistance:0.124,ampacity:380},
    200:{outerDiameter:60.0,massKgKm:6060,resistance:0.0933,ampacity:465},
    250:{outerDiameter:65.0,massKgKm:7420,resistance:0.0754,ampacity:535},
    325:{outerDiameter:71.0,massKgKm:9450,resistance:0.0579,ampacity:635},
    400:{outerDiameter:77.0,massKgKm:12570,resistance:0.0471,ampacity:725},
    500:{outerDiameter:85.0,massKgKm:14720,resistance:0.0376,ampacity:835}
  },
  'CV-4C': {
    14:{outerDiameter:23.0,massKgKm:750,resistance:1.34,ampacity:86},
    22:{outerDiameter:27.0,massKgKm:1100,resistance:0.849,ampacity:110},
    38:{outerDiameter:31.0,massKgKm:1730,resistance:0.491,ampacity:155},
    60:{outerDiameter:37.0,massKgKm:2650,resistance:0.311,ampacity:210},
    100:{outerDiameter:46.0,massKgKm:4250,resistance:0.187,ampacity:290},
    150:{outerDiameter:53.0,massKgKm:6050,resistance:0.124,ampacity:380},
    200:{outerDiameter:62.0,massKgKm:8070,resistance:0.0933,ampacity:465},
    250:{outerDiameter:67.0,massKgKm:9890,resistance:0.0754,ampacity:535},
    325:{outerDiameter:74.0,massKgKm:12590,resistance:0.0579,ampacity:635},
    400:{outerDiameter:80.0,massKgKm:16760,resistance:0.0471,ampacity:725},
    500:{outerDiameter:90.0,massKgKm:20940,resistance:0.0376,ampacity:835}
  },
  'CVD': {
    8:{outerDiameter:17.5,massKgKm:260,resistance:2.36,ampacity:66},
    14:{outerDiameter:19.0,massKgKm:373,resistance:1.34,ampacity:91},
    22:{outerDiameter:22.0,massKgKm:550,resistance:0.849,ampacity:120},
    38:{outerDiameter:26.0,massKgKm:858,resistance:0.491,ampacity:165},
    60:{outerDiameter:31.0,massKgKm:1315,resistance:0.311,ampacity:225},
    100:{outerDiameter:38.0,massKgKm:2065,resistance:0.187,ampacity:310},
    150:{outerDiameter:44.0,massKgKm:2965,resistance:0.124,ampacity:400},
    200:{outerDiameter:51.0,massKgKm:3970,resistance:0.0933,ampacity:490},
    250:{outerDiameter:56.0,massKgKm:4875,resistance:0.0754,ampacity:565},
    325:{outerDiameter:61.0,massKgKm:6150,resistance:0.0579,ampacity:670},
    400:{outerDiameter:67.0,massKgKm:8380,resistance:0.0471,ampacity:765},
    500:{outerDiameter:75.0,massKgKm:10470,resistance:0.0376,ampacity:880}
  },
  'CVT': {
    8:{outerDiameter:18.5,massKgKm:380,resistance:2.36,ampacity:62},
    14:{outerDiameter:21.0,massKgKm:555,resistance:1.34,ampacity:86},
    22:{outerDiameter:24.0,massKgKm:810,resistance:0.849,ampacity:110},
    38:{outerDiameter:28.0,massKgKm:1300,resistance:0.491,ampacity:155},
    60:{outerDiameter:33.0,massKgKm:1945,resistance:0.311,ampacity:210},
    100:{outerDiameter:41.0,massKgKm:3095,resistance:0.187,ampacity:290},
    150:{outerDiameter:47.0,massKgKm:4470,resistance:0.124,ampacity:380},
    200:{outerDiameter:55.0,massKgKm:6030,resistance:0.0933,ampacity:465},
    250:{outerDiameter:60.0,massKgKm:7210,resistance:0.0754,ampacity:535},
    325:{outerDiameter:66.0,massKgKm:9475,resistance:0.0579,ampacity:635},
    400:{outerDiameter:72.0,massKgKm:12570,resistance:0.0471,ampacity:725},
    500:{outerDiameter:80.0,massKgKm:14720,resistance:0.0376,ampacity:835}
  },
  'CVQ': {
    14:{outerDiameter:23.0,massKgKm:750,resistance:1.34,ampacity:82},
    22:{outerDiameter:27.0,massKgKm:1100,resistance:0.849,ampacity:105},
    38:{outerDiameter:31.0,massKgKm:1715,resistance:0.491,ampacity:148},
    60:{outerDiameter:37.0,massKgKm:2575,resistance:0.311,ampacity:200},
    100:{outerDiameter:46.0,massKgKm:4125,resistance:0.187,ampacity:278},
    150:{outerDiameter:53.0,massKgKm:6025,resistance:0.124,ampacity:365},
    200:{outerDiameter:62.0,massKgKm:8035,resistance:0.0933,ampacity:448},
    250:{outerDiameter:67.0,massKgKm:9695,resistance:0.0754,ampacity:515},
    325:{outerDiameter:74.0,massKgKm:12545,resistance:0.0579,ampacity:613},
    400:{outerDiameter:80.0,massKgKm:16760,resistance:0.0471,ampacity:725},
    500:{outerDiameter:90.0,massKgKm:20940,resistance:0.0376,ampacity:835}
  }
};

const THICK_STEEL_CONDUIT = [
  {nominal:'G16',outerDiameter:21.0,thicknessMm:2.3,innerDiameter:innerByThickness(21.0,2.3),unitMassKgM:kgPerM(3.88,3.66),lengthMm:3660},
  {nominal:'G22',outerDiameter:26.5,thicknessMm:2.3,innerDiameter:innerByThickness(26.5,2.3),unitMassKgM:kgPerM(5.01,3.66),lengthMm:3660},
  {nominal:'G28',outerDiameter:33.3,thicknessMm:2.5,innerDiameter:innerByThickness(33.3,2.5),unitMassKgM:kgPerM(6.95,3.66),lengthMm:3660},
  {nominal:'G36',outerDiameter:41.9,thicknessMm:2.5,innerDiameter:innerByThickness(41.9,2.5),unitMassKgM:kgPerM(8.89,3.66),lengthMm:3660},
  {nominal:'G42',outerDiameter:47.8,thicknessMm:2.5,innerDiameter:innerByThickness(47.8,2.5),unitMassKgM:kgPerM(10.2,3.66),lengthMm:3660},
  {nominal:'G54',outerDiameter:59.6,thicknessMm:2.8,innerDiameter:innerByThickness(59.6,2.8),unitMassKgM:kgPerM(14.3,3.66),lengthMm:3660},
  {nominal:'G70',outerDiameter:75.2,thicknessMm:2.8,innerDiameter:innerByThickness(75.2,2.8),unitMassKgM:kgPerM(18.3,3.66),lengthMm:3660},
  {nominal:'G82',outerDiameter:87.9,thicknessMm:2.8,innerDiameter:innerByThickness(87.9,2.8),unitMassKgM:kgPerM(21.5,3.66),lengthMm:3660},
  {nominal:'G92',outerDiameter:100.7,thicknessMm:3.5,innerDiameter:innerByThickness(100.7,3.5),unitMassKgM:kgPerM(30.7,3.66),lengthMm:3660},
  {nominal:'G104',outerDiameter:113.4,thicknessMm:3.5,innerDiameter:innerByThickness(113.4,3.5),unitMassKgM:kgPerM(34.7,3.66),lengthMm:3660}
];
const THIN_STEEL_CONDUIT = [
  {nominal:'C19',outerDiameter:19.1,thicknessMm:1.6,innerDiameter:innerByThickness(19.1,1.6),unitMassKgM:kgPerM(2.53,3.66),lengthMm:3660},
  {nominal:'C25',outerDiameter:25.4,thicknessMm:1.6,innerDiameter:innerByThickness(25.4,1.6),unitMassKgM:kgPerM(3.44,3.66),lengthMm:3660},
  {nominal:'C31',outerDiameter:31.8,thicknessMm:1.6,innerDiameter:innerByThickness(31.8,1.6),unitMassKgM:kgPerM(4.36,3.66),lengthMm:3660},
  {nominal:'C39',outerDiameter:38.1,thicknessMm:1.6,innerDiameter:innerByThickness(38.1,1.6),unitMassKgM:kgPerM(5.27,3.66),lengthMm:3660},
  {nominal:'C51',outerDiameter:50.8,thicknessMm:1.6,innerDiameter:innerByThickness(50.8,1.6),unitMassKgM:kgPerM(7.10,3.66),lengthMm:3660},
  {nominal:'C63',outerDiameter:63.5,thicknessMm:2.0,innerDiameter:innerByThickness(63.5,2.0),unitMassKgM:kgPerM(11.1,3.66),lengthMm:3660},
  {nominal:'C75',outerDiameter:76.2,thicknessMm:2.0,innerDiameter:innerByThickness(76.2,2.0),unitMassKgM:kgPerM(13.4,3.66),lengthMm:3660}
];
const THREADLESS_STEEL_CONDUIT = [
  {nominal:'E19',outerDiameter:19.1,thicknessMm:1.2,innerDiameter:innerByThickness(19.1,1.2),unitMassKgM:kgPerM(1.94,3.66),lengthMm:3660},
  {nominal:'E25',outerDiameter:25.4,thicknessMm:1.2,innerDiameter:innerByThickness(25.4,1.2),unitMassKgM:kgPerM(2.62,3.66),lengthMm:3660},
  {nominal:'E31',outerDiameter:31.8,thicknessMm:1.4,innerDiameter:innerByThickness(31.8,1.4),unitMassKgM:kgPerM(3.84,3.66),lengthMm:3660},
  {nominal:'E39',outerDiameter:38.1,thicknessMm:1.4,innerDiameter:innerByThickness(38.1,1.4),unitMassKgM:kgPerM(4.65,3.66),lengthMm:3660},
  {nominal:'E51',outerDiameter:50.8,thicknessMm:1.4,innerDiameter:innerByThickness(50.8,1.4),unitMassKgM:kgPerM(6.26,3.66),lengthMm:3660},
  {nominal:'E63',outerDiameter:63.5,thicknessMm:1.6,innerDiameter:innerByThickness(63.5,1.6),unitMassKgM:kgPerM(8.93,3.66),lengthMm:3660},
  {nominal:'E75',outerDiameter:76.2,thicknessMm:1.6,innerDiameter:innerByThickness(76.2,1.6),unitMassKgM:kgPerM(12.1,3.66),lengthMm:3660}
];

const PLASTIC_CONDUIT = {
  'CD管': [
    {nominal:'14',outerDiameter:19.0,innerDiameter:14.0,unitMassKgM:kgPerM(3.2,50),coilLengthM:50,coilMassKg:3.2},
    {nominal:'16',outerDiameter:21.0,innerDiameter:16.0,unitMassKgM:kgPerM(3.5,50),coilLengthM:50,coilMassKg:3.5},
    {nominal:'22',outerDiameter:27.5,innerDiameter:22.0,unitMassKgM:kgPerM(5.2,50),coilLengthM:50,coilMassKg:5.2},
    {nominal:'28',outerDiameter:34.0,innerDiameter:28.0,unitMassKgM:kgPerM(4.0,30),coilLengthM:30,coilMassKg:4.0},
    {nominal:'36',outerDiameter:42.0,innerDiameter:36.0,unitMassKgM:kgPerM(5.7,30),coilLengthM:30,coilMassKg:5.7}
  ],
  'PF管': [
    {nominal:'14',outerDiameter:21.5,innerDiameter:14.0,unitMassKgM:kgPerM(3.6,50),coilLengthM:50,coilMassKg:3.6},
    {nominal:'16',outerDiameter:23.0,innerDiameter:16.0,unitMassKgM:kgPerM(4.2,50),coilLengthM:50,coilMassKg:4.2},
    {nominal:'22',outerDiameter:30.5,innerDiameter:22.0,unitMassKgM:kgPerM(6.0,50),coilLengthM:50,coilMassKg:6.0},
    {nominal:'28',outerDiameter:36.5,innerDiameter:28.0,unitMassKgM:kgPerM(4.8,30),coilLengthM:30,coilMassKg:4.8},
    {nominal:'36',outerDiameter:45.5,innerDiameter:36.0,unitMassKgM:kgPerM(6.5,30),coilLengthM:30,coilMassKg:6.5}
  ],
  'FEP管': [
    {nominal:'30',outerDiameter:41,innerDiameter:30,unitMassKgM:kgPerM(10,50),coilLengthM:50,coilMassKg:10},
    {nominal:'40',outerDiameter:55,innerDiameter:41,unitMassKgM:kgPerM(15,50),coilLengthM:50,coilMassKg:15},
    {nominal:'50',outerDiameter:66,innerDiameter:50,unitMassKgM:kgPerM(20,50),coilLengthM:50,coilMassKg:20},
    {nominal:'65',outerDiameter:86,innerDiameter:66,unitMassKgM:kgPerM(30,50),coilLengthM:50,coilMassKg:30},
    {nominal:'80',outerDiameter:103,innerDiameter:81,unitMassKgM:kgPerM(40,50),coilLengthM:50,coilMassKg:40},
    {nominal:'100',outerDiameter:131,innerDiameter:102,unitMassKgM:kgPerM(55,50),coilLengthM:50,coilMassKg:55},
    {nominal:'125',outerDiameter:163,innerDiameter:125,unitMassKgM:kgPerM(80,50),coilLengthM:50,coilMassKg:80},
    {nominal:'150',outerDiameter:194,innerDiameter:147,unitMassKgM:kgPerM(100,50),coilLengthM:50,coilMassKg:100},
    {nominal:'200',outerDiameter:257,innerDiameter:200,unitMassKgM:kgPerM(120,30),coilLengthM:30,coilMassKg:120}
  ],
  'VE管': [
    {nominal:'14',outerDiameter:18,innerDiameter:14,unitMassKgM:'-',lengthM:4},
    {nominal:'16',outerDiameter:22,innerDiameter:18,unitMassKgM:'-',lengthM:4},
    {nominal:'22',outerDiameter:26,innerDiameter:22,unitMassKgM:'-',lengthM:4},
    {nominal:'28',outerDiameter:34,innerDiameter:28,unitMassKgM:'-',lengthM:4},
    {nominal:'36',outerDiameter:42,innerDiameter:35,unitMassKgM:'-',lengthM:4},
    {nominal:'42',outerDiameter:48,innerDiameter:40,unitMassKgM:'-',lengthM:4},
    {nominal:'54',outerDiameter:60,innerDiameter:51,unitMassKgM:'-',lengthM:4},
    {nominal:'70',outerDiameter:76,innerDiameter:67,unitMassKgM:'-',lengthM:4},
    {nominal:'82',outerDiameter:89,innerDiameter:77,unitMassKgM:'-',lengthM:4}
  ]
};

const METAL_CONDUIT = {
  '厚鋼電線管': THICK_STEEL_CONDUIT,
  'ねじなし鋼製電線管': THREADLESS_STEEL_CONDUIT,
  '薄鋼電線管': THIN_STEEL_CONDUIT,
  'ポリエチレンライニング鋼管': THICK_STEEL_CONDUIT.map(v => ({...v, coatingThicknessMm:'0.6±0.2', note:'寸法・質量は鋼管本体値。ライニング膜厚は注記扱い。'}))
};

const FLEXIBLE_CONDUIT = {
  '金属製可とう電線管（非防水）': [
    {nominal:'10',outerDiameter:13.3,innerDiameter:9.2,unitMassKgM:0.21,coilLengthM:50,coilMassKg:10.5,minBendRadiusMm:30},
    {nominal:'12',outerDiameter:16.1,innerDiameter:11.4,unitMassKgM:0.29,coilLengthM:50,coilMassKg:14.5,minBendRadiusMm:35},
    {nominal:'15',outerDiameter:19.0,innerDiameter:14.1,unitMassKgM:0.32,coilLengthM:50,coilMassKg:16.0,minBendRadiusMm:45},
    {nominal:'17',outerDiameter:21.5,innerDiameter:16.6,unitMassKgM:0.44,coilLengthM:50,coilMassKg:22.0,minBendRadiusMm:50},
    {nominal:'24',outerDiameter:28.8,innerDiameter:23.8,unitMassKgM:0.65,coilLengthM:25,coilMassKg:16.3,minBendRadiusMm:75},
    {nominal:'30',outerDiameter:34.9,innerDiameter:29.3,unitMassKgM:0.74,coilLengthM:25,coilMassKg:18.5,minBendRadiusMm:90},
    {nominal:'38',outerDiameter:42.9,innerDiameter:37.1,unitMassKgM:0.97,coilLengthM:25,coilMassKg:24.3,minBendRadiusMm:150},
    {nominal:'50',outerDiameter:54.9,innerDiameter:49.1,unitMassKgM:1.20,coilLengthM:20,coilMassKg:24.0,minBendRadiusMm:200},
    {nominal:'63',outerDiameter:69.1,innerDiameter:62.6,unitMassKgM:1.73,coilLengthM:10,coilMassKg:17.3,minBendRadiusMm:310},
    {nominal:'76',outerDiameter:82.9,innerDiameter:76.0,unitMassKgM:2.04,coilLengthM:10,coilMassKg:20.4,minBendRadiusMm:380},
    {nominal:'83',outerDiameter:88.1,innerDiameter:81.0,unitMassKgM:2.21,coilLengthM:10,coilMassKg:22.1,minBendRadiusMm:400},
    {nominal:'101',outerDiameter:107.3,innerDiameter:100.2,unitMassKgM:3.00,coilLengthM:6,coilMassKg:18.0,minBendRadiusMm:500}
  ],
  '金属製可とう電線管（防水）': [
    {nominal:'10',outerDiameter:14.9,innerDiameter:9.2,unitMassKgM:0.27,coilLengthM:50,coilMassKg:13.5,minBendRadiusMm:30},
    {nominal:'12',outerDiameter:17.7,innerDiameter:11.4,unitMassKgM:0.37,coilLengthM:50,coilMassKg:18.5,minBendRadiusMm:35},
    {nominal:'15',outerDiameter:20.6,innerDiameter:14.1,unitMassKgM:0.44,coilLengthM:50,coilMassKg:22.0,minBendRadiusMm:45},
    {nominal:'17',outerDiameter:23.1,innerDiameter:16.6,unitMassKgM:0.50,coilLengthM:50,coilMassKg:25.0,minBendRadiusMm:50},
    {nominal:'24',outerDiameter:30.4,innerDiameter:23.8,unitMassKgM:0.73,coilLengthM:25,coilMassKg:18.3,minBendRadiusMm:75},
    {nominal:'30',outerDiameter:36.5,innerDiameter:29.3,unitMassKgM:0.86,coilLengthM:25,coilMassKg:21.5,minBendRadiusMm:90},
    {nominal:'38',outerDiameter:44.9,innerDiameter:37.1,unitMassKgM:1.16,coilLengthM:25,coilMassKg:29.0,minBendRadiusMm:150},
    {nominal:'50',outerDiameter:56.9,innerDiameter:49.1,unitMassKgM:1.35,coilLengthM:20,coilMassKg:27.0,minBendRadiusMm:200},
    {nominal:'63',outerDiameter:71.5,innerDiameter:62.6,unitMassKgM:2.30,coilLengthM:10,coilMassKg:23.0,minBendRadiusMm:310},
    {nominal:'76',outerDiameter:85.3,innerDiameter:76.0,unitMassKgM:2.60,coilLengthM:10,coilMassKg:26.0,minBendRadiusMm:380},
    {nominal:'83',outerDiameter:90.9,innerDiameter:81.0,unitMassKgM:2.80,coilLengthM:10,coilMassKg:28.0,minBendRadiusMm:400},
    {nominal:'101',outerDiameter:110.1,innerDiameter:100.2,unitMassKgM:3.55,coilLengthM:6,coilMassKg:21.3,minBendRadiusMm:500}
  ]
};

const DATA_ISSUES = [
  'CD管・PF管の42サイズは寸法・巻質量まで確定できていないため未収録。',
  'VE管は外径・近似内径・長さのみ収録。単位質量は未確認のため「-」表示。',
  'FEP管は30〜200を収録。20は今回の確認資料では同表に無いため未収録。',
  'ポリエチレンライニング鋼管は鋼管本体寸法・質量を収録し、膜厚は注記扱い。'
];

const DOC_GROUPS = [
  {key:'calc', title:'計算資料', items:[
    {id:'cable_cv1', title:'ケーブル一覧表（CV単芯）', searchable:true, build:()=>buildCableTable('CV-1C','CV単芯')},
    {id:'cable_cv2', title:'ケーブル一覧表（CV-2C）', searchable:true, build:()=>buildCableTable('CV-2C','CV-2C')},
    {id:'cable_cv3', title:'ケーブル一覧表（CV-3C）', searchable:true, build:()=>buildCableTable('CV-3C','CV-3C')},
    {id:'cable_cv4', title:'ケーブル一覧表（CV-4C）', searchable:true, build:()=>buildCableTable('CV-4C','CV-4C')},
    {id:'cable_cvd', title:'ケーブル一覧表（CVD）', searchable:true, build:()=>buildCableTable('CVD','CVD')},
    {id:'cable_cvt', title:'ケーブル一覧表（CVT）', searchable:true, build:()=>buildCableTable('CVT','CVT')},
    {id:'cable_cvq', title:'ケーブル一覧表（CVQ）', searchable:true, build:()=>buildCableTable('CVQ','CVQ')},
    {id:'drop_criteria', title:'電圧降下判定基準', searchable:false, build:buildVoltageCriteria},
    {id:'formula_current', title:'基本計算式（電流換算）', searchable:false, build:buildFormulaCurrent},
    {id:'formula_drop', title:'基本計算式（電圧降下）', searchable:false, build:buildFormulaDrop},
    {id:'formula_coef', title:'基本計算式（許容電流補正）', searchable:false, build:buildFormulaCoef},
    {id:'main_breaker', title:'主幹選定の考え方', searchable:false, build:buildMainBreakerDoc}
  ]},
  {key:'construction', title:'施工資料', items:[
    {id:'conduit_resin', title:'樹脂系配管サイズ一覧表', searchable:true, build:buildResinConduitDoc},
    {id:'conduit_metal', title:'金属系配管サイズ一覧表', searchable:true, build:buildMetalConduitDoc},
    {id:'conduit_flexible', title:'可とう管サイズ一覧表', searchable:true, build:buildFlexibleConduitDoc},
    {id:'data_issues', title:'未確定・要確認データ', searchable:true, build:buildDataIssuesDoc},
    {id:'conduit_support', title:'配管支持間隔', searchable:false, build:buildConduitSupportDoc},
    {id:'rack_width', title:'ラック幅選定の考え方', searchable:false, build:buildRackWidthDoc},
    {id:'rack_support', title:'ラック支持間隔', searchable:false, build:buildRackSupportDoc},
    {id:'rack_seismic', title:'ラック耐震の考え方', searchable:false, build:buildRackSeismicDoc}
  ]},
  {key:'ground', title:'接地資料', items:[
    {id:'ground_basis', title:'接地基準・接地抵抗一覧', searchable:false, build:buildGroundBasisDoc},
    {id:'ground_wire', title:'接地線サイズ参考表', searchable:true, build:buildGroundWireDoc}
  ]},
  {key:'reference', title:'参考資料', items:[
    {id:'hv_symbols', title:'高圧単線結線図の略記号一覧・用語解説', searchable:true, build:buildHvSymbolsDoc}
  ]}
];

function toLocalDateTimeInput(date = new Date()){
  const pad = v => String(v).padStart(2,'0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function formatDateTimeForOutput(value){
  if (!value) return '';
  return String(value).replace('T',' ');
}

const DEFAULT_UI = {
  calculationType:'power', calcMode:'', powerSystem:'', voltage:'', powerFactor:'', efficiency:'',
  wiringLength:'', existingBreaker:'', breakerMarginRatio:'0.8', projectName:'', projectType:'', submitTo:'', drawingNo:'', author:'', createdAt:'', projectRemarks:'', loadCount:'',
  cableFamily:'', cableSubtype:'', cableSize:'', cableSizingMode:'auto', baseAmpacity:'', ampacityMode:'none',
  installationMethod:'', layingCondition:'', ambientTemperature:'40', parallelCount:'',
  loads:[], lastResult:null, compareBaseId:'', compareMode:'major', displayScale:'1.0', readOnly:false
};

function migrateStateShape(input){
  const migrated = Object.assign(structuredClone(DEFAULT_UI), input || {});
  if (!migrated.cableFamily && migrated.cableType) {
    if (migrated.cableType === 'CVT') {
      migrated.cableFamily = 'CVT';
      migrated.cableSubtype = '';
    } else {
      migrated.cableFamily = 'CV';
      migrated.cableSubtype = migrated.cableType === 'CV-1C' ? 'CV-単芯' : migrated.cableType;
    }
  }
  migrated.cableSizingMode = migrated.cableSizingMode || DEFAULT_UI.cableSizingMode;
  migrated.breakerMarginRatio = migrated.breakerMarginRatio || DEFAULT_UI.breakerMarginRatio;
  migrated.displayScale = migrated.displayScale || DEFAULT_UI.displayScale;
  migrated.loads = Array.isArray(migrated.loads) ? migrated.loads : [];
  return migrated;
}

function loadJson(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch{
    return fallback;
  }
}

function createFreshState(){
  const fresh = structuredClone(DEFAULT_UI);
  const uiPrefs = loadJson(STORAGE.ui, {});
  fresh.displayScale = uiPrefs.displayScale || DEFAULT_UI.displayScale;
  fresh.compareBaseId = uiPrefs.compareBaseId || '';
  fresh.compareMode = uiPrefs.compareMode || compareModeDefault;
  fresh.createdAt = toLocalDateTimeInput();
  return fresh;
}

let state = createFreshState();
let historyItems = loadJson(STORAGE.history, []);
let savedItems = loadJson(STORAGE.saved, []);
let compareIds = loadJson(STORAGE.compare, []);
let deferredPrompt = null;
let disclaimerStep = 0;

const $ = id => document.getElementById(id);
const screens = {calc:$('screen-calc'), docs:$('screen-docs'), saved:$('screen-saved'), settings:$('screen-settings')};

function persistState(){
  const uiPrefs = {
    displayScale: state.displayScale || DEFAULT_UI.displayScale,
    compareBaseId: state.compareBaseId || '',
    compareMode: state.compareMode || compareModeDefault
  };
  localStorage.setItem(STORAGE.ui, JSON.stringify(uiPrefs));
  localStorage.setItem(STORAGE.history, JSON.stringify(historyItems));
  localStorage.setItem(STORAGE.saved, JSON.stringify(savedItems));
  localStorage.setItem(STORAGE.compare, JSON.stringify(compareIds));
  localStorage.setItem(STORAGE.sort, $('savedSort')?.value || savedSortDefault);
}

function formatNumber(v, digits=2){
  if (v === '' || v === null || v === undefined || Number.isNaN(Number(v))) return '-';
  return new Intl.NumberFormat('ja-JP',{maximumFractionDigits:digits,minimumFractionDigits:0}).format(Number(v));
}

function showToast(msg){
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1800);
}

function escapeHtml(v){
  return String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

function formulaText(kind, inputType){
  const phase = isThreePhase() ? '三相' : '単相';
  const voltage = state.voltage || 'V';
  const pf = state.powerFactor || '力率';
  const eff = state.efficiency || '効率';
  const empty = '入力方式を選択すると、この欄の換算式を表示します。';
  if (!inputType) return empty;
  const head = `${phase} / 入力方式：${inputType} / V=${voltage} / 力率=${pf} / 効率=${eff}`;
  const phase3 = isThreePhase();
  const formulas = {
    current: {
      kW: phase3 ? 'I[A] = P[kW] × 1000 ÷ (√3 × V × 力率 × 効率)' : 'I[A] = P[kW] × 1000 ÷ (V × 力率 × 効率)',
      kVA: phase3 ? 'I[A] = S[kVA] × 1000 ÷ (√3 × V)' : 'I[A] = S[kVA] × 1000 ÷ V',
      A: 'I[A] = 入力電流[A]'
    },
    kw: {
      kW: 'P[kW] = 入力容量[kW]',
      kVA: 'P[kW] = S[kVA] × 力率 × 効率',
      A: phase3 ? 'P[kW] = √3 × V × I[A] × 力率 × 効率 ÷ 1000' : 'P[kW] = V × I[A] × 力率 × 効率 ÷ 1000'
    },
    kva: {
      kW: 'S[kVA] = P[kW] ÷ (力率 × 効率)',
      kVA: 'S[kVA] = 入力容量[kVA]',
      A: phase3 ? 'S[kVA] = √3 × V × I[A] ÷ 1000' : 'S[kVA] = V × I[A] ÷ 1000'
    }
  };
  const title = kind === 'current' ? '換算電流' : kind === 'kw' ? '換算容量[kW]' : '換算容量[kVA]';
  return `${title}
${head}
${formulas[kind]?.[inputType] || empty}`;
}
function formulaTitle(kind){ return kind === 'current' ? '換算電流の計算式' : kind === 'kw' ? '換算容量[kW]の計算式' : '換算容量[kVA]の計算式'; }
function ensureFormulaPopup(){
  let popup = $('formulaPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'formulaPopup';
    popup.className = 'formula-popup hidden';
    popup.setAttribute('role','status');
    document.body.appendChild(popup);
  }
  return popup;
}
function hideFormulaPopup(){ const popup = $('formulaPopup'); if (popup) { popup.classList.add('hidden'); popup.dataset.source = ''; } }
function showFormulaPopup(trigger){
  const popup = ensureFormulaPopup();
  const source = trigger.dataset.formulaSource || '';
  if (!popup.classList.contains('hidden') && popup.dataset.source === source) { hideFormulaPopup(); return; }
  const kind = trigger.dataset.formulaKind;
  const inputType = trigger.dataset.inputType || '';
  const text = formulaText(kind, inputType);
  popup.innerHTML = `<strong>${escapeHtml(formulaTitle(kind))}</strong><span>${escapeHtml(text).replace(/\n/g,'<br>')}</span>`;
  popup.dataset.source = source;
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(340, window.innerWidth - 24);
  let left = rect.left + window.scrollX;
  left = Math.max(12 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - width - 12));
  const top = rect.bottom + window.scrollY + 8;
  popup.style.width = `${width}px`;
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.classList.remove('hidden');
}
function bindFormulaPopup(){
  document.addEventListener('click', event=>{
    const trigger = event.target.closest('.formula-trigger');
    if (trigger) { event.preventDefault(); event.stopPropagation(); showFormulaPopup(trigger); return; }
    if (!event.target.closest('#formulaPopup')) hideFormulaPopup();
  });
  window.addEventListener('scroll', hideFormulaPopup, {passive:true});
  window.addEventListener('resize', hideFormulaPopup);
}
function formulaTriggerHtml(kind, label, inputType, source){
  return `<button type="button" class="formula-trigger" data-formula-kind="${escapeHtml(kind)}" data-input-type="${escapeHtml(inputType || '')}" data-formula-source="${escapeHtml(source)}">${escapeHtml(label)}</button>`;
}

function setSelectOptions(el, options, placeholder='選択してください', selected=''){
  if (!el) return;
  const html = [`<option value="">${escapeHtml(placeholder)}</option>`]
    .concat(options.map(opt => typeof opt === 'object'
      ? `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`
      : `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`))
    .join('');
  el.innerHTML = html;
  el.value = selected || '';
}

function currentCableType(){
  if (state.cableFamily === 'CVT') return 'CVT';
  if (state.cableFamily === 'CV') return state.cableSubtype === 'CV-単芯' ? 'CV-1C' : state.cableSubtype || '';
  return '';
}
function selectedCableTypeFromState(){ return currentCableType(); }
function applyCableTypeToState(type){
  if (type === 'CVT') { state.cableFamily = 'CVT'; state.cableSubtype = ''; return; }
  state.cableFamily = type ? 'CV' : '';
  state.cableSubtype = type === 'CV-1C' ? 'CV-単芯' : type || '';
}
function getCableSizes(type){ return !type || !CABLE_DATA[type] ? [] : Object.keys(CABLE_DATA[type]).map(Number).sort((a,b)=>a-b); }
function getCableInfo(type, size){ return !type || !size || !CABLE_DATA[type] ? null : CABLE_DATA[type][size] || null; }

function getPowerSystemOptions(){ return state.calculationType === 'lighting' ? ['1φ2W','1φ3W'] : ['3φ3W','3φ4W']; }
function normalizePowerSystemForCalcType(){ if (!getPowerSystemOptions().includes(state.powerSystem)) state.powerSystem = ''; }
function isThreePhase(){ return String(state.powerSystem).startsWith('3φ'); }

function createBlankLoad(index){ return {id:crypto.randomUUID(), title:`負荷${index+1}`, name:'', inputType:'', value:''}; }
function normalizeLoads(){
  const target = Number(state.loadCount || 0);
  if (!target) { state.loads = []; return; }
  while(state.loads.length < target) state.loads.push(createBlankLoad(state.loads.length));
  if (state.loads.length > target) state.loads = state.loads.slice(0,target);
  state.loads.forEach((load,i)=> load.title = `負荷${i+1}`);
}

function currentForLoad(load){
  const value = Number(load.value), voltage = Number(state.voltage), pf = Number(state.powerFactor), eff = Number(state.efficiency);
  if (!value || !voltage || !pf || !eff || !load.inputType) return '';
  if (load.inputType === 'A') return value;
  if (load.inputType === 'kVA') return isThreePhase() ? (value*1000)/(Math.sqrt(3)*voltage) : (value*1000)/voltage;
  if (load.inputType === 'kW') return isThreePhase() ? (value*1000)/(Math.sqrt(3)*voltage*pf*eff) : (value*1000)/(voltage*pf*eff);
  return '';
}
function kwForLoad(load){
  const value = Number(load.value), pf = Number(state.powerFactor), eff = Number(state.efficiency), voltage = Number(state.voltage);
  if (!value || !pf || !eff || !load.inputType) return '';
  if (load.inputType === 'kW') return value;
  if (load.inputType === 'kVA') return value*pf*eff;
  if (load.inputType === 'A') return (isThreePhase() ? Math.sqrt(3)*voltage*value/1000 : voltage*value/1000) * pf * eff;
  return '';
}
function kvaForLoad(load){
  const value = Number(load.value), pf = Number(state.powerFactor), eff = Number(state.efficiency), voltage = Number(state.voltage);
  if (!value || !pf || !eff || !load.inputType) return '';
  if (load.inputType === 'kVA') return value;
  if (load.inputType === 'kW') return value/(pf*eff);
  if (load.inputType === 'A') return isThreePhase() ? Math.sqrt(3)*voltage*value/1000 : voltage*value/1000;
  return '';
}
function getLoadSummary(){
  const list = state.loads.map(load=>({...load, current:currentForLoad(load), kw:kwForLoad(load), kva:kvaForLoad(load)}));
  return {list, totalCurrent:list.reduce((s,v)=>s+(Number(v.current)||0),0), totalKW:list.reduce((s,v)=>s+(Number(v.kw)||0),0), totalKVA:list.reduce((s,v)=>s+(Number(v.kva)||0),0)};
}

function requiredBreakerFromLoad(){
  const totalCurrent = getLoadSummary().totalCurrent;
  if (!totalCurrent) return 0;
  return BREAKER_SIZES.find(v=>v>=totalCurrent) || BREAKER_SIZES.at(-1);
}
function recommendedBreakerFromMargin(){
  if (state.calcMode === 'existing') return Number(state.existingBreaker || 0) || requiredBreakerFromLoad();
  const totalCurrent = getLoadSummary().totalCurrent;
  const ratio = Number(state.breakerMarginRatio || 0.8);
  const basis = ratio ? totalCurrent / ratio : totalCurrent;
  return BREAKER_SIZES.find(v=>v>=basis) || BREAKER_SIZES.at(-1);
}
function adoptedBreaker(){ return recommendedBreakerFromMargin(); }
function sizingCurrentBase(){ return adoptedBreaker(); }

function getCorrectionBreakdown(){
  const temp = Number(state.ambientTemperature || 0), parallel = Number(state.parallelCount || 0);
  const installation = INSTALL_COEF[state.installationMethod] || {air:null,rack:null,pipe:null};
  const condition = CONDITION_COEF[state.layingCondition] ?? null;
  const temperature = TEMP_COEF[temp] ?? null;
  const parallelCoef = PARALLEL_COEF[parallel] ?? null;
  const methodValue = state.installationMethod === '気中' ? installation.air : state.installationMethod === 'ラック' ? installation.rack : state.installationMethod === '配管' ? installation.pipe : null;
  const final = [temperature, parallelCoef, methodValue, condition].every(v=>v!=null) ? temperature * parallelCoef * methodValue * condition : null;
  return {temperature, parallel:parallelCoef, air:installation.air, rack:installation.rack, pipe:installation.pipe, method:methodValue, condition, final};
}
function correctedAmpacity(){
  const basis = Number(state.baseAmpacity || 0), breakdown = getCorrectionBreakdown();
  return basis && breakdown.final ? basis * breakdown.final : 0;
}
function calcVoltageDrop(current, resistance, lengthM){
  const voltage = Number(state.voltage || 0);
  if (!current || !resistance || !lengthM || !voltage) return {dropV:0, dropPercent:0};
  const dropV = isThreePhase() ? Math.sqrt(3)*current*resistance*lengthM/1000 : 2*current*resistance*lengthM/1000;
  return {dropV, dropPercent:(dropV/voltage)*100};
}
function voltageDropBasisCurrent(breakerCurrent, loadCurrent){
  const breaker = Number(breakerCurrent || 0);
  const load = Number(loadCurrent || 0);
  if (state.calcMode === 'existing') return Math.max(load, breaker);
  return load;
}
function rackWidthFor(outerDiameter, count){
  if (!outerDiameter || !count) return '';
  const occupied = outerDiameter * count * 1.35;
  return `W${RACK_WIDTHS.find(v=>v>=occupied) || RACK_WIDTHS.at(-1)}`;
}

function candidateFromSize(type, size, breakerCurrent, preferManualAmpacity=false){
  const info = getCableInfo(type, Number(size));
  const breakdown = getCorrectionBreakdown();
  const loadSummary = getLoadSummary();
  const length = Number(state.wiringLength || 0);
  if (!type || !info || !breakerCurrent || !length || !breakdown.final) return null;
  const basis = preferManualAmpacity && Number(state.baseAmpacity) ? Number(state.baseAmpacity) : Number(info.ampacity || 0);
  const corrected = basis * breakdown.final;
  const dropBasisCurrent = voltageDropBasisCurrent(breakerCurrent, loadSummary.totalCurrent);
  const drop = calcVoltageDrop(dropBasisCurrent, Number(info.resistance || 0), length);
  return {size:Number(size), info, basis, corrected, drop, dropBasisCurrent, currentOk:corrected>=breakerCurrent, dropOk:drop.dropPercent<=DROP_LIMIT_PERCENT};
}

function cableCandidateBySize(breakerCurrent, size){
  const preferManual = state.ampacityMode === 'manual' && Number(state.baseAmpacity);
  return candidateFromSize(selectedCableTypeFromState(), Number(size), breakerCurrent, preferManual);
}

function cableSelectionForBreaker(breakerCurrent){
  const type = selectedCableTypeFromState();
  const sizes = getCableSizes(type);
  if (!type || !sizes.length) return null;
  const candidates = sizes.map(size=>candidateFromSize(type, size, breakerCurrent, false)).filter(Boolean);
  return {candidates, valid:candidates.find(v=>v.currentOk && v.dropOk) || candidates.at(-1)};
}

function suggestedCableSelection(){ return cableSelectionForBreaker(adoptedBreaker()); }
function cableSelectionBasisCurrent(){ return adoptedBreaker(); }
function cableSelectionBasisLabel(){
  const basis = cableSelectionBasisCurrent();
  if (state.calcMode === 'existing') return basis ? `既設開閉器 ${basis}A 基準` : '既設開閉器基準';
  return basis ? `推奨開閉器 ${basis}A 基準` : '推奨開閉器基準';
}
function cableSelectionBasisNotice(result){
  const basis = Number(result?.cableSelectionBasisCurrent || cableSelectionBasisCurrent() || 0);
  if (state.calcMode === 'existing') {
    return basis ? `既設開閉器指定のため、ケーブル許容電流判定は既設開閉器 ${basis}A を基準にしています。電圧降下は実負荷電流と既設開閉器容量の大きい方を計算電流として判定しています。` : '既設開閉器指定のため、既設開閉器容量を基準に判定します。';
  }
  return basis ? `自動選定のため、ケーブル選定は推奨開閉器 ${basis}A 基準です。既設主幹容量を基準に確認する場合は、計算方式を「既設開閉器指定」に変更してください。` : '自動選定のため、推奨開閉器を基準にケーブル選定します。';
}
function primaryFactor(candidate){
  if (!candidate) return '-';
  const ratioCurrent = candidate.corrected ? sizingCurrentBase()/candidate.corrected : 0;
  const ratioDrop = candidate.drop.dropPercent / DROP_LIMIT_PERCENT;
  return ratioDrop > ratioCurrent ? '電圧降下' : state.calcMode === 'existing' ? '既設開閉器条件' : '許容電流';
}
function allSelectionReasons(candidate){
  if (!candidate) return [];
  const reasons = ['許容電流'];
  if (candidate.drop.dropPercent >= DROP_LIMIT_PERCENT * 0.7) reasons.push('電圧降下');
  if (state.calcMode === 'existing') reasons.push('既設開閉器条件');
  return [...new Set(reasons)];
}
function constructionNotes(totalMass){
  const notes = [];
  const length = Number(state.wiringLength || 0);
  const parallel = Number(state.parallelCount || 1);
  if (totalMass > 100) notes.push('概算総質量が大きいため、支持間隔・支持金物・アンカー強度を確認してください。');
  if (totalMass > 300) notes.push('ラック・吊り材・支持材の耐荷重、集中荷重、搬入・延線時の仮受けを確認してください。');
  if (length > 100) notes.push('長尺配線のため、電圧降下、始動時電圧降下、延線張力、曲げ半径、途中支持を確認してください。');
  if (state.installationMethod === '配管') notes.push('配管ルートでは入線率、曲がり数、プルボックス位置、管内放熱条件を確認してください。');
  if (state.installationMethod === 'ラック') notes.push('ラック敷設では段積み・密集・離隔、ケーブル固定、耐震支持、将来増設余地を確認してください。');
  if (state.layingCondition === '密集') notes.push('密集敷設のため、放熱条件と許容電流低減を現場条件で再確認してください。');
  if (state.layingCondition === '日射あり') notes.push('日射を受ける区間は温度上昇・被覆劣化・保護カバーの要否を確認してください。');
  if (parallel >= 2) notes.push('複数条敷設では各条の長さ差、端末処理、電流バランス、識別表示を確認してください。');
  if (state.calcMode === 'existing') notes.push('既設主幹指定時は遮断容量、保護協調、既設整定値、負荷側保護装置との協調を確認してください。');
  notes.push('端末処理、圧着端子サイズ、盤内曲げスペース、離隔、相順、絶縁抵抗測定を施工前後で確認してください。');
  if (state.calculationType === 'power') notes.push('動力負荷では始動方式、始動電流、過負荷保護、インバータ有無、サーマル整定を確認してください。');
  notes.push('概算質量・外径・許容電流は参考値です。最終値は仕様書、内線規定、現場仕様で確認してください。');
  return [...new Set(notes)];
}
function rootMemo(){
  const notes = ['参考値を使用しています。','最終判断は現場条件・法令・仕様を確認してください。'];
  notes.push(state.calcMode === 'existing' ? '既設条件を優先した計算です。既設開閉器容量を許容電流判定に使用します。' : `総負荷÷${state.breakerMarginRatio || '0.8'}を基準に推奨開閉器を選定しています。`);
  notes.push(`ケーブル選定基準は ${cableSelectionBasisLabel()} です。`);
  if (state.calcMode === 'existing') notes.push('既設開閉器指定時の電圧降下は、実負荷電流と既設開閉器容量の大きい方を基準電流として保守的に判定します。');
  else notes.push('既設主幹容量を基準に判定する場合は、計算方式を「既設開閉器指定」に変更してください。');
  notes.push('技術資料タブの基準条件を参照してください。');
  if (state.cableSizingMode === 'manual') notes.push('任意ケーブルサイズを手動指定して判定しています。');
  if (state.ampacityMode === 'manual') notes.push('基準許容電流は手動入力値を採用しています。');
  return notes;
}

function missingFields(){
  const missing = [];
  const pushIf = (condition, label, id) => { if (condition) missing.push({label,id}); };
  pushIf(!state.calcMode, '計算方式を選択してください。', 'calcMode');
  pushIf(!state.powerSystem, '電源方式を選択してください。', 'powerSystem');
  pushIf(!state.voltage, '電圧を選択してください。', 'voltage');
  pushIf(!state.powerFactor, '力率を選択してください。', 'powerFactor');
  pushIf(!state.efficiency, '効率を選択してください。', 'efficiency');
  pushIf(!state.wiringLength, '配線長を入力してください。', 'wiringLength');
  if (state.calcMode === 'existing') pushIf(!state.existingBreaker, '既設開閉器を選択してください。', 'existingBreaker');
  if (state.calcMode !== 'existing') pushIf(!state.breakerMarginRatio, '開閉器裕度設定を選択してください。', 'breakerMarginRatio');
  pushIf(!state.loadCount, '負荷数を選択してください。', 'loadCount');
  pushIf(!selectedCableTypeFromState(), 'ケーブル種類を選択してください。', 'cableType');
  pushIf(!state.cableSizingMode, 'ケーブルサイズ選定を選択してください。', 'cableSizingMode');
  if (state.cableSizingMode === 'manual') {
    pushIf(!state.cableSize, '任意ケーブルサイズを選択してください。', 'cableSize');
    pushIf(!state.baseAmpacity, '基準許容電流を入力してください。', 'baseAmpacity');
  }
  pushIf(!state.installationMethod, '敷設方法を選択してください。', 'installationMethod');
  pushIf(!state.layingCondition, '敷設条件を選択してください。', 'layingCondition');
  pushIf(!state.ambientTemperature, '環境温度を選択してください。', 'ambientTemperature');
  pushIf(!state.parallelCount, '条数を選択してください。', 'parallelCount');
  state.loads.forEach((load,index)=>{
    if (!load.name) missing.push({label:`負荷${index+1}の負荷名称を入力してください。`, id:`load-name-${load.id}`});
    if (!load.inputType) missing.push({label:`負荷${index+1}の入力方式を選択してください。`, id:`load-type-${load.id}`});
    if (load.value === '' || load.value === null || load.value === undefined) missing.push({label:`負荷${index+1}の負荷値を入力してください。`, id:`load-value-${load.id}`});
  });
  return missing;
}
function clearInputErrors(){ document.querySelectorAll('.input-error').forEach(el=>el.classList.remove('input-error')); }
function markMissingFields(list){ clearInputErrors(); list.forEach(item=>document.getElementById(item.id)?.classList.add('input-error')); }
function updateResultError(message){
  const box = $('resultErrorBox');
  if (!box) return;
  if (!message) { box.classList.add('hidden'); box.innerHTML = ''; return; }
  box.classList.remove('hidden'); box.innerHTML = message;
}

function calculate(){
  const missing = missingFields();
  if (missing.length) {
    markMissingFields(missing);
    state.lastResult = null;
    $('resultPanel').classList.remove('hidden');
    updateResultError(`未入力項目がある為、計算出来ません。入力して下さい。<br>${missing.map(v=>'・'+escapeHtml(v.label)).join('<br>')}`);
    $('resultBody').classList.add('hidden');
    persistState();
    return;
  }

  clearInputErrors();
  const loadSummary = getLoadSummary();
  const requiredBreaker = requiredBreakerFromLoad();
  const recommendedBreaker = adoptedBreaker();
  const requiredSelection = cableSelectionForBreaker(requiredBreaker);
  const recommendedSelection = cableSelectionForBreaker(recommendedBreaker);
  const requiredCandidate = requiredSelection?.valid || requiredSelection?.candidates.at(-1) || null;
  const recommendedCandidate = recommendedSelection?.valid || recommendedSelection?.candidates.at(-1) || null;
  const manualCandidate = state.cableSize ? cableCandidateBySize(recommendedBreaker, Number(state.cableSize)) : null;
  const cableSizingMode = state.cableSizingMode || 'auto';
  const cableBasisCurrent = cableSelectionBasisCurrent();
  const cableBasisLabel = cableSelectionBasisLabel();
  const candidate = cableSizingMode === 'manual' ? manualCandidate : recommendedCandidate;
  const breakdown = getCorrectionBreakdown();
  const basis = candidate?.basis || 0;
  const corrected = candidate?.corrected || 0;
  const drop = candidate?.drop || {dropV:0, dropPercent:0};
  const breakerOk = requiredBreaker ? recommendedBreaker >= requiredBreaker : true;
  const currentOk = candidate ? corrected >= recommendedBreaker : false;
  const dropOk = candidate ? drop.dropPercent <= DROP_LIMIT_PERCENT : false;
  const failReasons = [];
  if (!currentOk) failReasons.push(`指定ケーブル許容電流不足（ケーブル選定基準電流 ${formatNumber(cableBasisCurrent,1)}A / 指定ケーブル補正後許容 ${formatNumber(corrected,1)}A）`);
  if (!breakerOk) failReasons.push(`開閉器容量不足（必要 ${requiredBreaker}A / 推奨 ${recommendedBreaker}A）`);
  if (!dropOk) failReasons.push(`電圧降下超過（${formatNumber(drop.dropPercent,2)}% / 許容 ${DROP_LIMIT_PERCENT.toFixed(1)}%）`);
  const breakerMarginPercent = recommendedBreaker ? ((recommendedBreaker - loadSummary.totalCurrent) / recommendedBreaker) * 100 : 0;
  const capacityMarginKW = recommendedBreaker ? (isThreePhase() ? Math.sqrt(3)*Number(state.voltage)*recommendedBreaker*Number(state.powerFactor)*Number(state.efficiency)/1000 : Number(state.voltage)*recommendedBreaker*Number(state.powerFactor)*Number(state.efficiency)/1000) - loadSummary.totalKW : 0;
  const massKgM = candidate?.info?.massKgKm ? Number(candidate.info.massKgKm)/1000 : 0;
  const totalMass = massKgM * Number(state.wiringLength || 0) * Number(state.parallelCount || 1);
  const result = {
    calculatedAt:new Date().toISOString(), mode:state.calcMode, calculationType:state.calculationType,
    projectName:state.projectName || '', projectType:state.projectType || '', submitTo:state.submitTo || '', drawingNo:state.drawingNo || '', author:state.author || '', createdAt:state.createdAt || '', projectRemarks:state.projectRemarks || '',
    totalCurrent:loadSummary.totalCurrent, totalKW:loadSummary.totalKW, totalKVA:loadSummary.totalKVA,
    requiredBreaker, adoptedBreaker:recommendedBreaker, breakerMarginRatio:state.breakerMarginRatio || '0.8', breakerMarginPercent, capacityMarginKW,
    cableSelectionBasisCurrent:cableBasisCurrent, cableSelectionBasisLabel:cableBasisLabel,
    voltageDropV:drop.dropV, voltageDropPercent:drop.dropPercent, voltageDropBasisCurrent:candidate?.dropBasisCurrent || 0,
    baseAmpacity:basis, correctedAmpacity:corrected, cableType:selectedCableTypeFromState(), cableSize:candidate?.size || state.cableSize,
    cableSizingMode,
    requiredMinCableType:selectedCableTypeFromState(), requiredMinCableSize:requiredCandidate?.size || '', requiredMinCableCorrectedAmpacity:requiredCandidate?.corrected || 0, requiredMinCableVoltageDropPercent:requiredCandidate?.drop?.dropPercent || 0,
    recommendedCableType:selectedCableTypeFromState(), recommendedCableSize:recommendedCandidate?.size || '', recommendedCableCorrectedAmpacity:recommendedCandidate?.corrected || 0, recommendedCableVoltageDropPercent:recommendedCandidate?.drop?.dropPercent || 0,
    correctionBreakdown:breakdown, reasons:allSelectionReasons(candidate), mainFactor:primaryFactor(candidate), failReasons, judgement:failReasons.length ? '否' : '良',
    existingBreaker:state.existingBreaker || '', existingBreakerJudge:state.calcMode === 'existing' ? (breakerOk ? '適合' : '否') : '-', cableJudge:currentOk && dropOk ? '適合' : '否',
    rackWidth:candidate?.info?.outerDiameter ? rackWidthFor(Number(candidate.info.outerDiameter), Number(state.parallelCount || 1)) : '-', massKgM, massTotalKg:totalMass,
    constructionNotes:constructionNotes(totalMass), rootMemo:rootMemo(), loadDetails:loadSummary.list
  };
  state.lastResult = result;
  historyItems.unshift({id:crypto.randomUUID(), title:`${state.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算'}_${new Date().toLocaleString('sv-SE').replace(/[: ]/g,'_')}`, memo:'', savedAt:new Date().toISOString(), input:structuredClone(state), result:structuredClone(result), calculationMode:state.calcMode, versions:structuredClone(VERSIONS)});
  historyItems = historyItems.slice(0,50);
  persistState();
  $('resultPanel').classList.remove('hidden');
  $('resultBody').classList.remove('hidden');
  updateResultError('');
  renderResult();
  renderSaved();
  setTimeout(()=>$('resultPanel').scrollIntoView({behavior:'smooth', block:'start'}),0);
}

function statusSpan(text){
  if (text === '適合' || text === '良') return `<span class="status-ok">${escapeHtml(text)}</span>`;
  if (text === '否') return `<span class="status-ng">${escapeHtml(text)}</span>`;
  return `<span class="muted">${escapeHtml(text || '-')}</span>`;
}
function cableLabel(type, size){ return `${type || '-'} ${size ? `${size}sq` : '-'}`; }
function renderResult(){
  const r = state.lastResult;
  if (!r) return;
  $('resLoadCount').textContent = String(state.loads.length || 0);
  $('resTotalKW').textContent = formatNumber(r.totalKW,3);
  $('resTotalKVA').textContent = formatNumber(r.totalKVA,3);
  $('resTotalCurrent').textContent = formatNumber(r.totalCurrent,2);
  $('resRequiredBreaker').textContent = r.requiredBreaker ? `${r.requiredBreaker}A` : '-';
  $('resAdoptedBreaker').textContent = r.adoptedBreaker ? `${r.adoptedBreaker}A` : '-';
  if ($('resAdoptedBreaker2')) $('resAdoptedBreaker2').textContent = r.adoptedBreaker ? `${r.adoptedBreaker}A` : '-';
  const basisLabel = r.cableSelectionBasisLabel || (r.mode === 'existing' ? `既設開閉器 ${r.adoptedBreaker || '-'}A 基準` : `推奨開閉器 ${r.adoptedBreaker || '-'}A 基準`);
  const basisCurrent = r.cableSelectionBasisCurrent || r.adoptedBreaker || 0;
  if ($('resCableBasisMode')) $('resCableBasisMode').textContent = basisLabel;
  if ($('resCableBasisCurrent')) $('resCableBasisCurrent').textContent = basisCurrent ? `${formatNumber(basisCurrent,0)}A` : '-';
  if ($('resCableBasisMode2')) $('resCableBasisMode2').textContent = basisLabel;
  if ($('resCableBasisCurrent2')) $('resCableBasisCurrent2').textContent = basisCurrent ? `${formatNumber(basisCurrent,0)}A` : '-';
  const notice = $('resBasisNotice');
  if (notice) { notice.textContent = cableSelectionBasisNotice(r); notice.classList.remove('hidden'); }
  $('resRequiredMinCable').textContent = cableLabel(r.requiredMinCableType || r.cableType, r.requiredMinCableSize);
  $('resRecommendedCable').textContent = cableLabel(r.recommendedCableType || r.cableType, r.recommendedCableSize);
  $('resSelectedCable').textContent = cableLabel(r.cableType, r.cableSize);
  $('resDropV').textContent = formatNumber(r.voltageDropV,2);
  $('resDropPct').textContent = formatNumber(r.voltageDropPercent,2);
  $('resBreakerMargin').textContent = formatNumber(r.breakerMarginPercent,2);
  $('resCapacityMargin').textContent = formatNumber(r.capacityMarginKW,2);
  $('resMainFactor').textContent = r.mainFactor || '-';
  const judge = $('resJudgement');
  judge.textContent = r.judgement;
  judge.className = `judgement ${r.judgement === '良' ? 'good' : 'bad'}`;
  $('resExistingBreaker').innerHTML = r.existingBreaker ? `${escapeHtml(r.existingBreaker)}A` : '-';
  $('resRequiredBreaker2').innerHTML = r.requiredBreaker ? `${r.requiredBreaker}A` : '-';
  $('resExistingBreakerJudge').innerHTML = statusSpan(r.existingBreakerJudge);
  $('resCableJudge').innerHTML = statusSpan(r.cableJudge);
  $('resBaseAmpacity').textContent = formatNumber(r.baseAmpacity,2);
  $('resFinalCoef').textContent = formatNumber(r.correctionBreakdown?.final,3);
  $('resCorrectedAmpacity').textContent = formatNumber(r.correctedAmpacity,2);
  $('resAdoptedCable2').textContent = cableLabel(r.cableType, r.cableSize);
  $('resReasons').textContent = r.reasons?.length ? r.reasons.join('、') : '-';
  $('resDropLimit').textContent = `${DROP_LIMIT_PERCENT.toFixed(1)}%以下`;
  if ($('resDropBasisCurrent')) $('resDropBasisCurrent').textContent = formatNumber(r.voltageDropBasisCurrent,2);
  const failRoot = $('resFailReasons');
  failRoot.innerHTML = '';
  if (!r.failReasons.length) {
    const ok = document.createElement('div'); ok.className = 'readonly-box compact-box'; ok.innerHTML = '<strong class="status-ok">不適合項目はありません。</strong>'; failRoot.appendChild(ok);
  } else r.failReasons.forEach(reason=>{ const div = document.createElement('div'); div.className = 'fail-item'; div.textContent = reason; failRoot.appendChild(div); });
  const loadRoot = $('loadResultList');
  loadRoot.innerHTML = '';
  r.loadDetails.forEach((item,index)=>{
    const card = document.createElement('div'); card.className = 'load-result-card';
    card.innerHTML = `<div class="row"><strong>負荷${index+1}</strong><span class="muted">${escapeHtml(item.name || '-')}</span></div><div class="readonly-grid top-gap"><div><span>入力方式</span><strong>${escapeHtml(item.inputType || '-')}</strong></div><div><span>負荷値</span><strong>${escapeHtml(item.value || '-')} ${escapeHtml(item.inputType || '')}</strong></div><div><span>${formulaTriggerHtml('current','換算電流 [A]', item.inputType, `result-${index}-current`)}</span><strong>${formatNumber(item.current,2)}</strong></div><div><span>${formulaTriggerHtml('kw','換算容量 [kW]', item.inputType, `result-${index}-kw`)}</span><strong>${formatNumber(item.kw,3)}</strong></div><div><span>${formulaTriggerHtml('kva','換算容量 [kVA]', item.inputType, `result-${index}-kva`)}</span><strong>${formatNumber(item.kva,3)}</strong></div></div>`;
    loadRoot.appendChild(card);
  });
  const noteRoot = $('resConstructionNotes'); noteRoot.innerHTML = '';
  r.constructionNotes.forEach(note=>{ const div = document.createElement('div'); div.className = 'readonly-box compact-box'; div.innerHTML = `<strong class="muted">${escapeHtml(note)}</strong>`; noteRoot.appendChild(div); });
  const memoRoot = $('resRootMemo'); memoRoot.innerHTML = '';
  r.rootMemo.forEach(note=>{ const div = document.createElement('div'); div.className = 'readonly-box compact-box'; div.innerHTML = `<strong class="muted">${escapeHtml(note)}</strong>`; memoRoot.appendChild(div); });
}

function renderLoadCards(){
  normalizeLoads();
  const root = $('loadCards'); root.innerHTML = '';
  $('loadPositionLabel').textContent = state.loads.length ? `1 / ${state.loads.length}` : '- / -';
  if (!state.loads.length) { root.innerHTML = '<div class="load-card muted">負荷数を選択してください。</div>'; return; }
  state.loads.forEach((load,index)=>{
    const card = document.createElement('div'); card.className = 'load-card';
    card.innerHTML = `<div class="row"><strong>${escapeHtml(load.title)}</strong><span class="muted">${index+1} / ${state.loads.length}</span></div><div class="grid two top-gap"><label><span>負荷名称</span><input id="load-name-${load.id}" type="text" value="${escapeHtml(load.name)}" /></label><label><span>入力方式</span><select id="load-type-${load.id}"></select></label><label><span>負荷値</span><input id="load-value-${load.id}" type="number" inputmode="decimal" value="${load.value === '' ? '' : escapeHtml(load.value)}" /></label><div class="readonly-box compact-box"><span>入力方式</span><strong id="load-type-label-${load.id}">${escapeHtml(load.inputType || '-')}</strong></div></div><div class="readonly-grid top-gap"><div><span>${formulaTriggerHtml('current','換算電流 [A]', load.inputType, `load-${load.id}-current`)}</span><strong id="load-current-${load.id}">${formatNumber(currentForLoad(load),2)}</strong></div><div><span>${formulaTriggerHtml('kw','換算容量 [kW]', load.inputType, `load-${load.id}-kw`)}</span><strong id="load-kw-${load.id}">${formatNumber(kwForLoad(load),3)}</strong></div><div><span>${formulaTriggerHtml('kva','換算容量 [kVA]', load.inputType, `load-${load.id}-kva`)}</span><strong id="load-kva-${load.id}">${formatNumber(kvaForLoad(load),3)}</strong></div></div>`;
    root.appendChild(card);
    const nameInput = document.getElementById(`load-name-${load.id}`), typeSelect = document.getElementById(`load-type-${load.id}`), valueInput = document.getElementById(`load-value-${load.id}`);
    setSelectOptions(typeSelect, ['kW','A','kVA'], '選択してください', load.inputType);
    nameInput.addEventListener('input',()=>{ load.name = nameInput.value; validateRealtime(); persistState(); });
    typeSelect.addEventListener('change',()=>{ load.inputType = typeSelect.value; updateLoadDerivedValues(load); renderAmpacitySection(); validateRealtime(); persistState(); });
    wireNumericInput(valueInput,()=>{ load.value = valueInput.value; updateLoadDerivedValues(load); renderAmpacitySection(); validateRealtime(); persistState(); });
  });
  root.onscroll = updateLoadPositionLabel;
}
function updateLoadDerivedValues(load){
  document.querySelectorAll(`[data-formula-source^="load-${load.id}-"]`).forEach(btn=>{ btn.dataset.inputType = load.inputType || ''; });
  hideFormulaPopup();
  document.getElementById(`load-type-label-${load.id}`).textContent = load.inputType || '-';
  document.getElementById(`load-current-${load.id}`).textContent = formatNumber(currentForLoad(load),2);
  document.getElementById(`load-kw-${load.id}`).textContent = formatNumber(kwForLoad(load),3);
  document.getElementById(`load-kva-${load.id}`).textContent = formatNumber(kvaForLoad(load),3);
}
function updateLoadPositionLabel(){
  const root = $('loadCards'), children = [...root.children];
  if (!children.length) return;
  let closest = 0, best = Infinity;
  children.forEach((el,index)=>{ const diff = Math.abs(el.getBoundingClientRect().left - root.getBoundingClientRect().left); if (diff < best) { best = diff; closest = index; }});
  $('loadPositionLabel').textContent = `${closest+1} / ${children.length}`;
}

function buildCableTable(type,label){
  const rows = Object.entries(CABLE_DATA[type] || {}).map(([size,info])=>({sizeSq:size, outerDiameter:info.outerDiameter, massKgKm:info.massKgKm, resistance:info.resistance, ampacity:info.ampacity}));
  return {note:`${label}の参考値です。許容電流・外径・質量は最終的に仕様書で確認してください。`, headers:['サイズ [sq]','外径 [mm]','概算質量 [kg/km]','導体抵抗 [Ω/km]','許容電流 [A]'], keys:['sizeSq','outerDiameter','massKgKm','resistance','ampacity'], rows};
}
function textDoc(note, lines){ return {note, headers:['項目','内容'], keys:['title','body'], rows:lines.map(v=>({title:v[0],body:v[1]}))}; }
function buildVoltageCriteria(){ return textDoc('電圧降下の判定基準はアプリ内で5.0%以下に設定しています。', [['判定基準',`${DROP_LIMIT_PERCENT.toFixed(1)}%以下`],['注意','長距離配線・始動電流が大きい負荷・電圧変動が厳しい設備では、仕様条件を優先してください。'],['実務メモ','アプリは参考計算です。最終判断は現場条件・内線規定・設計仕様で確認してください。']]); }
function buildFormulaCurrent(){ return textDoc('電流換算の基本式です。', [['三相 kW → A','I = P × 1000 ÷ (√3 × V × 力率 × 効率)'],['単相 kW → A','I = P × 1000 ÷ (V × 力率 × 効率)'],['三相 kVA → A','I = kVA × 1000 ÷ (√3 × V)'],['単相 kVA → A','I = kVA × 1000 ÷ V'],['A入力','入力された電流値をそのまま換算電流として扱います。']]); }
function buildFormulaDrop(){ return textDoc('電圧降下の基本式です。', [['三相','e = √3 × I × R × L ÷ 1000'],['単相','e = 2 × I × R × L ÷ 1000'],['百分率','電圧降下率[%] = e ÷ 電圧 × 100'],['注意','リアクタンス成分は簡易計算では省略しています。長距離・大容量では詳細検討してください。']]); }
function buildFormulaCoef(){ return textDoc('許容電流補正の基本式です。', [['補正後許容電流','基準許容電流 × 温度補正 × 条数補正 × 敷設方法補正 × 敷設条件補正'],['温度補正','20〜50℃の係数テーブルを使用'],['条数補正','1〜6条の係数テーブルを使用'],['敷設方法補正','気中・ラック・配管の選択値を使用'],['敷設条件補正','一般・密集・日射ありの選択値を使用'],['注意','密集・日射・管路・ラック等の現場条件を反映して確認してください。']]); }
function buildMainBreakerDoc(){ return textDoc('主幹選定の考え方です。', [['必要最小開閉器','合計電流以上となる最小の標準開閉器です。'],['推奨開閉器','総負荷÷開閉器裕度設定を基準に標準開閉器へ丸めます。'],['既設開閉器指定','既設開閉器容量をケーブル選定基準電流として扱います。'],['自動選定','推奨開閉器容量をケーブル選定基準電流として扱います。'],['裕度','開閉器裕度[%] = (推奨開閉器 - 合計電流) ÷ 推奨開閉器 × 100'],['注意','始動電流・需要率・保護協調・短絡容量は別途確認してください。']]); }
function buildConduitRows(dataset, groupName){
  const rows = [];
  Object.entries(dataset || {}).forEach(([type,items])=>items.forEach(info=>rows.push({group:groupName, conduitType:type, nominal:info.nominal, outerDiameter:info.outerDiameter ?? '-', innerDiameter:info.innerDiameter ?? '-', thicknessMm:info.thicknessMm ?? '-', unitMassKgM:info.unitMassKgM ?? '-', length:info.lengthM ? `${info.lengthM}m` : info.lengthMm ? `${info.lengthMm}mm` : info.coilLengthM ? `${info.coilLengthM}m/巻` : '-', coilMassKg:info.coilMassKg ?? '-', minBendRadiusMm:info.minBendRadiusMm ?? '-', note:info.note || (info.coatingThicknessMm ? `膜厚 ${info.coatingThicknessMm}mm` : '')})));
  return rows;
}
function buildConduitPayload(dataset, groupName, note){ return {note, headers:['分類','配管種類','呼び','外径 [mm]','内径/近似内径 [mm]','厚さ [mm]','単位質量 [kg/m]','長さ','巻質量 [kg]','最小曲げ半径 [mm]','備考'], keys:['group','conduitType','nominal','outerDiameter','innerDiameter','thicknessMm','unitMassKgM','length','coilMassKg','minBendRadiusMm','note'], rows:buildConduitRows(dataset,groupName)}; }
function buildResinConduitDoc(){ return buildConduitPayload(PLASTIC_CONDUIT,'樹脂系','CD管・PF管・FEP管・VE管の参考寸法表です。アプリ内ではメーカー名・商品名を表示しません。'); }
function buildMetalConduitDoc(){ return buildConduitPayload(METAL_CONDUIT,'金属系','厚鋼・薄鋼・ねじなし・ポリエチレンライニング鋼管の参考寸法表です。'); }
function buildFlexibleConduitDoc(){ return buildConduitPayload(FLEXIBLE_CONDUIT,'可とう管','金属製可とう電線管の非防水・防水の参考寸法表です。アプリ内では一般名称で表示します。'); }
function buildDataIssuesDoc(){ return {note:'現時点で不足または要確認として残しているデータです。', headers:['No','内容'], keys:['no','text'], rows:DATA_ISSUES.map((text,index)=>({no:index+1,text}))}; }
function buildConduitSupportDoc(){ return textDoc('配管支持間隔の参考メモです。', [['確認事項','配管種類、サイズ、支持材、屋内外、振動、地震時条件を確認してください。'],['支持方法','サドル・ハンガー・ラック・吊り材等の強度と固定条件を確認してください。'],['注意','仕様・施工要領・現場仕様を優先してください。'],['アプリでの扱い','本表は参考メモです。支持間隔そのものの自動判定は未実装です。']]); }
function buildRackWidthDoc(){ return textDoc('ラック幅選定の参考メモです。', [['概算式','外径 × 条数 × 1.35 を占有幅目安として標準ラック幅へ丸めます。'],['標準幅','W200 / W300 / W400 / W500 / W600 / W800 の範囲で表示します。'],['注意','多段積み、離隔、放熱、将来増設、支持条件は別途確認してください。'],['アプリでの扱い','参考ラック幅はケーブル外径と条数から概算表示します。']]); }
function buildRackSupportDoc(){ return textDoc('ラック支持間隔の参考メモです。', [['確認事項','ラック幅、積載質量、支持材、アンカー、吊りボルト、地震時条件を確認してください。'],['荷重','ケーブル質量・ラック自重・付属品・将来増設分を考慮してください。'],['注意','最終判断は製品仕様・設計図・構造条件で確認してください。']]); }
function buildRackSeismicDoc(){ return textDoc('ラック耐震の考え方です。', [['確認事項','重要度、設置階、支持方法、振れ止め、アンカー、天井・壁・床の強度を確認してください。'],['施工メモ','長尺ラックや重量物周辺では、振れ止め・変位吸収・支持点の確認が重要です。'],['注意','耐震計算が必要な案件では、建築設備耐震設計指針等に基づく検討を行ってください。']]); }
function buildGroundBasisDoc(){ return {note:'接地種別と接地抵抗の参考表です。最終判断は法令・仕様で確認してください。', headers:['接地種別','主な用途','接地抵抗の目安','備考'], keys:['type','use','resistance','note'], rows:[{type:'A種',use:'高圧・特別高圧機器外箱等',resistance:'10Ω以下',note:'条件により詳細確認'},{type:'B種',use:'変圧器低圧側中性点等',resistance:'計算値以下',note:'地絡電流条件で算定'},{type:'C種',use:'300V超の低圧機器外箱等',resistance:'10Ω以下',note:'ELB条件で緩和あり'},{type:'D種',use:'300V以下の低圧機器外箱等',resistance:'100Ω以下',note:'ELB条件で緩和あり'},{type:'ELB条件',use:'漏電遮断器で保護される低圧回路',resistance:'条件により緩和',note:'動作時間・感度電流・仕様を確認'}]}; }
function buildGroundWireDoc(){ return {note:'主幹開閉器容量からの接地線サイズ参考表です。', headers:['接地種別','電線種類','最大開閉器 [A]','参考サイズ'], keys:['groundType','wireType','maxBreaker','size'], rows:GROUND_RULES}; }
function buildHvSymbolsDoc(){ return {note:'高圧単線結線図でよく見る略記号の参考表です。', headers:['略記号','名称','概要'], keys:['symbol','name','body'], rows:[{symbol:'PAS',name:'気中負荷開閉器',body:'高圧引込部などに設置される開閉器。'},{symbol:'DS',name:'断路器',body:'無負荷状態で回路を切り離す機器。'},{symbol:'LBS',name:'高圧交流負荷開閉器',body:'負荷電流の開閉に用いられる機器。'},{symbol:'VCB',name:'真空遮断器',body:'短絡電流等の遮断に用いられる遮断器。'},{symbol:'CT',name:'計器用変流器',body:'電流計測・保護継電器入力に用いる。'},{symbol:'VT',name:'計器用変圧器',body:'電圧計測・保護継電器入力に用いる。'},{symbol:'LA',name:'避雷器',body:'雷サージ等から設備を保護する。'},{symbol:'OCR',name:'過電流継電器',body:'過電流・短絡事故時の保護に用いる。'},{symbol:'GR',name:'地絡継電器',body:'地絡事故検出に用いる。'},{symbol:'ZCT',name:'零相変流器',body:'地絡電流の検出に用いる。'}]}; }
function ensureDocsUpgraded(){ /* v3.1では初期定義済み */ }
function renderDocs(){
  const search = ($('docsSearch').value || '').trim().toLowerCase();
  const root = $('docsContainer'); root.innerHTML = '';
  DOC_GROUPS.forEach(group=>{
    const groupCard = document.createElement('div'); groupCard.className = 'doc-group-card';
    const groupTitle = document.createElement('button'); groupTitle.type = 'button'; groupTitle.className = 'doc-group-toggle'; groupCard.appendChild(groupTitle);
    const groupBody = document.createElement('div'); groupBody.className = 'stack top-gap';
    let visibleCount = 0;
    group.items.forEach(item=>{
      const payload = item.build();
      const blob = `${group.title} ${item.title} ${payload.note || ''} ${JSON.stringify(payload.rows)}`.toLowerCase();
      if (search && !blob.includes(search)) return;
      visibleCount += 1;
      const itemCard = document.createElement('div'); itemCard.className = 'doc-item-card';
      const itemButton = document.createElement('button'); itemButton.type = 'button'; itemButton.className = 'doc-item-toggle'; itemButton.textContent = item.title;
      const itemBody = document.createElement('div'); itemBody.className = 'top-gap';
      if (payload.note) { const note = document.createElement('div'); note.className = 'field-hint'; note.textContent = payload.note; itemBody.appendChild(note); }
      const wrap = document.createElement('div'); wrap.className = 'doc-table-wrap top-gap';
      const table = document.createElement('table'); table.className = 'doc-table';
      const headers = payload.headers.map(v=>`<th>${escapeHtml(v)}</th>`).join('');
      const keys = payload.keys || (payload.rows[0] ? Object.keys(payload.rows[0]) : []);
      const rows = payload.rows.map(row=>`<tr>${keys.map(key=>`<td>${escapeHtml(row[key] ?? '-')}</td>`).join('')}</tr>`).join('');
      table.innerHTML = `<thead><tr>${headers}</tr></thead><tbody>${rows}</tbody>`;
      wrap.appendChild(table); itemBody.appendChild(wrap); itemCard.appendChild(itemButton); itemCard.appendChild(itemBody); groupBody.appendChild(itemCard);
    });
    groupTitle.textContent = `${group.title}（${visibleCount}件）`;
    if (!visibleCount && search) return;
    groupCard.appendChild(groupBody); root.appendChild(groupCard);
  });
  if (!root.children.length) root.innerHTML = '<div class="panel muted">該当する資料はありません。</div>';
}

function buildSaveCard(item, isHistory){
  const card = document.createElement('div'); card.className = 'saved-card';
  const selected = compareIds.includes(item.id);
  card.innerHTML = `<div class="saved-line"><div class="saved-summary"><div class="saved-title-row"><strong>${escapeHtml(item.title || '無題')}</strong><span class="badge ${item.result?.judgement === '良' ? 'good' : 'bad'}">${escapeHtml(item.result?.judgement || '-')}</span></div><span class="muted">${new Date(item.savedAt).toLocaleString('ja-JP')}</span></div></div>${item.memo ? `<div class="muted top-gap">${escapeHtml(item.memo)}</div>` : ''}<div class="readonly-grid top-gap"><div><span>計算方式</span><strong>${item.calculationMode === 'existing' ? '既設開閉器指定' : '自動選定'}</strong></div><div><span>任意ケーブル</span><strong>${escapeHtml(item.result?.cableType || '-')} ${item.result?.cableSize ? `${item.result.cableSize}sq` : '-'}</strong></div><div><span>推奨開閉器 [A]</span><strong>${formatNumber(item.result?.adoptedBreaker,0)}</strong></div><div><span>選定基準 [A]</span><strong>${formatNumber(item.result?.cableSelectionBasisCurrent ?? item.result?.adoptedBreaker,0)}</strong></div><div><span>合計電流 [A]</span><strong>${formatNumber(item.result?.totalCurrent,2)}</strong></div><div><span>電圧降下 [%]</span><strong>${formatNumber(item.result?.voltageDropPercent,2)}</strong></div><div><span>外径・質量データ版</span><strong>${escapeHtml(item.versions?.physical || VERSIONS.physical)}</strong></div></div><div class="inline-actions top-gap"><button class="ghost small js-open">この案を開く</button>${isHistory ? '<button class="ghost small js-save-history">保存済みに追加</button>' : `<button class="ghost small js-compare">${selected ? '比較から外す' : '比較に追加'}</button>`}${!isHistory ? '<button class="ghost small js-rename">名前変更</button>' : ''}<button class="ghost small js-delete">削除</button></div>`;
  card.querySelector('.js-open').onclick = ()=>openSavedItem(item);
  card.querySelector('.js-delete').onclick = ()=>{ if (isHistory) historyItems = historyItems.filter(v=>v.id!==item.id); else { savedItems = savedItems.filter(v=>v.id!==item.id); compareIds = compareIds.filter(id=>id!==item.id); } persistState(); renderSaved(); };
  if (isHistory) card.querySelector('.js-save-history').onclick = ()=>{ const copied = structuredClone(item); copied.id = crypto.randomUUID(); copied.title = `${item.title || '履歴'}_保存`; copied.savedAt = new Date().toISOString(); upsertSavedItem(copied); persistState(); renderSaved(); showToast('保存済みに追加しました。'); };
  else {
    card.querySelector('.js-compare').onclick = ()=>{ if (compareIds.includes(item.id)) compareIds = compareIds.filter(id=>id!==item.id); else if (compareIds.length < 3) compareIds.push(item.id); else return showToast('比較は最大3件です。'); if (!state.compareBaseId && compareIds.length) state.compareBaseId = compareIds[0]; persistState(); renderSaved(); };
    card.querySelector('.js-rename').onclick = ()=>{ const next = prompt('保存名を入力してください。', item.title || ''); if (next && next.trim()) { item.title = next.trim(); persistState(); renderSaved(); } };
  }
  return card;
}
function upsertSavedItem(item){
  const index = savedItems.findIndex(v=>v.title === item.title);
  if (index >= 0) { item.id = savedItems[index].id; savedItems[index] = item; }
  else savedItems.unshift(item);
  if (savedItems.length > MAX_SAVED_ITEMS) { const removed = savedItems.slice(MAX_SAVED_ITEMS); const removedIds = new Set(removed.map(v=>v.id)); savedItems = savedItems.slice(0, MAX_SAVED_ITEMS); compareIds = compareIds.filter(id=>!removedIds.has(id)); }
}
function renderSaved(){
  const historyRoot = $('historyList'); historyRoot.innerHTML = '';
  if (!historyItems.length) historyRoot.innerHTML = '<div class="panel muted">履歴はまだありません。</div>'; else historyItems.forEach(item=>historyRoot.appendChild(buildSaveCard(item,true)));
  const query = ($('savedSearch').value || '').trim().toLowerCase();
  const list = savedItems.filter(item=>!query || `${item.title || ''} ${item.memo || ''}`.toLowerCase().includes(query));
  const savedRoot = $('savedList'); savedRoot.innerHTML = '';
  if (!list.length) savedRoot.innerHTML = '<div class="panel muted">保存済みデータはまだありません。</div>'; else list.forEach(item=>savedRoot.appendChild(buildSaveCard(item,false)));
  renderCompare();
}
function renderCompare(){
  const baseSelect = $('compareBaseSelect');
  const compareItems = compareIds.map(id=>savedItems.find(v=>v.id===id)).filter(Boolean);
  $('compareTargetCount').textContent = `${compareItems.length}件`;
  setSelectOptions(baseSelect, compareItems.map(item=>({value:item.id,label:item.title || '無題'})), '選択してください', state.compareBaseId || '');
  baseSelect.onchange = ()=>{ state.compareBaseId = baseSelect.value; persistState(); renderCompare(); };
  const root = $('compareView'); root.innerHTML = '';
  if (compareItems.length < 2) { root.innerHTML = '<div class="panel muted">比較対象を2件以上選択してください。</div>'; return; }
  const baseItem = compareItems.find(v=>v.id===state.compareBaseId) || compareItems[0];
  if (!state.compareBaseId) state.compareBaseId = baseItem.id;
  const targets = compareItems.filter(v=>v.id!==baseItem.id);
  const metrics = [
    ['任意ケーブル', `${baseItem.result?.cableType || '-'} ${baseItem.result?.cableSize ? baseItem.result.cableSize + 'sq' : '-'}`, item=>`${item.result?.cableType || '-'} ${item.result?.cableSize ? item.result.cableSize + 'sq' : '-'}`, null],
    ['推奨開閉器 [A]', baseItem.result?.adoptedBreaker, item=>item.result?.adoptedBreaker, 'number'],
    ['ケーブル選定基準電流 [A]', baseItem.result?.cableSelectionBasisCurrent ?? baseItem.result?.adoptedBreaker, item=>item.result?.cableSelectionBasisCurrent ?? item.result?.adoptedBreaker, 'number'],
    ['合計電流 [A]', baseItem.result?.totalCurrent, item=>item.result?.totalCurrent, 'number'],
    ['電圧降下 [%]', baseItem.result?.voltageDropPercent, item=>item.result?.voltageDropPercent, 'number'],
    ['開閉器裕度 [%]', baseItem.result?.breakerMarginPercent, item=>item.result?.breakerMarginPercent, 'number'],
    ['容量裕度 [kW]', baseItem.result?.capacityMarginKW, item=>item.result?.capacityMarginKW, 'number'],
    ['判定', baseItem.result?.judgement, item=>item.result?.judgement, null]
  ];
  const table = document.createElement('div'); table.className = 'compare-table-wrap';
  const head = `<thead><tr><th>項目</th><th>基準案<br>${escapeHtml(baseItem.title || '無題')}</th>${targets.map(item=>`<th>${escapeHtml(item.title || '無題')}</th>`).join('')}</tr></thead>`;
  const body = metrics.map(([label,base,getter,type])=>`<tr><td>${escapeHtml(label)}</td><td>${type==='number' ? formatNumber(base,2) : escapeHtml(base ?? '-')}</td>${targets.map(item=>{ const value = getter(item); if (type==='number') { const diff = Number(value || 0) - Number(base || 0); return `<td>${formatNumber(value,2)}<br><span class="muted">差分 ${diff>0?'+':''}${formatNumber(diff,2)}</span></td>`; } return `<td>${escapeHtml(value ?? '-')}</td>`; }).join('')}</tr>`).join('');
  table.innerHTML = `<table class="compare-table">${head}<tbody>${body}</tbody></table>`;
  root.appendChild(table);
}
function openSavedItem(item){ state = migrateStateShape(item.input); state.lastResult = structuredClone(item.result); persistState(); renderAll(); switchScreen('calc'); $('resultPanel').classList.remove('hidden'); $('resultBody').classList.remove('hidden'); updateResultError(''); renderResult(); showToast('計算画面へ読み込みました。'); }
function switchSavedTab(tab){ document.querySelectorAll('.saved-seg').forEach(btn=>btn.classList.toggle('active', btn.dataset.savedTab === tab)); document.querySelectorAll('.saved-subview').forEach(el=>el.classList.remove('active')); $(`saved-subview-${tab}`)?.classList.add('active'); }
function switchScreen(screen){ Object.entries(screens).forEach(([key,el])=>el?.classList.toggle('active', key === screen)); document.querySelectorAll('.nav-btn').forEach(btn=>btn.classList.toggle('active', btn.dataset.screen === screen)); }

function activeCableCandidateForDisplay(){
  const breaker = adoptedBreaker();
  if (state.cableSize) return cableCandidateBySize(breaker, Number(state.cableSize));
  const selection = suggestedCableSelection();
  return selection?.valid || null;
}
function renderAmpacitySection(){
  const breakdown = getCorrectionBreakdown();
  const activeCandidate = activeCableCandidateForDisplay();
  const corrected = activeCandidate?.corrected || correctedAmpacity();
  $('correctedAmpacityValue').textContent = corrected ? formatNumber(corrected,2) : '-';
  $('coefTemperature').textContent = breakdown.temperature ? formatNumber(breakdown.temperature,3) : '-';
  $('coefParallel').textContent = breakdown.parallel ? formatNumber(breakdown.parallel,3) : '-';
  $('coefMethod').textContent = breakdown.method ? formatNumber(breakdown.method,3) : '-';
  $('coefCondition').textContent = breakdown.condition ? formatNumber(breakdown.condition,3) : '-';
  $('coefFinal').textContent = breakdown.final ? formatNumber(breakdown.final,3) : '-';
  const info = activeCandidate?.info || getCableInfo(selectedCableTypeFromState(), Number(state.cableSize));
  const massPerM = info?.massKgKm ? Number(info.massKgKm)/1000 : 0;
  $('massPerMeter').textContent = massPerM ? formatNumber(massPerM,3) : '-';
  const totalMass = massPerM && state.wiringLength ? massPerM * Number(state.wiringLength) * Number(state.parallelCount || 1) : 0;
  $('massTotal').textContent = totalMass ? formatNumber(totalMass,2) : '-';
  $('rackWidthValue').textContent = info?.outerDiameter ? rackWidthFor(Number(info.outerDiameter), Number(state.parallelCount || 1)) : '-';
  const badge = $('ampacityModeBadge'); badge.className = 'mode-badge';
  if (state.ampacityMode === 'auto' || activeCandidate?.info?.ampacity) badge.textContent = '自動'; else if (state.ampacityMode === 'manual') { badge.textContent = '手動'; badge.classList.add('manual'); } else { badge.textContent = '未設定'; badge.classList.add('none'); }
}
function applyDisplayScale(){ document.documentElement.style.setProperty('--display-scale', String(Number(state.displayScale || 1.0))); }
function applySettingsValues(){ $('verAmpacity').textContent = VERSIONS.ampacity; $('verPhysical').textContent = VERSIONS.physical; $('verForm').textContent = VERSIONS.form; }
function renderAll(){
  normalizePowerSystemForCalcType();
  setSelectOptions($('calcMode'), [{value:'auto',label:'自動選定'},{value:'existing',label:'既設開閉器指定'}], '選択してください', state.calcMode);
  setSelectOptions($('powerSystem'), getPowerSystemOptions(), '選択してください', state.powerSystem);
  setSelectOptions($('voltage'), ['100','200','400'], '選択してください', state.voltage);
  setSelectOptions($('powerFactor'), POWER_FACTOR_OPTIONS, '選択してください', state.powerFactor);
  setSelectOptions($('efficiency'), EFFICIENCY_OPTIONS, '選択してください', state.efficiency);
  setSelectOptions($('existingBreaker'), BREAKER_SIZES.map(v=>({value:String(v),label:`${v}A`})), '選択してください', state.existingBreaker);
  setSelectOptions($('breakerMarginRatio'), BREAKER_MARGIN_RATIO_OPTIONS, '選択してください', state.breakerMarginRatio || '0.8');
  setSelectOptions($('loadCount'), Array.from({length:20},(_,i)=>({value:String(i+1),label:String(i+1)})), '選択してください', state.loadCount);
  setSelectOptions($('cableSizingMode'), CABLE_SIZING_MODE_OPTIONS, '選択してください', state.cableSizingMode || 'auto');
  const cableType = selectedCableTypeFromState();
  setSelectOptions($('cableType'), ['CV-1C','CV-2C','CV-3C','CV-4C','CVD','CVT','CVQ'], '選択してください', cableType);
  setSelectOptions($('cableSize'), getCableSizes(cableType).map(v=>({value:String(v),label:`${v}sq`})), '選択してください', state.cableSize);
  setSelectOptions($('installationMethod'), ['気中','ラック','配管'], '選択してください', state.installationMethod);
  setSelectOptions($('layingCondition'), ['一般','密集','日射あり'], '選択してください', state.layingCondition);
  setSelectOptions($('ambientTemperature'), [20,25,30,35,40,45,50].map(v=>({value:String(v),label:`${v}℃`})), '選択してください', state.ambientTemperature);
  setSelectOptions($('parallelCount'), [1,2,3,4,5,6].map(v=>({value:String(v),label:String(v)})), '選択してください', state.parallelCount);
  setSelectOptions($('displayScale'), DISPLAY_SCALE_OPTIONS, '選択してください', state.displayScale || '1.0');
  $('wiringLength').value = state.wiringLength || '';
  $('projectName').value = state.projectName || '';
  $('projectType').value = state.projectType || '';
  $('submitTo').value = state.submitTo || '';
  $('drawingNo').value = state.drawingNo || '';
  $('author').value = state.author || '';
  $('createdAt').value = state.createdAt || '';
  $('projectRemarks').value = state.projectRemarks || '';
  $('baseAmpacity').value = state.baseAmpacity || '';
  $('calcModeHint').textContent = state.calcMode === 'existing' ? '既設開閉器サイズを基準に幹線サイズを判定します。' : `推奨開閉器は、合計電流÷開閉器裕度設定で選定します。`;
  document.querySelectorAll('.seg').forEach(btn=>btn.classList.toggle('active', btn.dataset.calcType === state.calculationType));
  applyDisplayScale(); renderLoadCards(); renderAmpacitySection(); renderDocs(); renderSaved(); applySettingsValues();
  if (state.lastResult) { $('resultPanel').classList.remove('hidden'); $('resultBody').classList.remove('hidden'); updateResultError(''); renderResult(); }
  else { $('resultPanel').classList.add('hidden'); }
}
function wireNumericInput(input,onChange){ input.addEventListener('input', onChange); }
function bindEvents(){
  bindFormulaPopup();
  document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>switchScreen(btn.dataset.screen)));
  document.querySelectorAll('.seg').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.seg').forEach(v=>v.classList.remove('active')); btn.classList.add('active'); state.calculationType = btn.dataset.calcType; normalizePowerSystemForCalcType(); persistState(); renderAll(); }));
  document.querySelectorAll('.saved-seg').forEach(btn=>btn.addEventListener('click',()=>switchSavedTab(btn.dataset.savedTab)));
  $('calcMode').addEventListener('change',()=>{ state.calcMode = $('calcMode').value; persistState(); renderAll(); });
  $('powerSystem').addEventListener('change',()=>{ state.powerSystem = $('powerSystem').value; persistState(); renderLoadCards(); renderAmpacitySection(); validateRealtime(); });
  $('voltage').addEventListener('change',()=>{ state.voltage = $('voltage').value; persistState(); renderLoadCards(); renderAmpacitySection(); validateRealtime(); });
  $('powerFactor').addEventListener('change',()=>{ state.powerFactor = $('powerFactor').value; persistState(); renderLoadCards(); renderAmpacitySection(); validateRealtime(); });
  $('efficiency').addEventListener('change',()=>{ state.efficiency = $('efficiency').value; persistState(); renderLoadCards(); renderAmpacitySection(); validateRealtime(); });
  $('existingBreaker').addEventListener('change',()=>{ state.existingBreaker = $('existingBreaker').value; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('breakerMarginRatio').addEventListener('change',()=>{ state.breakerMarginRatio = $('breakerMarginRatio').value || '0.8'; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('loadCount').addEventListener('change',()=>{ state.loadCount = $('loadCount').value; normalizeLoads(); persistState(); renderLoadCards(); validateRealtime(); });
  $('cableSizingMode').addEventListener('change',()=>{ state.cableSizingMode = $('cableSizingMode').value || 'auto'; persistState(); validateRealtime(); });
  $('cableType').addEventListener('change',()=>{ const nextType = $('cableType').value; applyCableTypeToState(nextType); const sizes = getCableSizes(nextType).map(String); if (!sizes.includes(String(state.cableSize))) { state.cableSize = ''; state.baseAmpacity = ''; state.ampacityMode = 'none'; } persistState(); renderAll(); });
  $('cableSize').addEventListener('change',()=>{ state.cableSize = $('cableSize').value; if (state.lastResult) state.cableSizingMode = 'manual'; const info = getCableInfo(selectedCableTypeFromState(), Number(state.cableSize)); state.baseAmpacity = info?.ampacity ? String(info.ampacity) : ''; state.ampacityMode = info?.ampacity ? 'auto' : 'none'; persistState(); renderAll(); validateRealtime(); });
  wireNumericInput($('baseAmpacity'),()=>{ state.baseAmpacity = $('baseAmpacity').value; state.ampacityMode = $('baseAmpacity').value ? 'manual' : 'none'; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('installationMethod').addEventListener('change',()=>{ state.installationMethod = $('installationMethod').value; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('layingCondition').addEventListener('change',()=>{ state.layingCondition = $('layingCondition').value; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('ambientTemperature').addEventListener('change',()=>{ state.ambientTemperature = $('ambientTemperature').value; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('parallelCount').addEventListener('change',()=>{ state.parallelCount = $('parallelCount').value; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('projectName').addEventListener('input',()=>{ state.projectName = $('projectName').value; persistState(); });
  $('projectType').addEventListener('input',()=>{ state.projectType = $('projectType').value; persistState(); });
  $('submitTo').addEventListener('input',()=>{ state.submitTo = $('submitTo').value; persistState(); });
  $('drawingNo').addEventListener('input',()=>{ state.drawingNo = $('drawingNo').value; persistState(); });
  $('author').addEventListener('input',()=>{ state.author = $('author').value; persistState(); });
  $('createdAt').addEventListener('input',()=>{ state.createdAt = $('createdAt').value; persistState(); });
  $('projectRemarks').addEventListener('input',()=>{ state.projectRemarks = $('projectRemarks').value; persistState(); });
  wireNumericInput($('wiringLength'),()=>{ state.wiringLength = $('wiringLength').value; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('calculateBtn').addEventListener('click', calculate);
  $('toggleResultBtn').addEventListener('click',()=>{ const body = $('resultBody'); body.classList.toggle('hidden'); $('toggleResultBtn').textContent = body.classList.contains('hidden') ? '展開する' : '折りたたむ'; });
  $('saveResultTopBtn').addEventListener('click', openSaveDialog); $('saveResultBottomBtn').addEventListener('click', openSaveDialog);
  $('confirmSaveBtn').addEventListener('click', e=>{ e.preventDefault(); confirmSave(); });
  $('csvBtn').addEventListener('click', downloadCsv); $('excelBtn').addEventListener('click', downloadExcel); $('pdfBtn').addEventListener('click', printPdf);
  $('groundWireBtn').addEventListener('click',()=>$('groundDialog').showModal()); $('closeGroundDialog').addEventListener('click',()=>$('groundDialog').close()); $('groundType').addEventListener('change', updateGroundResult); $('groundWireType').addEventListener('change', updateGroundResult);
  $('docsSearch').addEventListener('input', renderDocs); $('openDocsFromCalc').addEventListener('click',()=>switchScreen('docs')); $('returnCalcFromDocs').addEventListener('click',()=>switchScreen('calc'));
  $('savedSearch').addEventListener('input', renderSaved);
  $('clearHistoryBtn').addEventListener('click',()=>{ if (!confirm('履歴をすべて削除しますか？')) return; historyItems = []; persistState(); renderSaved(); });
  $('displayScale').addEventListener('change',()=>{ state.displayScale = $('displayScale').value || '1.0'; applyDisplayScale(); persistState(); });
  $('resetDisclaimerBtn').addEventListener('click',()=>{ localStorage.removeItem(STORAGE.disclaimer); showToast('次回起動時に免責を再表示します。'); });
  window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt = e; $('installBtn').hidden = false; });
  $('installBtn').addEventListener('click', async()=>{ if (!deferredPrompt) return; deferredPrompt.prompt(); deferredPrompt = null; $('installBtn').hidden = true; });
}
function validateRealtime(){ markMissingFields(missingFields()); }
function openSaveDialog(){
  if (!state.lastResult) return showToast('先に計算してください。');
  $('saveTitleInput').value = state.projectName || `${state.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算'}_${new Date().toLocaleString('sv-SE').replace(/[: ]/g,'_')}`;
  $('saveMemoInput').value = state.projectRemarks || '';
  $('saveDialog').showModal();
}
function confirmSave(){
  const title = $('saveTitleInput').value.trim();
  if (!title) return showToast('保存名を入力してください。');
  const item = {id:crypto.randomUUID(), title, memo:$('saveMemoInput').value.trim(), savedAt:new Date().toISOString(), input:structuredClone(state), result:structuredClone(state.lastResult), calculationMode:state.calcMode, versions:structuredClone(VERSIONS)};
  const existed = savedItems.some(v=>v.title === title);
  upsertSavedItem(item); persistState(); renderSaved(); $('saveDialog').close(); showToast(existed ? '同名の保存データを上書きしました。' : '保存しました。');
}
function excelSafe(value){ return escapeHtml(value ?? '').replace(/\n/g,'<br>'); }
function outputRows(){
  const r = state.lastResult;
  return [
    ['工事件名', state.projectName || ''], ['工事種別', state.projectType || ''], ['提出先', state.submitTo || ''], ['図番', state.drawingNo || ''], ['作成者', state.author || ''], ['作成日時', formatDateTimeForOutput(state.createdAt || '')], ['備考', state.projectRemarks || ''], ['計算種別', state.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算'], ['計算方式', state.calcMode === 'existing' ? '既設開閉器指定' : '自動選定'], ['電源方式', state.powerSystem], ['電圧[V]', state.voltage], ['力率', state.powerFactor], ['効率', state.efficiency], ['配線長[m]', state.wiringLength], ['既設開閉器[A]', state.existingBreaker || ''], ['開閉器裕度設定', state.breakerMarginRatio || ''], ['必要最小開閉器[A]', r.requiredBreaker], ['推奨開閉器[A]', r.adoptedBreaker], ['ケーブル選定基準', r.cableSelectionBasisLabel || ''], ['ケーブル選定基準電流[A]', r.cableSelectionBasisCurrent || r.adoptedBreaker || ''], ['必要最小ケーブルサイズ', cableLabel(r.requiredMinCableType, r.requiredMinCableSize)], ['自動推奨ケーブル', cableLabel(r.recommendedCableType, r.recommendedCableSize)], ['任意ケーブルサイズ', cableLabel(r.cableType, r.cableSize)], ['基準許容電流[A]', r.baseAmpacity], ['補正後許容電流[A]', r.correctedAmpacity], ['合計容量[kW]', r.totalKW], ['合計容量[kVA]', r.totalKVA], ['合計電流[A]', r.totalCurrent], ['電圧降下[V]', r.voltageDropV], ['電圧降下[%]', r.voltageDropPercent], ['電圧降下計算電流[A]', r.voltageDropBasisCurrent], ['開閉器裕度[%]', r.breakerMarginPercent], ['容量裕度[kW]', r.capacityMarginKW], ['概算質量[kg/m]', r.massKgM], ['概算総質量[kg]', r.massTotalKg], ['参考ラック幅', r.rackWidth], ['良否判定', r.judgement], ['選定主因', r.mainFactor], ['選定根拠', r.reasons.join('、')], ['許容電流データ版', VERSIONS.ampacity], ['外径・質量データ版', VERSIONS.physical], ['帳票様式版', VERSIONS.form]
  ];
}
function downloadExcel(){
  if (!state.lastResult) return showToast('先に計算してください。');
  const r = state.lastResult;
  const summaryRows = outputRows();
  const loadRows = r.loadDetails.map((load,index)=>[index+1, load.name, load.inputType, load.value, formatNumber(load.current,2), formatNumber(load.kw,3), formatNumber(load.kva,3)]);
  const html = `<html><head><meta charset="utf-8"><style>body{font-family:"Yu Gothic",Meiryo,sans-serif;}table{border-collapse:collapse;margin-bottom:18px;}th,td{border:1px solid #999;padding:6px 8px;mso-number-format:"\\@";}th{background:#eaf2ff;}.note{color:#c00;font-weight:bold;}</style></head><body><h1>低圧幹線計算 結果表</h1><p class="note">本帳票は参考資料です。内線規定・関係法令・現場仕様・機器仕様を確認し、最終判断は利用者責任で行ってください。</p><h2>計算結果</h2><table>${summaryRows.map(row=>`<tr><th>${excelSafe(row[0])}</th><td>${excelSafe(row[1])}</td></tr>`).join('')}</table><h2>負荷一覧</h2><table><tr><th>No</th><th>負荷名称</th><th>入力方式</th><th>負荷値</th><th>換算電流[A]</th><th>換算容量[kW]</th><th>換算容量[kVA]</th></tr>${loadRows.map(row=>`<tr>${row.map(cell=>`<td>${excelSafe(cell)}</td>`).join('')}</tr>`).join('')}</table><h2>施工参考メモ</h2><table>${r.constructionNotes.map(note=>`<tr><td>${excelSafe(note)}</td></tr>`).join('')}</table><h2>根拠メモ</h2><table>${r.rootMemo.map(note=>`<tr><td>${excelSafe(note)}</td></tr>`).join('')}</table></body></html>`;
  const blob = new Blob(['\ufeff' + html], {type:'application/vnd.ms-excel;charset=utf-8;'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${state.projectName || 'feeder_calc'}_${Date.now()}.xls`; a.click(); URL.revokeObjectURL(url);
}
function downloadCsv(){
  if (!state.lastResult) return showToast('先に計算してください。');
  const r = state.lastResult;
  const rows = [['項目','値'], ...outputRows(), [], ['負荷No','負荷名称','入力方式','負荷値','換算電流[A]','換算容量[kW]','換算容量[kVA]']];
  r.loadDetails.forEach((load,index)=>rows.push([index+1, load.name, load.inputType, load.value, load.current, load.kw, load.kva]));
  const csv = rows.map(row=>row.map(v=>`"${String(v ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${state.projectName || 'feeder_calc'}_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
}
function printPdf(){ if (!state.lastResult) return showToast('先に計算してください。'); if (!confirm('本帳票は参考資料です。最終判断は利用者責任で行ってください。続行しますか？')) return; window.print(); }
function updateGroundResult(){
  const groundType = $('groundType').value, wireType = $('groundWireType').value, breaker = Number(state.lastResult?.adoptedBreaker || state.existingBreaker || 0);
  const rule = GROUND_RULES.find(v=>v.groundType===groundType && v.wireType===wireType && breaker<=v.maxBreaker) || GROUND_RULES.find(v=>v.groundType===groundType && v.wireType===wireType);
  $('groundResult').textContent = rule ? `推奨開閉器 ${breaker || '-'}A の参考接地線サイズ：${rule.size}` : '条件に合う参考サイズがありません。';
}
function runDisclaimer(){
  if (localStorage.getItem(STORAGE.disclaimer) === 'accepted') return;
  disclaimerStep = 1;
  $('disclaimerTitle').textContent = '免責事項';
  $('disclaimerBody').textContent = '本Webアプリおよび帳票出力内容は参考資料です。計算結果は現場条件・仕様・関係法令により変わります。';
  $('disclaimerDialog').showModal();
  $('disclaimerNextBtn').onclick = ()=>{ if (disclaimerStep === 1) { disclaimerStep = 2; $('disclaimerTitle').textContent = '重要な確認'; $('disclaimerBody').textContent = '最終判断は利用者責任で行ってください。内線規定、関係法令、現場条件、機器仕様、保護協調等を必ず確認してください。'; } else { localStorage.setItem(STORAGE.disclaimer,'accepted'); $('disclaimerDialog').close(); } };
}
function registerSW(){ if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
function init(){ ensureDocsUpgraded(); bindEvents(); applySettingsValues(); renderAll(); switchScreen('calc'); switchSavedTab('history'); runDisclaimer(); registerSW(); }
document.addEventListener('DOMContentLoaded', init);
