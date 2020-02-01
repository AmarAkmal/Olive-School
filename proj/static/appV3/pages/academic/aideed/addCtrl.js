(function () {
    'use strict';

    angular.module('BlurAdmin.pages.academic')
        .controller('aideedCreateCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "$state", "$uibModal", aideedCreateCtrl]);

    function aideedCreateCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, $state, $uibModal) {
        $scope.select_sem = {'selected': [], 'options': ['1', '2', '3']};
        $scope.desc = "";
        $scope.formData = {};
        $scope.items = [];
        $scope.alreadyChooseSub = [];
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
                resolve: {
                    alreadyChooseSub: function () {
                        return $scope.alreadyChooseSub;
                    }
                },

            });

            modalInstance.result.then(function (selectedItem) {
                $scope.items.push(selectedItem);
                $scope.alreadyChooseSub = [];
                for (var x in $scope.items) {
                    $scope.alreadyChooseSub.push($scope.items[x].subject.id)

                }

            });
        };
        $scope.delete_report = function (data) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../static/app' + gversion + '/pages/asset/widgets/delete.html',
                size: "sm",
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    data: function () {
                        return data;
                    }
                },
                controller: function ($scope, $uibModalInstance, $uibModal, data) {

                    $scope.confirmDel = function () {
                        $uibModalInstance.close(data);

                    };


                }, //controller end
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.alreadyChooseSub = [];
                for (var x in $scope.items) {

                    if ($scope.items[x].subject.id == selectedItem.subject.id) {
                        $scope.items.splice(x, 1);
                    } else {
                        $scope.alreadyChooseSub.push($scope.items[x].subject.id)
                    }

                }

            })
        }
        $scope.edit_report = function (data) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',
                templateUrl: '../static/app' + gversion + '/pages/academic/aideed/widgets/update.html',
                size: 'lg',
                resolve: {
                    data: function () {
                        return data;
                    }
                },
                controller: function ($scope, $uibModalInstance, $uibModal, data) {
                    let arrayVir = [];
                    $scope.formData = {};
                    $scope.skill = {};
                    $scope.comment = {};

                    $scope.subject_name = data.subject.subject;
                    $scope.subject_id = data.subject.id;
                    $scope.formData.overall = data.subject.overall_band;
                    $scope.formData.comments = data.subject.comments;
                    $scope.skill_name = data.skill;


                    $http({
                        method: 'GET',
                        url: ip_server + 'aideed/get_skill/band?subject_id=' + data.subject.id
                    }).then(function (result) {
                        // $scope.skill_name = result.data[0]['skill'];
                        $scope.band_name = result.data[0]['band'];

                    });

                    $scope.submit = function () {
                        arrayVir = []
                        angular.forEach($scope.skill_name, function (value, key) {
                            let object = {};
                            object['id'] = value.id;
                            object['band'] = value.band;
                            object['comment'] = value.comment;
                            object['skill'] = value.skill;

                            arrayVir.push(object);

                        });

                        var jsonData = {
                            'subject': {
                                'id': $scope.subject_id,
                                'subject': $scope.subject_name,
                                'overall_band': $scope.formData.overall,
                                'comments': $scope.formData.comments
                            },
                            'skill': arrayVir
                        };
                        $uibModalInstance.close(jsonData);
                    };
                }

            });
            modalInstance.result.then(function (selectedItem) {

                for (var x in $scope.items) {
                    if ($scope.items[x].subject.id == selectedItem.subject.id) {
                        $scope.items[x].subject.id = selectedItem.subject.id;
                        $scope.items[x].subject.overall_band = selectedItem.subject.overall_band;
                        $scope.items[x].subject.comments = selectedItem.subject.comments;
                        for (var j in $scope.items[x].skill) {

                            if ($scope.items[x].skill[j].id === selectedItem.skill[j].id) {
                                $scope.items[x].skill[j].id = selectedItem.skill[j].id;
                                $scope.items[x].skill[j].band = selectedItem.skill[j].band;
                                $scope.items[x].skill[j].comment = selectedItem.skill[j].comment;
                                $scope.items[x].skill[j].skill = selectedItem.skill[j].skill;

                            }
                        }


                    }
                }

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
    }
}());

//     }).catch(function (error) {
//         alert("Connection Error");
//         loaderModal.close();
//         $uibMod