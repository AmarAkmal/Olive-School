(function () {
    'use strict';

    angular.module('BlurAdmin.pages.event')
        .controller('studentEventViewCtrl', ['$http', '$scope', 'toastr', 'fileReader', '$filter', 'items', '$rootScope', "$uibModal", "$uibModalStack", studentEventViewCtrl]);

    function studentEventViewCtrl($http, $scope, toastr, fileReader, $filter, items, $rootScope, $uibModal, $uibModalStack) {
        $scope.submit_name = "Update";
        $scope.student_name = "";
        $scope.date_event = "";
        $scope.desc = "";
        $scope.attachment_deleted = "";
        $scope.ic = "";

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
                url: ip_server + 'student/get_event_detail?id=' + items
            }).then(function (result) {
                result = result.data;
                $scope.id = result.id;
                $scope.ic = result.student_ic;
                $scope.student_name = result.student_name + "(" + result.student_ic + ")";
                $scope.student_ic = result.student_ic;
                $scope.date_event = result.date_event;
                $scope.desc = result.desc;
                $scope.attachment_lama_event = result.attachment;
                // $scope.path = result.attachment;

                loaderModal.close()
            }).catch(function (error) {
                alert("Connection Error");
                loaderModal.close();
                $uibModalStack.dismissAll();

            });

        }

        $scope.removeAttNew = function (index) {

            $scope.attachment.splice(index, 1);
        };

        $scope.attachment_deleted = [];
        $scope.removeAtt = function (index) {
            if ($scope.attachment_lama_event[index].id) {
                $scope.attachment_deleted.push($scope.attachment_lama_event[index].id)
            }
            $scope.attachment_lama_event.splice(index, 1);
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
            if ($scope.attachment) {
                for (var i = 0; i < $scope.attachment.length; i++) {
                    fd.append('attachment', $scope.attachment[i]);
                }
            }
            var data = JSON.stringify({
                "student_ic": $scope.ic,
                "date_event": $scope.date_event,
                "desc": $scope.desc,
                "attachment_deleted": $scope.attachment_deleted,


            });
            fd.append('data', data);
            //
            $http.post(ip_server + "student/update_event?id=" + items, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function (response) {
                if (response.data['status'] == "OK") {
                    toastr.success('Data successfully saved.', 'Success!');
                    loaderModal.close();
                    $uibModalStack.dismissAll();
                    $rootScope.$broadcast('load_list_event');

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
