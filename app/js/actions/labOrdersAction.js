import { axiosInstance } from '../config';
import {
  FETCH_LAB_ORDERS,
  SET_LAB_TEST,
  FETCH_LAB_TEST_RESULTS,
  SET_ORDER_LAB_ENCOUNTER,
} from './actionTypes';

export const fetchLabOrders = (testOrderType, options) => ({
  type: FETCH_LAB_ORDERS,
  payload: axiosInstance.get(`order?s=default&totalCount=true&sort=desc&status=active&orderTypes=${testOrderType}&activatedOnOrAfterDate=${options.dateFromField}&activatedOnOrBeforeDate=${options.dateToField}&v=full`),
});

export const fetchLabTestResults = (patientUuid, conceptUuid) => ({
  type: FETCH_LAB_TEST_RESULTS,
  payload: axiosInstance.get(`obs/?patient=${patientUuid}&concept=${conceptUuid}&v=custom:(id,uuid,display,obsDatetime,value:(id,uuid,display,name:(uuid,name)),encounter:(id,uuid,encounterDatetime,obs:(uuid,display,value)))`),
});

export const setLabTestTypes = testTypes => ({
  type: SET_LAB_TEST,
  testTypes,
});

export const setOrderLabEncounter = (count, order) => ({
  type: `${SET_ORDER_LAB_ENCOUNTER}_${count}`,
  order,
});
