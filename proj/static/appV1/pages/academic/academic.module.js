(function () {
    'use strict';

    angular.module('BlurAdmin.pages.academic', ['ui.select', 'summernote'])
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider


            .state('academic-list', {
                url: '/academic-list',
                templateUrl: '../static/app' + gversion + '/pages/academic/academic.html',
                controller: 'academic_listCtrl',
                title: 'Academic',
                sidebarMeta: {
                    icon: 'ion-compose',
                    order: 20
                }
            });
        // $urlRouterProvider.when('/report', '/report');
    }

})();
