(function () {
        'use strict';

        angular.module('BlurAdmin.pages.academic')
            .controller('aideedViewCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "items", "$uibModal", aideedViewCtrl]);

        function aideedViewCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, items, $uibModal) {
            $scope.form = {};
            $scope.form = items;
            console.log(items);
        }
    }

)();
