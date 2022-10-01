import ApiUtil from '../util/ApiUtil';
import store from '../state';
import { setFundDeatils } from '../state/plans';

export const getRetirementPlanFund = async () => {
  try {
    const plans = await ApiUtil.getWithToken('user/getRetirementPlanFund');
    store.dispatch(setFundDeatils(plans?.data || null));
    return plans;
  } catch (error) {
    console.log(error);
  }
};
