(function () {
    'use strict';

    angular.module('BlurAdmin.pages.account')
        .controller('account_createCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", account_createCtrl]);

    function account_createCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes) {
        $scope.format1 = function () {
            // console.log(input)
            console.log($scope.month)
            if ($scope.month <= 9) {
                // console.log($scope.month = 0 + $scope.month)
                $scope.month = "0" + $scope.month;
            }
        }

        // $(function () {
        //     // var d = new Date();
        //     $('#datepicker').datepicker({
        //         changeMonth: true,
        //         showButtonPanel: true,
        //         // dateFormat: 'mm',
        //         dateFormat: 'dd MM yy', showOtherMonths: true, selectOtherMonths: true,
        //         changeYear: true,
        //         onClose: function (selectedDate,) {
        //             console.log(selectedDate)
        //             // scope.formData.date_report = selectedDate;
        //             // rootScope.$broadcast('load_list_report')
        //
        //
        //         }
        //     });
        //     // $(".date-picker-month").focus(function () {
        //     //     $(".ui-datepicker-year").hide();
        //     // });
        //
        //
        //     // var d = new Date();
        //     // $('#datepicker1').datepicker({
        //     //     changeYear: true,
        //     //     changeMonth: true,
        //     //     showButtonPanel: true,
        //     //     dateFormat: 'yy-mmdd' + d.getHours() + d.getMinutes() + d.getSeconds(),
        //     //     onClose: function (dateText, inst) {
        //     //         $scope.generate_running = create_UUID();
        //     //         console.log($scope.generate_running)
        //     //         $scope.code = dateText
        //     //
        //     //     }
        //     // });
        //
        //
        //     // function create_UUID() {
        //     //     var dt = new Date().getTime();
        //     //     var uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        //     //         var r = (dt + Math.random() * 16) % 16 | 0;
        //     //         dt = Math.floor(dt / 16);
        //     //         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        //     //     });
        //     //     return uuid;
        //     // }
        //
        //     //   $('#datepicker2').datepicker({
        //     //       changeYear: true,
        //     //      changeMonth: true,
        //     //     showButtonPanel: true,
        //     //    dateFormat: 'yy-mm-dd',
        //     //     onClose: function (dateText, inst) {
        //     //         var year = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
        //     //         $scope.month = year
        //     //         $(this).datepicker('setDate', new Date(year, 1));
        //     //     }
        //     // });
        //     // $(".date-picker-year").focus(function () {
        //     //     $(".ui-datepicker-month").hide();
        //     // });
        //
        //
        //     // $('#datemonthpicker').datepicker({
        //     //     changeMonth: true,
        //     //     showButtonPanel: true,
        //     //     dateFormat: 'mm',
        //     //     onClose: function (dateText, inst) {
        //     //         var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
        //     //         $(this).datepicker('setDate', new Date(month));
        //     //     }
        //     // });
        //     // $(".date-picker-month").focus(function () {
        //     //     $(".ui-datepicker-year").hide();
        //     // });
        // });
        //################################################################################################

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
        $scope.submit = function () {
            console.log($scope.items)

        }
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
