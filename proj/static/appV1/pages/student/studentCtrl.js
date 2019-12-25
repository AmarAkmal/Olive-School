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


        $scope.formData = {};
        $scope.formData.student_name = "";
        $scope.formData.student_ic = "";
        $scope.formData.student_intake = "";
        //#### Page Number #####//
        $scope.goto = {};
        $scope.goto.page = 1;
        $scope.pagenum = 1;

        //#### select box #####//
        $scope.selectedList = {};
        $scope.selection = [];

        $scope.$on('load_list_student', function () {
            loadData();
        });

        loadData();

        function loadData() {
            $scope.formData.isAllSelected = false;
            console.log($scope.formData)
            $http.get(ip_server + 'student/list_student/' + $scope.pagenum, {
                params: {
                    student_name: $scope.formData.student_name,
                    student_ic: $scope.formData.student_ic,
                    student_intake: $scope.formData.student_intake
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
                    // console.log(response.totalpagenum)
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

            $scope.formData.student_name = "";
            $scope.formData.student_ic = "";
            $scope.formData.student_intake = "";

            loadData();

        }

        // --------------------------------start modal ------------------------------------------
        $scope.delete = function () {
            var selection = [];
            angular.forEach($scope.selectedList, function (selected, bind) {
                if (selected) {
                    selection.push(bind);
                }
            });

            if (selection.length == 0) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../static/app' + gversion + '/pages/asset/widgets/alert.html',
                    size: "sm",
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        items: function () {
                            return selection;
                        }
                    }
                });
            } else {

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../static/app' + gversion + '/pages/asset/widgets/delete.html',
                    size: "sm",
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        list_del: function () {
                            return selection;
                        },

                    },
                    controller: function ($scope, $uibModalInstance, list_del) {
                        $scope.confirmDel = function () {

                            var data = $.param({
                                data: JSON.stringify({
                                    "item_id": list_del
                                })
                            });


                            $http.post(ip_server + 'student/delete_student', data, {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                                }
                            }).then(function (response) {
                                console.log(response)
                                if (response.data['status'] == "OK") {

                                    toastr.success('Data has been deleted.', 'Success!');
                                    $rootScope.$broadcast('load_list_student')

                                } else {
                                    toastr.error("Data hasn't been updated.", 'Error!');
                                    // $scope.dismissM = '$close()'
                                }


                            }).catch(function (error) {
                                console.log(error, "ERROR")

                            });


                        }; //function end
                    }, //controller end


                });


                modalInstance.result.finally(function () {
                    $scope.selectedList = {};
                    $scope.selection = [];
                    $scope.formData.isAllSelected = false;
                });
            }
        };
        $scope.view = function (item) {
            var modalInstance = $uibModal.open({
                animation: false,

                templateUrl: '../static/app' + gversion + '/pages/student/widgets/create_student.html',
                controller: 'studentViewCtrl',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function () {
                loadData();
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        };
        $scope.add_student = function () {
            var modalInstance = $uibModal.open({
                animation: false,
                keyboard: false,
                templateUrl: '../static/app' + gversion + '/pages/student/widgets/create_student.html',
                controller: 'student_createCtrl',
                size: 'lg',

            });

            modalInstance.result.finally(function () {
                // loadDatauser();
            });

        };
        $scope.select_intake = {'selected': 'All', 'options': ['1', '2', '3']};
        // --------------------------------end modal ------------------------------------------


    }


})();
