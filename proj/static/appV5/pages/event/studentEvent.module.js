(function () {
    'use strict';

    angular.module('BlurAdmin.pages.event', ['ui.select', 'angularjs-datetime-picker'])
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('student-event', {
                url: '/student-event',
                templateUrl: '../static/app' + gversion + '/pages/event/studentEvent.html',
                controller: 'studentEventListCtrl',
                title: 'Event',
                sidebarMeta: {
                     icon: 'fa fa-calendar',
                    order: 40
                }
            });
    }

})();
