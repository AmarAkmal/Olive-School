var rootScope;
(function () {
    'use strict';
    // angular.module('BlurAdmin.pages.event').directive('studentbirthday', function () {
    //     return function (scope, element, $rootScope) {
    //
    //         element.datepicker({
    //             dateFormat: 'dd MM yy', showOtherMonths: true, selectOtherMonths: true,
    //             changeYear: true,
    //             onSelect: function (selectedDate,) {
    //                 scope.student_birthday = selectedDate;
    //                 // rootScope.$broadcast('load_list_report')
    //
    //
    //             }
    //         });
    //     };
    // });

    angular.module('BlurAdmin.pages.event')
        .directive('dateselecter', function () {
            return function (scope, element, $rootScope) {

                element.datepicker({
                    dateFormat: 'dd MM yy', showOtherMonths: true, selectOtherMonths: true,
                    changeYear: true,
                    onSelect: function (selectedDate,) {
                        scope.formData.date_selected = selectedDate;
                        rootScope.$broadcast('load_list_event')


                    }
                });
            };
        })
        .controller('studentEventListCtrl', ['$scope', '$uibModal', 'baProgressModal', '$http', 'toastr', '$window', '$rootScope', "$uibModalStack", studentEventListCtrl]);


    function studentEventListCtrl($scope, $uibModal, baProgressModal, $http, toastr, $window, $rootScope, $uibModalStack) {
        $scope.role = role;
        rootScope = $rootScope;

        $scope.formData = {};
        $scope.formData.student_name = "";
        $scope.formData.student_ic = "";
        $scope.formData.date_selected = "";
        $scope.formData.desc = "";
        //#### Page Number #####//
        $scope.goto = {};
        $scope.goto.page = 1;
        $scope.pagenum = 1;

        //#### select box #####//
        $scope.selectedList = {};
        $scope.selection = [];

        $scope.$on('load_list_event', function () {
            loadData();
        });

        loadData();

        function loadData() {
            $scope.formData.isAllSelected = false;
            $http.get(ip_server + 'student/list_event/' + $scope.pagenum, {
                params: {
                    student_name: $scope.formData.student_name,
                    student_ic: $scope.formData.student_ic,
                    date_selected: $scope.formData.date_selected,
                    desc: $scope.formData.desc
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

                if (response.count_result == 0) {    /*Control last page no data */
                    $scope.goto.page = 1;
                    $scope.pagenum = 1;

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
                alert("Connection Error");
                $uibModalStack.dismissAll();
            });
        }

        $scope.prev = function () {
            if ($scope.pagenum > 1) {
                $scope.pagenum -= 1;
            }
            loadData();
        };
        $scope.next = function () {
            $scope.pagenum += 1;
            $scope.goto.page = $scope.pagenum;
            loadData();
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

            $scope.formData.student_name = "";
            $scope.formData.student_ic = "";
            $scope.formData.date_selected = "";
            $scope.formData.desc = "";

            loadData();

        };

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
                    controller: function ($scope, $uibModalInstance, $uibModal, list_del) {
                        $scope.confirmDel = function () {
                            loaderModal = $uibModal.open({
                                animation: true,
                                templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
                                size: 'sm',
                                backdrop: 'static',
                                keyboard: false,
                            });


                            $http.delete(ip_server + 'student/delete_event/' + JSON.stringify(list_del), {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                                }
                            }).then(function (response) {
                                if (response.data['status'] == "OK") {
                                    toastr.success('Data has been deleted.', 'Success!');
                                    loaderModal.close();
                                    $uibModalStack.dismissAll();
                                    $rootScope.$broadcast('load_list_event');

                                } else {
                                    toastr.error("Data hasn't been updated.", 'Error!');
                                    loaderModal.close();
                                    // $scope.dismissM = '$close()'
                                }


                            }).catch(function (error) {
                                alert("Connection Error");
                                loaderModal.close();

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
        $scope.view = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,

                templateUrl: '../static/app' + gversion + '/pages/event/widgets/updateEvent.html',
                controller: 'studentEventViewCtrl',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function () {
                loadData();
            }, function () {
            });

        };
        $scope.add_student = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                templateUrl: '../static/app' + gversion + '/pages/event/widgets/createEvent.html',
                controller: 'studentEventCreateCtrl',
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
