import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import Header from '../components/Header/Header';
import { assets } from '../constants';
import {
  AddPension,
  CameraAccessDenied,
  CameraAccessIsRequired,
  ChooseYourPlan,
  ConfirmDetails,
  CreatePassword,
  FaceId,
  FindYourAddress,
  FirstStepComplete,
  ForgotPassword,
  IsYourDocumentReadable,
  IsYourIDPhotoClear,
  IsYourProfilePhotoClear,
  LetsVerifyYourIdentity,
  PrepareYourDocument,
  PrepareYourId,
  ProfileIndexOne,
  ProfilePhoto,
  ResetLink,
  RetirementPlan,
  RetirementPlanGraph,
  SecondStepComplete,
  SelectDocumentScreen,
  SelectIdentityType,
  ShowPlanDetails,
  SignIn,
  SignUp,
  SignUpIntro,
  Splash,
  StepThreeInitialScreen,
  TakeSelfie,
  TaxDetails,
  TellUsAboutYou,
  TellUsAboutYou2,
  ThingsToDoScreen,
  ThirdStepComplete,
  UpdateAddress,
  UpdateConfirmDetails,
  UpdateContacts,
  UpdateCountryDob,
  UpdateTaxDetails,
  UpdateUserName,
  UpdateVerifyOtp,
  HelpCenter,
  UserProfile,
  VerifyOtp,
  Welcome,
  WhatRetireAgeScreen,
  WhatYourIncome,
  Referrals,
  LiveChat,
  ResetLinkForPhone,
  ResetPassword,
  DocumentScanner,
  DisplayDocument,
  CameraAccessDeniedDocx,
  CameraAccessIsRequiredDocx,
} from '../screens';
import { Payments, Transactions } from '../screens/Dashboard';
import DrawerNavigation from './DrawerNavigation';
import linking from './Linking';

