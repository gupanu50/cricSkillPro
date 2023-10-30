//================= Network Configration =======================//
const URIS: Record<string, string> = {
  DEVELOPMENT: 'http://om-ev.1hour.in:3006/',
  PRODUCTION: '',
  STAGING: '',
};

const HTTP_CODES: Record<string, Number> = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  VALIDATION: 422,
  SERVER_ERROR: 500,
};

const ENDPOINTS: Record<string, string> = {
  LOGIN: 'login',
  REGISTRATION: 'registration',
  CHARGING_STATION: 'getChargingStation',
  CHARGER_TYPE: 'chargersTypes',
};

const STATIC_PAGE: Record<string, string> = {
  PRIVACY_POLICY: '',
  TERMS_CONDITION: '',
};

//================== REGEX =============================//
const REGEX: Record<string, RegExp> = {
  NAME: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  MOBILE: /^[6-9]\d{9}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
};

//================== Font Family =============================//
const FONT_FAMILIES: Record<string, string> = {
  REGULAR: 'ABeeZee-Regular',
  ITALIC: 'ABeeZee-Italic',
  REGULAR_TXT: 'Montserrat-Regular',
  SEMIBOLD_TXT: 'Montserrat-SemiBold',
  BOLD_TXT: 'Montserrat-Bold',
  MEDIUM_TXT: 'Montserrat-Medium',
  LIGHT_TXT: 'Montserrat-Light',
  WORKSANS: 'WorkSans-Regular',
  WORKSANS_MEDIUM: 'WorkSans-Medium',
  WORKSANS_BOLD: 'WorkSans-Bold',
  WORKSANS_ITALIC: 'WorkSans-Italic',
  WORKSANS_LIGHT: 'WorkSans-Light',
  WORKSANS_BLACK: 'WorkSans-Black',
  WORKSANS_BOLD_ITALIC: 'WorkSans-BoldItalic',
  WORKSANS_SEMIBOLD: 'WorkSans-SemiBold',
};

//================ MARGIN and PADDINGS ===================//
const METRICS: Record<string, Number> = {
  MAR_5: 5,
  MAR_8: 8,
  MAR_9: 9,
  MAR_10: 10,
  MAR_11: 11,
  MAR_12: 12,
  MAR_13: 13,
  MAR_14: 14,
  MAR_15: 15,
  MAR_16: 16,
  MAR_17: 17,
  MAR_18: 18,
  MAR_19: 19,
  MAR_20: 20,
  MAR_21: 21,
  MAR_22: 22,
  MAR_23: 23,
  MAR_24: 24,
  MAR_25: 25,
  MAR_29: 29,
  MAR_30: 30,
  MAR_32: 32,
  MAR_35: 35,
  MAR_40: 40,
  MAR_45: 45,
  MAR_50: 50,
  MAR_55: 55,
  MAR_60: 60,
  MAR_66: 66,
  MAR_81: 81,
  MAR_104: 104,
  MAR_110: 110,
  MAR_120: 120,
  MAR_131: 131,
};

//==================== Define Colors ========================//
const COLORS: Record<string, string | any> = {
  GRAY_BACKGROUND: 'rgba(190,190,190,0.5)',
  GRAY: '#D8D8D8',
  BORDER_COLOR: '#E4E4E499',
  DROPDOWNBORDERCOLOR: '#ECF1F3',
  WHITE: '#FFFFFF',
  BLACK: 'black',
  RED: 'red',
  GREEN: 'green',
  GRAY_255_6: 'rgba(255,255,255,0.6)',
  GOLD: '#E6C65B',
  PLACEHOLDER: '#999999',
  BLUE: '#3B68FF',
  TABCOLOR: '#136548',
  TABUNSELECTED: '#181818',
  GRAYBUTTON: '#868686',
  RESEND: '#136548',
  PRE_COLOR: ['#BF0D0D', '#9D0707'],
  PERFECT_COLOR: ['#9F43CC', '#31CA18', '#188ACA', '#5118CA', '#EFAE06'],
  WORST_COLOR: ['#FEBABA', '#CC4343', '#FD8484', '#A41717', '#C02828'],
  INACTIVE:['lightgrey', 'lightgrey'],
  SELECTION:'#FF9900',
  MAIN:'#006641'
};

export {
  HTTP_CODES,
  FONT_FAMILIES,
  URIS,
  COLORS,
  METRICS,
  ENDPOINTS,
  STATIC_PAGE,
  REGEX,
};
