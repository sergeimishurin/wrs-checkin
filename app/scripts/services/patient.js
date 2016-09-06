'use strict';

/**
 * @ngdoc service
 * @name checkinApp.patient
 * @description
 * # patient
 * Factory in the checkinApp.
 */
angular.module('checkinApp')
    .factory('Patient', function ($resource, ENV) {
        var url = ENV.apiEndpoint + '/client/patient';

        return $resource(url, {}, {
            personal_info: {
                url: url + "/personal-info/:id",
                method: 'GET',
                isArray: false
            },
            address: {
                url: url + '/address/:id',
                method: 'GET',
                params: {
                    type: 'home',
                }
            },
            phoneNumbers: {
                url: url + '/phone-numbers/:id',
                method: 'GET'
            },
            pharmacies: {
                url: url + '/pharmacy/:id',
                method: 'GET'
            },
            insurance: {
                url: url + '/insurances/:id',
                method: 'GET'
            },
            totalOwedSum: {
                url: url + '/total-owed-sum/:id',
                method: 'GET'
            },
            // emergencyContacts: {
            //     url: url + '/emergency-contacts/:id',
            //     method: 'GET'
            // },
            creditCard: {
                url: url + '/credit-card/:id',
                method: 'GET'
            },
            communicationPreferences: {
                url: url + '/communication-preferences/:id',
                method: 'GET'
            },
            updatePatientDataAndAppointmentStage: {
                method: 'PUT',
                url: url + "/checkin/:id",
               // data: patient_data,
                headers: {'Content-Type': 'application/json'}
            }

        });
    });
