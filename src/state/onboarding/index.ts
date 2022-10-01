import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

type OnboardingState = {
  userId: number | null;
  email: string;
  emailError: string;
  phoneNumber: string;
  phoneNumError: string;
  countryCode: string;
  callingCode: string;
  termsCheck: boolean;
  termsCheckError: boolean;
  selectPlan: {
    selectedPlan: number;
    confirmPlan: number;
    planRisk: number;
  };
  createPassword: {
    lowerCase: boolean;
    upperCase: boolean;
    characterCase: boolean;
    numberCase: boolean;
    passwordError: boolean;
    password: any;
  };
  confirmpassword: any;
  confirmpasswordError: string;
  firstName: string;
  lastName: string;
  country: string;
  citizenship: string;
  dob: any;
  password: string;
  firstNameError: string;
  lastNameError: string;
  dobError: string;
  employmentStatusId: number;
  employmentStatus: string;
  ppsnNumber: string;
  ppsnNumberError: string;
  profilePhoto: {
    // base64: string;
    url: string;
  };
  emailToken: string;
  phoneToken: string;
  emailOTP: number;
  allCountryList: allCountryList[];
  popularCountryList: popularCountryList[];
  address: string;
  retireAge: number;
  retireAmount: number;
  lifeTimeGoal: string;
  activateGoal: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  verifiedEmail: string;
  verifiedPhone: string;
  payMethod: string;
  isEnableBiometrics: boolean;
};

interface popularCountryList {
  id: number;
  name: string;
}

interface allCountryList {
  id: number;
  name: string;
}

interface employmentStatus {
  id: number;
  name: string;
}

