(function () {
        'use strict';

        angular.module('BlurAdmin.pages.academic')
            .controller('academicCreateCtrl', ['$http', '$scope', 'toastr', '$rootScope', "editableOptions", "editableThemes", "$uibModalStack", "$uibModal", "$templateCache", academicCreateCtrl]);

        function academicCreateCtrl($http, $scope, toastr, $rootScope, editableOptions, editableThemes, $uibModalStack, $uibModal, $templateCache) {
            $scope.select_sem = {'selected': [], 'options': ['1', '2', '3']};
            $scope.desc = "";
            $scope.items = [];
            $http({
                method: 'GET',
                url: ip_server + 'student/get_student_list'
            }).then(function (result) {
                $scope.student_name = result.data
            });
            $scope.config = {};
            $scope.config = {
                "height": 1000,
                "language": 'en',
                "allowedContent": true,
                "entities": false,
            };
            $scope.config.toolbarGroups = [
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                {name: 'forms', groups: ['forms']},
                {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                {name: 'links', groups: ['links']},
                {name: 'insert', groups: ['insert']},
                {name: 'styles', groups: ['styles']},
                {name: 'colors', groups: ['colors']},
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'tools', groups: ['tools']},
                {name: 'others', groups: ['others']},
                // {name: 'about', groups: ['about']}
            ];
            $scope.config.extraPlugins = 'lineheight';


            $scope.desc = '<table class="Table" style="border-collapse:collapse; width:777.9500pt; margin-left:6.7500pt; margin-right:6.7500pt; border:1.0000pt solid windowtext; font-family:&quot;Times New Roman&quot;; font-size:10pt">\n' +
                '\t<tbody>\n' +
                '\t\t<tr>\n' +
                '\t\t\t<td colspan="7" style="border-bottom:1.0000pt solid windowtext; width:777.9500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:1.0000pt solid windowtext" valign="top" width="1037">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:14.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Name : </span></span></span></span></b>&nbsp;</span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom: 0pt; margin-left: 5px;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:14.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Age :</span></span></span></span></b></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:14.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Date Implemented :&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Date review:&nbsp;</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr>\n' +
                '\t\t\t<td colspan="7" style="border-bottom:1.0000pt solid windowtext; width:777.9500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="1037">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:14.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Individualized Educational Plan</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:108.6500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:none" valign="center" width="144">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Area/Domain</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:115.4500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:1.0000pt solid windowtext" valign="center" width="153">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Strengths &amp; Weaknesses</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:119.7500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:1.0000pt solid windowtext" valign="center" width="159">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Target</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:163.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:1.0000pt solid windowtext" valign="center" width="217">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Success Criteria</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:102.8000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:1.0000pt solid windowtext" valign="center" width="137">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Teaching Strategies</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:67.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:1.0000pt solid windowtext" valign="center" width="89">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Frequency</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:1.0000pt solid windowtext" valign="center" width="134">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Review</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:27.3500pt">\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:108.6500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="144">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Speech and Language</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:115.4500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="153">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">He is able to engage in simple conversations; however, his pronunciation and articulation of words need improving and he has inappropriate </span></span></span><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">voice rate and phrasing in sentence at times. </span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:119.7500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="159">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="text-autospace:none"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">To increase speech intelligibility in conversation.</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:163.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="217">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="text-autospace:none"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">Use appropriate rate and phrasing in sentence production (pitch, volume rate, stress) </span></span><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">with 2-3 prompt in 4 out of 5 independent tasks.</span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:102.8000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="137">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">- Modelling technique</span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">- Interactive communication</span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:67.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="89">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">2-3 times a week</span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Exceeded target" type="checkbox" value="1" /><span style="font-size:12px;"><strong><strong>Exceeded target</strong></strong></span></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:12.7500pt">\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:150%"><span style="font-family:Calibri"><b><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Remarks: &nbsp;</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:28.1500pt">\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:108.6500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="144">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Attention &amp; Memory</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:115.4500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="153">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">Student is able to initiate task independently but still gets easily distracted by his surroundings, therefore, still needs to be prompted in finishing tasks quickly/concentrating or paying attention during lessons.</span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:119.7500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="159">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">To be able to maintain focus until task is complete. </span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:163.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="217">\n' +
                '\t\t\t<p class="17" style="margin-bottom:0.0000pt; margin-left:11.7500pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">Student is able to maintain on task for a minimum of 10 minutes independently without prompt on 4 out of 5 independent tasks. </span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:102.8000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="137">\n' +
                '\t\t\t<p class="17" style="margin-bottom: 0pt;"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">- Minimal visual distractions</span></span></p>\n' +
                '\n' +
                '\t\t\t<p class="17" style="margin-bottom:0.0000pt"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">-Have “Attention Breaks”</span></span></p>\n' +
                '\n' +
                '\t\t\t<p class="17" style="margin-bottom:0.0000pt"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">-Attention – challenge (5-10 minutes active play before &nbsp;task)</span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-left: -2.15pt; margin-bottom: 0pt;">&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:67.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="89">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">2-3 times a week</span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Exceeded target" type="checkbox" value="1" /><span style="font-size:12px;"><strong><strong>Exceeded target</strong></strong></span></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:28.1500pt">\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:150%"><span style="font-family:Calibri"><b><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Remarks: &nbsp;</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:28.1500pt">\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:108.6500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="144">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="font-weight:bold">Academic skills</span></span></span></b></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:115.4500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="153">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="background:#ffffff"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">He is able to read and understand more stories now, however, he has trouble with putting more in depth meaning to the stories.</span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:119.7500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="159">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="background:#ffffff"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Able to use a variety of strategies during reading and viewing to construct, monitor, and confirm meaning, including predicting, making connections, and visualizing, asking and answering questions.</span></span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:163.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="217">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">He will check predictions, confirm, and revise predictions based on information from reading and viewing with 80% accuracy in 2 out of 3 trials.</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">He will visualize, sketch, or use graphic organizers to support comprehension (e.g., mind map, quadrants) with 80% accuracy in 2 out of 3 trials.</span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:102.8000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="137">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="text-autospace:none"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">- Slowing Down</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="text-autospace:none"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">-"Blanks"</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="text-autospace:none"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">- Preview</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:67.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="89">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">2 -3 times a week</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Exceeded target" type="checkbox" value="1" /><span style="font-size:12px;"><strong><strong>Exceeded target</strong></strong></span></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:33.4000pt">\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:150%"><span style="font-family:Calibri"><b><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Remarks: &nbsp;</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:84.0000pt">\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:108.6500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="144">\n' +
                '\t\t\t<p style="margin-bottom: 0pt; text-align: center;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="font-weight:bold">Task behavior and behavior modification</span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:115.4500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="153">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="vertical-align:baseline"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">He has an impulsive behaviour whereby he pulls people instead of talking and telling them what he wants.</span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:119.7500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="159">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="vertical-align:baseline"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">To be able to verbally express himself and have self-control to not pull others.</span></span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:163.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="217">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Student is able to call out to people and tell them what he wants with 80% accuracy in 3 out of 5 trial.</span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:102.8000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="137">\n' +
                '\t\t\t<p class="17"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Self-regulation</span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p class="17"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Behaviour modification</span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:67.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="89">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Everyday </span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Exceeded target" type="checkbox" value="1" /><span style="font-size:12px;"><strong><strong>Exceeded target</strong></strong></span></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:61.4500pt">\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:150%"><span style="font-family:Calibri"><b><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Remarks: &nbsp;</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:124.2000pt">\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:108.6500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:1.0000pt solid windowtext; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="144">\n' +
                '\t\t\t<p align="center" style="text-align:center; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="font-weight:bold">Tots Intervention Modules</span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:115.4500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="153">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:136%"><span style="font-family:Calibri"><b><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Proprioception hyposensitivity </span></span></span></span></b><b>&nbsp;</b></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<ul>\n' +
                '\t\t\t\t<li class="17"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">Difficulty sitting in his chair.</span></span></li>\n' +
                '\t\t\t</ul>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">He shows inappropriate self-stimulatory behaviour (flapping)</span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-left:3.6000pt; margin-bottom:0pt">&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:119.7500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="159">\n' +
                '\t\t\t<p style="margin-bottom: 10pt;"><span style="font-size:11pt"><span style="line-height:136%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="background:#ffffff"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">To improve his focus and attention for 80% of the school day.</span></span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt"><span style="font-size:11pt"><span style="line-height:136%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="background:#ffffff"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">To reduce his self-stimulatory behaviour in a socially acceptable way by socializing in group activities more.</span></span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:163.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="217">\n' +
                '\t\t\t<p align="justify" style="margin-bottom:10.0000pt; text-align:justify"><span style="font-size:11pt"><span style="text-justify:inter-ideograph"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="background:#ffffff"><span style="font-family:\'Times New Roman\'">Student is able to work at his desk, sitting in his chair, for 15-20 minutes without prompt &nbsp;others &nbsp;&nbsp;in 4 out 5 consecutive tries</span></span></span>&nbsp;</span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'">Student will demonstrate improved sensory modulation by self-calming with the use of sensory techniques needed.</span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:102.8000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="137">\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Deep pressure activities </span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Joint compression</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Heavy work activities</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Resistance activities</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Swings</span></span></span></span></span></span></p>\n' +
                '\n' +
                '\t\t\t<p style="margin-bottom:10.0000pt;"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">- Taking a walk between classes.</span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td rowspan="2" style="border-bottom:1.0000pt solid windowtext; width:67.4000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="89">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">2-3 times a week</span></span></span></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Exceeded target" type="checkbox" value="1" /><span style="font-size:12px;"><strong><strong>Exceeded target</strong></strong></span></p>\n' +
                '\n' +
                '\t\t\t<p><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t\t<tr style="height:16.7000pt">\n' +
                '\t\t\t<td style="border-bottom:1.0000pt solid windowtext; width:100.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:1.0000pt solid windowtext; border-top:none" valign="top" width="134">\n' +
                '\t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:150%"><span style="font-family:Calibri"><b><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Remarks: &nbsp;</span></span></span></span></b></span></span></span></p>\n' +
                '\t\t\t</td>\n' +
                '\t\t</tr>\n' +
                '\t</tbody>\n' +
                '</table>\n' +
                '\n' +
                '<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '<p style="margin-left:4.5000pt; margin-bottom:0pt"><span style="font-size:11pt"><span style="background:#ffffff"><span style="line-height:114%"><span style="font-family:Calibri"><b><span style="font-size:14.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000"><span style="font-weight:bold">Parent’s Agreement</span></span></span></span></b></span></span></span></span></p>\n' +
                '\n' +
                '<p style="margin-left:4.5000pt; margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '<p style="margin-left:4.5000pt; margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '<p style="margin-left:4.5000pt; margin-bottom:0pt"><span style="font-size:11pt"><span style="background:#ffffff"><span style="line-height:150%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">I, __________________________________________, parent of _____________________________________ have read and understood the above IEP that has been set for my son. I agree with the plan and promise to cooperate with the teachers and therapists of The Olive Trees School to ensure optimal achievement of the IEP.</span></span></span></span></span></span></span></p>\n' +
                '\n' +
                '<p style="margin-left:4.5000pt; margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '<p style="margin-left:4.5000pt; margin-bottom:0pt"><span style="font-size:11pt"><span style="background:#ffffff"><span style="line-height:200%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Parent’s Name:</span></span></span> <span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Class teacher: </span></span></span> <span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">___________________________</span></span></span></span></span></span></span></p>\n' +
                '\n' +
                '<p style="margin-left:4.5000pt; margin-bottom:0pt"><span style="font-size:11pt"><span style="background:#ffffff"><span style="line-height:200%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Date&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;:</span></span></span> <span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">___________________________&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Date&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;:___________________________ &nbsp;&nbsp;</span></span></span></span></span></span></span></p>\n' +
                '\n' +
                '<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Signature&nbsp; &nbsp; &nbsp; &nbsp; :</span></span></span> <span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Signature&nbsp; &nbsp; &nbsp;:</span></span></span><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">_____________________</span></span></span><span style="font-size:12.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">____</span></span></span></span></span></span></p>\n' +
                '\n' +
                '<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                '\n' +
                '<p style="margin-bottom:0pt">&nbsp;</p>';

            $scope.submit = function () {

                loaderModal = $uibModal.open({
                    animation: true,
                    templateUrl: '../static/app' + gversion + '/pages/asset/widgets/loader.html',
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false,
                });
                var fd = new FormData();
                var data = {
                    "user_id": user_id,
                    "student_id": $scope.student_name.selected.id,
                    "year": $scope.year,
                    // "sem": $scope.select_sem.selected,
                    // "items": $scope.items,
                    "desc": $scope.desc,
                };


                // if ($scope.attachment) {
                //     for (var i = 0; i < $scope.attachment.length; i++) {
                //         fd.append('attachment', $scope.attachment[i]);
                //     }
                // }

                fd.append('data', JSON.stringify(data));

                $http.post(ip_server + 'academic/add', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }
                ).then(function (response) {
                    if (response.data.status === "OK") {
                        toastr.success('Data successfully saved.', 'Success');
                        loaderModal.close();
                        $uibModalStack.dismissAll();
                        $rootScope.$broadcast('load_list_academic');

                    } else {
                        toastr.error("Data hasn't been save.", 'Error!');
                    }
                }).catch(function (error) {
                    alert("Connection Error");
                    loaderModal.close();
                    $uibModalStack.dismissAll();
                });
            };

            $scope.remove_items = function (index) {
                $scope.items.splice(index, 1);
            };

            $scope.remove_item_edit = function (index, desc, price) {

                if (desc.length == 0 && price.length == 0) {

                    $scope.items.splice(index, 1);
                    // calculate();
                }
            };
            $scope.add_item = function () {
                $scope.inserted = {
                    // id: $scope.items.length + 1,
                    code: '',
                    subject: "",
                    score: "",
                };

                if ($scope.items.length == 0) {
                    $scope.items.push($scope.inserted);
                } else {

                    if ($scope.items[$scope.items.length - 1].code != "") {
                        $scope.items.push($scope.inserted);
                    } else {
                        toastr.warning('Please save before add new item !', 'Warning');
                    }
                }

            };

            editableOptions.theme = 'bs3';
            $scope.checkValidity = function (data, type) {
                if (type == 'code') {
                    if (data == undefined) {           /*Add new deleted data  undefined*/
                        return "Required!";
                    }

                    if (data.length == 0) {         /*Add new save length 0/"" */
                        return "Required!";
                    }


                } else if (type == 'subject') {
                    if (data == undefined) {           /*Add new deleted data  undefined*/
                        return "Required!";
                    }

                    if (data.length == 0) {         /*Add new save length 0/"" */
                        return "Required!";
                    }

                } else if (type == 'score') {
                    if (data == undefined) {           /*Add new deleted data  undefined*/
                        return "Required!";
                    }

                    if (data.length == 0) {         /*Add new save length 0/"" */
                        return "Description Required!";
                    }

                }

            }

        }
    }

)();
