(function () {
    'use strict';


    angular.module('BlurAdmin.pages.academic').controller('academic_listCtrl', ['$scope', '$uibModal', 'baProgressModal', '$http', 'toastr', '$window', '$rootScope', academic_listCtrl]);


    function academic_listCtrl($scope, $uibModal, baProgressModal, $http, toastr, $window, $rootScope) {
        $scope.select_intake = {'selected': 'All', 'options': ['1', '2', '3']};


        $scope.add = function () {
            var modalInstance = $uibModal.open({
                animation: false,
                keyboard: false,
                backdrop: 'static',
                templateUrl: '../static/app' + gversion + '/pages/academic/widgets/create.html',
                controller: 'academicCreateCtrl',
                size: 'lg',

            });

            modalInstance.result.finally(function () {
                // loadDatauser();
            });

        };


    }


})();
