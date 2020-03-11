(function () {
    'use strict';

    angular.module('BlurAdmin.pages.account')
        .controller('accountViewCtrl', ['$scope', '$uibModal', '$http', 'invoice_id', 'toastr', '$rootScope', 'editableOptions', 'editableThemes', '$uibModalStack', accountViewCtrl]);

    function accountViewCtrl($scope, $uibModal, $http, invoice_id, toastr, $rootScope, editableOptions, editableThemes, $uibModalStack) {
        $scope.items = [];

        $scope.desc = "";
        $scope.countBil = 0;
        loadData();

        function loadData() {
            loaderModal = $uibModal.open({
                animation: true,
                templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
            });
            $http({
                method: 'GET',
                url: ip_server + 'account/get_invoice?invoice_id=' + invoice_id
            }).then(function (result) {
                result = result.data;
                $scope.student_id = result.student_id;
                $scope.student_id = result.student_id;

                $scope.year = result.year.toString() + result.month.toString();

                $scope.desc = result.desc;
                $scope.is_pay = result.is_pay;
                $scope.is_pay_status = result.is_pay_status;
                $scope.attachment_lama = result.attachment;
                $scope.invoice_no = result.invoice_no;
                $scope.items = result.invoice_detail;
                $scope.total = result.total;
                $scope.totalBlance = result.amount_bil;
                $scope.bill_code = result.bill_code;
                $scope.bill_detail = result.bill_detail;
                $scope.student_name = result.student_name + '(' + result.student_ic + ')';
                loaderModal.close();
                calculate();
            }).catch(function (error) {
                alert("Connection Error");
                loaderModal.close();
                $uibModalStack.dismissAll();
            });


        }
        $scope.countBilV = function(data) {
            $scope.countBil = $scope.countBil + parseInt(data)
        };
        $scope.attachment_deleted = [];
        $scope.removeAtt = function (index) {
            if ($scope.attachment_lama[index].id) {
                $scope.attachment_deleted.push($scope.attachment_lama[index].id)
            }
            $scope.attachment_lama.splice(index, 1);
        };

        // $scope.student_name.selected = {'ic_no': items.student_ic, 'name': items.student_name}
        $scope.submit = function () {
            loaderModal = $uibModal.open({
                animation: true,
                templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
            });
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
                    loaderModal.close();
                    $uibModalStack.dismissAll();
                    $rootScope.$broadcast('load_list_account');
                } else {
                    toastr.error("Data hasn't been save.", 'Error!');
                }
            }).catch(function (error) {
                alert("Connection Error");
                loaderModal.close();
                $uibModalStack.dismissAll();

            });

        };


        $scope.calculate = calculate;

        // $scope.total_price = 0;

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

        $scope.items_delete = [];
        $scope.remove_items = function (index) {
            if ($scope.items[index].id) {
                $scope.items_delete.push($scope.items[index].id)
            }
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
