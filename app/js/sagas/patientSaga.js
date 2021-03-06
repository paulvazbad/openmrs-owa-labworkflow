import {
  call,
  put,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import {
  patientRest,
  constantsRest,
  encounterRest,
  orderRest,
} from '@openmrs/react-components';
import actionTypes, { FETCH_PATIENT_LAB_TEST_RESULTS } from '../actions/actionTypes';
import patientAction from '../actions/patientAction';

function* getPatient(action) {
  try {
    const response = yield call(patientRest.getPatient, {
      patientUuid: action.payload.patientUuid,
    });
    if (response) {
      yield put(patientAction.getPatientSucceeded(response));
      yield put(patientAction.addPatient(response));
      yield put(patientAction.setSelectedPatient(response.uuid));
    }
  } catch (e) {
    yield put(patientAction.getPatientFailed(e.message));
  }
}

export function* patientSagas() {
  yield takeLatest(actionTypes.SET_PATIENT.REQUESTED, getPatient);
}

function* fetchAndSetTestResults(action) {
  const { patientUUID } = action;
  try {
    const encounterTypeResponse = yield call(constantsRest.fetchLabResultsEncounterType);
    const labResultsTestOrderTypeResponse = yield call(constantsRest.fetchLabResultsTestOrderType);
    if (encounterTypeResponse && labResultsTestOrderTypeResponse) {
      const labResultsTestOrderType = labResultsTestOrderTypeResponse.results[0].value;
      const encounterTypeUUID = encounterTypeResponse.results[0].value;
      const patientOrdersResponse = yield call(orderRest.fetchAllOrdersByPatient, patientUUID,
        labResultsTestOrderType);

      const patientEncountersResponse = yield call(
        encounterRest.fetchEncountersByPatient,
        patientUUID,
        encounterTypeUUID,
      );

      if (patientOrdersResponse && patientEncountersResponse) {
        if (patientOrdersResponse.results.length) {
          yield put(patientAction.setPatientData({
            meta: {
              orders: patientOrdersResponse.results.filter(order => order.action !== "DISCONTINUE"),
              encounters: patientEncountersResponse.results,
            },
            patientUUID,
          }));
        }
      }
    }
  } catch (e) {
    yield put(patientAction.getPatientFailed(e.message));
  }
}

export function* fetchPatientTestResults() {
  yield takeEvery(FETCH_PATIENT_LAB_TEST_RESULTS, fetchAndSetTestResults);
}
