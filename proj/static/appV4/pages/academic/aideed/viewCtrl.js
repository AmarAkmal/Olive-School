(function () {
        'use strict';

        angular.module('BlurAdmin.pages.academic')
            .controller('aideedViewCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "items", "$uibModal", aideedViewCtrl]);

        function aideedViewCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, items, $uibModal) {
            if (role == 'Principle') {
                $scope.show_this = true
            } else {
                $scope.show_this = false
            }
            $scope.alreadyChooseSub = [];
            $scope.form = {};
            $scope.form = items;
            $scope.items = $scope.form.body;
            // $scope.alreadyChooseSub = [];
            for (var x in $scope.items) {
                $scope.alreadyChooseSub.push($scope.items[x].subject.id)

            }
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
            $scope.printDiv_show = false;
            $scope.printDiv = function () {
                $scope.printDiv_show = true;

                var newWin = window.open("");
                newWin.document.write('<br><br><div><label style="margin: 20px; text-decoration: underline;">Report Card</label></div>');
                newWin.document.write('<div><label style="margin: 20px">Student’s Name :' + $scope.form.student_name + '</label></div>');
                newWin.document.write('<div><label style="margin: 20px">Class :' + $scope.form.code + ' – ' + $scope.form.class + '</label></div>');
                var ghtml = document.getElementById("DivIdToPrint");
                var DivIdToPrint = ghtml.cloneNode(true);
                $('<br><div><label style="margin: 20px"></label></div>').prependTo(DivIdToPrint);
                var htmlToPrint = '' +
                    '<style type="text/css">' +
                    'table{' +
                    'border-spacing: 0px;' +
                    '}' +
                    'table th, table td {' +
                    'border:0.5px solid #000;padding: 5px;' +
                    '}' +
                    'table tr {text-align: left}' +
                    'table{' +
                    ' margin: auto;' +
                    'width: calc(100% - 40px);}' +
                    '.noprint{display: none}' +
                    '</style>';
                htmlToPrint += DivIdToPrint.outerHTML;
                newWin.document.write(htmlToPrint);

                newWin.print();

                newWin.close();
                $scope.printDiv_show = false;
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
            };
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
            $scope.loadData = function () {
                $rootScope.$broadcast('load_list_academic_aideed');

            }

            $scope.submit = function () {

                var data = {
                    "id": $scope.form.id,
                    "class": $scope.form.class,
                    "code": $scope.form.code,
                    "student_ic": $scope.form.student_ic,
                };
                var fd = new FormData();
                fd.append('data', JSON.stringify($scope.items));
                fd.append('second', JSON.stringify(data));
                $http.post(ip_server + 'aideed/update', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }
                ).then(function (response) {
                    if (response.data.status === "OK") {
                        toastr.success('Data successfully saved.', 'Success');
                        $rootScope.$broadcast('load_list_academic_aideed');

                    } else {
                        toastr.error("Data hasn't been save.", 'Error!');
                    }
                });

            }


        }
    }

)();
