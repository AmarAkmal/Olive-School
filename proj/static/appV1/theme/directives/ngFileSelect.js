(function () {
    'use strict';


    angular.module('BlurAdmin.theme')
        .directive('ngFileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    var model = $parse(attrs.ngFileModel);
                    var modelSetter = model.assign;
                    element.bind('change', function () {
                        var values = [];
                        angular.forEach(element[0].files, function (item) {

                            values.push(item);
                        });
                        scope.$apply(function () {

                            modelSetter(scope, values);

                        });
                    });
                }
            }
        }]);


    angular.module('BlurAdmin.theme')
        .directive('ngFileSelect', ngFileSelect);

    /** @ngInject */
    function ngFileSelect() {
        return {
            link: function ($scope, el) {
                el.bind('change', function (e) {
                    $scope.file = (e.srcElement || e.target).files[0];
                    $scope.getFile($scope.file);
                })
            }
        }
    }

})();