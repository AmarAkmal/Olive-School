(function () {
    'use strict';


    angular.module('BlurAdmin.pages.account').controller('account_listCtrl', ['$scope', '$uibModal', '$http', 'toastr',  '$rootScope', account_listCtrl]);


    function account_listCtrl($scope, $uibModal, $http, toastr , $rootScope) {

        $scope.select_intake = {'selected': 'All', 'options': ['1', '2', '3']};
        $scope.add_invoice = function () {
            var modalInstance = $uibModal.open({
                animation: false,
                keyboard: false,
                templateUrl: '../static/app' + gversion + '/pages/account/widgets/create_invoice.html',
                controller: 'account_createCtrl',
                size: 'lg',

            });

            modalInstance.result.finally(function () {
                // loadDatauser();
            });

        };


    }


})();
