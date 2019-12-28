(function () {
    'use strict';

    angular.module('BlurAdmin.pages.student')
        .controller('studentViewCtrl', ['$http', '$scope', 'toastr', 'fileReader', '$filter', 'items', '$rootScope', studentViewCtrl]);

    function studentViewCtrl($http, $scope, toastr, fileReader, $filter, items, $rootScope) {
        $scope.submit_name = "Update"
        // console.log(items);

        loadData();

        function loadData() {
            $http({
                method: 'GET',
                url: ip_server + 'student/get_student_detail?id=' + items
            }).then(function (result) {
                console.log(result)
                result = result.data
                $scope.id = result.id;
                $scope.student_name = result.student_name;
                $scope.student_ic = result.student_ic;
                $scope.student_address = result.student_address;
                $scope.intake = result.student_intake;
                // $scope.student_picture = result.student_picture;

                $scope.father_name = result.father_name;
                $scope.father_email = result.father_email;
                $scope.father_contact = result.father_phone;


                $scope.mother_name = result.mother_name;
                $scope.mother_email = result.mother_email;
                $scope.mother_contact = result.mother_phone;
                $scope.picture  = result.picture
            });

        }
        //
        //
        // if ($scope.student_picture) {
        //     $scope.picture = '../static/uploads' + '/' + $scope.id + '/' + $scope.student_picture;
        // } else {
        //     $scope.picture = $filter('appImage')('theme/student.png');
        //     console.log($scope.picture)
        // }


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

            $http.post(ip_server + "student/update_student?id=" + user_id, fd, {
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
