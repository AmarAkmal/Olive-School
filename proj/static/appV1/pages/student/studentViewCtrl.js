(function () {
    'use strict';

    angular.module('BlurAdmin.pages.student')
        .controller('studentViewCtrl', ['$http', '$scope', 'toastr', 'fileReader', '$filter', 'items','$rootScope', studentViewCtrl]);

    function studentViewCtrl($http, $scope, toastr, fileReader, $filter, items,$rootScope) {
        $scope.submit_name = "Update"
        // console.log(items);

        $scope.id = items.id;
        $scope.student_name = items.student_name;
        $scope.student_ic = items.student_ic;
        $scope.student_address = items.student_address;
        $scope.intake = items.student_intake;
        $scope.student_picture = items.student_picture;

        $scope.father_name = items.father_name;
        $scope.father_email = items.father_email;
        $scope.father_contact = items.father_phone;


        $scope.mother_name = items.mother_name;
        $scope.mother_email = items.mother_email;
        $scope.mother_contact = items.mother_phone;
        if ($scope.student_picture){
             $scope.picture = '../static/uploads' + '/' + $scope.id + '/' + $scope.student_picture;
        }else{
              $scope.picture = $filter('appImage')('theme/student.png');
        }


        $scope.submit = function () {
            var fd = new FormData();
            if (typeof $scope.file !== "undefined") {
                if ($scope.file.type.indexOf('image') != -1) {
                    fd.append('file', $scope.file);
                }
            }
            var data = JSON.stringify({
                "id": $scope.id,
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

            $http.post(ip_server + "update_student?id=" + user_id, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function (response) {
                if (response.data['status'] == "OK") {

                    toastr.success('Data successfully saved.', 'Success!');
                    $rootScope.$broadcast('load_list_student')

                } else {
                    toastr.error("Data hasn't been updated.", 'Error!');
                    // $scope.dismissM = '$close()'
                }
            });
        }
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

    }
})();
