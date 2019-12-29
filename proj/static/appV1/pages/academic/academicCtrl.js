(function () {
    'use strict';


    angular.module('BlurAdmin.pages.academic').controller('academic_listCtrl', ['$scope', '$uibModal', 'baProgressModal', '$http', 'toastr', '$window', '$rootScope', academic_listCtrl]);


    function academic_listCtrl($scope, $uibModal, baProgressModal, $http, toastr, $window, $rootScope) {
        $scope.formData = {};
        $scope.formData.select_sem = {'selected': [], 'options': ['All', '1', '2', '3']};
        $scope.formData.select_sem.selected = "All";


        $scope.formData.student_name = "";
        $scope.formData.ic_no = "";
        $scope.formData.year = "";
        //#### Page Number #####//
        $scope.goto = {};
        $scope.goto.page = 1;
        $scope.pagenum = 1;

        //#### select box #####//
        $scope.selectedList = {};
        $scope.selection = [];

        $scope.$on('load_list_academic', function () {
            loadData();
        });
        loadData();

        function loadData() {
            $scope.formData.isAllSelected = false;
            $http.get(ip_server + 'academic/list/' + $scope.pagenum, {
                params: {
                    student_name: $scope.formData.student_name,
                    student_ic: $scope.formData.ic_no,
                    year: $scope.formData.year,
                    sem: $scope.formData.select_sem.selected
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

            $scope.formData.select_sem.selected = "All";
            $scope.formData.student_name = "";
            $scope.formData.ic_no = "";
            $scope.formData.year = "";

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

                            var data = $.param({
                                data: JSON.stringify({
                                    "item_id": list_del
                                })
                            });


                            $http.post(ip_server + 'academic/delete', data, {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                                }
                            }).then(function (response) {
                                if (response.data['status'] == "OK") {
                                    toastr.success('Data has been deleted.', 'Success!');
                                    loaderModal.close();
                                    $uibModalStack.dismissAll();
                                    $rootScope.$broadcast('load_list_academic');

                                } else {
                                    toastr.error("Data hasn't been updated.", 'Error!');
                                }


                            }).catch(function (error) {
                                alert("Connection Error");
                                loaderModal.close()

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

                templateUrl: '../static/app' + gversion + '/pages/academic/widgets/update.html',
                controller: 'academicViewCtrl',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function () {
                loadData();
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        };


        // --------------------------------end modal ------------------------------------------


        $scope.add = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',
                templateUrl: '../static/app' + gversion + '/pages/academic/widgets/create.html',
                controller: 'academicCreateCtrl',
                size: 'lg',

            });

            modalInstance.result.finally(function () {
                // loadDatauser();
            });

        };


    }


})();
