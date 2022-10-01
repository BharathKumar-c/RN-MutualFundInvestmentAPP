import { combineReducers } from '@reduxjs/toolkit';

import onboarding from './onboarding';
import onboardingStepTwo from './onboarding/StepTwo';
import onboardingStepThree from './onboarding/StepThree';
import onboardingProgress from './onboarding/OnboardingProgress';
import auth from './auth';
import generalUtil from './generalUtil';
import plans from './plans';
import permission from './permission';

const rootReducer = combineReducers({
  onboarding,
  onboardingStepTwo,
  onboardingStepThree,
  auth,
  generalUtil,
  onboardingProgress,
  plans,
  permission,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
