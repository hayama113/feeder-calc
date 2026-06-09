const APP_VERSION = '3.2.12';

const VERSIONS = {
  app: 'Web v3.2.12',
  ampacity: '2026.06-A',
  physical: '2026.06-A',
  form: '2026.06-B'
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
const VOLTAGE_DROP_LIMIT_OPTIONS = [
  {value:'5', label:'5%以下（標準）'},
  {value:'3', label:'3%以下（厳しめ）'}
];
const LOAD_PURPOSE_OPTIONS = [
  {value:'lighting', label:'照明・コンセント系'},
  {value:'power', label:'動力系'}
];
const VOLTAGE_PRESET_OPTIONS = [
  {value:'100', label:'100V'},
  {value:'105', label:'105V'},
  {value:'200', label:'200V'},
  {value:'210', label:'210V'},
  {value:'220', label:'220V'},
  {value:'230', label:'230V'},
  {value:'240', label:'240V'},
  {value:'400', label:'400V'},
  {value:'415', label:'415V'},
  {value:'440', label:'440V'},
  {value:'custom', label:'任意入力'}
];
const VOLTAGE_PRESET_VALUES = VOLTAGE_PRESET_OPTIONS.filter(v=>v.value !== 'custom').map(v=>v.value);
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
const DEFAULT_DROP_LIMIT_PERCENT = 5.0;
const RACK_WIDTHS = [200,300,400,500,600,800];
const MAX_SAVED_ITEMS = 10;
const savedSortDefault = 'newest';
const compareModeDefault = 'major';

const kgPerM = (kg, m) => Number((kg / m).toFixed(3));
const innerByThickness = (outer, thickness) => Number((outer - 2 * thickness).toFixed(1));

const GROUND_RULES = [
  {groundType:'C種', wireType:'IV', maxBreaker:100, size:'8sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:200, size:'14sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:400, size:'22sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:800, size:'38sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:100, size:'5.5sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:200, size:'8sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:400, size:'14sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:800, size:'22sq'}
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
    {nominal:'36',outerDiameter:42.0,innerDiameter:36.0,unitMassKgM:kgPerM(5.7,30),coilLengthM:30,coilMassKg:5.7},
    {nominal:'42',outerDiameter:48.0,innerDiameter:42.0,unitMassKgM:kgPerM(6.9,30),coilLengthM:30,coilMassKg:6.9,note:'42サイズは参考値'}
  ],
  'PF管': [
    {nominal:'14',outerDiameter:21.5,innerDiameter:14.0,unitMassKgM:kgPerM(3.6,50),coilLengthM:50,coilMassKg:3.6},
    {nominal:'16',outerDiameter:23.0,innerDiameter:16.0,unitMassKgM:kgPerM(4.2,50),coilLengthM:50,coilMassKg:4.2},
    {nominal:'22',outerDiameter:30.5,innerDiameter:22.0,unitMassKgM:kgPerM(6.0,50),coilLengthM:50,coilMassKg:6.0},
    {nominal:'28',outerDiameter:36.5,innerDiameter:28.0,unitMassKgM:kgPerM(4.8,30),coilLengthM:30,coilMassKg:4.8},
    {nominal:'36',outerDiameter:45.5,innerDiameter:36.0,unitMassKgM:kgPerM(6.5,30),coilLengthM:30,coilMassKg:6.5},
    {nominal:'42',outerDiameter:52.0,innerDiameter:42.0,unitMassKgM:kgPerM(8.9,30),coilLengthM:30,coilMassKg:8.9,note:'42サイズは参考値'}
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
    {nominal:'14',outerDiameter:18,innerDiameter:14,unitMassKgM:0.180,lengthM:4,note:'質量は参考値'},
    {nominal:'16',outerDiameter:22,innerDiameter:18,unitMassKgM:0.223,lengthM:4,note:'質量は参考値'},
    {nominal:'22',outerDiameter:26,innerDiameter:22,unitMassKgM:0.248,lengthM:4,note:'質量は参考値'},
    {nominal:'28',outerDiameter:34,innerDiameter:28,unitMassKgM:0.485,lengthM:4,note:'質量は参考値'},
    {nominal:'36',outerDiameter:42,innerDiameter:35,unitMassKgM:0.703,lengthM:4,note:'質量は参考値'},
    {nominal:'42',outerDiameter:48,innerDiameter:40,unitMassKgM:0.935,lengthM:4,note:'質量は参考値'},
    {nominal:'54',outerDiameter:60,innerDiameter:51,unitMassKgM:1.288,lengthM:4,note:'質量は参考値'},
    {nominal:'70',outerDiameter:76,innerDiameter:67,unitMassKgM:1.545,lengthM:4,note:'質量は参考値'},
    {nominal:'82',outerDiameter:89,innerDiameter:77,unitMassKgM:2.725,lengthM:4,note:'質量は参考値'}
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
  'CD管・PF管の42サイズを参考値として追加済み。最終値は採用品の仕様書で確認してください。',
  'VE管の単位質量を参考値として追加済み。最終値は採用品の仕様書で確認してください。'
];

const DOC_GROUPS = [
  {key:'standards', title:'規程・法令基準', items:[
    {id:'standard_scope', title:'技術資料の位置づけ', searchable:true, build:buildStandardsScopeDoc},
    {id:'voltage_drop_code', title:'規程上の電圧降下目安（内線規程1310節参考）', searchable:true, build:buildVoltageDropCodeDoc},
    {id:'insulation_low_voltage', title:'低圧電路の絶縁抵抗値', searchable:true, build:buildInsulationResistanceDoc},
    {id:'ground_resistance_code', title:'接地抵抗値（A/B/C/D種）', searchable:true, build:buildGroundResistanceCodeDoc},
    {id:'ground_application_code', title:'機械器具外箱の接地種別', searchable:true, build:buildGroundApplicationCodeDoc},
    {id:'earth_leakage_breaker', title:'地絡遮断装置の確認', searchable:true, build:buildEarthLeakageBreakerDoc},
    {id:'standards_checklist', title:'現場確認チェックリスト', searchable:true, build:buildStandardsChecklistDoc}
  ]},
  {key:'calc', title:'計算資料', items:[
    {id:'cable_cv1', title:'ケーブル一覧表（CV単芯）', searchable:true, build:()=>buildCableTable('CV-1C','CV単芯')},
    {id:'cable_cv2', title:'ケーブル一覧表（CV-2C）', searchable:true, build:()=>buildCableTable('CV-2C','CV-2C')},
    {id:'cable_cv3', title:'ケーブル一覧表（CV-3C）', searchable:true, build:()=>buildCableTable('CV-3C','CV-3C')},
    {id:'cable_cv4', title:'ケーブル一覧表（CV-4C）', searchable:true, build:()=>buildCableTable('CV-4C','CV-4C')},
    {id:'cable_cvd', title:'ケーブル一覧表（CVD）', searchable:true, build:()=>buildCableTable('CVD','CVD')},
    {id:'cable_cvt', title:'ケーブル一覧表（CVT）', searchable:true, build:()=>buildCableTable('CVT','CVT')},
    {id:'cable_cvq', title:'ケーブル一覧表（CVQ）', searchable:true, build:()=>buildCableTable('CVQ','CVQ')},
    {id:'drop_criteria', title:'アプリ電圧降下判定基準（3%/5%）', searchable:false, build:buildVoltageCriteria},
    {id:'formula_current', title:'基本計算式（電流換算）', searchable:false, build:buildFormulaCurrent},
    {id:'formula_drop', title:'基本計算式（電圧降下）', searchable:false, build:buildFormulaDrop},
    {id:'formula_coef', title:'基本計算式（許容電流補正）', searchable:false, build:buildFormulaCoef},
    {id:'tech_calc_tools', title:'技術検算フォーム', searchable:true, build:buildTechCalcToolsDoc},
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

function normalizeCalculationTypeValue(value){
  const raw = String(value || '').toLowerCase();
  if (raw === 'lighting' || raw.includes('電灯') || raw.includes('照明')) return 'lighting';
  return 'power';
}
function isLightingCalc(target = state){
  return normalizeCalculationTypeValue(target?.calculationType) === 'lighting';
}
function loadPurposeLabel(type = state.calculationType){
  return normalizeCalculationTypeValue(type) === 'lighting' ? '照明・コンセント系' : '動力系';
}
function effectiveEfficiency(target = state){
  return isLightingCalc(target) ? 1 : Number(target.efficiency || 0);
}
function efficiencyDisplayValue(target = state){
  return isLightingCalc(target) ? '1.0（照明・コンセント系は内部計算値）' : (target.efficiency || '');
}

const DEFAULT_UI = {
  calculationType:'power', calcMode:'', powerSystem:'', voltage:'', voltagePreset:'', voltageCustom:'', powerFactor:'', efficiency:'',
  wiringLength:'', voltageDropLimitPercent:'5', existingBreaker:'', breakerMarginRatio:'0.8', projectName:'', projectType:'', submitTo:'', drawingNo:'', author:'', createdAt:'', projectRemarks:'', loadCount:'',
  cableFamily:'', cableSubtype:'', cableSize:'', cableSizingMode:'auto', baseAmpacity:'', ampacityMode:'none',
  installationMethod:'', layingCondition:'', ambientTemperature:'40', parallelCount:'',
  loads:[], lastResult:null, compareBaseId:'', compareMode:'major', displayScale:'1.0', readOnly:false
};

function migrateStateShape(input){
  const migrated = Object.assign(structuredClone(DEFAULT_UI), input || {});
  migrated.calculationType = normalizeCalculationTypeValue(migrated.calculationType);
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
  migrated.voltageDropLimitPercent = String(migrated.voltageDropLimitPercent || DEFAULT_UI.voltageDropLimitPercent);
  normalizeVoltageState(migrated);
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
  const eff = isLightingCalc() ? '' : (state.efficiency || '効率');
  const empty = '入力方式を選択すると、この欄の換算式を表示します。';
  if (!inputType) return empty;
  const head = isLightingCalc() ? `${phase} / 入力方式：${inputType} / V=${voltage} / 力率=${pf}` : `${phase} / 入力方式：${inputType} / V=${voltage} / 力率=${pf} / 効率=${eff}`;
  const phase3 = isThreePhase();
  const useEff = !isLightingCalc();
  const formulas = {
    current: {
      kW: phase3 ? (useEff ? 'I[A] = P[kW] × 1000 ÷ (√3 × V × 力率 × 効率)' : 'I[A] = P[kW] × 1000 ÷ (√3 × V × 力率)') : (useEff ? 'I[A] = P[kW] × 1000 ÷ (V × 力率 × 効率)' : 'I[A] = P[kW] × 1000 ÷ (V × 力率)'),
      kVA: phase3 ? 'I[A] = S[kVA] × 1000 ÷ (√3 × V)' : 'I[A] = S[kVA] × 1000 ÷ V',
      A: 'I[A] = 入力電流[A]'
    },
    kw: {
      kW: 'P[kW] = 入力容量[kW]',
      kVA: useEff ? 'P[kW] = S[kVA] × 力率 × 効率' : 'P[kW] = S[kVA] × 力率',
      A: phase3 ? (useEff ? 'P[kW] = √3 × V × I[A] × 力率 × 効率 ÷ 1000' : 'P[kW] = √3 × V × I[A] × 力率 ÷ 1000') : (useEff ? 'P[kW] = V × I[A] × 力率 × 効率 ÷ 1000' : 'P[kW] = V × I[A] × 力率 ÷ 1000')
    },
    kva: {
      kW: useEff ? 'S[kVA] = P[kW] ÷ (力率 × 効率)' : 'S[kVA] = P[kW] ÷ 力率',
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

function normalizeVoltageState(target = state){
  const rawVoltage = target.voltage == null ? '' : String(target.voltage);
  if (!target.voltagePreset) {
    if (rawVoltage && VOLTAGE_PRESET_VALUES.includes(rawVoltage)) {
      target.voltagePreset = rawVoltage;
      target.voltageCustom = '';
    } else if (rawVoltage) {
      target.voltagePreset = 'custom';
      target.voltageCustom = rawVoltage;
    } else {
      target.voltagePreset = '';
      target.voltageCustom = '';
    }
  }
  if (target.voltagePreset === 'custom') {
    target.voltageCustom = target.voltageCustom || rawVoltage || '';
    target.voltage = target.voltageCustom || '';
  } else if (target.voltagePreset) {
    target.voltage = target.voltagePreset;
    target.voltageCustom = '';
  }
}
function isCustomVoltage(){
  return state.voltagePreset === 'custom';
}
function applyVoltagePresetToState(){
  if (isCustomVoltage()) state.voltage = state.voltageCustom || '';
  else { state.voltage = state.voltagePreset || ''; state.voltageCustom = ''; }
}
function renderVoltageFields(){
  normalizeVoltageState(state);
  $('customVoltageField')?.classList.toggle('hidden', !isCustomVoltage());
  const customInput = $('voltageCustom');
  if (customInput) customInput.value = state.voltageCustom || '';
}
function maybeRecalculateAfterInput(){
  if (state.lastResult && !missingFields().length) calculate({recordHistory:false, scrollResult:false});
}

function currentCableType(){
  if (state.cableFamily === 'CVT') return 'CVT';
  if (state.cableFamily === 'CV') return state.cableSubtype === 'CV-単芯' ? 'CV-1C' : state.cableSubtype || '';
  return '';
}
function selectedCableTypeFromState(){ return currentCableType(); }
function coreCountForPowerSystem(powerSystem = state.powerSystem){
  const ps = String(powerSystem || '');
  if (ps === '1φ2W') return 2;
  if (ps === '1φ3W') return 3;
  if (ps === '3φ3W') return 3;
  if (ps === '3φ4W') return 4;
  return 1;
}
function cableCoreCount(type = selectedCableTypeFromState(), powerSystem = state.powerSystem){
  return type === 'CV-1C' ? coreCountForPowerSystem(powerSystem) : 1;
}
function cableTypeDisplayName(type = selectedCableTypeFromState(), powerSystem = state.powerSystem){
  if (!type) return '-';
  if (type === 'CV-1C') return `CV-1C（単心×${coreCountForPowerSystem(powerSystem)}本）`;
  return type;
}
function allowedCableTypesForPowerSystem(powerSystem = state.powerSystem){
  const ps = String(powerSystem || '');
  if (ps === '1φ2W') return ['CV-2C','CVD','CV-1C'];
  if (ps === '1φ3W') return ['CV-3C','CVT','CV-1C'];
  if (ps === '3φ3W') return ['CV-3C','CVT','CV-1C'];
  if (ps === '3φ4W') return ['CV-4C','CVQ','CV-1C'];
  return ['CV-2C','CV-3C','CV-4C','CVD','CVT','CVQ','CV-1C'];
}
function cableTypeRequirementText(powerSystem = state.powerSystem){
  const ps = String(powerSystem || '');
  if (ps === '1φ2W') return '1φ2Wでは2心相当（CVD / CV-2C / CV-1C×2本）を選択してください。';
  if (ps === '1φ3W') return '1φ3Wでは3心相当（CVT / CV-3C / CV-1C×3本）を選択してください。';
  if (ps === '3φ3W') return '3φ3Wでは3心相当（CVT / CV-3C / CV-1C×3本）を選択してください。';
  if (ps === '3φ4W') return '3φ4Wでは4心相当（CVQ / CV-4C / CV-1C×4本）を選択してください。';
  return '電源方式を選択すると、使用できるケーブル種類を制限します。';
}
function cableTypeCompatibilityMessage(type = selectedCableTypeFromState(), powerSystem = state.powerSystem){
  if (!powerSystem || !type) return '';
  const allowed = allowedCableTypesForPowerSystem(powerSystem);
  return allowed.includes(type) ? '' : `${powerSystem}では${type}は選択できません。${cableTypeRequirementText(powerSystem)}`;
}
function resetCableSelectionForCompatibility(message=''){
  applyCableTypeToState('');
  state.cableSize = '';
  state.baseAmpacity = '';
  state.ampacityMode = 'none';
  if (message) state.cableCompatibilityWarning = message;
}
function normalizeCableTypeForPowerSystem(){
  const type = selectedCableTypeFromState();
  const message = cableTypeCompatibilityMessage(type, state.powerSystem);
  if (message) resetCableSelectionForCompatibility(message);
}
function applyCableTypeToState(type){
  if (type === 'CVT') { state.cableFamily = 'CVT'; state.cableSubtype = ''; return; }
  state.cableFamily = type ? 'CV' : '';
  state.cableSubtype = type === 'CV-1C' ? 'CV-単芯' : type || '';
}
function getCableSizes(type){ return !type || !CABLE_DATA[type] ? [] : Object.keys(CABLE_DATA[type]).map(Number).sort((a,b)=>a-b); }
function getCableInfo(type, size){ return !type || !size || !CABLE_DATA[type] ? null : CABLE_DATA[type][size] || null; }

function getPowerSystemOptions(){ return isLightingCalc() ? ['1φ2W','1φ3W'] : ['3φ3W','3φ4W']; }
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
  const value = Number(load.value), voltage = Number(state.voltage), pf = Number(state.powerFactor), eff = effectiveEfficiency();
  if (!value || !voltage || !pf || !eff || !load.inputType) return '';
  if (load.inputType === 'A') return value;
  if (load.inputType === 'kVA') return isThreePhase() ? (value*1000)/(Math.sqrt(3)*voltage) : (value*1000)/voltage;
  if (load.inputType === 'kW') return isThreePhase() ? (value*1000)/(Math.sqrt(3)*voltage*pf*eff) : (value*1000)/(voltage*pf*eff);
  return '';
}
function kwForLoad(load){
  const value = Number(load.value), pf = Number(state.powerFactor), eff = effectiveEfficiency(), voltage = Number(state.voltage);
  if (!value || !pf || !eff || !load.inputType) return '';
  if (load.inputType === 'kW') return value;
  if (load.inputType === 'kVA') return value*pf*eff;
  if (load.inputType === 'A') return (isThreePhase() ? Math.sqrt(3)*voltage*value/1000 : voltage*value/1000) * pf * eff;
  return '';
}
function kvaForLoad(load){
  const value = Number(load.value), pf = Number(state.powerFactor), eff = effectiveEfficiency(), voltage = Number(state.voltage);
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
  const totalCurrent = getLoadSummary().totalCurrent;
  const ratio = Number(state.breakerMarginRatio || 0.8);
  const basis = ratio ? totalCurrent / ratio : totalCurrent;
  return BREAKER_SIZES.find(v=>v>=basis) || BREAKER_SIZES.at(-1);
}
function existingBreakerForSizing(){ return Number(state.existingBreaker || 0); }
function adoptedBreaker(){ return recommendedBreakerFromMargin(); }
function capacityKwForBreaker(breaker){
  const voltage = Number(state.voltage || 0), pf = Number(state.powerFactor || 0), eff = effectiveEfficiency(), current = Number(breaker || 0);
  if (!voltage || !pf || !eff || !current) return 0;
  return isThreePhase() ? Math.sqrt(3)*voltage*current*pf*eff/1000 : voltage*current*pf*eff/1000;
}
function marginForBreaker(breaker, loadSummary=getLoadSummary()){
  const current = Number(breaker || 0);
  if (!current) return {percent:0, capacityKW:0};
  return {
    percent: ((current - loadSummary.totalCurrent) / current) * 100,
    capacityKW: capacityKwForBreaker(current) - loadSummary.totalKW
  };
}
function cableSelectionBasisDisplayName(){
  return state.calcMode === 'existing' ? '既設開閉器' : '推奨開閉器';
}
function cableSelectionBasisMarginLabel(){
  return `${cableSelectionBasisDisplayName()}裕度 [%]`;
}
function cableSelectionBasisCapacityLabel(){
  return `${cableSelectionBasisDisplayName()}容量裕度 [kW]`;
}
function cableSelectionBasisCurrent(){
  return state.calcMode === 'existing' ? existingBreakerForSizing() : adoptedBreaker();
}
function sizingCurrentBase(){ return cableSelectionBasisCurrent(); }

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
function getDropLimitPercent(result=null){
  const value = Number(result?.voltageDropLimitPercent || state.voltageDropLimitPercent || DEFAULT_DROP_LIMIT_PERCENT);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_DROP_LIMIT_PERCENT;
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
  const dropLimit = getDropLimitPercent();
  return {type, size:Number(size), info, basis, corrected, drop, dropBasisCurrent, dropLimit, currentOk:corrected>=breakerCurrent, dropOk:drop.dropPercent<=dropLimit};
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
  const ratioDrop = candidate.drop.dropPercent / getDropLimitPercent();
  return ratioDrop > ratioCurrent ? '電圧降下' : state.calcMode === 'existing' ? '既設開閉器条件' : '許容電流';
}
function allSelectionReasons(candidate){
  if (!candidate) return [];
  const reasons = ['許容電流'];
  if (candidate.drop.dropPercent >= getDropLimitPercent() * 0.7) reasons.push('電圧降下');
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
  if (selectedCableTypeFromState() === 'CV-1C') notes.push(`CV-1C単心選定では、電源方式に応じた必要本数（${coreCountForPowerSystem()}本）を質量・ラック幅に反映しています。相識別、端末処理、固定方法、離隔を確認してください。`);
  if (state.calcMode === 'existing') notes.push('既設主幹指定時は遮断容量、保護協調、既設整定値、負荷側保護装置との協調を確認してください。');
  notes.push('端末処理、圧着端子サイズ、盤内曲げスペース、離隔、相順、絶縁抵抗測定を施工前後で確認してください。');
  if (isLightingCalc()) notes.push('照明・コンセント系負荷では分岐回路数、負荷バランス、中性線電流、点滅・制御方式、将来増設を確認してください。');
  else notes.push('動力負荷では始動方式、始動電流、過負荷保護、インバータ有無、サーマル整定を確認してください。');
  notes.push('接地種別・接地線サイズは電圧区分と開閉器容量からの参考選定です。接地対象、地絡遮断装置、共用/専用接地、現場仕様を確認してください。');
  notes.push('概算質量・外径・許容電流は参考値です。最終値は仕様書、内線規程、現場仕様で確認してください。');
  return [...new Set(notes)];
}
function rootMemo(){
  const notes = ['参考値を使用しています。','最終判断は現場条件・法令・仕様を確認してください。'];
  notes.push(`推奨開閉器は、合計電流÷${state.breakerMarginRatio || '0.8'}を基準に選定しています。`);
  if (state.calcMode === 'existing') notes.push('既設開閉器容量は、推奨開閉器とは別にケーブル選定基準として扱います。');
  notes.push(`ケーブル選定基準は ${cableSelectionBasisLabel()} です。`);
  notes.push(`電圧降下判定基準は ${getDropLimitPercent().toFixed(1)}%以下です。`);
  notes.push('接地種別は入力電圧からC種/D種等を推定し、図面記号（EC/ED等）と分けて表示します。接地線サイズは各選定ページの開閉器容量を基準に参考表示します。');
  if (state.calcMode === 'existing') notes.push('既設開閉器指定時の電圧降下は、実負荷電流と既設開閉器容量の大きい方を基準電流として保守的に判定します。');
  else notes.push('既設主幹容量を基準に判定する場合は、計算方式を「既設開閉器指定」に変更してください。');
  notes.push('技術資料タブの基準条件を参照してください。');
  if (selectedCableTypeFromState() === 'CV-1C') notes.push(`CV-1Cは単心1本のデータを基に、${coreCountForPowerSystem()}本構成として概算質量・ラック幅を表示しています。`);
  if (state.cableSizingMode === 'manual') notes.push('手動判定ケーブルサイズを指定して判定しています。');
  if (state.ampacityMode === 'manual') notes.push('基準許容電流は手動入力値を採用しています。');
  return notes;
}

function missingFields(){
  const missing = [];
  const pushIf = (condition, label, id) => { if (condition) missing.push({label,id}); };
  pushIf(!state.calcMode, '計算方式を選択してください。', 'calcMode');
  pushIf(!state.powerSystem, '電源方式を選択してください。', 'powerSystem');
    pushIf(!state.voltage || Number(state.voltage) <= 0, isCustomVoltage() ? '任意電圧を入力してください。' : '電圧を選択してください。', isCustomVoltage() ? 'voltageCustom' : 'voltage');
  pushIf(!state.powerFactor, '力率を選択してください。', 'powerFactor');
  if (!isLightingCalc()) pushIf(!state.efficiency, '効率を選択してください。', 'efficiency');
  pushIf(!state.wiringLength, '配線長を入力してください。', 'wiringLength');
  if (state.calcMode === 'existing') pushIf(!state.existingBreaker, '既設開閉器を選択してください。', 'existingBreaker');
  if (state.calcMode !== 'existing') pushIf(!state.breakerMarginRatio, '開閉器裕度設定を選択してください。', 'breakerMarginRatio');
  pushIf(!state.loadCount, '負荷数を選択してください。', 'loadCount');
  pushIf(!selectedCableTypeFromState(), 'ケーブル種類を選択してください。', 'cableType');
  const cableCompatMessage = cableTypeCompatibilityMessage();
  pushIf(!!cableCompatMessage, cableCompatMessage, 'cableType');
  pushIf(!state.cableSizingMode, 'ケーブルサイズ選定を選択してください。', 'cableSizingMode');
  if (state.cableSizingMode === 'manual') {
    pushIf(!state.cableSize, '手動判定ケーブルサイズを選択してください。', 'cableSize');
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

function calculate(options={}){
  const {recordHistory=true, scrollResult=true} = options || {};
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
  const cableBasisCurrent = cableSelectionBasisCurrent();
  const cableBasisLabel = cableSelectionBasisLabel();
  const requiredSelection = cableSelectionForBreaker(requiredBreaker);
  const recommendedSelection = cableSelectionForBreaker(recommendedBreaker);
  const basisSelection = cableBasisCurrent ? cableSelectionForBreaker(cableBasisCurrent) : null;
  const requiredCandidate = requiredSelection?.valid || requiredSelection?.candidates.at(-1) || null;
  const recommendedCandidate = recommendedSelection?.valid || recommendedSelection?.candidates.at(-1) || null;
  const basisCandidate = basisSelection?.valid || basisSelection?.candidates.at(-1) || null;
  const manualCandidate = state.cableSize ? cableCandidateBySize(cableBasisCurrent || recommendedBreaker, Number(state.cableSize)) : null;
  const cableSizingMode = state.cableSizingMode || 'auto';
  const candidate = cableSizingMode === 'manual' ? manualCandidate : basisCandidate;
  const breakdown = getCorrectionBreakdown();
  const basis = candidate?.basis || 0;
  const corrected = candidate?.corrected || 0;
  const drop = candidate?.drop || {dropV:0, dropPercent:0};
  const dropLimit = getDropLimitPercent();
  const breakerOk = state.calcMode === 'existing' ? (cableBasisCurrent >= requiredBreaker) : (recommendedBreaker >= requiredBreaker);
  const currentOk = candidate ? corrected >= cableBasisCurrent : false;
  const dropOk = candidate ? drop.dropPercent <= dropLimit : false;
  const failReasons = [];
  if (!currentOk) failReasons.push(`指定ケーブル許容電流不足（ケーブル選定基準電流 ${formatNumber(cableBasisCurrent,1)}A / 指定ケーブル補正後許容 ${formatNumber(corrected,1)}A）`);
  if (!breakerOk) failReasons.push(state.calcMode === 'existing' ? `既設開閉器容量不足（必要 ${requiredBreaker}A / 既設 ${cableBasisCurrent}A）` : `開閉器容量不足（必要 ${requiredBreaker}A / 推奨 ${recommendedBreaker}A）`);
  if (!dropOk) failReasons.push(`電圧降下超過（${formatNumber(drop.dropPercent,2)}% / 許容 ${dropLimit.toFixed(1)}%）`);
  const recommendedMargin = marginForBreaker(recommendedBreaker, loadSummary);
  const basisMargin = marginForBreaker(cableBasisCurrent, loadSummary);
  const breakerMarginPercent = recommendedMargin.percent;
  const capacityMarginKW = recommendedMargin.capacityKW;
  const activeMetrics = cableMetrics(candidate);
  const massKgM = activeMetrics.massKgM || 0;
  const totalMass = activeMetrics.massTotalKg || 0;
  const requiredMetrics = cableMetrics(requiredCandidate);
  const recommendedMetrics = cableMetrics(recommendedCandidate);
  const basisMetrics = cableMetrics(basisCandidate);
  const requiredGround = groundSelectionForBreaker(requiredBreaker, `必要最小開閉器 ${requiredBreaker || '-'}A基準`);
  const recommendedGround = groundSelectionForBreaker(recommendedBreaker, `推奨開閉器 ${recommendedBreaker || '-'}A基準`);
  const basisGround = groundSelectionForBreaker(cableBasisCurrent, state.calcMode === 'existing' ? `既設開閉器 ${cableBasisCurrent || '-'}A基準` : `推奨開閉器 ${cableBasisCurrent || '-'}A基準`);
  const result = {
    calculatedAt:new Date().toISOString(), mode:state.calcMode, calculationType:state.calculationType, loadPurpose:loadPurposeLabel(),
    projectName:state.projectName || '', projectType:state.projectType || '', submitTo:state.submitTo || '', drawingNo:state.drawingNo || '', author:state.author || '', createdAt:state.createdAt || '', projectRemarks:state.projectRemarks || '', powerSystem:state.powerSystem || '', voltage:state.voltage || '',
    totalCurrent:loadSummary.totalCurrent, totalKW:loadSummary.totalKW, totalKVA:loadSummary.totalKVA,
    requiredBreaker, adoptedBreaker:recommendedBreaker, breakerMarginRatio:state.breakerMarginRatio || '0.8',
    recommendedBreakerMarginPercent:recommendedMargin.percent, recommendedCapacityMarginKW:recommendedMargin.capacityKW,
    basisBreakerMarginPercent:basisMargin.percent, basisCapacityMarginKW:basisMargin.capacityKW,
    breakerMarginPercent:recommendedMargin.percent, capacityMarginKW:recommendedMargin.capacityKW,
    voltageDropLimitPercent:dropLimit,
    cableSelectionBasisCurrent:cableBasisCurrent, cableSelectionBasisLabel:cableBasisLabel, cableSelectionBasisName:cableSelectionBasisDisplayName(),
    cableSelectionBasisMarginLabel:cableSelectionBasisMarginLabel(), cableSelectionBasisCapacityLabel:cableSelectionBasisCapacityLabel(),
    voltageDropV:drop.dropV, voltageDropPercent:drop.dropPercent, voltageDropBasisCurrent:candidate?.dropBasisCurrent || 0,
    baseAmpacity:basis, correctedAmpacity:corrected, cableType:selectedCableTypeFromState(), cableSize:candidate?.size || state.cableSize,
    cableSizingMode,
    basisCableType:selectedCableTypeFromState(), basisCableSize:basisCandidate?.size || '', basisCableCorrectedAmpacity:basisCandidate?.corrected || 0, basisCableVoltageDropV:basisCandidate?.drop?.dropV || 0, basisCableVoltageDropPercent:basisCandidate?.drop?.dropPercent || 0, basisCableDropBasisCurrent:basisCandidate?.dropBasisCurrent || 0, basisCableMassKgM:basisMetrics.massKgM, basisCableMassTotalKg:basisMetrics.massTotalKg, basisCableRackWidth:basisMetrics.rackWidth, basisGround,
    requiredMinCableType:selectedCableTypeFromState(), requiredMinCableSize:requiredCandidate?.size || '', requiredMinCableCorrectedAmpacity:requiredCandidate?.corrected || 0, requiredMinCableVoltageDropV:requiredCandidate?.drop?.dropV || 0, requiredMinCableVoltageDropPercent:requiredCandidate?.drop?.dropPercent || 0, requiredMinCableDropBasisCurrent:requiredCandidate?.dropBasisCurrent || 0, requiredMinCableMassKgM:requiredMetrics.massKgM, requiredMinCableMassTotalKg:requiredMetrics.massTotalKg, requiredMinCableRackWidth:requiredMetrics.rackWidth, requiredMinGround:requiredGround,
    recommendedCableType:selectedCableTypeFromState(), recommendedCableSize:recommendedCandidate?.size || '', recommendedCableCorrectedAmpacity:recommendedCandidate?.corrected || 0, recommendedCableVoltageDropV:recommendedCandidate?.drop?.dropV || 0, recommendedCableVoltageDropPercent:recommendedCandidate?.drop?.dropPercent || 0, recommendedCableDropBasisCurrent:recommendedCandidate?.dropBasisCurrent || 0, recommendedCableMassKgM:recommendedMetrics.massKgM, recommendedCableMassTotalKg:recommendedMetrics.massTotalKg, recommendedCableRackWidth:recommendedMetrics.rackWidth, recommendedGround,
    correctionBreakdown:breakdown, reasons:allSelectionReasons(candidate), mainFactor:primaryFactor(candidate), failReasons, judgement:failReasons.length ? '否' : '良',
    existingBreaker:state.calcMode === 'existing' ? (state.existingBreaker || '') : '', existingBreakerJudge:state.calcMode === 'existing' ? (breakerOk ? '適合' : '否') : '-', cableJudge:currentOk && dropOk ? '適合' : '否',
    rackWidth:activeMetrics.rackWidth || '-', massKgM, massTotalKg:totalMass,
    constructionNotes:constructionNotes(totalMass), rootMemo:rootMemo(), loadDetails:loadSummary.list
  };
  state.lastResult = result;
  if (recordHistory) {
    historyItems.unshift({id:crypto.randomUUID(), title:`低圧幹線計算_${loadPurposeLabel()}_${new Date().toLocaleString('sv-SE').replace(/[: ]/g,'_')}`, memo:'', savedAt:new Date().toISOString(), input:structuredClone(state), result:structuredClone(result), calculationMode:state.calcMode, versions:structuredClone(VERSIONS)});
    historyItems = historyItems.slice(0,50);
  }
  persistState();
  $('resultPanel').classList.remove('hidden');
  $('resultBody').classList.remove('hidden');
  updateResultError('');
  renderResult();
  renderSaved();
  if (scrollResult) setTimeout(()=>$('resultPanel').scrollIntoView({behavior:'smooth', block:'start'}),0);
}

function statusSpan(text){
  if (text === '適合' || text === '良') return `<span class="status-ok">${escapeHtml(text)}</span>`;
  if (text === '否') return `<span class="status-ng">${escapeHtml(text)}</span>`;
  return `<span class="muted">${escapeHtml(text || '-')}</span>`;
}
function cableLabel(type, size){
  if (!type && !size) return '-';
  const name = type === 'CV-1C' ? `CV-1C ${size ? `${size}sq` : '-' } ×${coreCountForPowerSystem()}本` : `${type || '-'} ${size ? `${size}sq` : '-'}`;
  return name;
}
function cableMetrics(candidate){
  const info = candidate?.info || null;
  const type = candidate?.type || selectedCableTypeFromState();
  const coreCount = cableCoreCount(type);
  const massKgMPerCoreOrCable = info?.massKgKm ? Number(info.massKgKm) / 1000 : 0;
  const massKgM = massKgMPerCoreOrCable * coreCount;
  const wiringLength = Number(state.wiringLength || 0);
  const parallel = Number(state.parallelCount || 1);
  const totalRunCount = coreCount * parallel;
  const massTotalKg = massKgMPerCoreOrCable && wiringLength ? massKgMPerCoreOrCable * wiringLength * totalRunCount : 0;
  const rackWidth = info?.outerDiameter ? rackWidthFor(Number(info.outerDiameter), totalRunCount) : '-';
  return { massKgM, massTotalKg, rackWidth, coreCount, totalRunCount };
}

function groundKindForVoltage(voltage){
  const v = Number(voltage || 0);
  if (!v) return {kind:'', symbol:'', label:'-', resistance:'-', autoTrip:'-', reason:'電圧未入力のため接地種別を推定できません。', note:'電圧未入力のため接地種別を推定できません。'};
  if (v <= 300) return {kind:'D種', symbol:'ED', label:'D種接地工事', resistance:'100Ω以下', autoTrip:'0.5秒以内自動遮断時：500Ω以下可', reason:`入力電圧${v}Vが300V以下の低圧回路のため。`, note:'300V以下の低圧機械器具外箱等の代表選定です。'};
  if (v <= 600) return {kind:'C種', symbol:'EC', label:'C種接地工事', resistance:'10Ω以下', autoTrip:'0.5秒以内自動遮断時：500Ω以下可', reason:`入力電圧${v}Vが300Vを超える低圧回路のため。`, note:'300V超過の低圧機械器具外箱等の代表選定です。'};
  return {kind:'A種', symbol:'EA', label:'A種接地工事又は高圧側要確認', resistance:'10Ω以下目安', autoTrip:'設備区分により要確認', reason:`入力電圧${v}Vが低圧範囲を超える可能性があるため。`, note:'低圧範囲外の可能性があるため、高圧/特別高圧の設備区分で確認してください。'};
}
function groundWireSizeFor(kind, breaker, wireType='IV'){
  const current = Number(breaker || 0);
  if (!kind || !current) return '';
  const rules = GROUND_RULES.filter(v=>v.groundType === kind && v.wireType === wireType).sort((a,b)=>a.maxBreaker-b.maxBreaker);
  const rule = rules.find(v=>current <= Number(v.maxBreaker || 0)) || rules.at(-1);
  return rule?.size || '';
}
function groundSelectionForBreaker(breaker, basisLabel=''){
  const current = Number(breaker || 0);
  const ground = groundKindForVoltage(Number(state.voltage || 0));
  const wireType = 'IV';
  const size = groundWireSizeFor(ground.kind, current, wireType);
  return {
    type: ground.kind,
    symbol: ground.symbol,
    label: ground.label,
    resistance: ground.resistance,
    autoTrip: ground.autoTrip,
    wireSize: size ? `${size}候補` : '要確認',
    basisBreaker: current,
    basisLabel: basisLabel || (current ? `${current}A基準` : '要確認'),
    wireType: `${wireType}相当`,
    selectionReason: ground.reason,
    note: ground.note
  };
}

function setTextIfExists(id, value){ const el = $(id); if (el) el.textContent = value; }
function setHtmlIfExists(id, value){ const el = $(id); if (el) el.innerHTML = value; }
function renderNoteList(id, notes){
  const root = $(id);
  if (!root) return;
  root.innerHTML = '';
  (notes || []).forEach(note=>{
    const div = document.createElement('div');
    div.className = 'readonly-box compact-box';
    div.innerHTML = `<strong class="muted">${escapeHtml(note)}</strong>`;
    root.appendChild(div);
  });
}
function calculationModeLabel(result){
  return result?.mode === 'existing' ? '既設開閉器指定' : '自動選定';
}
function calculationModeDescription(result){
  const purpose = result?.loadPurpose || loadPurposeLabel(result?.calculationType);
  const powerSystem = result?.powerSystem || state.powerSystem || '-';
  if (result?.mode === 'existing') return `負荷用途：${purpose} / 電源方式：${powerSystem}。推奨側とは別に既設開閉器 ${formatNumber(result.cableSelectionBasisCurrent || 0,0)}A をケーブル選定基準として判定しています。`;
  return `負荷用途：${purpose} / 電源方式：${powerSystem}。合計電流と開閉器裕度設定から推奨開閉器 ${formatNumber(result?.adoptedBreaker || 0,0)}A を算出し、その条件を基準に判定しています。`;
}
function branchJudgeHtml(ok){ return statusSpan(ok ? '良' : '否'); }
function branchConstructionNotes(branch, result){
  const notes = [];
  if (branch === 'min') {
    notes.push('必要最小は合計電流以上となる最小条件です。裕度が小さいため、実施工では推奨条件または既設条件も併せて確認してください。');
    notes.push('将来増設、始動電流、保護協調、盤内余裕を見込む場合は、必要最小だけで判断しないでください。');
  } else if (branch === 'recommended') {
    notes.push(`推奨は合計電流÷${result?.breakerMarginRatio || '0.8'}を基準に標準開閉器へ丸めた条件です。通常の比較基準として確認してください。`);
    notes.push('推奨ケーブルは推奨開閉器容量に見合う許容電流と電圧降下で選定しています。');
    if (resultMinSameAsRecommended(result)) notes.push('推奨選定と最小選定が同一のため、最小選定ページは省略しています。');
  } else {
    if (result?.mode === 'existing') {
      notes.push('既設は入力した既設開閉器容量を基準に、ケーブル許容電流・電圧降下を保守的に確認する条件です。');
      notes.push('既設開閉器を流用する場合は、遮断容量、保護協調、既設整定値、負荷側保護装置との協調を確認してください。');
    } else {
      notes.push('自動選定モードでは既設開閉器を基準にしていません。既設主幹容量を基準に確認する場合は、計算方式を「既設開閉器指定」に変更してください。');
    }
  }
  const common = (result?.constructionNotes || []).filter(note=>!notes.includes(note));
  return [...notes, ...common];
}

function resultMinSameAsRecommended(result){
  if (!result) return false;
  const sameBreaker = Number(result.requiredBreaker || 0) === Number(result.adoptedBreaker || 0);
  const sameType = String(result.requiredMinCableType || result.cableType || '') === String(result.recommendedCableType || result.cableType || '');
  const sameSize = Number(result.requiredMinCableSize || 0) === Number(result.recommendedCableSize || 0);
  const sameDrop = Math.abs(Number(result.requiredMinCableVoltageDropPercent || 0) - Number(result.recommendedCableVoltageDropPercent || 0)) < 0.01;
  const sameAmpacity = Math.abs(Number(result.requiredMinCableCorrectedAmpacity || 0) - Number(result.recommendedCableCorrectedAmpacity || 0)) < 0.1;
  return sameBreaker && sameType && sameSize && sameDrop && sameAmpacity;
}
function resultPageCount(result){
  const sameMinRec = resultMinSameAsRecommended(result);
  if (result?.mode === 'existing') return sameMinRec ? 2 : 3;
  return sameMinRec ? 1 : 2;
}
function showBranchDetailNotes(result){
  const sameMinRec = resultMinSameAsRecommended(result);
  const recNotice = $('resRecSameAsMinNotice');
  if (recNotice) {
    recNotice.classList.toggle('hidden', !sameMinRec);
    recNotice.textContent = sameMinRec ? '最小選定結果と同一です。必要最小開閉器・必要最小ケーブルは、推奨選定と同じ条件になるため、最小選定ページは省略しています。' : '';
  }
}

function applyResultPageOrder(result){
  const pages = $('resResultPages');
  const minCard = $('resMinPageCard');
  const recCard = $('resRecPageCard');
  const existingCard = $('resExistingPageCard');
  const orderLabel = $('resPagesOrderLabel');
  const isExisting = result?.mode === 'existing';
  const sameMinRec = resultMinSameAsRecommended(result);
  const totalPages = resultPageCount(result);

  setTextIfExists('resMinPageTitle', '最小選定結果');
  setTextIfExists('resRecPageTitle', '推奨選定結果');
  setTextIfExists('resExistingPageTitle', '既設選定結果');

  if (existingCard) existingCard.classList.toggle('hidden', !isExisting);
  if (minCard) minCard.classList.toggle('hidden', sameMinRec);

  if (isExisting) {
    if (existingCard) existingCard.style.order = '1';
    if (recCard) recCard.style.order = '2';
    if (minCard) minCard.style.order = sameMinRec ? '3' : '3';
    setTextIfExists('resExistingPageBadge', `1 / ${totalPages}`);
    setTextIfExists('resRecPageBadge', `2 / ${totalPages}`);
    if (!sameMinRec) setTextIfExists('resMinPageBadge', `3 / ${totalPages}`);
    if (orderLabel) orderLabel.textContent = sameMinRec ? '横スクロール：既設選定 → 推奨選定' : '横スクロール：既設選定 → 推奨選定 → 最小選定';
  } else {
    if (recCard) recCard.style.order = '1';
    if (minCard) minCard.style.order = '2';
    setTextIfExists('resRecPageBadge', `1 / ${totalPages}`);
    if (!sameMinRec) setTextIfExists('resMinPageBadge', `2 / ${totalPages}`);
    if (orderLabel) orderLabel.textContent = sameMinRec ? '横スクロール：推奨選定のみ' : '横スクロール：推奨選定 → 最小選定';
  }

  showBranchDetailNotes(result);
  if (pages) {
    pages.setAttribute('aria-label', isExisting ? (sameMinRec ? '既設・推奨の選定結果' : '既設・推奨・最小の選定結果') : (sameMinRec ? '推奨選定結果' : '推奨・最小の選定結果'));
    const modeKey = `${isExisting ? 'existing' : 'auto'}-${sameMinRec ? 'same' : 'split'}`;
    if (pages.dataset.resultMode !== modeKey) {
      pages.dataset.resultMode = modeKey;
      requestAnimationFrame(()=>{ pages.scrollLeft = 0; });
    }
  }
}

function renderResult(){
  const r = state.lastResult;
  if (!r) return;
  setTextIfExists('resCalcModeLabel', calculationModeLabel(r));
  setTextIfExists('resCalcModeDescription', calculationModeDescription(r));
  applyResultPageOrder(r);
  setTextIfExists('resExistingPageDescription', r.mode === 'existing' ? '既設開閉器容量を基準にケーブル許容電流・電圧降下を確認します。' : '自動選定モードでは既設開閉器を判定基準にしていません。既設主幹容量を基準にする場合は、計算方式を「既設開閉器指定」に変更してください。');
  $('resLoadCount').textContent = String(state.loads.length || 0);
  $('resTotalKW').textContent = formatNumber(r.totalKW,3);
  $('resTotalKVA').textContent = formatNumber(r.totalKVA,3);
  $('resTotalCurrent').textContent = formatNumber(r.totalCurrent,2);
  setTextIfExists('resDropSummaryCommon', `${formatNumber(r.voltageDropV,2)}V / ${formatNumber(r.voltageDropPercent,2)}% / 判定基準 ${getDropLimitPercent(r).toFixed(1)}%以下`);
  setTextIfExists('resMinSelectionBasis', '必要最小開閉器基準');
  setTextIfExists('resMinBasisCurrent', r.requiredBreaker ? `${formatNumber(r.requiredBreaker,0)}A` : '-');
  setTextIfExists('resMinDropLimit', `${getDropLimitPercent(r).toFixed(1)}%以下`);
  setTextIfExists('resMinMainFactor', (r.requiredMinCableVoltageDropPercent || 0) > getDropLimitPercent(r) ? '電圧降下' : '必要最小開閉器容量');
  setTextIfExists('resRecSelectionBasis', '推奨開閉器基準');
  setTextIfExists('resRecBasisCurrent', r.adoptedBreaker ? `${formatNumber(r.adoptedBreaker,0)}A` : '-');
  setTextIfExists('resRecDropLimit', `${getDropLimitPercent(r).toFixed(1)}%以下`);
  setTextIfExists('resRecMainFactor', (r.recommendedCableVoltageDropPercent || 0) > getDropLimitPercent(r) ? '電圧降下' : '推奨開閉器容量');
  $('resRequiredBreaker').textContent = r.requiredBreaker ? `${r.requiredBreaker}A` : '-';
  $('resAdoptedBreaker').textContent = r.adoptedBreaker ? `${r.adoptedBreaker}A` : '-';
  if ($('resAdoptedBreaker2')) $('resAdoptedBreaker2').textContent = r.adoptedBreaker ? `${r.adoptedBreaker}A` : '-';
  const basisLabel = r.cableSelectionBasisLabel || (r.mode === 'existing' ? `既設開閉器 ${r.cableSelectionBasisCurrent || '-'}A 基準` : `推奨開閉器 ${r.adoptedBreaker || '-'}A 基準`);
  const basisCurrent = r.cableSelectionBasisCurrent || r.adoptedBreaker || 0;
  if ($('resCableBasisMode')) $('resCableBasisMode').textContent = basisLabel;
  if ($('resCableBasisCurrent')) $('resCableBasisCurrent').textContent = basisCurrent ? `${formatNumber(basisCurrent,0)}A` : '-';
  if ($('resCableBasisMode2')) $('resCableBasisMode2').textContent = basisLabel;
  if ($('resCableBasisCurrent2')) $('resCableBasisCurrent2').textContent = basisCurrent ? `${formatNumber(basisCurrent,0)}A` : '-';
  const notice = $('resBasisNotice');
  if (notice) { notice.textContent = cableSelectionBasisNotice(r); notice.classList.remove('hidden'); }
  $('resRequiredMinCable').textContent = cableLabel(r.requiredMinCableType || r.cableType, r.requiredMinCableSize);
  $('resRecommendedCable').textContent = cableLabel(r.recommendedCableType || r.cableType, r.recommendedCableSize);
  $('resSelectedCable').textContent = cableLabel(r.basisCableType || r.cableType, r.basisCableSize || r.cableSize);
  $('resDropV').textContent = formatNumber(r.voltageDropV,2);
  $('resDropPct').textContent = formatNumber(r.voltageDropPercent,2);
  if ($('resRecommendedBreakerMargin')) $('resRecommendedBreakerMargin').textContent = formatNumber(r.recommendedBreakerMarginPercent ?? r.breakerMarginPercent,2);
  if ($('resRecommendedCapacityMargin')) $('resRecommendedCapacityMargin').textContent = formatNumber(r.recommendedCapacityMarginKW ?? r.capacityMarginKW,2);
  const basisMarginCard = $('resBasisMarginCard');
  const basisCapacityCard = $('resBasisCapacityCard');
  const showBasisMargin = r.mode === 'existing' && Number(r.cableSelectionBasisCurrent || 0);
  if (basisMarginCard) basisMarginCard.classList.toggle('hidden', !showBasisMargin);
  if (basisCapacityCard) basisCapacityCard.classList.toggle('hidden', !showBasisMargin);
  if ($('resBasisMarginLabel')) $('resBasisMarginLabel').textContent = r.cableSelectionBasisMarginLabel || '選定基準裕度 [%]';
  if ($('resBasisCapacityLabel')) $('resBasisCapacityLabel').textContent = r.cableSelectionBasisCapacityLabel || '選定基準容量裕度 [kW]';
  if ($('resBasisBreakerMargin')) $('resBasisBreakerMargin').textContent = formatNumber(r.basisBreakerMarginPercent ?? r.breakerMarginPercent,2);
  if ($('resBasisCapacityMargin')) $('resBasisCapacityMargin').textContent = formatNumber(r.basisCapacityMarginKW ?? r.capacityMarginKW,2);
  if ($('resBreakerMargin')) $('resBreakerMargin').textContent = formatNumber(r.recommendedBreakerMarginPercent ?? r.breakerMarginPercent,2);
  if ($('resCapacityMargin')) $('resCapacityMargin').textContent = formatNumber(r.recommendedCapacityMarginKW ?? r.capacityMarginKW,2);
  $('resMainFactor').textContent = r.mainFactor || '-';
  const judge = $('resJudgement');
  judge.textContent = r.judgement;
  judge.className = `judgement ${r.judgement === '良' ? 'good' : 'bad'}`;
  setHtmlIfExists('resExistingBreaker', r.existingBreaker ? `${escapeHtml(r.existingBreaker)}A` : '-');
  if ($('resRequiredBreaker2')) $('resRequiredBreaker2').innerHTML = r.requiredBreaker ? `${r.requiredBreaker}A` : '-';
  setHtmlIfExists('resExistingBreakerJudge', statusSpan(r.existingBreakerJudge));
  setHtmlIfExists('resCableJudge', statusSpan(r.cableJudge));
  $('resBaseAmpacity').textContent = formatNumber(r.baseAmpacity,2);
  $('resFinalCoef').textContent = formatNumber(r.correctionBreakdown?.final,3);
  $('resCorrectedAmpacity').textContent = formatNumber(r.correctedAmpacity,2);
  $('resAdoptedCable2').textContent = cableLabel(r.cableType, r.cableSize);
  $('resReasons').textContent = r.reasons?.length ? r.reasons.join('、') : '-';
  $('resDropLimit').textContent = `${getDropLimitPercent(r).toFixed(1)}%以下`;
  if ($('resDropBasisCurrent')) $('resDropBasisCurrent').textContent = formatNumber(r.voltageDropBasisCurrent,2);
  setTextIfExists('resMinCorrectedAmpacity', formatNumber(r.requiredMinCableCorrectedAmpacity,2));
  setTextIfExists('resMinDropPct', formatNumber(r.requiredMinCableVoltageDropPercent,2));
  setTextIfExists('resMinMassKgM', r.requiredMinCableMassKgM ? formatNumber(r.requiredMinCableMassKgM,3) : '-');
  setTextIfExists('resMinMassTotalKg', r.requiredMinCableMassTotalKg ? formatNumber(r.requiredMinCableMassTotalKg,2) : '-');
  setTextIfExists('resMinRackWidth', r.requiredMinCableRackWidth || '-');
  setTextIfExists('resMinGroundType', r.requiredMinGround?.label || '-');
  setTextIfExists('resMinGroundSymbol', r.requiredMinGround?.symbol || '-');
  setTextIfExists('resMinGroundReason', r.requiredMinGround?.selectionReason || '-');
  setTextIfExists('resMinGroundResistance', r.requiredMinGround?.resistance || '-');
  setTextIfExists('resMinGroundWireSize', r.requiredMinGround?.wireSize || '-');
  setTextIfExists('resMinGroundBasis', r.requiredMinGround?.basisLabel || '-');
  setHtmlIfExists('resMinJudge', branchJudgeHtml((r.requiredMinCableCorrectedAmpacity || 0) >= (r.requiredBreaker || 0) && (r.requiredMinCableVoltageDropPercent || 0) <= getDropLimitPercent(r)));
  setTextIfExists('resRecCorrectedAmpacity', formatNumber(r.recommendedCableCorrectedAmpacity,2));
  setTextIfExists('resRecDropPct', formatNumber(r.recommendedCableVoltageDropPercent,2));
  setTextIfExists('resRecMassKgM', r.recommendedCableMassKgM ? formatNumber(r.recommendedCableMassKgM,3) : '-');
  setTextIfExists('resRecMassTotalKg', r.recommendedCableMassTotalKg ? formatNumber(r.recommendedCableMassTotalKg,2) : '-');
  setTextIfExists('resRecRackWidth', r.recommendedCableRackWidth || '-');
  setTextIfExists('resRecGroundType', r.recommendedGround?.label || '-');
  setTextIfExists('resRecGroundSymbol', r.recommendedGround?.symbol || '-');
  setTextIfExists('resRecGroundReason', r.recommendedGround?.selectionReason || '-');
  setTextIfExists('resRecGroundResistance', r.recommendedGround?.resistance || '-');
  setTextIfExists('resRecGroundWireSize', r.recommendedGround?.wireSize || '-');
  setTextIfExists('resRecGroundBasis', r.recommendedGround?.basisLabel || '-');
  setTextIfExists('resBasisMassKgM', r.basisCableMassKgM ? formatNumber(r.basisCableMassKgM,3) : '-');
  setTextIfExists('resBasisMassTotalKg', r.basisCableMassTotalKg ? formatNumber(r.basisCableMassTotalKg,2) : '-');
  setTextIfExists('resBasisRackWidth', r.basisCableRackWidth || '-');
  setTextIfExists('resBasisGroundType', r.basisGround?.label || '-');
  setTextIfExists('resBasisGroundSymbol', r.basisGround?.symbol || '-');
  setTextIfExists('resBasisGroundReason', r.basisGround?.selectionReason || '-');
  setTextIfExists('resBasisGroundResistance', r.basisGround?.resistance || '-');
  setTextIfExists('resBasisGroundWireSize', r.basisGround?.wireSize || '-');
  setTextIfExists('resBasisGroundBasis', r.basisGround?.basisLabel || '-');
  setHtmlIfExists('resRecJudge', branchJudgeHtml((r.recommendedCableCorrectedAmpacity || 0) >= (r.adoptedBreaker || 0) && (r.recommendedCableVoltageDropPercent || 0) <= getDropLimitPercent(r)));
  renderNoteList('resMinConstructionNotes', branchConstructionNotes('min', r));
  renderNoteList('resRecConstructionNotes', branchConstructionNotes('recommended', r));
  renderNoteList('resBasisConstructionNotes', branchConstructionNotes('basis', r));
  if (r.mode !== 'existing') {
    setTextIfExists('resCableBasisMode', '既設開閉器未指定');
    setTextIfExists('resCableBasisCurrent', '-');
    setTextIfExists('resSelectedCable', '-');
    setTextIfExists('resBasisMassKgM', '-');
    setTextIfExists('resBasisMassTotalKg', '-');
    setTextIfExists('resBasisRackWidth', '-');
    setTextIfExists('resBasisGroundType', '-');
    setTextIfExists('resBasisGroundSymbol', '-');
    setTextIfExists('resBasisGroundReason', '-');
    setTextIfExists('resBasisGroundResistance', '-');
    setTextIfExists('resBasisGroundWireSize', '-');
    setTextIfExists('resBasisGroundBasis', '-');
    setTextIfExists('resExistingBreaker', '-');
    setHtmlIfExists('resExistingBreakerJudge', statusSpan('-'));
    setHtmlIfExists('resCableJudge', statusSpan('-'));
  }
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
  const note = type === 'CV-1C'
    ? `${label}は単心1本あたりの参考値です。計算結果では電源方式に応じて×2本/×3本/×4本として概算質量・ラック幅へ反映します。許容電流・外径・質量は最終的に仕様書で確認してください。`
    : `${label}の参考値です。許容電流・外径・質量は最終的に仕様書で確認してください。`;
  return {note, headers:['サイズ [sq]','許容電流 [A]','外径 [mm]','概算質量 [kg/km]','導体抵抗 [Ω/km]'], keys:['sizeSq','ampacity','outerDiameter','massKgKm','resistance'], rows};
}
function textDoc(note, lines){ return {note, headers:['項目','内容'], keys:['title','body'], rows:lines.map(v=>({title:v[0],body:v[1]}))}; }
function buildStandardsScopeDoc(){ return textDoc('公開法令・電技解釈で確認できる最低基準と、内線規程で確認すべき代表項目を整理しています。数値は参考表示であり、最新版の規程・設計仕様・保安規程・現場条件を優先してください。', [['アプリで反映した範囲','低圧電圧降下、低圧絶縁抵抗、A/B/C/D種接地抵抗、機械器具外箱の接地種別、地絡遮断装置の確認項目'],['内線規程の扱い','内線規程は民間規格です。技術資料には現場確認用の代表値・確認欄を表示し、詳細な適用条件は原本で確認する前提です'],['法令との関係','電気設備技術基準・電技解釈の最低基準を下回らないことを前提に、内線規程・設計仕様・機器仕様・保護協調を確認してください'],['注意','本アプリは参考計算です。施工可否や届出要否を確定するものではありません']]); }
function buildVoltageDropCodeDoc(){ return {note:'内線規程1310節の低圧配線電圧降下許容値として一般に参照される区分です。アプリの計算判定は入力条件の「電圧降下判定基準」で5.0%又は3.0%を選択できます。供給方式・こう長に応じた最終判断は本表と設計仕様で確認してください。', headers:['こう長','電気使用場所内変圧器から供給','電気事業者から低圧供給','確認メモ'], keys:['length','privateTransformer','utilityLowVoltage','note'], rows:[{length:'60m以下',privateTransformer:'幹線3%以下 / 分岐2%以下',utilityLowVoltage:'幹線2%以下 / 分岐2%以下',note:'幹線・分岐を個別に確認。'},{length:'60m超過〜120m以下',privateTransformer:'合計5%以下',utilityLowVoltage:'合計4%以下',note:'幹線＋分岐の合計で確認。'},{length:'120m超過〜200m以下',privateTransformer:'合計6%以下',utilityLowVoltage:'合計5%以下',note:'長距離幹線では始動時電圧降下も別途確認。'},{length:'200m超過',privateTransformer:'合計7%以下',utilityLowVoltage:'合計6%以下',note:'詳細計算・設備仕様・電力会社協議を優先。'}]}; }
function buildInsulationResistanceDoc(){ return {note:'低圧電路の絶縁抵抗値の最低基準です。開閉器又は過電流遮断器で区切ることのできる電路ごとに確認します', headers:['電路の使用電圧区分','条件・確認方法','判定値','備考'], keys:['voltage','condition','resistance','note'], rows:[{voltage:'300V以下',condition:'対地電圧150V以下',resistance:'0.1MΩ以上',note:'100V回路等'},{voltage:'300V以下',condition:'上記以外',resistance:'0.2MΩ以上',note:'三相200V回路等'},{voltage:'300V超過',condition:'低圧範囲',resistance:'0.4MΩ以上',note:'三相400V回路等'},{voltage:'充電回路',condition:'停電・開放不可など　クランプメーター等で漏えい電流を測定',resistance:'1mA以下',note:'電技解釈上の代替確認　現場手順・停電可否を確認'}]}; }
function buildGroundResistanceCodeDoc(){ return {note:'A/B/C/D種接地工事の接地抵抗値の代表基準です。B種は地絡電流Ig及び遮断時間条件で算定します', headers:['接地種別','接地抵抗値','主な用途','注意'], keys:['type','resistance','use','note'], rows:[{type:'A種',resistance:'10Ω以下',use:'高圧・特別高圧機器外箱等',note:'避雷器等では個別条件も確認'},{type:'B種',resistance:'150/Ig 以下（条件により300/Ig又は600/Ig）',use:'変圧器二次側中性点等の系統接地',note:'機械器具外箱の保護接地とは用途が異なる'},{type:'C種',resistance:'10Ω以下',use:'300V超過の低圧機器外箱等',note:'0.5秒以内に自動遮断する装置を施設する場合は500Ω以下'},{type:'D種',resistance:'100Ω以下',use:'300V以下の低圧機器外箱等',note:'0.5秒以内に自動遮断する装置を施設する場合は500Ω以下'}]}; }
function buildGroundApplicationCodeDoc(){ return {note:'機械器具の金属製外箱等へ施す保護接地の区分です。B種は変圧器二次側中性点等の系統接地として別項目で確認します', headers:['区分','接地工事','主な確認点'], keys:['voltage','ground','note'], rows:[{voltage:'低圧 300V以下',ground:'D種接地工事　図面・端子記号：ED',note:'対地電圧、設置場所、水気、地絡遮断装置の有無を確認'},{voltage:'低圧 300V超過',ground:'C種接地工事　図面・端子記号：EC',note:'400V級動力機器など　地絡遮断装置・接地抵抗を確認'},{voltage:'高圧又は特別高圧',ground:'A種接地工事',note:'高圧機器外箱、キュービクル内機器等'},{voltage:'変圧器二次側中性点等',ground:'B種接地工事',note:'系統接地として扱う　機械器具外箱のA/C/D種保護接地と混同しない'}]}; }
function buildEarthLeakageBreakerDoc(){ return textDoc('地絡遮断装置の施設確認です。金属製外箱を有する使用電圧60V超の低圧機械器具に接続する電路では、原則として地絡時に自動遮断する装置の要否を確認します。', [['原則','金属製外箱を有する使用電圧60V超の低圧機械器具に接続する電路は、地絡時に自動的に遮断する装置を確認します。'],['例外確認','乾燥場所、対地電圧150V以下で水気のない場所、二重絶縁構造、絶縁変圧器、接地抵抗3Ω以下などの例外条件があります。'],['400V級の注意','使用電圧300V超の低圧電路では、地絡遮断・C種接地・保護協調を特に確認してください。'],['アプリでの扱い','本アプリはELB要否を自動判定しません。施工前チェック項目として表示します。']]); }
function buildStandardsChecklistDoc(){ return textDoc('計算結果を現場で採用する前の最低確認項目です。各項目は技術検算フォームでも概算確認できます', [['電圧降下','式：三相 ΔV=√3×I×R×L/1000　単相2線 ΔV=2×I×R×L/1000　電圧降下率=ΔV/V×100'],['許容電流','式：補正後許容電流=基準許容電流×温度補正×条数補正×敷設方法補正×敷設条件補正'],['過電流保護','式：必要最小開閉器=合計電流以上の標準容量　推奨開閉器=合計電流÷裕度設定を標準容量へ丸め'],['接地','式：接地種別は使用電圧区分から推定　接地線サイズは開閉器容量別の参考表で確認'],['絶縁','式：絶縁抵抗基準 0.1MΩ/0.2MΩ/0.4MΩ　測定困難時は漏えい電流1mA以下を確認'],['施工','曲げ半径、入線率、プルボックス、支持間隔、耐震支持、防水・防食、端末処理を確認']]); }
function buildVoltageCriteria(){ return textDoc('電圧降下の判定基準は入力条件で5.0%以下又は3.0%以下を選択できます。選択値に応じて最小・推奨・既設の各ケーブル選定結果を再判定します。供給方式・こう長により内線規程上の目安が変わるため、「規程・法令基準」内の電圧降下許容値も確認してください。', [['現在のアプリ判定基準',`${getDropLimitPercent().toFixed(1)}%以下`],['内線規程確認','60m以下は幹線・分岐を個別確認、60m超過は供給方式別の合計許容値を確認します。'],['注意','長距離配線・始動電流が大きい負荷・電圧変動が厳しい設備では、仕様条件を優先してください。'],['実務メモ','アプリは参考計算です。最終判断は現場条件・内線規程・設計仕様で確認してください。']]); }
function buildFormulaCurrent(){ return textDoc('電流換算の基本式です。', [['三相 kW → A','I = P × 1000 ÷ (√3 × V × 力率 × 効率)'],['単相 kW → A','I = P × 1000 ÷ (V × 力率 × 効率)。照明・コンセント系では効率を1.0扱い'],['三相 kVA → A','I = kVA × 1000 ÷ (√3 × V)'],['単相 kVA → A','I = kVA × 1000 ÷ V'],['A入力','入力された電流値をそのまま換算電流として扱います。']]); }
function buildFormulaDrop(){ return textDoc('電圧降下の基本式です。', [['三相','e = √3 × I × R × L ÷ 1000'],['単相','e = 2 × I × R × L ÷ 1000'],['百分率','電圧降下率[%] = e ÷ 電圧 × 100'],['注意','リアクタンス成分は簡易計算では省略しています。長距離・大容量では詳細検討してください。']]); }
function buildFormulaCoef(){ return textDoc('許容電流補正の基本式です。', [['補正後許容電流','基準許容電流 × 温度補正 × 条数補正 × 敷設方法補正 × 敷設条件補正'],['温度補正','20〜50℃の係数テーブルを使用'],['条数補正','1〜6条の係数テーブルを使用'],['敷設方法補正','気中・ラック・配管の選択値を使用'],['敷設条件補正','一般・密集・日射ありの選択値を使用'],['注意','密集・日射・管路・ラック等の現場条件を反映して確認してください。']]); }
function buildMainBreakerDoc(){ return textDoc('主幹選定の考え方です。', [['必要最小開閉器','合計電流以上となる最小の標準開閉器です。'],['推奨開閉器','機器容量から算出した合計電流÷開閉器裕度設定を基準に、標準開閉器へ丸めます。既設開閉器指定時でも推奨開閉器は既設値に置き換えません。'],['既設開閉器指定','既設開閉器容量をケーブル選定基準電流として扱い、既設開閉器に見合う選定基準ケーブルを表示します。'],['自動選定','推奨開閉器容量をケーブル選定基準電流として扱います。'],['推奨開閉器裕度','推奨開閉器裕度[%] = (推奨開閉器 - 合計電流) ÷ 推奨開閉器 × 100'],['推奨開閉器容量裕度','推奨開閉器容量裕度[kW] = √3 × 電圧 × 推奨開閉器 × 力率 × 効率 ÷ 1000 − 合計容量[kW]。単相は√3を使用しません。'],['既設開閉器裕度','既設開閉器指定時は、既設開閉器裕度[%] = (既設開閉器 - 合計電流) ÷ 既設開閉器 × 100 を別枠で表示します。'],['注意','始動電流・需要率・保護協調・短絡容量は別途確認してください。']]); }
function conduitLengthLabel(info){
  return info.lengthM ? `${info.lengthM}m` : info.lengthMm ? `${info.lengthMm}mm` : info.coilLengthM ? `${info.coilLengthM}m/巻` : '-';
}
function conduitNoteLabel(info){
  return info.note || (info.coatingThicknessMm ? `膜厚 ${info.coatingThicknessMm}mm` : '');
}
function compactConduitColumns(rows){
  const baseColumns = [
    {key:'nominal', header:'呼び', required:true},
    {key:'outerDiameter', header:'外径 [mm]', required:true},
    {key:'innerDiameter', header:'内径/近似内径 [mm]', required:true},
    {key:'thicknessMm', header:'厚さ [mm]'},
    {key:'unitMassKgM', header:'単位質量 [kg/m]'},
    {key:'length', header:'長さ'},
    {key:'coilMassKg', header:'巻質量 [kg]'},
    {key:'minBendRadiusMm', header:'最小曲げ半径 [mm]'},
    {key:'note', header:'備考'}
  ];
  return baseColumns.filter(col=>col.required || rows.some(row=>row[col.key] !== undefined && row[col.key] !== null && row[col.key] !== '' && row[col.key] !== '-'));
}
function buildConduitSectionRows(items){
  return (items || []).map(info=>({
    nominal:info.nominal,
    outerDiameter:info.outerDiameter ?? '-',
    innerDiameter:info.innerDiameter ?? '-',
    thicknessMm:info.thicknessMm ?? '-',
    unitMassKgM:info.unitMassKgM ?? '-',
    length:conduitLengthLabel(info),
    coilMassKg:info.coilMassKg ?? '-',
    minBendRadiusMm:info.minBendRadiusMm ?? '-',
    note:conduitNoteLabel(info)
  }));
}
function buildConduitPayload(dataset, groupName, note){
  const sections = Object.entries(dataset || {}).map(([type,items])=>{
    const rows = buildConduitSectionRows(items);
    const columns = compactConduitColumns(rows);
    return {
      title:type,
      count:rows.length,
      note:`${groupName} / ${type} の参考寸法です。`,
      headers:columns.map(col=>col.header),
      keys:columns.map(col=>col.key),
      rows
    };
  });
  return {
    note:`${note}`, 
    sections,
    headers:['配管種類','件数'],
    keys:['title','count'],
    rows:sections.map(section=>({title:section.title,count:`${section.count}件`}))
  };
}
function buildResinConduitDoc(){ return buildConduitPayload(PLASTIC_CONDUIT,'樹脂系','CD管・PF管・FEP管・VE管の参考寸法表です。'); }
function buildMetalConduitDoc(){ return buildConduitPayload(METAL_CONDUIT,'金属系','厚鋼・薄鋼・ねじなし・ポリエチレンライニング鋼管の参考寸法表です。'); }
function buildFlexibleConduitDoc(){ return buildConduitPayload(FLEXIBLE_CONDUIT,'可とう管','金属製可とう電線管の非防水・防水の参考寸法表です。'); }
function buildDataIssuesDoc(){ return {note:'データ反映状況です。最終値は採用品の仕様書で確認してください。', headers:['No','内容'], keys:['no','text'], rows:DATA_ISSUES.map((text,index)=>({no:index+1,text}))}; }
function buildConduitSupportDoc(){
  return {
    note:'配管支持間隔の参考表です。水平・垂直ともに標準値を目安とし、端部、曲がり部、立上り、ボックス付近、貫通部、振動部では追加支持を確認してください',
    headers:['対象','標準支持間隔','垂直方向・立上り','端部・曲がり部の注意','主な確認事項'],
    keys:['target','interval','vertical','edge','note'],
    rows:[
      {target:'金属管（厚鋼・薄鋼・ねじなし鋼製電線管）',interval:'2.0m以下',vertical:'垂直配管も2.0m以下を目安　各階・立上り部で支持を確認',edge:'ボックス、器具、曲がり部、分岐部付近は必要に応じ支持',note:'屋外、振動部、重量物支持部は設計図・仕様書を優先'},
      {target:'合成樹脂管（CD管・PF管・VE管等）',interval:'1.5m以下',vertical:'垂直配管も1.5m以下を目安　たわみ・抜け・熱伸縮を確認',edge:'端部、曲がり部、ボックス付近はたわみ・抜けを確認',note:'熱伸縮、屋外紫外線、埋設/露出条件を確認'},
      {target:'金属製可とう電線管',interval:'1.0m以下を目安',vertical:'垂直・機器接続部は短い間隔で支持し、余長・振動吸収を確認',edge:'接続部付近・機器振動部は緩み止め、曲げ半径を確認',note:'防水形/非防水形、振動機器、可動部の余長を確認'},
      {target:'FEP管・地中管路',interval:'埋設条件・管路設計による',vertical:'立上り部、ハンドホール取合い、管口部を固定し防護を確認',edge:'ハンドホール、立上り、曲がり部、管口処理を確認',note:'土被り、埋戻し、曲げ、管路勾配、通線張力を別途確認'},
      {target:'共通',interval:'支持間隔だけでなく支持強度で確認',vertical:'垂直荷重、ずれ止め、貫通部、盤入線部、地震時変位を確認',edge:'管端・盤入線部・貫通部・プルボックス前後を確認',note:'標準値は参考　設計図、仕様書、内線規程、施工要領を優先'}
    ]
  };
}
function buildRackWidthDoc(){ return textDoc('ラック幅選定の参考メモです。標準施工要領等の考え方を参考に、アプリ内では一般化した概算式として表示します。', [['基本式','必要幅目安=ケーブル外径合計×余裕率'],['ケーブル外径合計','丸形ケーブルは外径×条数　単心ケーブルは外径×必要本数×条数'],['余裕率','1.25〜1.5程度を目安　放熱・離隔・結束・将来増設を考慮'],['標準幅への丸め','必要幅目安を上回る標準ラック幅へ丸めます'],['標準幅','W200 / W300 / W400 / W500 / W600 / W800 の範囲で表示します'],['注意','多段積み、離隔、放熱、曲がり部、立上り、支持条件、耐震条件は別途確認してください'],['アプリでの扱い','初期概算は外径合計×1.35を目安に表示します']]); }
function buildRackSupportDoc(){
  return {
    note:'ケーブルラック支持間隔の参考表です。標準施工要領・公共建築工事標準仕様書等で一般に用いられる値を参考表示しています。ラック材質、幅、積載質量、耐震支持、吊り材、アンカー条件を必ず確認してください。',
    headers:['対象','標準支持間隔','追加支持が必要な箇所','主な確認事項'],
    keys:['target','interval','support','note'],
    rows:[
      {target:'鋼製ケーブルラック・水平部',interval:'2.0m以下',support:'端部、曲がり部、分岐部、接続部付近',note:'ラック幅、積載質量、たわみ、吊りボルト径、耐震支持を確認。'},
      {target:'アルミ製・樹脂製等のラック・水平部',interval:'1.5m以下を目安',support:'端部、曲がり部、分岐部、接続部付近',note:'材質別の許容荷重、温度、屋外腐食、メーカー仕様を確認。'},
      {target:'垂直部',interval:'3.0m以下',support:'各階支持、立上り・端部・接続部付近',note:'配線室等は仕様により各階支持条件を確認。'},
      {target:'重量ケーブル・将来増設あり',interval:'標準値より短縮を検討',support:'集中荷重部、ケーブル引込部、端末部',note:'ケーブル質量、ラック自重、付属品、将来増設、地震時荷重を合算。'},
      {target:'共通',interval:'設計図・仕様書優先',support:'耐震支持、振止め、伸縮部、壁貫通部',note:'本表は自動判定ではなく施工確認用の参考値。'}
    ]
  };
}
function buildRackSeismicDoc(){ return textDoc('ラック耐震の考え方です。', [['確認事項','重要度、設置階、支持方法、振れ止め、アンカー、天井・壁・床の強度を確認してください。'],['施工メモ','長尺ラックや重量物周辺では、振れ止め・変位吸収・支持点の確認が重要です。'],['注意','耐震計算が必要な案件では、建築設備耐震設計指針等に基づく検討を行ってください。']]); }
function buildGroundBasisDoc(){ return {note:'接地種別と接地抵抗の参考表です。詳細は「規程・法令基準」内の接地抵抗値も確認してください。', headers:['接地種別','主な用途','接地抵抗の目安','備考'], keys:['type','use','resistance','note'], rows:[{type:'A種',use:'高圧・特別高圧機器外箱等',resistance:'10Ω以下',note:'設備種別ごとの例外条件も確認。'},{type:'B種',use:'変圧器低圧側中性点等',resistance:'150/Ig以下等',note:'地絡電流Ig・遮断時間条件で算定。'},{type:'C種',use:'300V超の低圧機器外箱等',resistance:'10Ω以下',note:'0.5秒以内自動遮断条件で500Ω以下。'},{type:'D種',use:'300V以下の低圧機器外箱等',resistance:'100Ω以下',note:'0.5秒以内自動遮断条件で500Ω以下。'},{type:'C/D種の自動遮断条件',use:'低圧電路の0.5秒以内自動遮断条件',resistance:'500Ω以下可',note:'ELB等は接地種別ではなく、接地抵抗値の緩和条件として確認。'}]}; }
function buildGroundWireDoc(){ return {note:'低圧幹線で使うC種・D種接地線サイズの参考表です。EA/EB/EC/EDは図面・端子記号、ELBは接地抵抗値の緩和条件として別確認します', headers:['接地種別','適用電圧','過電流遮断器容量','接地線サイズ目安','備考'], keys:['groundType','voltage','maxBreaker','size','note'], cardLayout:true, rows:GROUND_RULES.map(row=>({groundType:row.groundType, voltage:row.groundType==='C種'?'300V超過の低圧':'300V以下の低圧', maxBreaker:`${row.maxBreaker}A以下`, size:row.size, note:'参考値　内線規程表・現場仕様で確認'}))}; }
function buildHvSymbolsDoc(){
  return {
    note:'高圧単線結線図・受変電設備図でよく見る略記号の参考表です。図面・客先仕様により表記が異なる場合があります。',
    headers:['略記号','名称','概要'],
    keys:['symbol','name','body'],
    rows:[
      {symbol:'PAS',name:'気中負荷開閉器',body:'高圧引込部などに設置される開閉器。'},
      {symbol:'UGS',name:'地中線用負荷開閉器',body:'地中引込の高圧受電点などに用いる開閉器。'},
      {symbol:'DS',name:'断路器',body:'無負荷状態で回路を切り離す機器。'},
      {symbol:'LBS',name:'高圧交流負荷開閉器',body:'負荷電流の開閉に用いられる機器。'},
      {symbol:'PF',name:'高圧限流ヒューズ',body:'短絡電流等を限流遮断するヒューズ。'},
      {symbol:'PC',name:'電力ヒューズ付開閉器',body:'負荷開閉器とヒューズを組み合わせた保護開閉器。'},
      {symbol:'VCB',name:'真空遮断器',body:'短絡電流等の遮断に用いられる遮断器。'},
      {symbol:'OCB',name:'油遮断器',body:'油を消弧媒体とする遮断器。既設設備で見られる。'},
      {symbol:'ACB',name:'気中遮断器',body:'低圧主幹などで用いる気中遮断器。'},
      {symbol:'MCCB',name:'配線用遮断器',body:'低圧回路の過電流保護に用いる遮断器。'},
      {symbol:'ELCB/ELB',name:'漏電遮断器',body:'地絡・漏電保護機能を持つ遮断器。'},
      {symbol:'CT',name:'計器用変流器',body:'電流計測・保護継電器入力に用いる。'},
      {symbol:'ZCT',name:'零相変流器',body:'地絡電流の検出に用いる。'},
      {symbol:'VT/PT',name:'計器用変圧器',body:'電圧計測・保護継電器入力に用いる。'},
      {symbol:'LA',name:'避雷器',body:'雷サージ等から設備を保護する。'},
      {symbol:'OCR',name:'過電流継電器',body:'過電流・短絡事故時の保護に用いる。'},
      {symbol:'DGR',name:'方向性地絡継電器',body:'地絡方向を判定して地絡事故を検出する継電器。'},
      {symbol:'GR',name:'地絡継電器',body:'地絡事故検出に用いる。'},
      {symbol:'OVR',name:'過電圧継電器',body:'過電圧を検出する保護継電器。'},
      {symbol:'UVR',name:'不足電圧継電器',body:'不足電圧を検出する保護継電器。'},
      {symbol:'OVGR',name:'地絡過電圧継電器',body:'地絡時の零相電圧等を検出する継電器。'},
      {symbol:'A',name:'電流計',body:'回路電流を表示する計器。'},
      {symbol:'V',name:'電圧計',body:'回路電圧を表示する計器。'},
      {symbol:'AS',name:'電流計切替スイッチ',body:'電流計の測定相を切り替えるスイッチ。'},
      {symbol:'VS',name:'電圧計切替スイッチ',body:'電圧計の測定相を切り替えるスイッチ。'},
      {symbol:'WH',name:'電力量計',body:'使用電力量を計量する計器。'},
      {symbol:'VAR',name:'無効電力計',body:'無効電力を計測する計器。'},
      {symbol:'PFM',name:'力率計',body:'力率を表示する計器。'},
      {symbol:'Tr/TR',name:'変圧器',body:'高圧を低圧へ降圧する機器等。'},
      {symbol:'SC',name:'進相コンデンサ',body:'力率改善用のコンデンサ。'},
      {symbol:'SR',name:'直列リアクトル',body:'進相コンデンサ回路の高調波抑制等に用いる。'},
      {symbol:'LGR',name:'漏電継電器',body:'低圧回路の漏電検出に用いる継電器。'},
      {symbol:'MC',name:'電磁接触器',body:'電動機・負荷の開閉に用いる接触器。'},
      {symbol:'THR',name:'サーマルリレー',body:'電動機の過負荷保護に用いる。'},
      {symbol:'INV',name:'インバータ',body:'電動機の可変速制御に用いる。'},
      {symbol:'M',name:'電動機',body:'モータ負荷を示す。'},
      {symbol:'E/EA/EB/EC/ED',name:'接地記号',body:'接地系統又は接地端子を示す。A/B/C/D種と図面記号を確認。'},
      {symbol:'BCT',name:'零相変流器又はブッシングCT',body:'図面により意味が異なるため凡例を確認。'},
      {symbol:'CB',name:'遮断器',body:'遮断器の総称。図面ではVCB/ACB/MCCB等と併記されることがある。'},
      {symbol:'COS',name:'切替スイッチ',body:'操作回路や計器回路の切替に用いる。'}
    ]
  };
}

function buildTechCalcToolsDoc(){
  return {
    note:'技術資料内で任意の数値を代入して概算検算できます。計算結果本体とは分離した補助計算です。',
    headers:['項目','内容'], keys:['item','body'], rows:[
      {item:'三相電流',body:'I=P×1000÷(√3×V×力率×効率)'},
      {item:'単相電流',body:'I=P×1000÷(V×力率×効率)'},
      {item:'電圧降下',body:'三相 ΔV=√3×I×R×L÷1000　単相2線 ΔV=2×I×R×L÷1000　率=ΔV÷V×100'},
      {item:'許容電流補正',body:'補正後許容電流=基準許容電流×各補正係数'}
    ],
    html:`
      <div class="tech-calc-list">
        <section class="tech-calc-card" data-tech-calc="three-phase-current">
          <h4>三相電流計算</h4>
          <div class="tech-calc-grid">
            <label><span>容量[kW]</span><input data-field="kw" type="number" inputmode="decimal" value="45"></label>
            <label><span>電圧[V]</span><input data-field="voltage" type="number" inputmode="decimal" value="440"></label>
            <label><span>力率</span><input data-field="pf" type="number" inputmode="decimal" value="0.85" step="0.01"></label>
            <label><span>効率</span><input data-field="eff" type="number" inputmode="decimal" value="0.9" step="0.01"></label>
          </div>
          <div class="readonly-box top-gap"><span>計算結果[A]</span><strong data-result>-</strong></div>
        </section>
        <section class="tech-calc-card" data-tech-calc="single-phase-current">
          <h4>単相電流計算</h4>
          <div class="tech-calc-grid">
            <label><span>容量[kW]</span><input data-field="kw" type="number" inputmode="decimal" value="5"></label>
            <label><span>電圧[V]</span><input data-field="voltage" type="number" inputmode="decimal" value="200"></label>
            <label><span>力率</span><input data-field="pf" type="number" inputmode="decimal" value="0.9" step="0.01"></label>
            <label><span>効率</span><input data-field="eff" type="number" inputmode="decimal" value="1.0" step="0.01"></label>
          </div>
          <div class="readonly-box top-gap"><span>計算結果[A]</span><strong data-result>-</strong></div>
        </section>
        <section class="tech-calc-card" data-tech-calc="voltage-drop">
          <h4>電圧降下計算</h4>
          <div class="tech-calc-grid">
            <label><span>方式</span><select data-field="phase"><option value="three">三相3線</option><option value="single2">単相2線</option></select></label>
            <label><span>電流[A]</span><input data-field="current" type="number" inputmode="decimal" value="225"></label>
            <label><span>導体抵抗[Ω/km]</span><input data-field="resistance" type="number" inputmode="decimal" value="0.187" step="0.001"></label>
            <label><span>長さ[m]</span><input data-field="length" type="number" inputmode="decimal" value="120"></label>
            <label><span>電圧[V]</span><input data-field="voltage" type="number" inputmode="decimal" value="440"></label>
          </div>
          <div class="readonly-box top-gap"><span>計算結果</span><strong data-result>-</strong></div>
        </section>
        <section class="tech-calc-card" data-tech-calc="ampacity-correction">
          <h4>許容電流補正</h4>
          <div class="tech-calc-grid">
            <label><span>基準許容電流[A]</span><input data-field="base" type="number" inputmode="decimal" value="290"></label>
            <label><span>温度補正</span><input data-field="temp" type="number" inputmode="decimal" value="1" step="0.01"></label>
            <label><span>条数補正</span><input data-field="parallel" type="number" inputmode="decimal" value="1" step="0.01"></label>
            <label><span>敷設方法補正</span><input data-field="method" type="number" inputmode="decimal" value="0.95" step="0.01"></label>
            <label><span>敷設条件補正</span><input data-field="condition" type="number" inputmode="decimal" value="1" step="0.01"></label>
          </div>
          <div class="readonly-box top-gap"><span>補正後許容電流[A]</span><strong data-result>-</strong></div>
        </section>
      </div>`
  };
}

function techCalcNumber(card, key){
  const el = card.querySelector(`[data-field="${key}"]`);
  return Number(el?.value || 0);
}
function updateTechCalcCard(card){
  const type = card.dataset.techCalc;
  const out = card.querySelector('[data-result]');
  if (!out) return;
  if (type === 'three-phase-current') {
    const kw = techCalcNumber(card,'kw'), v = techCalcNumber(card,'voltage'), pf = techCalcNumber(card,'pf'), eff = techCalcNumber(card,'eff');
    out.textContent = kw && v && pf && eff ? `${formatNumber(kw*1000/(Math.sqrt(3)*v*pf*eff),2)}A` : '-';
  } else if (type === 'single-phase-current') {
    const kw = techCalcNumber(card,'kw'), v = techCalcNumber(card,'voltage'), pf = techCalcNumber(card,'pf'), eff = techCalcNumber(card,'eff');
    out.textContent = kw && v && pf && eff ? `${formatNumber(kw*1000/(v*pf*eff),2)}A` : '-';
  } else if (type === 'voltage-drop') {
    const phase = card.querySelector('[data-field="phase"]')?.value || 'three';
    const i = techCalcNumber(card,'current'), r = techCalcNumber(card,'resistance'), l = techCalcNumber(card,'length'), v = techCalcNumber(card,'voltage');
    const coef = phase === 'single2' ? 2 : Math.sqrt(3);
    const dropV = coef*i*r*l/1000;
    out.textContent = i && r && l && v ? `${formatNumber(dropV,2)}V / ${formatNumber(dropV/v*100,2)}%` : '-';
  } else if (type === 'ampacity-correction') {
    const base = techCalcNumber(card,'base'), temp = techCalcNumber(card,'temp'), parallel = techCalcNumber(card,'parallel'), method = techCalcNumber(card,'method'), condition = techCalcNumber(card,'condition');
    const corrected = base*temp*parallel*method*condition;
    out.textContent = base ? `${formatNumber(corrected,2)}A` : '-';
  }
}
function bindTechCalcTools(){
  document.querySelectorAll('[data-tech-calc]').forEach(card=>{
    if (card.dataset.boundTechCalc === '1') { updateTechCalcCard(card); return; }
    card.dataset.boundTechCalc = '1';
    card.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',()=>updateTechCalcCard(card)));
    card.querySelectorAll('select').forEach(el=>el.addEventListener('change',()=>updateTechCalcCard(card)));
    updateTechCalcCard(card);
  });
}

function ensureDocsUpgraded(){ /* v3.1では初期定義済み */ }
const expandedDocGroups = new Set();
const expandedDocItems = new Set();
function makeDocChevron(isOpen){ return isOpen ? '▾' : '▸'; }
function toggleDocPanel(button, body, isOpen){
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  button.classList.toggle('open', isOpen);
  body.hidden = !isOpen;
}
function renderDocs(){
  const search = ($('docsSearch').value || '').trim().toLowerCase();
  const root = $('docsContainer'); root.innerHTML = '';
  const visibleGroups = [];
  const flatItems = [];
  DOC_GROUPS.forEach(group=>{
    const visibleItems = [];
    group.items.forEach(item=>{
      const payload = item.build();
      const blob = `${group.title} ${item.title} ${payload.note || ''} ${JSON.stringify(payload.rows)}`.toLowerCase();
      if (search && !blob.includes(search)) return;
      const entry = {group, item, payload, index: flatItems.length, itemKey:`${group.key}:${item.id}`};
      flatItems.push(entry);
      visibleItems.push(entry);
    });
    if (visibleItems.length || !search) visibleGroups.push({group, visibleItems});
  });
  const openDocEntry = (entryIndex)=>{
    const target = flatItems[entryIndex];
    if (!target) return;
    expandedDocGroups.add(target.group.key);
    expandedDocItems.clear();
    expandedDocItems.add(target.itemKey);
    renderDocs();
    requestAnimationFrame(()=>{
      const targetEl = document.getElementById(`doc-card-${target.itemKey.replace(/[^a-zA-Z0-9_-]/g,'-')}`);
      if (targetEl) targetEl.scrollIntoView({behavior:'smooth', block:'start'});
    });
  };
  visibleGroups.forEach(({group, visibleItems})=>{
    if (!visibleItems.length && search) return;
    const groupCard = document.createElement('div'); groupCard.className = 'doc-group-card';
    const groupTitle = document.createElement('button'); groupTitle.type = 'button'; groupTitle.className = 'doc-group-toggle';
    groupTitle.setAttribute('aria-controls', `doc-group-${group.key}`);
    const groupBody = document.createElement('div'); groupBody.className = 'stack doc-group-body'; groupBody.id = `doc-group-${group.key}`;
    visibleItems.forEach(entry=>{
      const {item, payload, itemKey, index} = entry;
      const safeKey = itemKey.replace(/[^a-zA-Z0-9_-]/g,'-');
      const itemCard = document.createElement('div'); itemCard.className = 'doc-item-card'; itemCard.id = `doc-card-${safeKey}`;
      const itemButton = document.createElement('button'); itemButton.type = 'button'; itemButton.className = 'doc-item-toggle';
      itemButton.setAttribute('aria-controls', `doc-item-${safeKey}`);
      const rowCount = Array.isArray(payload.rows) ? payload.rows.length : 0;
      const itemOpen = !search && expandedDocItems.has(itemKey);
      itemButton.innerHTML = `<span class="doc-toggle-label"><span class="doc-chevron">${makeDocChevron(itemOpen)}</span><span>${escapeHtml(item.title)}</span></span><span class="doc-count">${rowCount}件</span>`;
      const itemBody = document.createElement('div'); itemBody.className = 'doc-item-body'; itemBody.id = itemButton.getAttribute('aria-controls');
      const breadcrumb = document.createElement('div'); breadcrumb.className = 'doc-breadcrumb';
      breadcrumb.textContent = `${group.title} / ${item.title}（${index + 1}/${flatItems.length}）`;
      itemBody.appendChild(breadcrumb);
      const actionsTop = document.createElement('div'); actionsTop.className = 'doc-nav-actions';
      actionsTop.innerHTML = `<button type="button" class="ghost small js-doc-prev" ${index<=0?'disabled':''}>前の資料</button><button type="button" class="ghost small js-doc-next" ${index>=flatItems.length-1?'disabled':''}>次の資料</button><button type="button" class="ghost small js-doc-close">閉じる</button>`;
      itemBody.appendChild(actionsTop);
      if (payload.note) { const note = document.createElement('div'); note.className = 'field-hint doc-note'; note.textContent = payload.note; itemBody.appendChild(note); }
      if (payload.html) { const htmlBox = document.createElement('div'); htmlBox.className = 'doc-custom-html'; htmlBox.innerHTML = payload.html; itemBody.appendChild(htmlBox); }
      const keys = payload.keys || (payload.rows?.[0] ? Object.keys(payload.rows[0]) : []);
      const columnGuide = document.createElement('div'); columnGuide.className = 'doc-column-guide';
      const guideColumns = payload.sections ? '配管種類をタップしてサイズ表を展開' : (payload.headers || []).map(v=>escapeHtml(v)).join(' ／ ');
      columnGuide.innerHTML = `<span>表示中：${escapeHtml(group.title)} / ${escapeHtml(item.title)}</span><span class="doc-column-guide-cols">列：${guideColumns}</span>`;
      itemBody.appendChild(columnGuide);
      if (payload.html) {
        // custom HTML already appended above
      } else if (Array.isArray(payload.sections) && payload.sections.length) {
        const sectionRoot = document.createElement('div');
        sectionRoot.className = 'doc-subsection-list';
        payload.sections.forEach((section, sectionIndex)=>{
          const details = document.createElement('details');
          details.className = 'doc-subitem-card';
          const summary = document.createElement('summary');
          summary.className = 'doc-subitem-summary';
          summary.innerHTML = `<span>${escapeHtml(section.title)}</span><span class="doc-count">${section.rows?.length || 0}件</span>`;
          details.appendChild(summary);
          const sectionBody = document.createElement('div');
          sectionBody.className = 'doc-subitem-body';
          const sectionGuide = document.createElement('div');
          sectionGuide.className = 'doc-column-guide doc-section-guide';
          sectionGuide.innerHTML = `<span>表示中：${escapeHtml(group.title)} / ${escapeHtml(item.title)} / ${escapeHtml(section.title)}</span><span class="doc-column-guide-cols">列：${(section.headers || []).map(v=>escapeHtml(v)).join(' ／ ')}</span>`;
          sectionBody.appendChild(sectionGuide);
          if (section.note) { const snote = document.createElement('div'); snote.className = 'field-hint doc-note'; snote.textContent = section.note; sectionBody.appendChild(snote); }
          const wrap = document.createElement('div'); wrap.className = 'doc-table-wrap';
          const table = document.createElement('table'); table.className = 'doc-table doc-conduit-table';
          const sectionKeys = section.keys || (section.rows?.[0] ? Object.keys(section.rows[0]) : []);
          const sectionHeaders = section.headers || [];
          const headers = sectionHeaders.map(v=>`<th>${escapeHtml(v)}</th>`).join('');
          const rows = (section.rows || []).map(row=>`<tr>${sectionKeys.map((key, cellIndex)=>`<td data-label="${escapeHtml(sectionHeaders[cellIndex] || key)}">${escapeHtml(row[key] ?? '-')}</td>`).join('')}</tr>`).join('');
          table.innerHTML = `<thead><tr>${headers}</tr></thead><tbody>${rows}</tbody>`;
          wrap.appendChild(table);
          sectionBody.appendChild(wrap);
          details.appendChild(sectionBody);
          sectionRoot.appendChild(details);
        });
        itemBody.appendChild(sectionRoot);
      } else {
        const wrap = document.createElement('div'); wrap.className = 'doc-table-wrap';
        const table = document.createElement('table'); table.className = 'doc-table';
        const isTextHeavy = keys.some(key=>['body','note','content','summary','remarks','check','main','target','method'].includes(key)) || (payload.rows || []).some(row=>keys.some(key=>String(row[key] ?? '').length >= 24));
        if (keys.includes('body') || keys.includes('note') || isTextHeavy || payload.cardLayout) table.classList.add('doc-text-table');
        if (isTextHeavy || payload.cardLayout) { table.classList.add('doc-card-table'); wrap.classList.add('doc-card-table-wrap'); }
        const tableHeaders = payload.headers || [];
        const headers = tableHeaders.map(v=>`<th>${escapeHtml(v)}</th>`).join('');
        const rows = payload.rows.map(row=>`<tr>${keys.map((key, cellIndex)=>`<td data-label="${escapeHtml(tableHeaders[cellIndex] || key)}">${escapeHtml(row[key] ?? '-')}</td>`).join('')}</tr>`).join('');
        table.innerHTML = `<thead><tr>${headers}</tr></thead><tbody>${rows}</tbody>`;
        wrap.appendChild(table); itemBody.appendChild(wrap);
      }
      const actionsBottom = actionsTop.cloneNode(true); actionsBottom.classList.add('bottom'); itemBody.appendChild(actionsBottom);
      const bindNav = (actions)=>{
        const prev = actions.querySelector('.js-doc-prev');
        const next = actions.querySelector('.js-doc-next');
        const close = actions.querySelector('.js-doc-close');
        if (prev) prev.onclick = ()=>openDocEntry(index - 1);
        if (next) next.onclick = ()=>openDocEntry(index + 1);
        if (close) close.onclick = ()=>{ expandedDocItems.delete(itemKey); renderDocs(); requestAnimationFrame(()=>{ const el = document.getElementById(`doc-card-${safeKey}`); if (el) el.scrollIntoView({behavior:'smooth', block:'center'}); }); };
      };
      bindNav(actionsTop); bindNav(actionsBottom);
      toggleDocPanel(itemButton, itemBody, itemOpen);
      itemButton.addEventListener('click',()=>{
        const nextOpen = itemBody.hidden;
        if (nextOpen) expandedDocItems.add(itemKey); else expandedDocItems.delete(itemKey);
        itemButton.querySelector('.doc-chevron').textContent = makeDocChevron(nextOpen);
        toggleDocPanel(itemButton, itemBody, nextOpen);
      });
      itemCard.appendChild(itemButton); itemCard.appendChild(itemBody); groupBody.appendChild(itemCard);
    });
    const groupOpen = search ? true : expandedDocGroups.has(group.key);
    groupTitle.innerHTML = `<span class="doc-toggle-label"><span class="doc-chevron">${makeDocChevron(groupOpen)}</span><span>${escapeHtml(group.title)}</span></span><span class="doc-count">${visibleItems.length}件</span>`;
    toggleDocPanel(groupTitle, groupBody, groupOpen);
    groupTitle.addEventListener('click',()=>{
      const nextOpen = groupBody.hidden;
      if (nextOpen) expandedDocGroups.add(group.key); else expandedDocGroups.delete(group.key);
      groupTitle.querySelector('.doc-chevron').textContent = makeDocChevron(nextOpen);
      toggleDocPanel(groupTitle, groupBody, nextOpen);
    });
    groupCard.appendChild(groupTitle); groupCard.appendChild(groupBody); root.appendChild(groupCard);
  });
  if (!flatItems.length) root.innerHTML = '<div class="panel muted">該当する資料はありません。</div>';
  requestAnimationFrame(bindTechCalcTools);
}

function buildSaveCard(item, isHistory){
  const card = document.createElement('div'); card.className = 'saved-card';
  const selected = compareIds.includes(item.id);
  card.innerHTML = `<div class="saved-line"><div class="saved-summary"><div class="saved-title-row"><strong>${escapeHtml(item.title || '無題')}</strong><span class="badge ${item.result?.judgement === '良' ? 'good' : 'bad'}">${escapeHtml(item.result?.judgement || '-')}</span></div><span class="muted">${new Date(item.savedAt).toLocaleString('ja-JP')}</span></div></div>${item.memo ? `<div class="muted top-gap">${escapeHtml(item.memo)}</div>` : ''}<div class="readonly-grid top-gap"><div><span>計算方式</span><strong>${item.calculationMode === 'existing' ? '既設開閉器指定' : '自動選定'}</strong></div><div><span>判定ケーブル</span><strong>${escapeHtml(item.result?.cableType || '-')} ${item.result?.cableSize ? `${item.result.cableSize}sq` : '-'}</strong></div><div><span>推奨開閉器 [A]</span><strong>${formatNumber(item.result?.adoptedBreaker,0)}</strong></div><div><span>選定基準 [A]</span><strong>${formatNumber(item.result?.cableSelectionBasisCurrent ?? item.result?.adoptedBreaker,0)}</strong></div><div><span>合計電流 [A]</span><strong>${formatNumber(item.result?.totalCurrent,2)}</strong></div><div><span>電圧降下 [%]</span><strong>${formatNumber(item.result?.voltageDropPercent,2)}</strong></div><div><span>外径・質量データ版</span><strong>${escapeHtml(item.versions?.physical || VERSIONS.physical)}</strong></div></div><div class="inline-actions top-gap"><button class="ghost small js-open">この案を開く</button>${isHistory ? '<button class="ghost small js-save-history">保存済みに追加</button>' : `<button class="ghost small js-compare">${selected ? '比較から外す' : '比較に追加'}</button>`}${!isHistory ? '<button class="ghost small js-rename">名前変更</button>' : ''}<button class="ghost small js-delete">削除</button></div>`;
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
    ['判定ケーブル', `${baseItem.result?.cableType || '-'} ${baseItem.result?.cableSize ? baseItem.result.cableSize + 'sq' : '-'}`, item=>`${item.result?.cableType || '-'} ${item.result?.cableSize ? item.result.cableSize + 'sq' : '-'}`, null],
    ['推奨開閉器 [A]', baseItem.result?.adoptedBreaker, item=>item.result?.adoptedBreaker, 'number'],
    ['ケーブル選定基準電流 [A]', baseItem.result?.cableSelectionBasisCurrent ?? baseItem.result?.adoptedBreaker, item=>item.result?.cableSelectionBasisCurrent ?? item.result?.adoptedBreaker, 'number'],
    ['合計電流 [A]', baseItem.result?.totalCurrent, item=>item.result?.totalCurrent, 'number'],
    ['電圧降下 [%]', baseItem.result?.voltageDropPercent, item=>item.result?.voltageDropPercent, 'number'],
    ['電圧降下判定基準 [%]', baseItem.result?.voltageDropLimitPercent || 5, item=>item.result?.voltageDropLimitPercent || 5, 'number'],
    ['推奨開閉器裕度 [%]', baseItem.result?.recommendedBreakerMarginPercent ?? baseItem.result?.breakerMarginPercent, item=>item.result?.recommendedBreakerMarginPercent ?? item.result?.breakerMarginPercent, 'number'],
    ['推奨開閉器容量裕度 [kW]', baseItem.result?.recommendedCapacityMarginKW ?? baseItem.result?.capacityMarginKW, item=>item.result?.recommendedCapacityMarginKW ?? item.result?.capacityMarginKW, 'number'],
    ['選定基準開閉器裕度 [%]', baseItem.result?.basisBreakerMarginPercent ?? baseItem.result?.breakerMarginPercent, item=>item.result?.basisBreakerMarginPercent ?? item.result?.breakerMarginPercent, 'number'],
    ['選定基準開閉器容量裕度 [kW]', baseItem.result?.basisCapacityMarginKW ?? baseItem.result?.capacityMarginKW, item=>item.result?.basisCapacityMarginKW ?? item.result?.capacityMarginKW, 'number'],
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

function isManualCableSizing(){
  return state.cableSizingMode === 'manual';
}
function activeCableCandidateForDisplay(){
  const breaker = adoptedBreaker();
  if (isManualCableSizing() && state.cableSize) return cableCandidateBySize(breaker, Number(state.cableSize));
  const selection = suggestedCableSelection();
  return selection?.valid || null;
}
function renderManualCableFields(){
  const showManual = isManualCableSizing();
  $('manualCableSizeField')?.classList.toggle('hidden', !showManual);
  $('baseAmpacityField')?.classList.toggle('hidden', !showManual);
}
function renderCalcModeDependentFields(){
  const isExisting = state.calcMode === 'existing';
  $('existingBreakerField')?.classList.toggle('hidden', !isExisting);
  $('existingBreaker')?.toggleAttribute('disabled', !isExisting);
  setTextIfExists('breakerMarginLabel', isExisting ? '推奨選定用 開閉器裕度設定' : '開閉器裕度設定');
}
function renderLoadPurposeDependentFields(){
  const lighting = isLightingCalc();
  $('efficiencyField')?.classList.toggle('hidden', lighting);
  $('efficiency')?.toggleAttribute('disabled', lighting);
  if (lighting) state.efficiency = state.efficiency || '1.0';
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
  const badge = $('ampacityModeBadge'); badge.className = 'mode-badge';
  if (state.ampacityMode === 'auto' || activeCandidate?.info?.ampacity) badge.textContent = '自動'; else if (state.ampacityMode === 'manual') { badge.textContent = '手動'; badge.classList.add('manual'); } else { badge.textContent = '未設定'; badge.classList.add('none'); }
}
function applyDisplayScale(){ document.documentElement.style.setProperty('--display-scale', String(Number(state.displayScale || 1.0))); }
function applySettingsValues(){ $('verAmpacity').textContent = VERSIONS.ampacity; $('verPhysical').textContent = VERSIONS.physical; $('verForm').textContent = VERSIONS.form; }
function renderAll(){
  state.calculationType = normalizeCalculationTypeValue(state.calculationType);
  normalizePowerSystemForCalcType();
  setSelectOptions($('calcMode'), [{value:'auto',label:'自動選定'},{value:'existing',label:'既設開閉器指定'}], '選択してください', state.calcMode);
  setSelectOptions($('loadPurpose'), LOAD_PURPOSE_OPTIONS, '選択してください', state.calculationType);
  setSelectOptions($('powerSystem'), getPowerSystemOptions(), '選択してください', state.powerSystem);
  normalizeVoltageState(state);
  setSelectOptions($('voltage'), VOLTAGE_PRESET_OPTIONS, '選択してください', state.voltagePreset || state.voltage);
  setSelectOptions($('powerFactor'), POWER_FACTOR_OPTIONS, '選択してください', state.powerFactor);
  setSelectOptions($('efficiency'), EFFICIENCY_OPTIONS, '選択してください', state.efficiency);
  setSelectOptions($('existingBreaker'), BREAKER_SIZES.map(v=>({value:String(v),label:`${v}A`})), '選択してください', state.existingBreaker);
  setSelectOptions($('breakerMarginRatio'), BREAKER_MARGIN_RATIO_OPTIONS, '選択してください', state.breakerMarginRatio || '0.8');
  setSelectOptions($('voltageDropLimitPercent'), VOLTAGE_DROP_LIMIT_OPTIONS, '選択してください', String(state.voltageDropLimitPercent || '5'));
  setSelectOptions($('loadCount'), Array.from({length:20},(_,i)=>({value:String(i+1),label:String(i+1)})), '選択してください', state.loadCount);
  setSelectOptions($('cableSizingMode'), CABLE_SIZING_MODE_OPTIONS, '選択してください', state.cableSizingMode || 'auto');
  normalizeCableTypeForPowerSystem();
  const cableType = selectedCableTypeFromState();
  const allowedCableTypes = allowedCableTypesForPowerSystem();
  setSelectOptions($('cableType'), allowedCableTypes.map(type=>({value:type,label:cableTypeDisplayName(type)})), '選択してください', cableType);
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
  renderVoltageFields();
  renderManualCableFields();
  renderCalcModeDependentFields();
  renderLoadPurposeDependentFields();
  $('calcModeHint').textContent = state.calcMode === 'existing' ? '推奨開閉器は負荷電流÷裕度で算出し、既設開閉器は別枠でケーブル選定基準として判定します。' : `自動選定中は既設開閉器欄を使用しません。推奨開閉器は、合計電流÷開閉器裕度設定で選定します。`;
  const cableNotice = $('cableCompatibilityNotice');
  if (cableNotice) {
    const message = state.cableCompatibilityWarning || cableTypeRequirementText();
    cableNotice.textContent = message;
    cableNotice.classList.toggle('warning', !!state.cableCompatibilityWarning);
  }
  state.cableCompatibilityWarning = '';
  document.querySelectorAll('.seg').forEach(btn=>btn.classList.toggle('active', btn.dataset.calcType === state.calculationType));
  applyDisplayScale(); renderLoadCards(); renderAmpacitySection(); renderDocs(); renderSaved(); applySettingsValues();
  if (state.lastResult) { $('resultPanel').classList.remove('hidden'); $('resultBody').classList.remove('hidden'); updateResultError(''); renderResult(); }
  else { $('resultPanel').classList.add('hidden'); }
}
function wireNumericInput(input,onChange){ input.addEventListener('input', onChange); }
function bindEvents(){
  bindFormulaPopup();
  document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>switchScreen(btn.dataset.screen)));
  document.querySelectorAll('.seg').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.seg').forEach(v=>v.classList.remove('active')); btn.classList.add('active'); state.calculationType = normalizeCalculationTypeValue(btn.dataset.calcType); normalizePowerSystemForCalcType(); normalizeCableTypeForPowerSystem(); persistState(); renderAll(); }));
  $('loadPurpose')?.addEventListener('change',()=>{ state.calculationType = normalizeCalculationTypeValue($('loadPurpose').value); normalizePowerSystemForCalcType(); normalizeCableTypeForPowerSystem(); persistState(); renderAll(); validateRealtime(); });
  document.querySelectorAll('.saved-seg').forEach(btn=>btn.addEventListener('click',()=>switchSavedTab(btn.dataset.savedTab)));
  $('calcMode').addEventListener('change',()=>{ state.calcMode = $('calcMode').value; persistState(); renderAll(); });
  $('powerSystem').addEventListener('change',()=>{ state.powerSystem = $('powerSystem').value; normalizeCableTypeForPowerSystem(); persistState(); renderAll(); validateRealtime(); });
  $('voltage').addEventListener('change',()=>{
    state.voltagePreset = $('voltage').value;
    applyVoltagePresetToState();
    persistState();
    renderVoltageFields();
    renderLoadCards();
    renderAmpacitySection();
    validateRealtime();
    maybeRecalculateAfterInput();
  });
  $('voltageCustom').addEventListener('input',()=>{
    state.voltageCustom = $('voltageCustom').value;
    if (isCustomVoltage()) state.voltage = state.voltageCustom;
    persistState();
    renderLoadCards();
    renderAmpacitySection();
    validateRealtime();
    maybeRecalculateAfterInput();
  });
  $('powerFactor').addEventListener('change',()=>{ state.powerFactor = $('powerFactor').value; persistState(); renderLoadCards(); renderAmpacitySection(); validateRealtime(); });
  $('efficiency').addEventListener('change',()=>{ state.efficiency = $('efficiency').value; persistState(); renderLoadCards(); renderAmpacitySection(); validateRealtime(); });
  $('existingBreaker').addEventListener('change',()=>{ state.existingBreaker = $('existingBreaker').value; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('breakerMarginRatio').addEventListener('change',()=>{ state.breakerMarginRatio = $('breakerMarginRatio').value || '0.8'; persistState(); renderAmpacitySection(); validateRealtime(); });
  $('voltageDropLimitPercent').addEventListener('change',()=>{ state.voltageDropLimitPercent = $('voltageDropLimitPercent').value || '5'; persistState(); renderAmpacitySection(); validateRealtime(); if (state.lastResult && !missingFields().length) calculate({recordHistory:false, scrollResult:false}); });
  $('loadCount').addEventListener('change',()=>{ state.loadCount = $('loadCount').value; normalizeLoads(); persistState(); renderLoadCards(); validateRealtime(); });
  $('cableSizingMode').addEventListener('change',()=>{ state.cableSizingMode = $('cableSizingMode').value || 'auto'; persistState(); renderManualCableFields(); renderAmpacitySection(); validateRealtime(); });
  $('cableType').addEventListener('change',()=>{ const nextType = $('cableType').value; const message = cableTypeCompatibilityMessage(nextType, state.powerSystem); if (message) { resetCableSelectionForCompatibility(message); } else { applyCableTypeToState(nextType); const sizes = getCableSizes(nextType).map(String); if (!sizes.includes(String(state.cableSize))) { state.cableSize = ''; state.baseAmpacity = ''; state.ampacityMode = 'none'; } } persistState(); renderAll(); });
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
  if ($('groundWireBtn')) $('groundWireBtn').addEventListener('click',()=>$('groundDialog')?.showModal());
  if ($('closeGroundDialog')) $('closeGroundDialog').addEventListener('click',()=>$('groundDialog')?.close());
  if ($('groundType')) $('groundType').addEventListener('change', updateGroundResult);
  if ($('groundWireType')) $('groundWireType').addEventListener('change', updateGroundResult);
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
  $('saveTitleInput').value = state.projectName || `低圧幹線計算_${loadPurposeLabel()}_${new Date().toLocaleString('sv-SE').replace(/[: ]/g,'_')}`;
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
    ['工事件名', state.projectName || ''], ['工事種別', state.projectType || ''], ['提出先', state.submitTo || ''], ['図番', state.drawingNo || ''], ['作成者', state.author || ''], ['作成日時', formatDateTimeForOutput(state.createdAt || '')], ['備考', state.projectRemarks || ''], ['計算種別', '低圧幹線計算'], ['負荷用途', loadPurposeLabel()], ['計算方式', state.calcMode === 'existing' ? '既設開閉器指定' : '自動選定'], ['電源方式', state.powerSystem], ['電圧[V]', state.voltage], ['力率', state.powerFactor], ['効率', efficiencyDisplayValue()], ['配線長[m]', state.wiringLength], ['電圧降下判定基準[%]', r.voltageDropLimitPercent || state.voltageDropLimitPercent || '5'], ['既設開閉器[A]', state.calcMode === 'existing' ? (state.existingBreaker || '') : ''], ['開閉器裕度設定', state.breakerMarginRatio || ''], ['必要最小開閉器[A]', r.requiredBreaker], ['推奨開閉器[A]', r.adoptedBreaker], ['ケーブル選定基準', r.cableSelectionBasisLabel || ''], ['ケーブル選定基準電流[A]', r.cableSelectionBasisCurrent || r.adoptedBreaker || ''], ['必要最小ケーブルサイズ', cableLabel(r.requiredMinCableType, r.requiredMinCableSize)], ['推奨ケーブル', cableLabel(r.recommendedCableType, r.recommendedCableSize)], ['選定基準ケーブル', cableLabel(r.basisCableType || r.cableType, r.basisCableSize || r.cableSize)], ['判定ケーブル', cableLabel(r.cableType, r.cableSize)], ['基準許容電流[A]', r.baseAmpacity], ['補正後許容電流[A]', r.correctedAmpacity], ['合計容量[kW]', r.totalKW], ['合計容量[kVA]', r.totalKVA], ['合計電流[A]', r.totalCurrent], ['電圧降下[V]', r.voltageDropV], ['電圧降下[%]', r.voltageDropPercent], ['電圧降下計算電流[A]', r.voltageDropBasisCurrent], ['推奨開閉器裕度[%]', r.recommendedBreakerMarginPercent ?? r.breakerMarginPercent], ['推奨開閉器容量裕度[kW]', r.recommendedCapacityMarginKW ?? r.capacityMarginKW], [r.cableSelectionBasisMarginLabel || '選定基準裕度[%]', r.basisBreakerMarginPercent ?? r.breakerMarginPercent], [r.cableSelectionBasisCapacityLabel || '選定基準容量裕度[kW]', r.basisCapacityMarginKW ?? r.capacityMarginKW], ['必要最小ケーブル概算質量[kg/m]', r.requiredMinCableMassKgM], ['必要最小ケーブル概算総質量[kg]', r.requiredMinCableMassTotalKg], ['必要最小ケーブル参考ラック幅', r.requiredMinCableRackWidth], ['推奨ケーブル概算質量[kg/m]', r.recommendedCableMassKgM], ['推奨ケーブル概算総質量[kg]', r.recommendedCableMassTotalKg], ['推奨ケーブル参考ラック幅', r.recommendedCableRackWidth], ['選定基準ケーブル概算質量[kg/m]', r.basisCableMassKgM], ['選定基準ケーブル概算総質量[kg]', r.basisCableMassTotalKg], ['選定基準ケーブル参考ラック幅', r.basisCableRackWidth], ['必要最小接地種別', r.requiredMinGround?.label || ''], ['必要最小接地記号', r.requiredMinGround?.symbol || ''], ['必要最小接地選定根拠', r.requiredMinGround?.selectionReason || ''], ['必要最小接地線候補', r.requiredMinGround?.wireSize || ''], ['必要最小接地算定基準', r.requiredMinGround?.basisLabel || ''], ['推奨接地種別', r.recommendedGround?.label || ''], ['推奨接地記号', r.recommendedGround?.symbol || ''], ['推奨接地選定根拠', r.recommendedGround?.selectionReason || ''], ['推奨接地線候補', r.recommendedGround?.wireSize || ''], ['推奨接地算定基準', r.recommendedGround?.basisLabel || ''], ['選定基準接地種別', r.basisGround?.label || ''], ['選定基準接地記号', r.basisGround?.symbol || ''], ['選定基準接地選定根拠', r.basisGround?.selectionReason || ''], ['選定基準接地線候補', r.basisGround?.wireSize || ''], ['選定基準接地算定基準', r.basisGround?.basisLabel || ''], ['良否判定', r.judgement], ['選定主因', r.mainFactor], ['選定根拠', r.reasons.join('、')], ['許容電流データ版', VERSIONS.ampacity], ['外径・質量データ版', VERSIONS.physical], ['帳票様式版', VERSIONS.form]
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
  const groundTypeEl = $('groundType'), wireTypeEl = $('groundWireType'), resultEl = $('groundResult');
  if (!groundTypeEl || !wireTypeEl || !resultEl) return;
  const groundType = groundTypeEl.value, wireType = wireTypeEl.value, breaker = Number(state.lastResult?.cableSelectionBasisCurrent || state.lastResult?.adoptedBreaker || state.existingBreaker || 0);
  const rule = GROUND_RULES.find(v=>v.groundType===groundType && v.wireType===wireType && breaker<=v.maxBreaker) || GROUND_RULES.find(v=>v.groundType===groundType && v.wireType===wireType);
  resultEl.textContent = rule ? `基準開閉器 ${breaker || '-'}A の参考接地線サイズ：${rule.size}` : '条件に合う参考サイズがありません。';
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