const Stack = createStackNavigator();
const routes = [
  {
    name: 'TellUsAboutYou2',
    component: TellUsAboutYou2,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 33.2,
    progressBarStep: 1,
  },
  {
    name: 'TaxDetails',
    component: TaxDetails,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 100,
    progressBarStep: 1,
  },
  {
    name: 'FirstStepComplete',
    component: FirstStepComplete,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
  },
  {
    name: 'CreatePassword',
    component: CreatePassword,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 49.8,
    progressBarStep: 1,
  },
  {
    name: 'ConfirmDetails',
    component: ConfirmDetails,
    showHeader: true,
    headerProps: {
      showBackButton: false,
    },
    isEnableProgressBar: true,
    progressBarValue: 74.7,
    progressBarStep: 1,
  },
  {
    name: 'VerifyOtp',
    component: VerifyOtp,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 16.6,
    progressBarStep: 1,
  },
  {
    name: 'SignUp',
    component: SignUp,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 8.3,
    progressBarStep: 1,
  },
  {
    name: 'Splash',
    component: Splash,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
  },
  {
    name: 'SignIn',
    component: SignIn,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
  },
  {
    name: 'Details',
    component: SignIn,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'Welcome',
    component: Welcome,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'ProfileIndexOne',
    component: ProfileIndexOne,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
  },
  {
    name: 'TellUsAboutYou',
    component: TellUsAboutYou,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 24.9,
    progressBarStep: 1,
  },
  {
    name: 'ForgotPassword',
    component: ForgotPassword,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'ResetLink',
    component: ResetLink,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'ProfilePhoto',
    component: ProfilePhoto,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 66.4,
    progressBarStep: 1,
  },
  {
    name: 'FaceId',
    component: FaceId,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 58.1,
    progressBarStep: 1,
  },
  {
    name: 'CameraAccessIsRequired',
    component: CameraAccessIsRequired,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 28.6,
    progressBarStep: 2,
  },
  {
    name: 'LetsVerifyYourIdentity',
    component: LetsVerifyYourIdentity,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'SelectIdentityType',
    component: SelectIdentityType,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 14.3,
    progressBarStep: 2,
  },
  {
    name: 'FindYourAddress',
    component: FindYourAddress,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 41.5,
    progressBarStep: 1,
  },
  {
    name: 'SignUpIntro',
    component: SignUpIntro,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
  },
  {
    name: 'CameraAccessDenied',
    component: CameraAccessDenied,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 42.9,
    progressBarStep: 2,
  },
  {
    name: 'PrepareYourId',
    component: PrepareYourId,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 57.2,
    progressBarStep: 2,
  },
  {
    name: 'IsYourIDPhotoClear',
    component: IsYourIDPhotoClear,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 71.5,
    progressBarStep: 2,
  },
  {
    name: 'TakeSelfie',
    component: TakeSelfie,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 85.8,
    progressBarStep: 2,
  },
  {
    name: 'IsYourProfilePhotoClear',
    component: IsYourProfilePhotoClear,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 100,
    progressBarStep: 2,
  },
  {
    name: 'SecondStepComplete',
    component: SecondStepComplete,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'ChooseYourPlan',
    component: ChooseYourPlan,
    showHeader: true,
    headerProps: {
      showBackButton: false,
    },
    isEnableProgressBar: true,
    progressBarValue: 83,
    progressBarStep: 1,
  },
  {
    name: 'ShowPlanDetails',
    component: ShowPlanDetails,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 91,
    progressBarStep: 1,
  },
  {
    name: 'StepThreeInitialScreen',
    component: StepThreeInitialScreen,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
    isEnableProgressBar: true,
    progressBarValue: 10,
    progressBarStep: 3,
  },
  {
    name: 'SelectDocumentScreen',
    component: SelectDocumentScreen,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 25,
    progressBarStep: 3,
  },
  {
    name: 'PrepareYourDocument',
    component: PrepareYourDocument,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'CameraAccessDeniedDocx',
    component: CameraAccessDeniedDocx,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'CameraAccessIsRequiredDocx',
    component: CameraAccessIsRequiredDocx,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'IsYourDocumentReadable',
    component: IsYourDocumentReadable,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: true,
    progressBarValue: 90,
    progressBarStep: 3,
  },
  {
    name: 'ThirdStepComplete',
    component: ThirdStepComplete,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
    isEnableProgressBar: true,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'WhatRetireAgeScreen',
    component: WhatRetireAgeScreen,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'WhatYourIncome',
    component: WhatYourIncome,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'RetirementPlan',
    component: RetirementPlan,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'RetirementPlanGraph',
    component: RetirementPlanGraph,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
    progressBarValue: 50,
    progressBarStep: 3,
  },
  {
    name: 'ThingsToDoScreen',
    component: ThingsToDoScreen,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
    progressBarValue: 50,
    progressBarStep: 3,
    backIcon: assets.BackBtnIcon,
  },
  {
    name: 'AddPension',
    component: AddPension,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'UserProfile',
    component: UserProfile,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
    isEnableProgressBar: false,
    progressBarValue: 50,
    progressBarStep: 3,
    backIcon: assets.BackBtnIcon,
  },
  {
    name: 'Home',
    component: DrawerNavigation,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'Payments',
    component: Payments,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'Transactions',
    component: Transactions,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'UpdateAddress',
    component: UpdateAddress,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'UpdateConfirmDetails',
    component: UpdateConfirmDetails,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'UpdateCountryDob',
    component: UpdateCountryDob,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'UpdateTaxDetails',
    component: UpdateTaxDetails,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'UpdateUserName',
    component: UpdateUserName,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'UpdateContacts',
    component: UpdateContacts,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'UpdateVerifyOtp',
    component: UpdateVerifyOtp,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'Referrals',
    component: Referrals,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
    progressBarValue: 50,
    progressBarStep: 3,
    backIcon: assets.BackBtnIcon,
  },
  {
    name: 'ResetLinkForPhone',
    component: ResetLinkForPhone,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'HelpCenter',
    component: HelpCenter,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
  },
  {
    name: 'LiveChat',
    component: LiveChat,
    showHeader: false,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'ResetPassword',
    component: ResetPassword,
    showHeader: true,
    headerProps: {
      showBackButton: true,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'DocumentScanner',
    component: DocumentScanner,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
    isEnableProgressBar: false,
  },
  {
    name: 'DisplayDocument',
    component: DisplayDocument,
    showHeader: false,
    headerProps: {
      showBackButton: false,
    },
    isEnableProgressBar: false,
  },
];

function Navigation() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: true,
          gestureEnabled: false,
          cardOverlayEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {routes.map(
          ({
            name,
            component,
            progressBarStep,
            progressBarValue,
            showHeader,
            isEnableProgressBar,
            headerProps,
            backIcon,
          }) => {
            return (
              <Stack.Screen
                key={name}
                name={name}
                component={component}
                options={{
                  header: navigation => {
                    return (
                      <>
                        {showHeader && (
                          <Header
                            backIcon={backIcon}
                            navigation={navigation}
                            progressBarStep={progressBarStep}
                            progressBarValue={progressBarValue}
                            isEnableProgressBar={isEnableProgressBar}
                            headerProps={headerProps}
                          />
                        )}
                      </>
                    );
                  },
                }}
              />
            );
          },
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
