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
        var check = new moment();
        $scope.today = {
            date: check.format('MMMM') + ' ' + check.format('D') + ', ' + check.format('YYYY'),
            time: check.format("HH:mm")
        };

        States.query({countryId: 1}, function (response) {
            $scope.states = response.data;
        });

      $scope.patient_temp={};
        $scope.changePatientViewType = function() {
            $scope.patientEditMode = !$scope.patientEditMode;
            if($scope.patientEditMode) {
                angular.copy($scope.patient, $scope.patient_temp); 
                console.log(45);           
            }
        };

        $scope.confirmPatientChanges = function(patient_temp){
           angular.copy(patient_temp, $scope.patient);
            $scope.patientEditMode = false;
            console.log($scope.patient);
        };

        $scope.searchPharmacy = function(){
            $scope.searchPharmacyView = !$scope.searchPharmacyView;
        };

        $scope.selectPharmacies = function(){
           $scope.patient.pharmacies = $scope.chossedPharmacies; 
           $scope.searchPharmacyView = false;
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

        $scope.chossedPharmacies = [];
        $scope.selectPharmacy = function(pharmacy){ 
            var index = $scope.chossedPharmacies.indexOf(pharmacy);
            if(index === -1) {
                pharmacy.selected = true;        
                $scope.chossedPharmacies.push(pharmacy);
            } else {
                 $scope.chossedPharmacies.splice(index,1);
                  pharmacy.selected = false;
            }
           
        };      

        $scope.deletePharmacy = function(pharmacy){
            var index = $scope.patient.pharmacies.indexOf(pharmacy);
            $scope.patient.pharmacies.splice(index,1);
        };

        $scope.paymentMethod = '';
        $scope.setPaymentMethod = function(method){
            console.log(method);
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
                   $scope.patient.phoneNumbers = response[2].data[0];
                   $scope.patient.pharmacies = response[3].data;
                   $scope.patient.insurance = response[4].data;
                   $scope.patient.totalOwedSum = response[5].data;
                   $scope.patient.emergencyContacts = response[6].data;
            
                   console.log($scope.patient);
                   $scope.nextStep();
               });
            
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


        ////////////////////////////////////////////
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }



    });