const initialState: OnboardingState = {
  userId: null,
  email: '',
  emailError: '',
  phoneNumber: '',
  phoneNumError: '',
  countryCode: 'IE',
  callingCode: '353',
  termsCheck: false,
  termsCheckError: false,
  selectPlan: {
    selectedPlan: 0,
    confirmPlan: 0,
    planRisk: 0,
  },
  createPassword: {
    lowerCase: false,
    upperCase: false,
    characterCase: false,
    numberCase: false,
    passwordError: false,
    password: '',
  },
  confirmpassword: '',
  confirmpasswordError: '',
  firstName: '',
  lastName: '',
  country: 'Ireland',
  dob: new Date(),
  password: '',
  firstNameError: '',
  lastNameError: '',
  citizenship: 'Irish',
  dobError: '',
  employmentStatusId: 3,
  employmentStatus: 'Working',
  ppsnNumber: '',
  ppsnNumberError: '',
  profilePhoto: {
    // base64: '',
    url: '',
  },
  emailToken: '',
  phoneToken: '',
  emailOTP: 1,
  popularCountryList: [
    { id: 1, name: 'Ireland' },
    { id: 2, name: 'United States of America' },
    { id: 3, name: 'Australia' },
    { id: 4, name: 'India' },
  ],
  allCountryList: [
    { id: 1, name: 'Afghanistan' },
    { id: 2, name: 'Albania' },
    { id: 3, name: 'Algeria' },
    { id: 4, name: 'Andorra' },
    { id: 5, name: 'Angola' },
    { id: 6, name: 'Antigua and Barbuda' },
    { id: 7, name: 'Argentina' },
    { id: 8, name: 'Armenia' },
    { id: 9, name: 'Australia' },
    { id: 10, name: 'Austria' },
    { id: 11, name: 'Azerbaijan' },
    { id: 12, name: 'Bahamas' },
    { id: 13, name: 'Bahrain' },
    { id: 14, name: 'Bangladesh' },
    { id: 15, name: 'Barbados' },
    { id: 16, name: 'Belarus' },
    { id: 17, name: 'Belgium' },
    { id: 18, name: 'Belize' },
    { id: 19, name: 'Benin' },
    { id: 20, name: 'Bhutan' },
    { id: 21, name: 'Bolivia' },
    { id: 22, name: 'Bosnia and Herzegovina' },
    { id: 23, name: 'Botswana' },
    { id: 24, name: 'Brazil' },
    { id: 25, name: 'Brunei' },
    { id: 26, name: 'Bulgaria' },
    { id: 27, name: 'Burkina Faso' },
    { id: 28, name: 'Burundi' },
    { id: 29, name: "Cote d'Ivoire" },
    { id: 30, name: 'Cabo Verde' },
    { id: 31, name: 'Cambodia' },
    { id: 32, name: 'Cameroon' },
    { id: 33, name: 'Canada' },
    { id: 34, name: 'Central African Republic' },
    { id: 35, name: 'Chad' },
    { id: 36, name: 'Chile' },
    { id: 37, name: 'China' },
    { id: 38, name: 'Colombia' },
    { id: 39, name: 'Comoros' },
    { id: 40, name: 'Congo (Congo-Brazzaville)' },
    { id: 41, name: 'Costa Rica' },
    { id: 42, name: 'Croatia' },
    { id: 43, name: 'Cuba' },
    { id: 44, name: 'Cyprus' },
    { id: 45, name: 'Czechia (Czech Republic)' },
    { id: 46, name: 'Democratic Republic of the Congo' },
    { id: 47, name: 'Denmark' },
    { id: 48, name: 'Djibouti' },
    { id: 49, name: 'Dominica' },
    { id: 50, name: 'Dominican Republic' },
    { id: 51, name: 'Ecuador' },
    { id: 52, name: 'Egypt' },
    { id: 53, name: 'El Salvador' },
    { id: 54, name: 'Equatorial Guinea' },
    { id: 55, name: 'Eritrea' },
    { id: 56, name: 'Estonia' },
    { id: 57, name: 'Eswatini (fmr. "Swaziland")' },
    { id: 58, name: 'Ethiopia' },
    { id: 59, name: 'Fiji' },
    { id: 60, name: 'Finland' },
    { id: 61, name: 'France' },
    { id: 62, name: 'Gabon' },
    { id: 63, name: 'Gambia' },
    { id: 64, name: 'Georgia' },
    { id: 65, name: 'Germany' },
    { id: 66, name: 'Ghana' },
    { id: 67, name: 'Greece' },
    { id: 68, name: 'Grenada' },
    { id: 69, name: 'Guatemala' },
    { id: 70, name: 'Guinea' },
    { id: 71, name: 'Guinea-Bissau' },
    { id: 72, name: 'Guyana' },
    { id: 73, name: 'Haiti' },
    { id: 74, name: 'Holy See' },
    { id: 75, name: 'Honduras' },
    { id: 76, name: 'Hungary' },
    { id: 77, name: 'Iceland' },
    { id: 78, name: 'India' },
    { id: 79, name: 'Indonesia' },
    { id: 80, name: 'Iran' },
    { id: 81, name: 'Iraq' },
    { id: 82, name: 'Ireland' },
    { id: 83, name: 'Israel' },
    { id: 84, name: 'Italy' },
    { id: 85, name: 'Jamaica' },
    { id: 86, name: 'Japan' },
    { id: 87, name: 'Jordan' },
    { id: 88, name: 'Kazakhstan' },
    { id: 89, name: 'Kenya' },
    { id: 90, name: 'Kiribati' },
    { id: 91, name: 'Kuwait' },
    { id: 92, name: 'Kyrgyzstan' },
    { id: 93, name: 'Laos' },
    { id: 94, name: 'Latvia' },
    { id: 95, name: 'Lebanon' },
    { id: 96, name: 'Lesotho' },
    { id: 97, name: 'Liberia' },
    { id: 98, name: 'Libya' },
    { id: 99, name: 'Liechtenstein' },
    { id: 100, name: 'Lithuania' },
    { id: 101, name: 'Luxembourg' },
    { id: 102, name: 'Madagascar' },
    { id: 103, name: 'Malawi' },
    { id: 104, name: 'Malaysia' },
    { id: 105, name: 'Maldives' },
    { id: 106, name: 'Mali' },
    { id: 107, name: 'Malta' },
    { id: 108, name: 'Marshall Islands' },
    { id: 109, name: 'Mauritania' },
    { id: 110, name: 'Mauritius' },
    { id: 111, name: 'Mexico' },
    { id: 112, name: 'Micronesia' },
    { id: 113, name: 'Moldova' },
    { id: 114, name: 'Monaco' },
    { id: 115, name: 'Mongolia' },
    { id: 116, name: 'Montenegro' },
    { id: 117, name: 'Morocco' },
    { id: 118, name: 'Mozambique' },
    { id: 119, name: 'Myanmar (formerly Burma)' },
    { id: 120, name: 'Namibia' },
    { id: 121, name: 'Nauru' },
    { id: 122, name: 'Nepal' },
    { id: 123, name: 'Netherlands' },
    { id: 124, name: 'New Zealand' },
    { id: 125, name: 'Nicaragua' },
    { id: 126, name: 'Niger' },
    { id: 127, name: 'Nigeria' },
    { id: 128, name: 'North Korea' },
    { id: 129, name: 'North Macedonia' },
    { id: 130, name: 'Norway' },
    { id: 131, name: 'Oman' },
    { id: 132, name: 'Pakistan' },
    { id: 133, name: 'Palau' },
    { id: 134, name: 'Palestine State' },
    { id: 135, name: 'Panama' },
    { id: 136, name: 'Papua New Guinea' },
    { id: 137, name: 'Paraguay' },
    { id: 138, name: 'Peru' },
    { id: 139, name: 'Philippines' },
    { id: 140, name: 'Poland' },
    { id: 141, name: 'Portugal' },
    { id: 142, name: 'Qatar' },
    { id: 143, name: 'Romania' },
    { id: 144, name: 'Russia' },
    { id: 145, name: 'Rwanda' },
    { id: 146, name: 'Saint Kitts and Nevis' },
    { id: 147, name: 'Saint Lucia' },
    { id: 148, name: 'Saint Vincent and the Grenadines' },
    { id: 149, name: 'Samoa' },
    { id: 150, name: 'San Marino' },
    { id: 151, name: 'Sao Tome and Principe' },
    { id: 152, name: 'Saudi Arabia' },
    { id: 153, name: 'Senegal' },
    { id: 154, name: 'Serbia' },
    { id: 155, name: 'Seychelles' },
    { id: 156, name: 'Sierra Leone' },
    { id: 157, name: 'Singapore' },
    { id: 158, name: 'Slovakia' },
    { id: 159, name: 'Slovenia' },
    { id: 160, name: 'Solomon Islands' },
    { id: 161, name: 'Somalia' },
    { id: 162, name: 'South Africa' },
    { id: 163, name: 'South Korea' },
    { id: 164, name: 'South Sudan' },
    { id: 165, name: 'Spain' },
    { id: 166, name: 'Sri Lanka' },
    { id: 167, name: 'Sudan' },
    { id: 168, name: 'Suriname' },
    { id: 169, name: 'Sweden' },
    { id: 170, name: 'Switzerland' },
    { id: 171, name: 'Syria' },
    { id: 172, name: 'Tajikistan' },
    { id: 173, name: 'Tanzania' },
    { id: 174, name: 'Thailand' },
    { id: 175, name: 'Timor-Leste' },
    { id: 176, name: 'Togo' },
    { id: 177, name: 'Tonga' },
    { id: 178, name: 'Trinidad and Tobago' },
    { id: 179, name: 'Tunisia' },
    { id: 180, name: 'Turkey' },
    { id: 181, name: 'Turkmenistan' },
    { id: 182, name: 'Tuvalu' },
    { id: 183, name: 'Uganda' },
    { id: 184, name: 'Ukraine' },
    { id: 185, name: 'United Arab Emirates' },
    { id: 186, name: 'United Kingdom' },
    { id: 187, name: 'United States of America' },
    { id: 188, name: 'Uruguay' },
    { id: 189, name: 'Uzbekistan' },
    { id: 190, name: 'Vanuatu' },
    { id: 191, name: 'Venezuela' },
    { id: 192, name: 'Vietnam' },
    { id: 193, name: 'Yemen' },
    { id: 194, name: 'Zambia' },
    { id: 195, name: 'Zimbabwe' },
  ],
  address: '',
  retireAge: 0,
  retireAmount: 0,
  lifeTimeGoal: '',
  activateGoal: false,
  emailVerified: false,
  phoneVerified: false,
  verifiedEmail: '',
  verifiedPhone: '',
  payMethod: '',
  isEnableBiometrics: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: initialState,
  reducers: {
    resetState: () => initialState,
    setUserId: (state, { payload }: PayloadAction<number>) => {
      state.userId = payload;
    },
    setEmail: (state, { payload }: PayloadAction<string>) => {
      state.email = payload;
      let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

      if (payload.length === 0) {
        state.emailError = 'Email address must be entered';
      } else if (emailReg.test(payload) === false) {
        state.emailError = 'Enter valid email address';
      } else if (emailReg.test(payload) === true) {
        state.emailError = '';
      }
    },
    setEmailError: (state, { payload }: PayloadAction<string>) => {
      state.emailError = payload;
    },
    setPhoneNumber: (state, { payload }: PayloadAction<string>) => {
      state.phoneNumError = '';
      state.phoneNumber = payload;
    },
    setPhoneNumError: (state, { payload }: PayloadAction<string>) => {
      state.phoneNumError = payload;
    },
    setCountryCode: (state, { payload }: PayloadAction<string>) => {
      state.countryCode = payload;
    },
    setCallingCode: (state, { payload }: PayloadAction<string>) => {
      payload ? (state.callingCode = payload) : (state.callingCode = '');
    },
    setTermsCheck: (state, { payload }: PayloadAction<boolean>) => {
      state.termsCheck = payload;
      state.termsCheckError = !payload;
    },
    setSelectedPlan: (state, { payload }: PayloadAction<number>) => {
      state.selectPlan.selectedPlan = payload;
    },
    setConfirmPlan: (state, { payload }: PayloadAction<any>) => {
      const { riskLevel, selectedPlan } = payload;
      state.selectPlan.confirmPlan = selectedPlan;
      state.selectPlan.planRisk = riskLevel;
    },
    setCreatePassword: (state, { payload }: PayloadAction<any>) => {
      const isUpperCase = /^(?=.*[A-Z])/;
      const isLowerCase = /^(?=.*[a-z])/;
      const isNumber = /^(?=.*[0-9])/;
      const isSpecialCharacters = /^(?=.*\W)/;

      const passwordInputValue = payload;

      //for password
      if (passwordInputValue.length + 1 > 0) {
        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        const minLengthRegExp = /.{9,}/;
        const passwordLength = passwordInputValue.length;
        const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
        const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
        const digitsPassword = digitsRegExp.test(passwordInputValue);
        const specialCharPassword = specialCharRegExp.test(passwordInputValue);
        const minLengthPassword = minLengthRegExp.test(passwordInputValue);

        if (uppercasePassword) {
          state.createPassword.upperCase = true;
        } else {
          state.createPassword.upperCase = false;
        }
        if (lowercasePassword) {
          state.createPassword.lowerCase = true;
        } else {
          state.createPassword.lowerCase = false;
        }
        if (digitsPassword) {
          state.createPassword.numberCase = true;
        } else {
          state.createPassword.numberCase = false;
        }
        if (passwordInputValue.length > 9) {
          state.createPassword.characterCase = true;
        } else {
          state.createPassword.characterCase = false;
        }

        if (
          passwordLength === 0 ||
          !uppercasePassword ||
          !lowercasePassword ||
          !digitsPassword ||
          !minLengthPassword
        ) {
          state.createPassword.passwordError = true;
          state.createPassword.password = passwordInputValue;
        } else {
          state.createPassword.passwordError = false;
          state.createPassword.password = passwordInputValue;
        }
      }
    },
    setConfirmPassword: (state, { payload }: PayloadAction<any>) => {
      const confirmPsw = payload;
      const password = state.createPassword.password;
      if (confirmPsw.length > 0 && password.length > 0) {
        if (password !== confirmPsw) {
          state.confirmpassword = confirmPsw;
          state.confirmpasswordError =
            'Password and confirm password should match';
        } else {
          state.confirmpasswordError = '';
        }
      } else {
        state.confirmpasswordError = '';
      }

      state.confirmpassword = payload;
    },
    handleFirstName: (state, { payload }: PayloadAction<string>) => {
      state.firstName = payload;

      const fName = payload;

      const regExpOnlyForAlphabets = /^[\sa-zA-Z']+$/;
      const regTest = regExpOnlyForAlphabets.test(fName);

      if (payload === '') {
        state.firstNameError = 'First name is required';
      } else if (!regTest) {
        state.firstNameError = 'Numbers and special characters are not allowed';
      } else {
        state.firstNameError = '';
      }
    },
    handleLastName: (state, { payload }: PayloadAction<string>) => {
      state.lastName = payload;

      const lName = payload;

      const regExpOnlyForAlphabets = /^[\sa-zA-Z']+$/;
      const regTest = regExpOnlyForAlphabets.test(lName);
      if (payload === '') {
        state.lastName = payload;
        state.lastNameError = 'Last name is required';
      } else if (!regTest) {
        state.lastNameError = 'Numbers and special characters are not allowed';
      } else {
        state.lastNameError = '';
        state.lastName = payload;
      }
    },
    setCountry: (state, { payload }: PayloadAction<string>) => {
      state.country = payload;
    },
    setDOB: (state, { payload }: PayloadAction<Date>) => {
      state.dob = payload;
      var years = moment().diff(moment(payload), 'years', false);
      if (payload === null || years < 17) {
        state.dobError = 'Your age must be 18 or above';
      } else {
        state.dobError = '';
      }
    },
    setCitizenship: (state, { payload }: PayloadAction<string>) => {
      state.citizenship = payload;
    },
    setEmploymentStatus: (
      state,
      { payload }: PayloadAction<employmentStatus>,
    ) => {
      state.employmentStatusId = payload.id;
      state.employmentStatus = payload.name;
    },
    setPpsnNo: (state, { payload }: PayloadAction<string>) => {
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      state.ppsnNumber = payload;
      if (payload === '') {
        state.ppsnNumberError = 'Enter Personal Public Service Number';
      } else if (specialCharRegExp.test(payload)) {
        state.ppsnNumberError =
          'Personal Public Service Number must be numbers';
      } else if (payload.length != 9) {
        state.ppsnNumberError =
          'Personal Public Service Number must be 9 digits';
      } else {
        state.ppsnNumberError = '';
      }
    },
    setProfilePhoto: (state, { payload }: PayloadAction<any>) => {
      // const { data, path } = payload;
      // state.profilePhoto.base64 = data;
      state.profilePhoto.url = payload;
    },
    setEmailToken: (state, { payload }: PayloadAction<string>) => {
      state.emailToken = payload;
    },
    setPhoneToken: (state, { payload }: PayloadAction<string>) => {
      state.phoneToken = payload;
    },
    setAddress: (state, { payload }: PayloadAction<string>) => {
      state.address = payload;
    },
    setRetireAge: (state, { payload }: PayloadAction<string>) => {
      state.retireAge = parseInt(payload);
    },
    setRetireAmount: (state, { payload }: PayloadAction<string>) => {
      state.retireAmount = parseInt(payload);
      console.log('retir_amt :' + state.retireAmount);
    },
    setLifeGoal: (state, { payload }: PayloadAction<string>) => {
      state.lifeTimeGoal = payload;
    },
    setActivateGoal: (state, { payload }: PayloadAction<boolean>) => {
      state.activateGoal = payload;
    },
    setEmailVerified: (state, { payload }: PayloadAction<boolean>) => {
      state.emailVerified = payload;
    },
    setPhoneVerified: (state, { payload }: PayloadAction<boolean>) => {
      state.phoneVerified = payload;
    },
    setVerifiedEmail: (state, { payload }: PayloadAction<string>) => {
      state.verifiedEmail = payload;
    },
    setVerifiedPhone: (state, { payload }: PayloadAction<string>) => {
      state.verifiedPhone = payload;
    },
    setPayMethod: (state, { payload }: PayloadAction<string>) => {
      state.payMethod = payload;
    },
    setIsEnableBiometrics: (state, { payload }: PayloadAction<boolean>) => {
      state.isEnableBiometrics = payload;
    },
  },
});

export const {
  resetState,
  setUserId,
  setEmail,
  setPhoneNumber,
  setEmailError,
  setPhoneNumError,
  setCountryCode,
  setCallingCode,
  handleFirstName,
  handleLastName,
  setTermsCheck,
  setSelectedPlan,
  setConfirmPlan,
  setCreatePassword,
  setConfirmPassword,
  setCountry,
  setDOB,
  setCitizenship,
  setEmploymentStatus,
  setPpsnNo,
  setProfilePhoto,
  setEmailToken,
  setPhoneToken,
  setAddress,
  setRetireAge,
  setRetireAmount,
  setLifeGoal,
  setActivateGoal,
  setEmailVerified,
  setPhoneVerified,
  setVerifiedEmail,
  setVerifiedPhone,
  setPayMethod,
  setIsEnableBiometrics,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
