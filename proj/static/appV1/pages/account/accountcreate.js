(function () {
    'use strict';

    angular.module('BlurAdmin.pages.account')
        .controller('account_createCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", account_createCtrl]);

    function account_createCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes) {
        // $scope.format1 = function () {
        //
        //     if ($scope.month <= 9) {
        //         // console.log($scope.month = 0 + $scope.month)
        //         $scope.month = "0" + $scope.month;
        //     }
        // };
        $http({
            method: 'GET',
            url: ip_server + 'student/get_student'
        }).then(function (result) {
            // console.log(result)
            $scope.student_name = result.data
        });

        // $scope.student_name= [{'id':123 ,'name':'Amar'},{'id':456 ,'name':'Samad'}]
        $scope.submit = function () {

            var fd = new FormData();
            var data = {
                "student_name": $scope.student_name.selected.id,
                "year": $scope.year,
                "items": $scope.items,
                "desc": $scope.desc,
            };


            if ($scope.attachment) {
                for (var i = 0; i < $scope.attachment.length; i++) {
                    fd.append('attachment', $scope.attachment[i]);
                }
            }

            fd.append('data', JSON.stringify(data));
            console.log(fd)

            // var config = {transformRequest: angular.identity, headers: {'Content-Type': undefined}};
            $http.post(ip_server + 'account/add_invoice', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            ).then(function (response) {
                if (response.data.status === "OK") {
                    toastr.success('Data successfully saved.', 'Success');
                    $state.go('task.assigned', {page: '1'});
                }
            }).catch(function (error) {
                if (error.status === 401) {
                    denied();
                }
            });
        };
        // };

        $scope.items = [
            {

                "desc": "Math Tambahan",
                "amount": 300,

            },
            {

                "desc": "Sains",
                "amount": 400.39,
            },
        ];
        // $scope.total_price = 0;
        calculate();
        $scope.calculate = calculate;

        // $scope.total_price = 0;

        function calculate() {
            // console.log( $scope.items,"$data$data$data$data$data$data$data")
            $scope.subtotal = 0;
            // $scope.$scope.total_price = 0;
            for (var x in $scope.items) {
                console.log($scope.items[x])
                $scope.subtotal = $scope.subtotal + $scope.items[x]["amount"]
            }
            $scope.subtotal = $scope.subtotal.toFixed(2);
            $scope.total = Math.round($scope.subtotal * 10) / 10
            // console.log($scope.total_price_1, " $scope.total_price_1 $scope.total_price_1 $scope.total_price_1")
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
        // $scope.submit = function () {
        //     console.log($scope.items)
        //
        // }
        $scope.add_item = function () {
            $scope.inserted = {
                // id: $scope.items.length + 1,
                desc: '',
                amount: "",
            };
            $scope.items.push($scope.inserted);
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
