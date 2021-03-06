(function () {
    'use strict';

    angular.module('BlurAdmin.pages.student')
        .controller('student_createCtrl', ['$http', '$scope', 'toastr', 'fileReader', '$filter', "$rootScope", "$uibModalStack", '$uibModal', student_createCtrl]);

    function student_createCtrl($http, $scope, toastr, fileReader, $filter, $rootScope, $uibModalStack, $uibModal) {
        $scope.submit_name = "Submit";
        //
        // $scope.student_name = "$scope.student_name";
        // $scope.student_ic = "$scope.student_ic";
        // $scope.student_address = "$scope.student_address";
        //
        // $scope.father_name = "scope.father_name";
        // $scope.father_email = " $scope.father_email";
        // $scope.father_contact = "$scope.father_contact";
        //
        //
        // $scope.mother_name = "$scope.mother_name";
        // $scope.mother_email = " $scope.mother_email";
        // $scope.mother_contact = "$scope.mother_contact";
        // $scope.intake = "$scope.intake";
        //

        $scope.removePicture = function () {
            $scope.picture = $filter('appImage')('theme/student.png');
            $scope.noPicture = true;
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();

        };

        $scope.getFile = function (file) {
            $scope.file = file;
            fileReader.readAsDataUrl(file, $scope)
                .then(function (result) {
                    $scope.picture = result;
                });
        };

        $scope.submit = function () {
            loaderModal = $uibModal.open({
                animation: true,
                templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
            });
            var fd = new FormData();
            if (typeof $scope.file !== "undefined") {
                if ($scope.file.type.indexOf('image') != -1) {
                    fd.append('file', $scope.file);
                }
            }
            var data = JSON.stringify({
                "student_name": $scope.student_name,
                "student_ic": $scope.student_ic,
                "student_address": $scope.student_address,
                "intake": $scope.intake,

                "father_name": $scope.father_name,
                "father_email": $scope.father_email,
                "father_contact": $scope.father_contact,

                "mother_name": $scope.mother_name,
                "mother_email": $scope.mother_email,
                "mother_contact": $scope.mother_contact,

            });
            fd.append('data', data);

            $http.post(ip_server + "student/add?id=" + user_id, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function (response) {
                if (response.data['status'] == "OK") {
                    toastr.success('Data successfully saved.', 'Success!');
                    loaderModal.close();
                    $uibModalStack.dismissAll();
                    $rootScope.$broadcast('load_list_student');

                } else {
                    toastr.error("Data hasn't been updated.", 'Error!');
                    loaderModal.close()
                }
            }).catch(function (error) {
                alert("Connection Error");
                loaderModal.close()
            });
        }


    }
})();
