(function () {
    'use strict';


    angular.module('BlurAdmin.pages.account').controller('account_listCtrl', ['$scope', '$uibModal', '$http', 'toastr', '$rootScope', account_listCtrl]);


    function account_listCtrl($scope, $uibModal, $http, toastr, $rootScope) {
        $scope.formData = {};


        $scope.formData.receipt_no = "";
        $scope.formData.code = "";
        $scope.formData.student_name = "";
        $scope.formData.total = "";
        // $scope.formData.status = "";


        //#### Page Number #####//
        $scope.goto = {};
        $scope.goto.page = 1;
        $scope.pagenum = 1;

        //#### select box #####//
        $scope.selectedList = {};
        $scope.selection = [];

        $scope.formData.status = {
            'selected': {id: 'All', name: 'All'},
            'options': [{id: 'All', name: 'All'}, {id: 0, name: 'Pending'}, {id: 1, name: 'Done'}]
        };
        $scope.formData.status.selected = {id: 'All', name: 'All'};
        loadData();

        function loadData() {
            $scope.formData.isAllSelected = false;
            $http.get(ip_server + 'account/list/' + $scope.pagenum, {
                params: {
                    receipt_no: $scope.formData.receipt_no,
                    code: $scope.formData.code,
                    student_name: $scope.formData.student_name,
                    total: $scope.formData.total,
                    status: $scope.formData.status.selected.id
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            }).then(function (response) {

                response = response.data;

                $scope.smartTableData = response.data;
                $scope.count_result = response.count_result;
                $scope.totalpagenum = response.totalpagenum;

                $scope.paging = [];
                if ($scope.pagenum > $scope.totalpagenum) {   /*Control last page delete */
                    $scope.goto.page = $scope.totalpagenum;
                    $scope.pagenum = $scope.totalpagenum
                }

                if (response.count_result == 0) {
                    $scope.goto.page = 0;

                }
                if ($scope.pagenum > 4) {
                    if ($scope.pagenum + 2 <= response.totalpagenum) {
                        $scope.paging.push($scope.pagenum - 2, $scope.pagenum - 1, $scope.pagenum, $scope.pagenum + 1, $scope.pagenum + 2)
                    } else if ($scope.pagenum + 1 <= response.totalpagenum) {
                        $scope.paging.push($scope.pagenum - 3, $scope.pagenum - 2, $scope.pagenum - 1, $scope.pagenum, $scope.pagenum + 1)
                    } else if ($scope.pagenum == response.totalpagenum) {
                        $scope.paging.push($scope.pagenum - 4, $scope.pagenum - 3, $scope.pagenum - 2, $scope.pagenum - 1, $scope.pagenum)
                    }

                } else {
                    for (let i = 1; i <= response.totalpagenum; i++) {
                        $scope.paging.push(i);
                        if (i == 5) {
                            break;
                        }
                    }
                }


            }).catch(function (error) {
                console.log(error, "ERROR")
                // if (error.status === 401)
                //     denied()
            });
        }


        $scope.add_invoice = function () {
            var modalInstance = $uibModal.open({
                animation: false,
                keyboard: false,
                backdrop: 'static',
                templateUrl: '../static/app' + gversion + '/pages/account/widgets/create_invoice.html',
                controller: 'account_createCtrl',
                size: 'lg',

            });

            modalInstance.result.finally(function () {
                // loadDatauser();
            });

        };

        $scope.getfilter = function () {

            $scope.filterflag = true;
            $scope.pagenum = 1;
            $scope.goto.page = 1;
            loadData();
        };

        $scope.toggleAll = function () {

            var toggleStatus = $scope.formData.isAllSelected;
            angular.forEach($scope.smartTableData, function (itm) {
                $scope.selectedList[itm.id] = toggleStatus;
            })

        };


        $scope.gopage = function () {

            if ($scope.pagenum != $scope.goto.page && $scope.goto.page >= 1 && $scope.goto.page <= $scope.totalpagenum && Number.isInteger($scope.goto.page) == true) {
                $scope.pagenum = $scope.goto.page;
                loadData();
            }

        };

        $scope.pressnum = function (num) {

            if ($scope.pagenum != num) {
                $scope.pagenum = num;
                $scope.goto.page = num;
                loadData();
            }

        };


        $scope.clear = function () {
            $scope.goto.page = 1;
            $scope.pagenum = 1;
            $scope.selectedList = {};
            $scope.selection = [];
            $scope.formData.isAllSelected = false;

            $scope.formData.receipt_no = "";
            $scope.formData.code = "";
            $scope.formData.student_name = "";
            $scope.formData.total = "";
            $scope.formData.status.selected = {id: 'All', name: 'All'};


            loadData();

        }

    }


})();
