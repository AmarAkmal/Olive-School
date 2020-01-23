(function () {
        'use strict';

        angular.module('BlurAdmin.pages.academic')
            .controller('aideedViewCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "items", "$uibModal", aideedViewCtrl]);

        function aideedViewCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, items, $uibModal) {
            $scope.form = {};
            $scope.form = items;
            $scope.printDiv = function () {

                var newWin = window.open("");
                newWin.document.write('<br><br><div><label style="margin: 20px; text-decoration: underline;">Report Card</label></div>');
                newWin.document.write('<div><label style="margin: 20px">Student’s Name :' + $scope.form.student_name + '</label></div>');
                newWin.document.write('<div><label style="margin: 20px">Class :' + $scope.form.code + ' – ' + $scope.form.class + '</label></div>');
                var ghtml = document.getElementById("DivIdToPrint");
                var DivIdToPrint = ghtml.cloneNode(true);
                $('<br><div><label style="margin: 20px"></label></div>').prependTo(DivIdToPrint);
                var htmlToPrint = '' +
                    '<style type="text/css">' +
                    'table{' +
                    'border-spacing: 0px;' +
                    '}' +
                    'table th, table td {' +
                    'border:0.5px solid #000;padding: 5px;' +
                    '}' +
                    'table tr {text-align: left}' +
                    'table{' +
                    ' margin: auto;' +
                    'width: calc(100% - 40px);}' +
                    '.noprint{display: none}' +
                    '</style>';
                htmlToPrint += DivIdToPrint.outerHTML;
                newWin.document.write(htmlToPrint);
                newWin.print();
                newWin.close();

            }


        }
    }

)();
