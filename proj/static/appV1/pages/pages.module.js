(function () {
    'use strict';

    angular.module('BlurAdmin.pages', [
        'ui.router',
        'BlurAdmin.pages.student',
        'BlurAdmin.pages.account',
        'BlurAdmin.pages.academic',
        'BlurAdmin.pages.event',

    ]).config(routeConfig);


    /** @ngInject */
    function routeConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/student-list');
    }
})();
