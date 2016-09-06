'use strict';

/**
 * @ngdoc function
 * @name checkinApp.controller:PatientCtrl
 * @description
 * # PatientCtrl
 * Controller of the checkinApp
 */
angular.module('checkinApp')
  .controller('PatientCtrl', function ($scope, $q, moment, Pharmacy, AuthService, States, Patient,$state) {

    var _today = new moment();
    $scope.today = {
      date: _today.format('MMMM') + ' ' + _today.format('D') + ', ' + _today.format('YYYY'),
      time: _today.format("HH:mm")
    };
    $scope.patient = {};
    $scope.patientEditMode = false;
    $scope.patient_temp = {};
    $scope.pharmacies = [];
    $scope.pharmacy = {};
    $scope.chossedPharmacies = [];
    $scope.paymentMethod = '';
    $scope.editBillingAddress = false;
    $scope.states = States;

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


    //Datepicker
    $scope.dateOptions = {
      formatYear: 'mm/dd/yyyy',
      startingDay: 1,
      opened: false,
      open: function () {
        this.opened = true;
      }
    };
    $scope.dobOptions = {
      formatYear: 'mm/dd/yyyy',
      startingDay: 1,
      opened: false,
      open: function () {
        this.opened = true;
      }
    };

    States.query({countryId: 1}, function (response) {
      $scope.states = response.data;
    });


    $scope.changePatientViewType = function () {
      $scope.patientEditMode = !$scope.patientEditMode;
      if ($scope.patientEditMode) {
        angular.copy($scope.patient, $scope.patient_temp); 
      }
    };

    $scope.confirmPatientChanges = function (patient_temp) {
      angular.copy(patient_temp, $scope.patient);
      $scope.patientEditMode = false;
    };

    $scope.searchPharmacy = function () {
      $scope.searchPharmacyView = !$scope.searchPharmacyView;
    };

    $scope.selectPharmacies = function () {
      $scope.patient.pharmacies = $scope.chossedPharmacies;
      $scope.searchPharmacyView = false;
    };


    $scope.doSearchPharmacy = function (pharmacy) {
      pharmacy.type = 'retail';
      pharmacy.name = 'cvs';
      Pharmacy.query(pharmacy, function (response) {
        $scope.pharmacies = response.data;
      });
    };


    $scope.selectPharmacy = function (pharmacy) {
      var index = $scope.chossedPharmacies.indexOf(pharmacy);
      if (index === -1) {
        pharmacy.selected = true;
        $scope.chossedPharmacies.push(pharmacy);
      } else {
        $scope.chossedPharmacies.splice(index, 1);
        pharmacy.selected = false;
      }

    };

    $scope.deletePharmacy = function (pharmacy) {
      var index = $scope.patient.pharmacies.indexOf(pharmacy);
      pharmacy.selected = false;
      pharmacy.removeBoxOpened = false;
      $scope.patient.pharmacies.splice(index, 1);
    };

    $scope.openConfirmation = function (pharmacy) {
      pharmacy.removeBoxOpened = true;
      //$scope.patient.pharmacies.splice(index, 1);
    };
    $scope.closeConfirmation = function (pharmacy) {
      pharmacy.removeBoxOpened = false;
      //$scope.patient.pharmacies.splice(index, 1);
    };


    $scope.setPaymentMethod = function (method) {
      $scope.paymentMethod = method;
    };

    $scope.cardMethodActive = false;
    $scope.doPayment = function () {
      if ($scope.paymentMethod == 'card') {
        $scope.cardMethodActive = true;
      } else {
        delete $scope.patient.credit_card;
        Patient.updatePatientDataAndAppointmentStage({id:$scope.patient.personal_info.id}, $scope.patient, function(response){
            $scope.nextStep();
        });
      }
    };

    $scope.cancelPayment = function () {
      $scope.cardMethodActive = false;
    };

    $scope.makePayment = function () {
      $scope.cardMethodActive = false;
      $scope.successPayment = true;
      //If ALL validations passded
      $scope.patient.credit_card = {};
      //IF no
      // Patient.updatePatientDataAndAppointmentStage({id:$scope.patient.id}, $scope.patient, function(response){
      $scope.nextStep();
      // });
    };

    $scope.updateTotal = function() {
      $scope.patient.total = $scope.patient.totalOwedSum.owed_sum + $scope.patient.insurance.ins_co_pay;

    }

    $scope.finished = function () {
      $state.go('return');
    };


    $scope.changeBillingAddress = function () {
      $scope.editBillingAddress = !$scope.editBillingAddress;
    };

    $scope.patientLogin = function (patient_login) {
      var credentials = {
        "last_name": 'test',
        "date_of_birth": '01/01/1990',
      };

      // var credentials = {
      //   "last_name": patient_login.last_name,
      //   "date_of_birth": moment(patient_login.date_of_birth).format('MM/DD/YYYY'),
      // };

      $scope.setFeedBack = function(value) {
        $scope.patient.feedback = value;
      }

      AuthService.patientLogin(credentials).then(function (response) {
        $q.all([
          Patient.personal_info({id: response.id}).$promise,
          Patient.address({id: response.id}).$promise,
          Patient.phoneNumbers({id: response.id}).$promise,
          Patient.pharmacies({id: response.id}).$promise,
          Patient.insurance({id: response.id, index: 0}).$promise,
          Patient.totalOwedSum({id: response.id}).$promise,
          // Patient.emergencyContacts({id: response.id}).$promise,
        ]).then(function (response) {
          $scope.patient.personal_info = response[0].data[0];
          $scope.patient.personal_info.date_of_birth = new Date(response[0].data[0].date_of_birth);

          $scope.patient.address = response[1].data;
          $scope.patient.phoneNumbers = response[2].data[0];
          $scope.patient.pharmacies = response[3].data;
          $scope.patient.insurance = response[4].data;
          $scope.patient.totalOwedSum = response[5].data;
          // $scope.patient.emergencyContacts = response[6].data;
          $scope.patient.total = $scope.patient.totalOwedSum.owed_sum + $scope.patient.insurance.ins_co_pay;
          $scope.nextStep();
        });

      }, function (response) {

      });
    };
    
  });
