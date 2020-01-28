(function () {
    'use strict';
    // angular.module('BlurAdmin.pages.event').directive('dateeventselected', function () {
    //     return function (scope, element, $rootScope) {
    //
    //         element.datepicker({
    //             dateFormat: 'dd MM yy', showOtherMonths: true, selectOtherMonths: true,
    //             changeYear: true,
    //             onSelect: function (selectedDate,) {
    //                 scope.date_event = selectedDate;
    //                 // rootScope.$broadcast('load_list_report')
    //
    //
    //             }
    //         });
    //     };
    // });
// angular.module('BlurAdmin.theme')

    angular.module('BlurAdmin.pages.event').directive('dateeventselected', function () {
        return function (scope, element, $rootScope) {

            element.datepicker({
                restrict: 'A',
                dateFormat: 'dd MM yy', showOtherMonths: true, selectOtherMonths: true,
                changeYear: true,
                onSelect: function (selectedDate,) {
                    scope.date_event = selectedDate;
                    // rootScope.$broadcast('load_list_report')


                }
            });
        };
    }).directive('ngFileModelCreate', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var model = $parse(attrs.ngFileModelCreate);
                var modelSetter = model.assign;
                var values = [];
                element.bind('change', function () {

                    angular.forEach(element[0].files, function (item) {

                        values.push(item);
                    });
                    scope.$apply(function () {

                        modelSetter(scope, values);

                    });
                });
            }
        }
    }])
        .controller('studentEventCreateCtrl', ['$http', '$scope', 'toastr', 'fileReader', '$filter', "$rootScope", "$uibModalStack", '$uibModal', studentEventCreateCtrl]);

    function studentEventCreateCtrl($http, $scope, toastr, fileReader, $filter, $rootScope, $uibModalStack, $uibModal) {
        var today = new Date();
        // var month = new Array();
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var dd = String(today.getDate()).padStart(2, '0');
        var bulan = month[today.getMonth()];
        var yyyy = today.getFullYear();


        $scope.date_event = dd + " " + bulan + " " + yyyy;


        $scope.submit_name = "Submit";

        $scope.desc = "";
        $http({
            method: 'GET',
            url: ip_server + 'student/get_student_list'
        }).then(function (result) {
            $scope.student_name = result.data
        });
        $scope.removeAttNew = function (index) {
            // if ($scope.attachment[index].id) {
            //     $scope.attachment.push($scope.attachment[index].id)
            // }
            $scope.attachment.splice(index, 1);
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
            //
            var data = JSON.stringify({
                "student_detail": $scope.student_name.selected,
                "date_event": $scope.date_event,
                "desc": $scope.desc,


            });
            fd.append('data', data);
            //
            $http.post(ip_server + "student/add_event?id=" + user_id, fd, {
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
