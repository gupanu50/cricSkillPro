//======================= Screen Names ===================//
const SCREENS: Record<string, string> = {
    MAIN: 'dashboard',
    TABS: 'tabs',
    SPLASH: 'splash',
    OTP: 'otp',
    LOGIN: 'login',
    SIGNUP: 'signup',
    PROFILE:'profile',
    SESSION:'session',
    REGISTER: 'register',
    CREATESESSION: 'createsession',
    BATTINGANALYSIS: 'battinganalysis',
    BOWLINGANALYSIS: 'bowlinganalysis',
    SESSIONDETAILS: 'sessiondetails',
    UPDATEPROFILE: 'updateprofile',
    LEARN: 'learn',
};

// =================== Messages ===========================//
const MESSAGES:Record<string,string> ={
    LOGIN:'',
    LOGOUT:'You are logged out!!',
    ERROR_LOGIN:'Please try again after some time',
    SAVE_DATA:'Your data has been saved successfully!!',
    ERROR_UPDATEDATA:'Error updating user data, Please try later',
    ERROR:'We encountered an issue, please try again later!',
    SINGLE_BALL:"You don't played a single ball!!",
    SESSION:'Your Session Saved Successfully!!'
}

//==================== Validation Messages =================//
const VALIDATE_FORM: Record<string, string> = {
    FIRST_NAME: 'Please enter first name.',
    LAST_NAME: 'Please enter last name.',
    EMAIL: 'Please enter email address.',
    EMAIL_VALID: 'Please enter valid email address.',
    PASSWORD: 'Please enter password.',
    VALID_PASSWORD: 'Please enter valid password eg. Arsy@898',
    DOB: 'Please enter DOB.',
    SCREEN_NAME: 'Please enter screen name',
    C_PASSWORD: 'Please enter confirm password.',
    MISMATCH: "Password doesn't match",
    LOGOUT: 'Are you sure you want to logout?',
    PRIVACY: 'Please select post privacy.',
    ADDRESS: 'Please enter location',
    GENDER: 'Please select gender.',
    TERMS_AND_CODITION: 'Please Accept Terms & Conditions and Privacy Policy.',
    NAME:'Please enter name',
    VALID_NAME:'Please enter valid name',
    VALID_FIRST_NAME:'Please enter valid first name',
    VALID_LAST_NAME:'Please enter valid last name',
    MOBILE:'Please enter mobile no.',
    MOBILE_VALID:'Please enter valid mobile no.',
    STATION:'Please select Charging Station.',
    VEHICLE:'Please select Vehicle.',
    DATE:'Please select any Date.',
    SLOT:'Please select any Slot.',
    NEW_PASSWORD:'Please enter a new password',
    WRONG_OTP:'Please Enter Correct OTP',
    WEIGHT:'*Please enter your weight.',
    VALID_WEIGHT:'*Please enter valid data',
    HEIGHT:'*Please enter your height.',
    SESSION:'*Please enter session name.',
    VALID_SESSION:'*Session name already exists.'
};

export {
    SCREENS,
    VALIDATE_FORM,
    MESSAGES
};