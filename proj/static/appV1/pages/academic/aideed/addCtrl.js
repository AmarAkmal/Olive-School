(function () {
        'use strict';

        angular.module('BlurAdmin.pages.academic')
            .controller('aideedCreateCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "$state", "$uibModal", aideedCreateCtrl]);

        function aideedCreateCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, $state, $uibModal) {
            $scope.select_sem = {'selected': [], 'options': ['1', '2', '3']};
            $scope.desc = "";
            $scope.formData = {};
            $scope.items = [];
            $http({
                method: 'GET',
                url: ip_server + 'student/get_student_list'
            }).then(function (result) {
                $scope.student_name = result.data
            });

            $scope.add_item = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    keyboard: false,
                    backdrop: 'static',
                    templateUrl: '../static/app' + gversion + '/pages/academic/aideed/widgets/subject.html',
                    controller: 'aideedSubjectCtrl',
                    size: 'lg',

                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.items.push(selectedItem);
                });
            };
            $scope.submit = function () {

                var data = {
                    "class": $scope.formData.className,
                    "code": $scope.formData.code,
                    "student_ic": $scope.student_name.selected.id,
                };
                var fd = new FormData();
                fd.append('data', JSON.stringify($scope.items));
                fd.append('second', JSON.stringify(data));

                $http.post(ip_server + 'aideed/add', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }
                ).then(function (response) {
                    if (response.data.status === "OK") {
                        toastr.success('Data successfully saved.', 'Success');
                        $state.go('academic.aideed');

                    } else {
                        toastr.error("Data hasn't been save.", 'Error!');
                    }
                });

            }

            //     }).catch(function (error) {
            //         alert("Connection Error");
            //         loaderModal.close();
            //         $uibModalStack.dismissAll();
            //     });
            // };
        }
    }

)();
