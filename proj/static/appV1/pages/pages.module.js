// (function () {
//     'use strict';
//
//     angular.module('BlurAdmin.pages', [
//         'ui.router',
//         'BlurAdmin.pages.student',
//         'BlurAdmin.pages.account',
//         'BlurAdmin.pages.academic',
//         'BlurAdmin.pages.event',
//
//     ]).config(routeConfig);
//
//
//     /** @ngInject */
//     function routeConfig($urlRouterProvider) {
//         $urlRouterProvider.otherwise('/student-list');
//     }
// })();


(function () {
    'use strict';
    if (role == "Principle") {

        angular.module('BlurAdmin.pages', [
            'ui.router',
            'BlurAdmin.pages.student',
            'BlurAdmin.pages.account',
            'BlurAdmin.pages.academic',
            'BlurAdmin.pages.event',

        ]).config(routeConfig);

        function routeConfig($urlRouterProvider) {
            $urlRouterProvider.otherwise('/student-list');
        }

    } else if (role == "Teacher") {
        angular.module('BlurAdmin.pages', [
            'ui.router',
            'BlurAdmin.pages.student',
            'BlurAdmin.pages.event',


        ]).config(routeConfig);

        function routeConfig($urlRouterProvider) {
            $urlRouterProvider.otherwise('/student-list');
        }


    } else if (role == "Special Teacher 1") {
        angular.module('BlurAdmin.pages', [
            'ui.router',
            'BlurAdmin.pages.student',
            'BlurAdmin.pages.academic',
            'BlurAdmin.pages.event',

        ]).config(routeConfig);

        function routeConfig($urlRouterProvider) {
            $urlRouterProvider.otherwise('/student-list');
        }

    }else if (role == "Special Teacher 2") {
        angular.module('BlurAdmin.pages', [
            'ui.router',
            'BlurAdmin.pages.student',
            'BlurAdmin.pages.academic',
            'BlurAdmin.pages.event',

        ]).config(routeConfig);

        function routeConfig($urlRouterProvider) {
            $urlRouterProvider.otherwise('/student-list');
        }

    }
    else if (role == 'Account') {
        angular.module('BlurAdmin.pages', [
            'ui.router',
            'BlurAdmin.pages.account',


        ]).config(routeConfig);

        function routeConfig($urlRouterProvider) {
            $urlRouterProvider.otherwise('/account-list');
        }

    } else if (role == 'tOts Teacher') {
        angular.module('BlurAdmin.pages', [
            'ui.router',
            'BlurAdmin.pages.academic',
            'BlurAdmin.pages.event',

        ]).config(routeConfig);

        function routeConfig($urlRouterProvider) {
            $urlRouterProvider.otherwise('/academic/report_card');
        }

    }


})();

