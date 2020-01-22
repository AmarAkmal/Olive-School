(function () {
    'use strict';

    angular.module('BlurAdmin.pages.academic')
        .controller('academicViewCtrl', ['$scope', '$uibModal', '$http', 'id', 'toastr', '$rootScope', 'editableOptions', 'editableThemes', '$uibModalStack', '$sce', academicViewCtrl]);

    function academicViewCtrl($scope, $uibModal, $http, id, toastr, $rootScope, editableOptions, editableThemes, $uibModalStack, $sce) {
        $scope.config = {}
        $scope.config = {
            "height": 1000,
            "language": 'en',
            "allowedContent": true,
            "entities": false,
            "readOnly": true,
        };
        $scope.config.toolbarGroups = [

            {name: 'tools', groups: ['tools']},

        ];

        $scope.config.readOnly = true;
        $scope.config.extraPlugins = 'maximize';
        // $scope.trustedcontent = function (text) {
        //     return $sce.trustAsHtml(text)
        // };

        $scope.select_sem = {selected: [], options: ['1', '2', '3']};
        $scope.items = [];
        // $scope.desc = "";
        loadData();

        function loadData() {
            loaderModal = $uibModal.open({
                animation: true,
                templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
            });
            $http({
                method: 'GET',
                url: ip_server + 'academic/get_academic_iep?id=' + id
            }).then(function (result) {
                result = result.data;
                $scope.year = result.year;
                // $scope.items = result.items;
                $scope.desc = result.desc;
                $scope.student_name = result.student_name + '(' + result.student_ic + ')';
                // $scope.select_sem.selected = result.sem;
                loaderModal.close();
            }).catch(function (error) {
                alert("Connection Error");
                loaderModal.close();
                $uibModalStack.dismissAll();

            });

        }

        $scope.submit = function () {
            loaderModal = $uibModal.open({
                animation: true,
                templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
            });

            var fd = new FormData();
            var data = {
                "user_id": user_id,
                "student_id": $scope.student_id,
                "desc": $scope.desc,
            };

            fd.append('data', JSON.stringify(data));
            $http.post(ip_server + 'academic/update?id=' + id, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            ).then(function (response) {

                if (response.data.status === "OK") {
                    toastr.success('Data successfully saved.', 'Success');
                    loaderModal.close();
                    $uibModalStack.dismissAll();
                    $rootScope.$broadcast('load_list_academic');
                } else {
                    toastr.error("Data hasn't been save.", 'Error!');
                }
            }).catch(function (error) {
                alert("Connection Error");
                loaderModal.close();
                $uibModalStack.dismissAll();

            });
        };


        $scope.items_delete = [];
        $scope.remove_items = function (index) {
            if ($scope.items[index].code) {
                $scope.items_delete.push($scope.items[index].code)
            }
            $scope.items.splice(index, 1);

        };

        $scope.remove_item_edit = function (index, desc, price) {
            if (desc.length == 0 && price.length == 0) {
                $scope.items.splice(index, 1);
            }
        };

        $scope.add_item = function () {
            $scope.inserted = {
                // id: $scope.items.length + 1,
                check: 'new',
                code: '',
                subject: "",
                score: "",
            };

            if ($scope.items.length == 0) {
                $scope.items.push($scope.inserted);
            } else {

                if ($scope.items[$scope.items.length - 1].code != "") {
                    $scope.items.push($scope.inserted);
                } else {
                    toastr.warning('Please save before add new item !', 'Warning');
                }
            }
        };

        editableOptions.theme = 'bs3';
        // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round">1111</i></button>';
        // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
        $scope.checkValidity = function (data, type) {
            if (type == 'code') {
                if (data == undefined) {           /*Add new deleted data  undefined*/
                    return "Required!";
                }

                if (data.length == 0) {         /*Add new save length 0/"" */
                    return "Required!";
                }


            } else if (type == 'subject') {
                if (data == undefined) {           /*Add new deleted data  undefined*/
                    return "Required!";
                }

                if (data.length == 0) {         /*Add new save length 0/"" */
                    return "Required!";
                }

            } else if (type == 'score') {
                if (data == undefined) {           /*Add new deleted data  undefined*/
                    return "Required!";
                }

                if (data.length == 0) {         /*Add new save length 0/"" */
                    return "Description Required!";
                }

            }

        }
    }
})();
