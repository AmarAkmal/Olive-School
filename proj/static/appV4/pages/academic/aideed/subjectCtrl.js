(function () {
        'use strict';

        angular.module('BlurAdmin.pages.academic')
            .controller('aideedSubjectCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "$uibModalInstance", 'alreadyChooseSub', aideedSubjectCtrl]);

        function aideedSubjectCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, $uibModalInstance, alreadyChooseSub) {
            $scope.formData = {};
            $scope.skill = {};
            $scope.comment = {};

            $http({
                method: 'GET',
                url: ip_server + 'aideed/get_subject'
            }).then(function (result) {
                $scope.subject_name = []
                // if (alreadyChooseSub.length > 0) {
                for (var x in result.data) {
                    // alreadyChooseSub.includes(result.data[x].id)
                    if (alreadyChooseSub.includes(result.data[x].id) === false) {
                        $scope.subject_name.push(result.data[x])
                    }
                }
            });


            $scope.myChange = function () {
                $http({
                    method: 'GET',
                    url: ip_server + 'aideed/get_skill/band?subject_id=' + $scope.subject_name.selected.id
                }).then(function (result) {
                    $scope.skill_name = result.data[0]['skill']
                    $scope.band_name = result.data[0]['band']
                });
            }
            $scope.submit = function () {

                let arrayVir = [];
                let iCount = 0;
                angular.forEach($scope.skill, function (value, key) {
                    let object = {};
                    object['id'] = key;
                    object['band'] = value;
                    object['comment'] = $scope.comment[Object.keys($scope.comment)[iCount]];
                    object['skill'] = Object.keys($scope.comment)[iCount];

                    iCount++;
                    arrayVir.push(object);
                });

                var jsonData = {
                    'subject': {
                        'id': $scope.subject_name.selected.id,
                        'subject': $scope.subject_name.selected.name,
                        'overall_band': $scope.formData.overall,
                        'comments': $scope.formData.comments
                    },
                    'skill': arrayVir
                };

                $uibModalInstance.close(jsonData);
            };
        }
    }

)();
