describe("Ekstep Assesment Browser Plugin:", function() {
    var manifest, ctrl, $scope, pluginInstance;
    var instance = { manifest: {id: "org.ekstep.assessmentbrowser", ver: "1.0"}, "data":""};

    beforeAll(function(done) {
        CollectionEditorTestFramework.init(function() {
            manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.assessmentbrowser");
            path = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assessmentbrowserapp.js");
            pluginInstance = ecEditor.instantiatePlugin("org.ekstep.assessmentbrowser");
            var templatePath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assessmentbrowser.html");
            var controllerPath = ecEditor.resolvePluginResource(manifest.id, manifest.ver, "editor/assessmentbrowserapp.js");
            
            ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
            
            ecEditor.getCurrentStage = jasmine.createSpy().and.callFake(function() {
                return { id: '5437859-543758937' }
            });
            ecEditor.getContext = jasmine.createSpy().and.callFake(function() {
                return "do_1143535346658585";
            });

            done();
        })
    })
    it('mock popup service', function(done) {
        angular.mock.module('oc.lazyLoad');
        angular.mock.module('Scope.safeApply');
        inject(function($ocLazyLoad, _$rootScope_, _$controller_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $ocLazyLoad.load([{
                type: 'js',
                path: path
            }]).then(function() {
                ctrl = $controller("assessmentbrowsercontroller", {
                    $scope: $scope,
                    instance: instance
                });
                $scope.closeThisDialog = jasmine.createSpy().and.callFake(function() {
                    console.log("POPUP CLOSED")
                })
                done();
            }, function(error) {
                done();
            });
            setInterval(function() {
                _$rootScope_.$digest();
            }, 10);
        });
    });
    describe('Quiz plugin test cases', function() {
           
        it('Should invoke Meta Services and get Category Data', function(done) {
            var respCat = {"data": {"id":"ekstep.learning.framework.read","ver":"1.0","ts":"2018-06-01T11:35:01ZZ","params":{"resmsgid":"fc139cb7-d62c-4a90-ab2c-3b02cba7e002","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"framework":{"owner":"in.ekstep","identifier":"NCF","code":"NCF","consumerId":"fa271a76-c15a-4aa1-adff-31dd04682a1f","channel":"in.ekstep","description":"NCFCOPY ","type":"K-12","createdOn":"2018-01-23T17:07:56.405+0000","versionKey":"1525806108265","channels":[{"identifier":"ORG_001","name":"Org 001","objectType":"Channel","relation":"hasSequenceMember","description":"Channel for Org 001","index":null,"status":null,"depth":null,"mimeType":null,"visibility":null,"compatibilityLevel":null},{"identifier":"in.ekstep","name":"Ekstep","objectType":"Channel","relation":"hasSequenceMember","description":"Channel for in.ekstep","index":null,"status":null,"depth":null,"mimeType":null,"visibility":null,"compatibilityLevel":null}],"appId":"ekstep_portal","name":"NCF framework","lastUpdatedOn":"2018-05-08T19:01:48.265+0000","categories":[{"identifier":"ncf_board","code":"board","terms":[{"identifier":"ncf_board_ncert","code":"ncert","name":"NCERT","description":"","index":1,"category":"board","status":"Live"},{"identifier":"ncf_board_cbse","code":"cbse","name":"CBSE","description":"","index":2,"category":"board","status":"Live"},{"identifier":"ncf_board_icse","code":"icse","name":"ICSE","description":"","index":3,"category":"board","status":"Live"},{"identifier":"ncf_board_upboard","code":"upboard","name":"State (Uttar Pradesh)","description":"State (Uttar Pradesh)","index":4,"category":"board","status":"Live"},{"identifier":"ncf_board_apboard","code":"apboard","name":"State (Andhra Pradesh)","description":"State (Andhra Pradesh)","index":5,"category":"board","status":"Live"},{"identifier":"ncf_board_tnboard","code":"tnboard","name":"State (Tamil Nadu)","description":"State (Tamil Nadu)","index":6,"category":"board","status":"Live"},{"identifier":"ncf_board_ncte","code":"ncte","name":"NCTE","description":"","index":7,"category":"board","status":"Live"},{"identifier":"ncf_board_mscert","code":"mscert","name":"State (Maharashtra)","description":"State (Maharashtra)","index":8,"category":"board","status":"Live"},{"identifier":"ncf_board_bser","code":"bser","name":"State (Rajasthan)","description":"State (Rajasthan)","index":9,"category":"board","status":"Live"},{"identifier":"ncf_board_others","code":"others","name":"Other","description":"Other","index":10,"category":"board","status":"Live"}],"name":"Curriculum","description":"","index":1,"status":"Live"},{"identifier":"ncf_gradelevel","code":"gradeLevel","terms":[{"identifier":"ncf_gradelevel_kindergarten","code":"kindergarten","name":"KG","description":"KG","index":1,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade1","code":"grade1","name":"Class 1","description":"Class 1","index":2,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade2","code":"grade2","name":"Class 2","description":"Class 2","index":3,"category":"gradeLevel","status":"Live"},{"identifier":"ncf_gradelevel_grade3","code":"grade3","name":"Class 3","description":"Class 3","index":4,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade4","code":"grade4","name":"Class 4","description":"Class 4","index":5,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade5","code":"grade5","name":"Class 5","description":"Class 5","index":6,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade6","code":"grade6","name":"Class 6","description":"Class 6","index":7,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade7","code":"grade7","name":"Class 7","description":"Class 7","index":8,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade8","code":"grade8","name":"Class 8","description":"Class 8","index":9,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade9","code":"grade9","name":"Class 9","description":"Class 9","index":10,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade10","code":"grade10","name":"Class 10","description":"Class 10","index":11,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade11","code":"grade11","name":"Class 11","description":"Class 11","index":12,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_grade12","code":"grade12","name":"Class 12","description":"Class 12","index":13,"category":"gradelevel","status":"Live"},{"identifier":"ncf_gradelevel_others","code":"others","name":"Other","description":"","index":14,"category":"gradeLevel","status":"Live"}],"name":"Class","description":"","index":2,"status":"Live"},{"identifier":"ncf_subject","code":"subject","terms":[{"identifier":"ncf_subject_mathematics","code":"mathematics","name":"Mathematics","description":"","index":1,"category":"subject","status":"Live"},{"identifier":"ncf_subject_english","code":"english","name":"English","description":"","index":2,"category":"subject","status":"Live"},{"identifier":"ncf_subject_tamil","code":"tamil","name":"Tamil","description":"","index":3,"category":"subject","status":"Live"},{"identifier":"ncf_subject_telugu","code":"telugu","name":"Telugu","description":"","index":4,"category":"subject","status":"Live"},{"identifier":"ncf_subject_geography","code":"geography","name":"Geography","description":"","index":5,"category":"subject","status":"Live"},{"identifier":"ncf_subject_urdu","code":"urdu","name":"Urdu","description":"","index":6,"category":"subject","status":"Live"},{"identifier":"ncf_subject_kannada","code":"kannada","name":"Kannada","description":"","index":7,"category":"subject","status":"Live"},{"identifier":"ncf_subject_assamese","code":"assamese","name":"Assamese","description":"","index":8,"category":"subject","status":"Live"},{"identifier":"ncf_subject_physics","code":"physics","name":"Physics","description":"","index":9,"category":"subject","status":"Live"},{"identifier":"ncf_subject_chemistry","code":"chemistry","name":"Chemistry","description":"","index":10,"category":"subject","status":"Live"},{"identifier":"ncf_subject_hindi","code":"hindi","name":"Hindi","description":"","index":11,"category":"subject","status":"Live"},{"identifier":"ncf_subject_marathi","code":"marathi","name":"Marathi","description":"","index":12,"category":"subject","status":"Live"},{"identifier":"ncf_subject_environmentalstudies","code":"environmentalstudies","name":"EvS","description":"EvS","index":13,"category":"subject","status":"Live"},{"identifier":"ncf_subject_politicalscience","code":"politicalscience","name":"Political Science","description":"","index":14,"category":"subject","status":"Live"},{"identifier":"ncf_subject_bengali","code":"bengali","name":"Bengali","description":"","index":15,"category":"subject","status":"Live"},{"identifier":"ncf_subject_history","code":"history","name":"History","description":"","index":16,"category":"subject","status":"Live"},{"identifier":"ncf_subject_gujarati","code":"gujarati","name":"Gujarati","description":"","index":17,"category":"subject","status":"Live"},{"identifier":"ncf_subject_biology","code":"biology","name":"Biology","description":"","index":18,"category":"subject","status":"Live"},{"identifier":"ncf_subject_oriya","code":"oriya","name":"Odia","description":"Odia","index":19,"category":"subject","status":"Live"},{"identifier":"ncf_subject_punjabi","code":"punjabi","name":"Punjabi","description":"","index":20,"category":"subject","status":"Live"},{"identifier":"ncf_subject_nepali","code":"nepali","name":"Nepali","description":"","index":21,"category":"subject","status":"Live"},{"identifier":"ncf_subject_malayalam","code":"malayalam","name":"Malayalam","description":"","index":22,"category":"subject","status":"Live"},{"identifier":"ncf_subject_socialstudies","code":"socialstudies","name":"Social Studies","description":"Social Studies","index":23,"category":"subject","status":"Live"},{"identifier":"ncf_subject_science","code":"science","name":"Science","description":"Science","index":24,"category":"subject","status":"Live"},{"identifier":"ncf_subject_sanskrit","code":"sanskrit","name":"Sanskrit","description":"Sanskrit","index":25,"category":"subject","status":"Live"},{"identifier":"ncf_subject_healthandphysicaleducation","code":"healthandphysicaleducation","name":"Health and Physical Education","description":"Health and Physical Education","index":26,"category":"subject","status":"Live"},{"identifier":"ncf_subject_economics","code":"economics","name":"Economics","description":"Economics","index":27,"category":"subject","status":"Live"},{"identifier":"ncf_subject_other","code":"other","name":"Other","description":"Other","index":28,"category":"subject","status":"Live"}],"name":"Subject","description":"","index":3,"status":"Live"},{"identifier":"ncf_medium","code":"medium","terms":[{"identifier":"ncf_medium_english","code":"english","name":"English","description":"","index":1,"category":"medium","status":"Live"},{"identifier":"ncf_medium_hindi","code":"hindi","name":"Hindi","description":"","index":2,"category":"medium","status":"Live"},{"identifier":"ncf_medium_oriya","code":"oriya","name":"Odia","description":"Odia","index":3,"category":"medium","status":"Live"},{"identifier":"ncf_medium_telugu","code":"telugu","name":"Telugu","description":"","index":4,"category":"medium","status":"Live"},{"identifier":"ncf_medium_kannada","code":"kannada","name":"Kannada","description":"","index":5,"category":"medium","status":"Live"},{"identifier":"ncf_medium_marathi","code":"marathi","name":"Marathi","description":"","index":6,"category":"medium","status":"Live"},{"identifier":"ncf_medium_assamese","code":"assamese","name":"Assamese","description":"","index":7,"category":"medium","status":"Live"},{"identifier":"ncf_medium_bengali","code":"bengali","name":"Bengali","description":"","index":8,"category":"medium","status":"Live"},{"identifier":"ncf_medium_gujarati","code":"gujarati","name":"Gujarati","description":"","index":9,"category":"medium","status":"Live"},{"identifier":"ncf_medium_tamil","code":"tamil","name":"Tamil","description":"","index":10,"category":"medium","status":"Live"},{"identifier":"ncf_medium_urdu","code":"urdu","name":"Urdu","description":"","index":11,"category":"medium","status":"Live"},{"identifier":"ncf_medium_other","code":"other","name":"Other","description":"","index":12,"category":"medium","status":"Live"}],"name":"Medium","description":"","index":4,"status":"Live"}],"status":"Live"}}}};
            ecEditor.getService('meta').getCategorys = jasmine.createSpy().and.callFake(function(data, callback) {
                return callback(undefined, respCat);
            });
            done();
        });

        it('Should invoke Meta Services and get Assesment Data', function(done) {
            var resp = {"data": {"id": "ekstep.definition.find"}, "result":{}};
            ecEditor.getService('meta').getDefinitions = jasmine.createSpy().and.callFake(function(data, callback) {
                return callback(undefined, resp);
            });
            done();
        });

        it('Should invoke getFrameworkData method', function(done) {
            spyOn(ctrl, 'getFrameworkData').and.callThrough();
            ctrl.getFrameworkData();
            expect(ctrl.getFrameworkData).toHaveBeenCalled();
            expect(ctrl.getFrameworkData.calls.count()).toEqual(1);
            done();

        });

        it('Should invoke getResourceBundles method', function(done) {
            var resp = {"data":{"id":"ekstep.config.resourebundles.read","ver":"1.0","ts":"2018-06-01T12:47:01ZZ","params":{"resmsgid":"518f9c5d-a054-4c47-8a30-30c7b1446c3e","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"en":{"Serial Books":"Serial Books","objects":"Objects Used in the Content","downloadUrl":"Download Url","Adaptive Feedback":"Adaptive Feedback","iOS":"iOS","History":"History","skills":"Skills Required","xxxhdpi":"xxxhdpi","audio/mp3":"audio/mp3","Kannada":"Kannada","Learn from Mistakes":"Learn from Mistakes","Story":"Story","audio/mp4":"audio/mp4","Tutorial":"Tutorial","video/avi":"video/avi","7-8":"7-8","scaffolding":"Scaffolding","Urdu":"Urdu","minSupportedVersion":"Min Supported Version","Kindergarten":"Kindergarten","osId":"Operating System Id","version":"Version","Poems/Rhymes":"Poems/Rhymes","quality":"Quality","optStatus":"Optimization Status","interactivityLevel":"Interactivity Level","Gujarati":"Gujarati","Game":"Game","size":"Download File Size (in bytes)","lastPublishedOn":"Published On","concepts":"concepts","domain":"Domain","video/quicktime":"video/quicktime","video/mp4":"video/mp4","Art":"Art","grayScaleAppIcon":"GrayScale App Icon","video/webm":"video/webm","activity":"activity","Textual":"Textual","imageCredits":"Image Credits","document":"document","posterImage":"Poster Image","Holidays":"Holidays","Right/Wrong":"Right/Wrong","Listening":"Listening","popularity":"Popularity","genre":"Genre","audio":"audio","Speaker":"Speaker","6-7":"6-7","Nature":"Nature","Rural":"Rural","loadingMessage":"Loading Message","Creative Commons Attribution (CC BY)":"Creative Commons Attribution (CC BY)","video/3gpp":"video/3gpp","words":"Dictionary Words","Tamil":"Tamil","Speaking":"Speaking","idealScreenDensity":"Ideal Screen Density (dots per inch)","Draft":"Draft","video/mpeg":"video/mpeg","Music":"Music","Words":"Words","Life Skills":"Life Skills","Writing":"Writing","learningObjective":"Learning Objective","application/vnd.ekstep.content-archive":"application/vnd.ekstep.content-archive","Audio":"Audio","Other":"Other","story":"story","Creative Commons Attribution-ShareAlike (CC BY-SA)":"Creative Commons Attribution-ShareAlike (CC BY-SA)","keywords":"Keywords","State Curriculum":"State Curriculum","image/gif":"image/gif","language":"Language","mimeType":"Mime Type","source":"Source","GPS":"GPS","lastSubmittedBy":"Submitted for Review By","appIcon":"Icon","ecml":"ecml","artifactUrl":"Artifact Url","video/ogg":"video/ogg","Non-Fiction":"Non-Fiction","Hindi":"Hindi","5-6":"5-6","lastUpdatedBy":"Last Updated By","image":"image","visibility":"Visibility","Free Art License":"Free Art License","xhdpi":"xhdpi","mediaType":"Media Type","collection":"collection","Interrupts":"Interrupts","Motion Sensor":"Motion Sensor","Medium":"Medium","name":"Name","image/jpg":"image/jpg","numeracy":"numeracy","attributions":"Owner","Oriya":"Oriya","activity_class":"Activity Class Name","application/vnd.ekstep.html-archive":"application/vnd.ekstep.html-archive","Parent":"Parent","Folktales":"Folktales","description":"Description","video":"video","Review":"Review","idealScreenSize":"Ideal Screen Size","content":"content","ICSE":"ICSE","Processing":"Processing","duration":"Duration","Urban":"Urban","downloads":"No of downloads","lastUpdatedOn":"Last Updated On","Creative Commons Zero (CC0)":"Creative Commons Zero (CC0)",">10":">10","owner":"Owner","Redraft":"Redraft","teachingMode":"Teaching Mode","normal":"normal","image/png":"image/png","Adventure":"Adventure","minGenieVersion":"Min Supported Genie Version","CBSE":"CBSE","audio/ogg":"audio/ogg","Guidance":"Guidance","pdf":"pdf","createdBy":"Created By","developer":"Developer","worksheet":"worksheet","Flagged":"Flagged","templateType":"Template Type","copyright":"Copyright","Plays":"Plays","voiceCredits":"Voice Credits","School Stories":"School Stories","editorState":"Editor State","feedback":"Feedback","gradeLevel":"Grade Level","releaseNotes":"Release Notes","collections":"collections","children":"children","NCERT":"NCERT","collaborators":"Collaborators","Asset":"Asset","text":"Story Text","translatable":"Translatable","large":"large","Retired":"Retired","xlarge":"xlarge","portalOwner":"Portal Owner","Live":"Live","Reflection":"Reflection","Compass":"Compass","Bengali":"Bengali","Against DRM license":"Against DRM license","Low":"Low","Scary":"Scary","forkable":"Forkable","Comics":"Comics","Fiction":"Fiction","status":"Status","other":"other","ldpi":"ldpi","widget":"widget","Help":"Help","Draw":"Draw","image/bmp":"image/bmp","Complete":"Complete","methods":"methods","Worksheet":"Worksheet","Practice":"Practice","Open Audio License":"Open Audio License","Diagnostic":"Diagnostic","createdOn":"Created On","screenshots":"screenshots","minOsVersion":"Min Supported OS Version","rating_a":"Analytical Rating","Telugu":"Telugu","Rich Feedback":"Rich Feedback","ftb":"ftb","Nepali":"Nepali","theme":"Theme","Mystery":"Mystery","Malayalam":"Malayalam","xxhdpi":"xxhdpi","Alphabet Books":"Alphabet Books","Abstract":"Abstract","Flash Cards":"Flash Cards","Assamese":"Assamese","curriculum":"Curriculum","Default":"Default","filter":"Filter Criteria (JSON)","Puzzle":"Puzzle","lastSubmittedOn":"Submitted for Review On","image/tiff":"image/tiff","Gestures":"Gestures","versionCreatedBy":"Version Created By","<5":"<5","Family":"Family","Funny":"Funny","feedbackType":"Feedback","launchUrl":"Launch Url","All":"All","voice":"voice","small":"small","Geography":"Geography","data":"Data","audio/webm":"audio/webm","rating":"User Rating","Marathi":"Marathi","recognition":"recognition","body":"Body","Pictorial":"Pictorial","Mock":"Mock","Template":"Template","Picture Books":"Picture Books","Hobby":"Hobby","audio/x-wav":"audio/x-wav","mcq":"mcq","contentType":"Content Type","item_sets":"item_sets","mtf":"mtf","Tactile":"Tactile","thumbnail":"Thumbnail","application/octet-stream":"application/octet-stream","format":"Format","ageGroup":"Age Group","lastPublishedBy":"Published By","versionDate":"Version Date","Android":"Android","audio/mpeg":"audio/mpeg","literacy":"literacy","license":"License","application/vnd.ekstep.content-collection":"application/vnd.ekstep.content-collection","publisher":"Publisher","application/vnd.ekstep.ecml-archive":"application/vnd.ekstep.ecml-archive","Collection":"Collection","Concrete":"Concrete","Microphone":"Microphone","code":"Code","image/jpeg":"image/jpeg","hdpi":"hdpi","Science":"Science","image/svg+xml":"image/svg+xml","Windows":"Windows","Touch":"Touch","8-10":"8-10","checksum":"Checksum","Chapter Books":"Chapter Books","Visual":"Visual","Grade 1":"Grade 1","High":"High","Grade 2":"Grade 2","Grade 3":"Grade 3","mdpi":"mdpi","Grade 4":"Grade 4","os":"OS","Grade 5":"Grade 5","soundCredits":"Audio/Sound Credits","resources":"Resources","Error":"Error","application/vnd.android.package-archive":"application/vnd.android.package-archive","pkgVersion":"Package Version","English":"English","Open Game License":"Open Game License","Reading":"Reading","Simulation":"Simulation","Punjabi":"Punjabi","Pending":"Pending"},"ttl":24.0}}};
            ecEditor.getService('meta').getResourceBundles = jasmine.createSpy().and.callFake(function(data, callback) {
                return callback(ture, resp);
            });
            done();
        });

        it("Should initialize the content-selector popup", function(done) {
            ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
             element: 'assessmentConceptSelector',selectedConcepts: [] })
            done();
        });

        it("Should incoke addItemActivity method", function(done) {
            spyOn(ctrl, "addItemActivity").and.callThrough();
            ctrl.addItemActivity();
            expect(ctrl.addItemActivity).toHaveBeenCalled();
            done();
        });

        it("Should generate telemetry event", function(done) {
            var data = { type: "select", subtype: "dropDown", target: "languageDropDown" };
            var instance = { manifest: {id: "org.ekstep.assessmentbrowser", ver: "1.0"}};
            spyOn(ctrl, "generateTelemetry").and.callThrough();
            ctrl.generateTelemetry(data);
            expect(ecEditor.getService('telemetry').interact).toHaveBeenCalledWith({
              "type": data.type,
              "subtype": data.subtype,
              "target": data.target,
              "pluginid": instance.manifest.id,
              "pluginver": instance.manifest.ver,
              "objectid": "",
              "stage": ecEditor.getCurrentStage( ).id
            });
       
            expect(ctrl.generateTelemetry).toHaveBeenCalled();
            done();
        });
    })
})