(function () {
    'use strict';

    angular.module('BlurAdmin.pages', [
        'ui.router',
        'BlurAdmin.pages.account',
        'BlurAdmin.pages.student',
        'BlurAdmin.pages.academic',
    ]).config(routeConfig);


    /** @ngInject */
    function routeConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/student-list');
    }
})();
