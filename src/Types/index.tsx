// =================================== Types define here ===================================

import { Image, StyleProp, TextStyle, ViewStyle } from "react-native";

// ************************* user *****************************
export interface User  {
    email:string;
    firstName :string;
    lastName:string;
    mobileNo:string|number;
  }

// ************************* error *****************************
export interface ERROR{
    msg?:null|string;
}

// ************************* loginBody *****************************
export interface loginBody{
    email?:string;
    password?:string;
}

// ************************* asyncData *****************************
export interface data{
    email:string;
    password:string;
}

// ************************* RegisterState *****************************
export interface RegisterState {
    value:any;
}

// ************************* dashboardData *****************************
export interface dashboardData{
    name:string|undefined;
    email:string|undefined;
    mobile:string|undefined;
}

// ************************* Posts *****************************
export interface Posts{
    data?:Array<[]>|any;
    id:string;
    text:string;
    image:string;
}

// ************************* ApiCall *****************************
export interface apiData{
    data: object|any|null;
    isLoading: boolean;
    error: string|null;
}

// ************************* drawerMenu *****************************
export interface drawerMenu{
    name:string;
    image:object|string;
    isActive:boolean;
    screen:string;
}

// ************************* drawerSelect *****************************
export interface drawerSelect{
    name:string;
    screen:string;
}

// ************************** loaderProps *****************************
export interface loaderProps{
    loading:boolean;
}

// ************************** customButtonProps *****************************
export interface customButtonProps {
    press?: () => void;
    style?: StyleProp<ViewStyle>;
    label?: string;
    txtStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    image?: Image;
    color?: Array<string>;
    disable?:boolean; 
  }

// ************************** textBoxProps *****************************
 export interface textBoxProps {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
    validate?: (value: string) => void;
    secure?: boolean;
    num?: boolean;
    length?: number;
    containerStyle?: StyleProp<ViewStyle>;
    edit?: boolean;
  }

// ********************* booking list **********************************
export interface bookingList {
    id: number;
    name: string;
    vehicleNo: string;
    location: string;
    time: string;
    date: string;
    price: string;
}

// ********************** Array Data*********************************
export interface arrayData{
    [key:string]:string|Number
}
// ************************** dropDown Array *******************************
export interface dropDown{
    label:string;
    value:string|Number;
}

// ************************** balls Array *******************************
export interface balls{
    id:string|number;
    balls:string|number;
}

// **************************** userData*********************************
export interface userData{
    name:string;
    email:string;
    height:string;
    weight:string;
    mobile:string;
    gender:string;
    dob:string;
    createdAt:number|string;
    updatedAt:number|string;
    profilePic:string;
}

// **************************** ballsArray *******************************
export interface ballsArray{
    ball:number;
    performance:string;
    shot:string;
    analysis?:string;
}

// ************************** graph Array *******************************
export interface graphData{
    x:string;
    y:number
}
