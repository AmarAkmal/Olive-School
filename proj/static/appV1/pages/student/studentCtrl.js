(function () {
    'use strict';
    angular.module('BlurAdmin.pages.student').directive('studentbirthday', function () {
        return function (scope, element, $rootScope) {

            element.datepicker({
                dateFormat: 'dd MM yy', showOtherMonths: true, selectOtherMonths: true,
                changeYear: true,
                onSelect: function (selectedDate,) {
                    scope.student_birthday = selectedDate;
                    // rootScope.$broadcast('load_list_report')


                }
            });
        };
    });

    angular.module('BlurAdmin.pages.student').controller('student_listCtrl', ['$scope', '$uibModal', 'baProgressModal', '$http', 'toastr', '$window', '$rootScope', student_listCtrl]);


    function student_listCtrl($scope, $uibModal, baProgressModal, $http, toastr, $window, $rootScope) {

        $scope.add_student = function () {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: '../static/app' + gversion + '/pages/student/widgets/create_student.html',
                controller: 'student_createCtrl',
                size: 'lg',

            });

            modalInstance.result.finally(function () {
                // loadDatauser();
            });

        };
        $scope.select_intake = {'selected': 'All', 'options': ['1', '2', '3']};


    }


})();
