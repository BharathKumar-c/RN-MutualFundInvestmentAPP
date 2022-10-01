import {
  Dashboard,
  Goals,
  Help,
  Payments,
  Services,
  Transactions,
  Transfers,
  Aggregate,
} from '../../screens/Dashboard';
import { RetirementPlan } from '../../screens';
import { assets } from '../../constants';

export const routes = [
  {
    name: 'Dashboard',
    component: Dashboard,
    icon: assets.BarGraph,
    showHeader: true,
  },
  {
    name: 'Transactions',
    component: Transactions,
    icon: assets.PigBank,
    showHeader: true,
  },
  {
    name: 'Payments',
    component: Payments,
    icon: assets.BarGraph,
    showHeader: true,
  },
  {
    name: 'Transfers',
    component: Transfers,
    icon: assets.Bag,
    showHeader: true,
  },
  {
    name: 'Aggregate',
    component: Aggregate,
    icon: assets.BarGraph,
    showHeader: false,
  },
  {
    name: 'Services',
    component: Services,
    icon: assets.Bag,
    showHeader: true,
  },
  {
    name: 'Goals',
    component: RetirementPlan,
    icon: assets.PigBank,
    showHeader: true,
  },
  {
    name: 'Help',
    component: Help,
    icon: assets.BarGraph,
    showHeader: true,
  },
];
