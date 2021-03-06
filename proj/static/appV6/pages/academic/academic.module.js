(function () {
    'use strict';

    angular.module('BlurAdmin.pages.academic', ['ui.select', 'summernote', 'ckeditor'])
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
                url: '/report_card',
                templateUrl: '../static/app' + gversion + '/pages/academic/aideed/widgets/list.html',
                controller: 'aideed_listCtrl',
                title: 'Report Card',
                sidebarMeta: {
                    icon: 'ion-compose',
                    order: 20
                }
            })
            .state('academic.add', {
                url: '/add',
                templateUrl: '../static/app' + gversion + '/pages/academic/aideed/widgets/add.html',
                controller: 'aideedCreateCtrl',
                title: 'Create Report',
            })
            .state('academic.amar', {
                url: '/iep',
                templateUrl: '../static/app' + gversion + '/pages/academic/academic.html',
                controller: 'academic_listCtrl',
                title: 'IEP',
                sidebarMeta: {
                    icon: 'ion-compose',
                    order: 20
                }
            });
        // $urlRouterProvider.when('/academic', '/report_card');
    }

})();
