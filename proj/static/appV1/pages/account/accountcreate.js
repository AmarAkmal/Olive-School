(function () {
    'use strict';

    angular.module('BlurAdmin.pages.account')
        .controller('account_createCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "$uibModalStack", account_createCtrl]);

    function account_createCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, $uibModalStack) {
        $scope.ok_boleh = false
        $scope.items = [];
        $http({
            method: 'GET',
            url: ip_server + 'student/get_student_list'
        }).then(function (result) {
            $scope.student_name = result.data
        });

        // $scope.student_name= [{'id':123 ,'name':'Amar'},{'id':456 ,'name':'Samad'}]
        $scope.submit = function () {

            var fd = new FormData();
            var data = {
                "user_id": user_id,
                "student_id": $scope.student_name.selected.id,
                "year": $scope.year,
                "month": $scope.month,
                "items": $scope.items,
                "desc": $scope.desc,
                "total_pay": $scope.total,
            };


            if ($scope.attachment) {
                for (var i = 0; i < $scope.attachment.length; i++) {
                    fd.append('attachment', $scope.attachment[i]);
                }
            }

            fd.append('data', JSON.stringify(data));

            // var config = {transformRequest: angular.identity, headers: {'Content-Type': undefined}};
            $http.post(ip_server + 'account/add_invoice', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            ).then(function (response) {
                if (response.data.status === "OK") {
                    $rootScope.$broadcast('load_list_account');
                    toastr.success('Data successfully saved.', 'Success');
                    $uibModalStack.dismissAll();

                } else {
                    toastr.error("Data hasn't been save.", 'Error!');
                }
            }).catch(function (error) {

            });
        };

        calculate();
        $scope.calculate = calculate;


        function calculate() {

            $scope.calculate_sub = 0;
            // $scope.$scope.total_price = 0;
            for (var x in $scope.items) {
                if ($scope.items[x]["amount"]) {
                    $scope.calculate_sub = $scope.calculate_sub + parseFloat($scope.items[x]["amount"])
                }
            }
            $scope.total = $scope.calculate_sub.toFixed(2);
            // $scope.total = (Math.round($scope.subtotal * 10) / 10).toFixed(1)

        }

        $scope.remove_items = function (index) {
            $scope.items.splice(index, 1);
            calculate();
        };

        $scope.remove_item_edit = function (index, desc, price) {

            if (desc.length == 0 && price.length == 0) {

                $scope.items.splice(index, 1);
                calculate();
            }
        };
        $scope.add_item = function () {
            $scope.inserted = {
                // id: $scope.items.length + 1,
                desc: '',
                amount: "",
            };

            if ($scope.items.length == 0) {
                $scope.items.push($scope.inserted);
            } else {

                if ($scope.items[$scope.items.length - 1].desc != "") {
                    $scope.items.push($scope.inserted);
                } else {
                    toastr.warning('Please save before add new item !', 'Warning');
                }
            }

        };

        editableOptions.theme = 'bs3';
        // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round">1111</i></button>';
        // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
        $scope.checkValidity = function (data, type) {
            if (type == 'desc') {
                if (data == undefined) {           /*Add new deleted data  undefined*/
                    return "Description Required!";
                }

                if (data.length == 0) {         /*Add new save length 0/"" */
                    return "Description Required!";
                }


            } else if (type == 'price') {
                if (data == undefined) {         /*Add new deleted data  undefined*/
                    return "Required! Must Integer!";
                }

                if (data.length == 0) {          /*Add new save length 0/"" */
                    return "Required,Must Integer!";
                }
            }


        }

    }
})();
