'use strict';

/**
 * @ngdoc function
 * @name checkinApp.controller:PatientCtrl
 * @description
 * # PatientCtrl
 * Controller of the checkinApp
 */
angular.module('checkinApp')
    .controller('PatientCtrl', function ($scope, $q, moment, Pharmacy, AuthService, States, Patient) {
        $scope.patient = {};
        $scope.patientEditMode = false;
        States.query({countryId: 1}, function (response) {
            $scope.states = response.data;
        });

        var check = new moment();

        $scope.today = {
            date: check.format('MMMM') + ' ' + check.format('D') + ', ' + check.format('YYYY'),
            time: check.format("HH:mm")
        };

        $scope.changePatientViewType = function() {
            $scope.patientEditMode = !$scope.patientEditMode;
        };

        $scope.searchPharmacy = function(){
            $scope.searchPharmacyView = !$scope.searchPharmacyView;
        };

        $scope.pharmacies = [];
        $scope.pharmacy = {};
        $scope.doSearchPharmacy = function(pharmacy){
            pharmacy.type = 'retail';
            pharmacy.name = 'cvs';
            Pharmacy.query(pharmacy, function(response){
                $scope.pharmacies = response.data;
            });
        };

        $scope.selectPharmacy = function(pharmacy){
            $scope.patient.pharmacies.push(pharmacy);
        };

        $scope.deletePharmacy = function(pharmacy){
            var index = $scope.patient.pharmacies.indexOf(pharmacy);
            $scope.patient.pharmacies.splice(index,1);
        };

        $scope.paymentMethod = '';
        $scope.setPaymentMethod = function(method){
            $scope.paymentMethod = method;
        };

        $scope.cardMethodActive = false;
        $scope.doPayment = function(){
            if( $scope.paymentMethod == 'card') {
                $scope.cardMethodActive = true;
            } else {
                Patient.updatePatientDataAndAppointmentStage({id:$scope.patient.id}, $scope.patient, function(response){
                    $scope.nextStep();
                });
            }
        };

        $scope.cancelPayment = function(){
            $scope.cardMethodActive = false;
        };

        $scope.makePayment = function(){
            $scope.cardMethodActive = false;
            $scope.successPayment = true;
            Patient.updatePatientDataAndAppointmentStage({id:$scope.patient.id}, $scope.patient, function(response){
                console.log(response);
            });

    };

        $scope.patientLogin = function (userdata) {
            var credentials = {
                "first_name_initial": 'a',
                "last_name": 'test',
                "date_of_birth": '01/01/1990',
            };

            AuthService.patientLogin(credentials).then(function (response) {
                $scope.patient = response;
                $q.all([
                    Patient.personalInfo({id: response.id}).$promise,
                    Patient.address({id: response.id}).$promise,
                    Patient.phoneNumbers({id: response.id}).$promise,
                    Patient.pharmacies({id: response.id}).$promise,
                    Patient.insurance({id: response.id, index: 0}).$promise,
                    Patient.totalOwedSum({id: response.id}).$promise,
                    Patient.emergencyContacts({id: response.id}).$promise,
                ]).then(function (response) {
                    $scope.patient.personalInfo = response[0].data[0];
                    $scope.patient.address = response[1].data;
                    $scope.patient.phoneNumbers = response[2].data;
                    $scope.patient.pharmacies = response[3].data;
                    $scope.patient.insurance = response[4].data;
                    $scope.patient.totalOwedSum = response[5].data;
                    $scope.patient.emergencyContacts = response[6].data;

                    console.log($scope.patient);
                    $scope.nextStep();
                });
                //$scope.nextStep();
            }, function (response) {

            });
        };


        $scope.steps = [
            {title: 'Step 1 Log in', passed: 0, active: 1},
            {title: 'Step 2 Patient Profile', passed: 0, active: 0},
            {title: 'Step 3 Pharmacy', passed: 0, active: 0},
            {title: 'Step 4 Co-Pay', passed: 0, active: 0},
            {title: 'Step 5 Finished', passed: 0, active: 0}
        ];

        $scope.currentStep = 0;

        $scope.nextStep = function () {
            var _count = $scope.steps.length;
            for (var i = 0; i < _count; i++) {
                if ($scope.steps[i].active === 0) {
                    $scope.steps[i - 1].passed = 1;
                    $scope.steps[i].active = 1;
                    $scope.currentStep = i;
                    break;
                }
            }
        };

        $scope.backStep = function () {
            for (var i = $scope.steps.length - 1; i > 0; i--) {
                if ($scope.steps[i].active === 1) {
                    $scope.steps[i].active = 0;
                    $scope.steps[i].passed = 0;
                    $scope.steps[i - 1].passed = 0;
                    $scope.steps[i - 1].active = 1;
                    $scope.currentStep = i - 1;
                    break;
                }
            }
        };


    });
