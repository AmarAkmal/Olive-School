(function () {
    'use strict';

    angular.module('BlurAdmin.pages.account')
        .controller('accountViewCtrl', ['$scope', '$uibModal', '$http', 'invoice_id', 'toastr', '$rootScope', 'editableOptions', 'editableThemes', '$uibModalStack', accountViewCtrl]);

    function accountViewCtrl($scope, $uibModal, $http, invoice_id, toastr, $rootScope, editableOptions, editableThemes, $uibModalStack) {
        // console.log(items)
        $scope.items = [];
        // $scope.is_pay = 1;
        loadData();

        function loadData() {
            $http({
                method: 'GET',
                url: ip_server + 'account/get_invoice?invoice_id=' + invoice_id
            }).then(function (result) {
                console.log(result)
                result = result.data;
                $scope.student_id = result.student_id;
                $scope.student_id = result.student_id;
                $scope.year = parseFloat(result.year);
                $scope.month = parseFloat(result.month);
                $scope.desc = result.desc;
                $scope.is_pay = result.is_pay;
                $scope.attachment_lama = result.attachment;
                $scope.invoice_no = result.invoice_no;
                $scope.items = result.invoice_detail;
                $scope.total = result.total;
                // $scope.subtotal = result.subtotal;
                $scope.student_name = result.student_name + '(' + result.student_ic + ')';
                calculate();
            });

        }

        $scope.attachment_deleted = [];
        $scope.removeAtt = function (index) {
            console.log($scope.attachment_lama)
            if ($scope.attachment_lama[index].id) {
                // alert(1111)
                $scope.attachment_deleted.push($scope.attachment_lama[index].id)
            }
            console.log($scope.attachment_deleted)
            $scope.attachment_lama.splice(index, 1);
        };

        // $scope.student_name.selected = {'ic_no': items.student_ic, 'name': items.student_name}
        $scope.submit = function () {

            var fd = new FormData();
            var data = {
                "user_id": user_id,
                "student_id": $scope.student_id,
                "year": $scope.year,
                "month": $scope.month,
                "items": $scope.items,
                "desc": $scope.desc,
                "total_pay": $scope.total,
                "deleted_items": $scope.items_delete,
                "attachment_deleted": $scope.attachment_deleted,
            };


            if ($scope.attachment) {
                for (var i = 0; i < $scope.attachment.length; i++) {
                    fd.append('attachment', $scope.attachment[i]);
                }
            }

            fd.append('data', JSON.stringify(data));
            $http.post(ip_server + 'account/update_invoice?invoice_id=' + invoice_id, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            ).then(function (response) {

                if (response.data == "Already pay") {
                    toastr.success('User Already Pay.', 'Warning');
                }
                if (response.data.status === "OK") {
                    toastr.success('Data successfully saved.', 'Success');
                    $rootScope.$broadcast('load_list_account');
                    $uibModalStack.dismissAll();
                } else {
                    toastr.error("Data hasn't been save.", 'Error!');
                }
            }).catch(function (error) {

                console.log(error)

            });
        };


        $scope.calculate = calculate;

        // $scope.total_price = 0;

        function calculate() {
            // console.log( $scope.items,"$data$data$data$data$data$data$data")
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

        $scope.items_delete = [];
        $scope.remove_items = function (index) {
            if ($scope.items[index].id) {
                alert(1111)
                $scope.items_delete.push($scope.items[index].id)
            }
            // console.log($scope.items_delete)
            $scope.items.splice(index, 1);
            calculate();
        };

        $scope.remove_item_edit = function (index, desc, price) {

            if (desc.length == 0 && price.length == 0) {

                $scope.items.splice(index, 1);
                calculate();
            }
        };
        // $scope.submit = function () {
        //     console.log($scope.items)
        //
        // }

        $scope.add_item = function () {
            $scope.inserted = {
                check: "new",
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
            // console.log($scope.items[$scope.items.length] )


            // console.log($scope.items)
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
