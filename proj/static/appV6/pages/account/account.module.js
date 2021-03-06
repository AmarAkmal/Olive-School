(function () {
    'use strict';

    angular.module('BlurAdmin.pages.account', ['ui.select', 'angularjs-datetime-picker'])
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('account-list', {
                url: '/account-list',
                templateUrl: '../static/app' + gversion + '/pages/account/account.html',
                controller: 'account_listCtrl',
                title: 'Account',
                sidebarMeta: {
                    icon: 'fa fa-briefcase',
                    order: 10
                }
            });
        // $urlRouterProvider.when('/report', '/report');
    }

})();
