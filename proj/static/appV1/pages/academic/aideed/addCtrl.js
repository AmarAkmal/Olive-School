(function () {
        'use strict';

        angular.module('BlurAdmin.pages.academic')
            .controller('aideedCreateCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "$uibModalStack", "$uibModal", aideedCreateCtrl]);

        function aideedCreateCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, $uibModalStack, $uibModal) {
            $scope.select_sem = {'selected': [], 'options': ['1', '2', '3']};
            $scope.desc = "";
            $scope.items = [];
            $http({
                method: 'GET',
                url: ip_server + 'student/get_student_list'
            }).then(function (result) {
                $scope.student_name = result.data
            });


            // $scope.submit = function () {
            //     loaderModal = $uibModal.open({
            //         animation: true,
            //         templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
            //         size: 'sm',
            //         backdrop: 'static',
            //         keyboard: false,
            //     });
            //     var fd = new FormData();
            //     var data = {
            //         "user_id": user_id,
            //         "student_id": $scope.student_name.selected.id,
            //         "year": $scope.year,
            //         "sem": $scope.select_sem.selected,
            //         "items": $scope.items,
            //         "desc": $scope.desc,
            //     };
            //
            //
            //     if ($scope.attachment) {
            //         for (var i = 0; i < $scope.attachment.length; i++) {
            //             fd.append('attachment', $scope.attachment[i]);
            //         }
            //     }
            //
            //     fd.append('data', JSON.stringify(data));
            //
            //     $http.post(ip_server + 'academic/add', fd, {
            //             transformRequest: angular.identity,
            //             headers: {'Content-Type': undefined}
            //         }
            //     ).then(function (response) {
            //         if (response.data.status === "OK") {
            //             toastr.success('Data successfully saved.', 'Success');
            //             loaderModal.close();
            //             $uibModalStack.dismissAll();
            //             $rootScope.$broadcast('load_list_academic');
            //
            //         } else {
            //             toastr.error("Data hasn't been save.", 'Error!');
            //         }
            //     }).catch(function (error) {
            //         alert("Connection Error");
            //         loaderModal.close();
            //         $uibModalStack.dismissAll();
            //     });
            // };

            // $scope.remove_items = function (index) {
            //     $scope.items.splice(index, 1);
            // };
            //
            // $scope.remove_item_edit = function (index, desc, price) {
            //
            //     if (desc.length == 0 && price.length == 0) {
            //
            //         $scope.items.splice(index, 1);
            //         // calculate();
            //     }
            // };
            // $scope.add_item = function () {
            //     $scope.inserted = {
            //         // id: $scope.items.length + 1,
            //         code: '',
            //         subject: "",
            //         score: "",
            //     };
            //
            //     if ($scope.items.length == 0) {
            //         $scope.items.push($scope.inserted);
            //     } else {
            //
            //         if ($scope.items[$scope.items.length - 1].code != "") {
            //             $scope.items.push($scope.inserted);
            //         } else {
            //             toastr.warning('Please save before add new item !', 'Warning');
            //         }
            //     }
            //
            // };
            //
            // editableOptions.theme = 'bs3';
            // $scope.checkValidity = function (data, type) {
            //     if (type == 'code') {
            //         if (data == undefined) {           /*Add new deleted data  undefined*/
            //             return "Required!";
            //         }
            //
            //         if (data.length == 0) {         /*Add new save length 0/"" */
            //             return "Required!";
            //         }
            //
            //
            //     } else if (type == 'subject') {
            //         if (data == undefined) {           /*Add new deleted data  undefined*/
            //             return "Required!";
            //         }
            //
            //         if (data.length == 0) {         /*Add new save length 0/"" */
            //             return "Required!";
            //         }
            //
            //     } else if (type == 'score') {
            //         if (data == undefined) {           /*Add new deleted data  undefined*/
            //             return "Required!";
            //         }
            //
            //         if (data.length == 0) {         /*Add new save length 0/"" */
            //             return "Description Required!";
            //         }
            //
            //     }
            //
            // }

        }
    }

)();
