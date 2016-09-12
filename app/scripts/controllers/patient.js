'use strict';

angular.module('checkinApp')
  .controller('PatientCtrl', function ($scope, $q, moment, Pharmacy, AuthService, States, Patient, $state, $timeout, $rootScope) {

    var _today = new moment();
    $scope.today = {
      date: _today.format('MMMM') + ' ' + _today.format('D') + ', ' + _today.format('YYYY'),
      time: _today.format("HH:mm")
    };

    $rootScope.isWorking = false;
    $scope.errorMessage = '';

    $scope.patient = {};
    $scope.patient.credit_card = {};
    $scope.patientEditMode = false;
    $scope.patient_temp = {};
    $scope.pharmacies = [];
    $scope.pharmacy = {};
    $scope.chossedPharmacies = [];
    $rootScope.paymentMethod = '';
    $scope.editBillingAddress = false;
    $scope.states = States;
    $scope.errors = [];
    $scope.valid_card_number_and_type = true;
    $scope.valid_expiration_date = true;
    $scope.cardImage = '';

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
      //$scope.errors.push({name: 'This field is required'});
      //console.log( $scope.errors);
      //return false;
      angular.copy(patient_temp, $scope.patient);
      $scope.patientEditMode = false;
    };

    $scope.searchPharmacy = function () {
      $scope.searchPharmacyView = !$scope.searchPharmacyView;
    };

    $scope.selectPharmacies = function () {

      for (var i = 0; i < $scope.chossedPharmacies.length; i++) {
        if ($scope.patient.pharmacies.indexOf($scope.chossedPharmacies[i]) === -1) {
          $scope.patient.pharmacies.push($scope.chossedPharmacies[i]);
        }
      }
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
      $rootScope.paymentMethod = method;
    };

    $scope.cardMethodActive = false;
    $scope.doPayment = function () {
      orderPharmacies();

      if ($rootScope.paymentMethod == 'card') {
        $scope.cardMethodActive = true;
      } else {
        delete $scope.patient.credit_card;
        Patient.updatePatientDataAndAppointmentStage({id: $scope.patient.personal_info.id}, $scope.patient, function (response) {
          $scope.nextStep();
        });
      }
    };

    $scope.cancelPayment = function () {
      $scope.cardMethodActive = false;
    };

    $scope.makePayment = function () {
      $scope.cardMethodActive = false;
      $scope.successPayment = false;
      $scope.processPayment = true;

      Patient.updatePatientDataAndAppointmentStage({id: $scope.patient.personal_info.id}, $scope.patient, function (response) {
        $timeout(function () {
          $scope.processPayment = false;
          $scope.successPayment = true;
        }, 2000);
        //#27AE60
        //$scope.nextStep();

      });
    };

    $scope.updateTotal = function () {
      if ($scope.patient.insurance == null || $scope.patient.insurance == undefined) {
        $scope.patient.total = $scope.patient.totalOwedSum.owed_sum
      } else {
        $scope.patient.total = $scope.patient.totalOwedSum.owed_sum + $scope.patient.insurance.ins_co_pay;
      }

    }

    $scope.finished = function () {
      $state.go('return');
    };


    $scope.changeBillingAddress = function () {
      $scope.editBillingAddress = !$scope.editBillingAddress;
    };


    $scope.setFeedBack = function (value) {
      $scope.patient.feedback = value;
    };

    /**
     * @description
     * # Patient Main login functional, get all required data for patient
     */
    $scope.patientLogin = function (credentials) {
      $rootScope.isWorking = true;

      var credentials = {
        "last_name": 'test',            //credentials.last_name,
        "date_of_birth": '01/01/1990',  //moment(credentials.date_of_birth).format('MM/DD/YYYY'),
      };

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
          if (!$scope.patient.insurance.ins_co_pay) {
            $scope.patient.insurance.ins_co_pay = 0;
          }
          $scope.patient.total = $scope.patient.totalOwedSum.owed_sum + $scope.patient.insurance.ins_co_pay;

          $rootScope.isWorking = false;
          $scope.nextStep();
        });
      }, function (response) {
        $rootScope.isWorking = false;
        $scope.errorMessage = "Invalid Last Name, Date of Birth or You have not appointment for today.";
      });
    };

    var orderPharmacies = function () {
      for (var i = 0; i < $scope.patient.pharmacies.length; i++) {
        if (i === 0) {
          $scope.patient.pharmacies[i].is_primary = 1;
        } else {
          $scope.patient.pharmacies[i].is_primary = 0;
        }
      }
    };

    $scope.dragControlListeners = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return true;
      },
      itemMoved: function (event) {
        console.log(456);
      },
      orderChanged: function (event) {
        console.log(456);
      },
      containment: '#board',
      clone: true,
      allowDuplicates: false
    };

    $scope.validateCardNumber = function(number) {
      if(typeof number == 'undefined') {
        $scope.valid_card_number_and_type = false;
        return;
      }

      $scope.valid_card_number_and_type = true;

      var ntype = '';

      switch (number.toString().substring(0, 4)) {
        case '6011':
          if (String(number).length == 16) ntype = 'discover';
          break;
      }

      if(ntype === '') {
        switch (number.toString().substring(0, 2)) {
          case '51':
            if (number.toString().length == 16) ntype = 'mastercard';
            break;
          case '52':
            if (number.toString().length == 16) ntype = 'mastercard';
            break;
          case '53':
            if (number.toString().length == 16) ntype = 'mastercard';
            break;
          case '54':
            if (number.toString().length == 16) ntype = 'mastercard';
            break;
          case '55':
            if (number.toString().length == 16) ntype = 'mastercard';
            break;
          case '34':
            if (number.toString().length == 15) ntype = 'amex';
            break;
          case '37':
            if (number.toString().length == 15) ntype = 'amex';
            break;
          default:
            $scope.valid_card_number_and_type = false;
        }
      }
      

      if (number.toString().substring(0, 1) == '4' && (number.toString().length == 13 || number.toString().length == 16)) {
        ntype = 'visa';
        $scope.valid_card_number_and_type = true;
      }

      $scope.cardImage = ntype;
    };

    $scope.validateExpirationDate = function() {
      var _month = $scope.patient.credit_card.ccmonth;
      var _year = $scope.patient.credit_card.ccyear;

      var now = new Date();
      if ((parseInt(_year, 10) + 2000) < parseInt(now.getFullYear(), 10) || ((parseInt(_year, 10) + 2000) == parseInt(now.getFullYear(), 10) && parseInt(_month, 10) < parseInt(now.getMonth(), 10))) {
        $scope.valid_expiration_date = false;
      } else {
        $scope.valid_expiration_date = true;
      }
    }

  });
