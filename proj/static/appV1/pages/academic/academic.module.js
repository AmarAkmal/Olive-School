(function () {
    'use strict';

    angular.module('BlurAdmin.pages.academic', ['ui.select', 'summernote'])
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('academic', {
                url: '/academic',
                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'Academic',
                sidebarMeta: {
                    icon: 'ion-compose',
                    order: 1
                }
            })
            .state('academic.aideed', {
                url: '/aideed',
                templateUrl: '../static/app' + gversion + '/pages/academic/aideed/widgets/list.html',
                controller: 'aideed_listCtrl',
                title: 'Aideed',
                sidebarMeta: {
                    icon: 'ion-compose',
                    order: 20
                }
            })
            .state('academic.amar', {
                url: '/amar',
                templateUrl: '../static/app' + gversion + '/pages/academic/academic.html',
                controller: 'academic_listCtrl',
                title: 'Amar',
                sidebarMeta: {
                    icon: 'ion-compose',
                    order: 20
                }
            });
        $urlRouterProvider.when('/academic', '/academic/aideed');
    }

})();
