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

            $scope.desc = '<div class="Section0">\n' +
                ' <p style="text-align:center">&nbsp;</p>\n' +
                ' </div>\n' +
                ' \n' +
                ' <table align="center" border="1" cellspacing="0" class="Table" style="border-collapse:collapse; border:1.0000pt solid windowtext; font-family:&quot;Times New Roman&quot;; font-size:10pt; margin-left:6.7500pt; margin-right:6.7500pt; width:777.9500pt">\n' +
                ' \t<tbody>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td colspan="7" style="vertical-align:top; width:777.9500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-size:14px"><span style="font-family:Times New Roman,Times,serif"><strong><strong>Name : </strong></strong>&nbsp;</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-size:14px"><span style="font-family:Times New Roman,Times,serif"><strong><strong>Age :&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Diagnosis : </strong></strong>&nbsp;</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-size:14px"><span style="font-family:Times New Roman,Times,serif"><strong><strong>Date Implemented :&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Date review:&nbsp;</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td colspan="7" style="vertical-align:top; width:777.9500pt">\n' +
                ' \t\t\t<p style="text-align:center"><span style="color:null;"><span style="font-size:14px"><span style="font-family:Times New Roman,Times,serif"><strong><strong>Individualized Educational Plan</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="vertical-align:center; width:108.6500pt">\n' +
                ' \t\t\t<p style="text-align:center"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Area/Domain</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:center; width:115.4500pt">\n' +
                ' \t\t\t<p style="margin-left:5px; text-align:center"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Strengths &amp; Weaknesses</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:center; width:119.7500pt">\n' +
                ' \t\t\t<p style="margin-left:5px; text-align:center"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Target</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:center; width:163.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px; text-align:center"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Success Criteria</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:center; width:102.8000pt">\n' +
                ' \t\t\t<p style="margin-left:5px; text-align:center"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Teaching Strategies</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:center; width:67.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px; text-align:center"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Frequency</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:center; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px; text-align:center"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Review</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td rowspan="2" style="height:27.3500pt; vertical-align:top; width:108.6500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Speech and Language</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:27.3500pt; vertical-align:top; width:115.4500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">He is able to engage in simple conversations; however, his pronunciation and articulation of words need improving and he has inappropriate voice rate and phrasing in sentence at times. </span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:27.3500pt; vertical-align:top; width:119.7500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">To increase speech intelligibility in conversation.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:27.3500pt; vertical-align:top; width:163.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Use appropriate rate and phrasing in sentence production (pitch, volume rate, stress) with 2-3 prompt in 4 out of 5 independent tasks.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:27.3500pt; vertical-align:top; width:102.8000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Modelling technique</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Interactive communication</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:27.3500pt; vertical-align:top; width:67.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">2-3 times a week</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="height:27.3500pt; vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Exceeded target" type="checkbox" value="1" /><strong><strong>Exceeded target</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="height:12.7500pt; vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Remarks:&nbsp;&nbsp;</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px; text-align:justify">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px; text-align:justify">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px; text-align:justify">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px; text-align:justify">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td rowspan="2" style="height:28.1500pt; vertical-align:top; width:108.6500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Attention &amp; Memory</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:28.1500pt; vertical-align:top; width:115.4500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Student is able to initiate task independently but still gets easily distracted by his surroundings, therefore, still needs to be prompted in finishing tasks quickly/concentrating or paying attention during lessons.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:28.1500pt; vertical-align:top; width:119.7500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">To be able to maintain focus until task is complete. </span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:28.1500pt; vertical-align:top; width:163.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Student is able to maintain on task for a minimum of 10 minutes independently without prompt on 4 out of 5 independent tasks. </span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:28.1500pt; vertical-align:top; width:102.8000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;">-&nbsp;<span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Minimal&nbsp;visual distractions</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Have “Attention Breaks”</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Attention – challenge (5 10 minutes active play before &nbsp;task)</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="height:28.1500pt; vertical-align:top; width:67.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">2-3 times a week</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="height:28.1500pt; vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Exceeded target" type="checkbox" value="1" /><strong><strong>Exceeded target</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="height:28.1500pt; vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Remarks: &nbsp;</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:108.6500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Academic skills</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:115.4500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">He is able to read and understand more stories now, however, he has trouble with putting more in depth meaning to the stories.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:119.7500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Able to use a variety of strategies during reading and viewing to construct, monitor, and confirm meaning, including predicting, making connections, and visualizing, asking and answering questions.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:163.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">He will check predictions, confirm, and revise predictions based on information from reading and viewing with 80% accuracy in 2 out of 3 trials.</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">He will visualize, sketch, or use graphic organizers to support comprehension (e.g., mind map, quadrants) with 80% accuracy in 2 out of 3 trials.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:102.8000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Slowing Down</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">-"Blanks"</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Preview</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:67.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">2 -3 times a week</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Exceeded target" type="checkbox" value="1" /><strong><strong>Exceeded target</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Remarks: &nbsp;</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:108.6500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Task behavior and behavior modification</strong></strong></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:115.4500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">He has an impulsive behaviour whereby he pulls people instead of talking and telling them what he wants.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:119.7500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">To be able to verbally express himself and have self-control to not pull others.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:163.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Student is able to call out to people and tell them what he wants with 80% accuracy in 3 out of 5 trial.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:102.8000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Self-regulation</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Behaviour modification</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td rowspan="2" style="vertical-align:top; width:67.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Everyday </span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Fully met" type="checkbox" value="1" /><strong><strong>Fully met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Exceeded target" type="checkbox" value="1" /><strong><strong>Exceeded target</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Remarks: </strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td colspan="1" rowspan="2" style="vertical-align:top; width:108.6500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Tots Intervention Modules</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td colspan="1" rowspan="2" style="vertical-align:top; width:115.4500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Proprioception hyposensitivity </strong>&nbsp;</strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<ul>\n' +
                ' \t\t\t\t<li>\n' +
                ' \t\t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Difficulty sitting in his chair.</span></span></span></p>\n' +
                ' \t\t\t\t</li>\n' +
                ' \t\t\t</ul>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">He shows inappropriate self-stimulatory behaviour (flapping)</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:10px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td colspan="1" rowspan="2" style="vertical-align:top; width:119.7500pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">To improve his focus and attention for 80% of the school day.</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">To reduce his self-stimulatory behaviour in a socially acceptable way by socializing in group activities more.</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:25px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td colspan="1" rowspan="2" style="vertical-align:top; width:163.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Student is able to work at his desk, sitting in his chair, for 15-20 minutes without prompt &nbsp;others &nbsp;&nbsp;in 4 out 5 consecutive tries&nbsp;</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">Student will demonstrate improved sensory modulation by self-calming with the use of sensory techniques needed.</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td colspan="1" rowspan="2" style="vertical-align:top; width:102.8000pt">\n' +
                ' \t\t\t<p style="margin-left:15px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Deep pressure activities </span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Joint compression</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Heavy work activities</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Resistance activities</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Swings</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">- Taking a walk between classes.</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td colspan="1" rowspan="2" style="vertical-align:top; width:67.4000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">2-3 times a week</span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Fully met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Partially met" type="checkbox" value="1" /><strong><strong>Partially met</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Exceeded target" type="checkbox" value="1" /><strong><strong>Exceeded target</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><input name="Not met" type="checkbox" value="1" /><strong><strong>Not met</strong></strong>&nbsp;</span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="vertical-align:top; width:100.5000pt">\n' +
                ' \t\t\t<p style="margin-left:5px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong><strong>Remarks: &nbsp;</strong></strong></span></span></span></p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-left:5px">&nbsp;</p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t</tbody>\n' +
                ' </table>\n' +
                ' \n' +
                ' <p style="margin-left:10px"><span style="color:null;"><span style="font-size:14px"><span style="font-family:Times New Roman,Times,serif"><strong>Parent’s Agreement</strong></span></span></span></p>\n' +
                ' \n' +
                ' <p style="margin-left:10px"><span style="color:null;"><span style="font-family:Times New Roman,Times,serif"><span style="font-size:12px">I, __________________________________________, parent of _____________________________________ have read and understood the above IEP that has been set for my son. I agree with the plan and promise to cooperate with the teachers and therapists of The Olive Trees School to ensure optimal achievement of the IEP.</span></span></span></p>\n' +
                ' \n' +
                ' <p style="padding:0pt 0pt 0pt 0pt ; margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span></p>\n' +
                ' \n' +
                ' <table class="MsoTableGrid" style="border-collapse:collapse; border:none; text-align:justify; font-family:&quot;Times New Roman&quot;; font-size:10pt">\n' +
                ' \t<tbody>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="border-bottom:none; width:365.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:none; border-top:none" valign="top" width="487">\n' +
                ' \t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Parent’s Name</span></span></span>&nbsp;<span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">:_________________________</span></span></span></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="border-bottom:none; width:365.5500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:none; border-top:none" valign="top" width="487">\n' +
                ' \t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Class Teacher </span></span></span><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">:_________________________</span></span></span></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="border-bottom:none; width:365.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:none; border-top:none" valign="top" width="487">\n' +
                ' \t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Date</span></span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">: _________________________</span></span></span></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="border-bottom:none; width:365.5500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:none; border-top:none" valign="top" width="487">\n' +
                ' \t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Date</span></span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">: _________________________</span></span></span></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t\t<tr>\n' +
                ' \t\t\t<td style="border-bottom:none; width:365.5000pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:none; border-top:none" valign="top" width="487">\n' +
                ' \t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Signature</span></span></span><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></span></span><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">_________________________</span></span></span></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t\t<td style="border-bottom:none; width:365.5500pt; padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ; border-left:none; border-right:none; border-top:none" valign="top" width="487">\n' +
                ' \t\t\t<p style="margin-bottom:0pt">&nbsp;</p>\n' +
                ' \n' +
                ' \t\t\t<p style="margin-bottom:0pt"><span style="font-size:11pt"><span style="line-height:114%"><span style="font-family:Calibri"><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">Signature</span></span></span><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></span></span><span style="font-size:11.0000pt"><span style="font-family:\'Times New Roman\'"><span style="color:#000000">_________________________</span></span></span></span></span></span></p>\n' +
                ' \t\t\t</td>\n' +
                ' \t\t</tr>\n' +
                ' \t</tbody>\n' +
                ' </table>\n' +
                ' \n' +
                ' <p style="padding:0pt 0pt 0pt 0pt ; margin-bottom:0pt">&nbsp;</p>\n' +
                ' \n' +
                ' <p style="margin-bottom:0pt">&nbsp;</p>\n' +
                ' \n' +
                ' <p style="margin-left:5px">&nbsp;</p>\n' +
                ' ';
            // console.log($scope.desc)
            $scope.submit = function () {
                // console.log($scope.desc)
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
