angular.module('contentmetaApp', []).controller('contentmetaController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.mode = ecEditor.getConfig('editorConfig').mode;
    $scope.metadataCloneOb = {};
    $scope.nodeId = $scope.nodeType = '';
    const DEFAULT_NODETYPE = 'Collection';

    $scope.updateTitle = function(event, title) {
        $scope.content.name = title;
        ecEditor.dispatchEvent('org.ekstep.collectioneditor:breadcrumb');
        $scope.$safeApply();
    }

    $scope.updateContent = function(event, data) {
        
        $scope.content = {
            "id":"ekstep.learning.content.hierarchy",
            "ver":"3.0",
            "ts":"2018-12-04T05:45:10ZZ",
            "params":{
               "resmsgid":"1db3aa9c-36d6-4dfb-9905-44742caf06b3",
               "msgid":null,
               "err":null,
               "status":"successful",
               "errmsg":null
            },
            "responseCode":"OK",
            "result":{
               "content":{
                  "ownershipType":[
                     "createdBy"
                  ],
                  "code":"org.sunbird.RLoEyL",
                  "channel":"b00bc992ef25f1a9a8d63291e20efc8d",
                  "description":"Enter description for TextBook",
                  "organisation":[
                     "QA ORG",
                     "Sunbird"
                  ],
                  "language":[
                     "English"
                  ],
                  "mimeType":"application/vnd.ekstep.content-collection",
                  "idealScreenSize":"normal",
                  "createdOn":"2018-11-30T05:30:34.007+0000",
                  "children":[
                     {
                        "identifier":"do_1126470686098145281308",
                        "code":"do_1126470686098145281308",
                        "visibility":"Parent",
                        "index":1,
                        "mimeType":"application/vnd.ekstep.content-collection",
                        "createdOn":"2018-12-03T10:06:57.409+0000",
                        "versionKey":"1543831617409",
                        "framework":"NCFCOPY",
                        "children":[
                           {
                              "identifier":"do_1126470718777180161309",
                              "code":"do_1126470718777180161309",
                              "visibility":"Parent",
                              "keywords":[
                                 "key1 new"
                              ],
                              "topicData":"(1) topics selected",
                              "description":"desc 2",
                              "index":1,
                              "mimeType":"application/vnd.ekstep.content-collection",
                              "createdOn":"2018-12-03T10:13:36.323+0000",
                              "versionKey":"1543832016323",
                              "tags":[
                                 "key1 new"
                              ],
                              "framework":"NCFCOPY",
                              "children":[
                                 {
                                    "identifier":"do_1126471110094929921316",
                                    "code":"do_1126471110094929921316",
                                    "visibility":"Parent",
                                    "keywords":[
                                       "key3"
                                    ],
                                    "topicData":"(1) topics selected",
                                    "description":"desc 3",
                                    "index":1,
                                    "mimeType":"application/vnd.ekstep.content-collection",
                                    "createdOn":"2018-12-03T11:33:13.151+0000",
                                    "versionKey":"1543836793151",
                                    "tags":[
                                       "key3"
                                    ],
                                    "framework":"NCFCOPY",
                                    "children":[
                                       {
                                          "identifier":"do_1126471110094929921317",
                                          "code":"do_1126471110094929921317",
                                          "visibility":"Parent",
                                          "keywords":[
                                             "key4"
                                          ],
                                          "topicData":"(1) topics selected",
                                          "questions":[
         
                                          ],
                                          "description":"desc 4",
                                          "index":1,
                                          "mimeType":"application/vnd.ekstep.content-collection",
                                          "createdOn":"2018-12-03T11:33:13.151+0000",
                                          "versionKey":"1543836793151",
                                          "tags":[
                                             "key4"
                                          ],
                                          "framework":"NCFCOPY",
                                          "concepts":[
         
                                          ],
                                          "children":[
         
                                          ],
                                          "usesContent":[
         
                                          ],
                                          "name":"TB-1.1.1.1",
                                          "topic":[
                                             "Topic 3"
                                          ],
                                          "lastUpdatedOn":"2018-12-03T11:34:19.109+0000",
                                          "contentType":"TextBookUnit",
                                          "status":"Draft"
                                       }
                                    ],
                                    "name":"TB-1.1.1",
                                    "topic":[
                                       "Topic 4"
                                    ],
                                    "lastUpdatedOn":"2018-12-03T11:34:19.119+0000",
                                    "contentType":"TextBookUnit",
                                    "status":"Draft"
                                 },
                                 {
                                    "identifier":"do_1126471135268618241318",
                                    "code":"62eb6057-11be-4e4e-a11b-c50507d97c8c",
                                    "visibility":"Parent",
                                    "questions":[
         
                                    ],
                                    "description":"sdddd",
                                    "index":2,
                                    "mimeType":"application/vnd.ekstep.content-collection",
                                    "createdOn":"2018-12-03T11:38:20.447+0000",
                                    "versionKey":"1543837100447",
                                    "framework":"NCFCOPY",
                                    "concepts":[
         
                                    ],
                                    "children":[
         
                                    ],
                                    "usesContent":[
         
                                    ],
                                    "name":"Untitled TextBook",
                                    "lastUpdatedOn":"2018-12-03T11:38:20.447+0000",
                                    "contentType":"TextBookUnit",
                                    "status":"Draft"
                                 }
                              ],
                              "name":"TB-1.1",
                              "topic":[
                                 "Topic 1"
                              ],
                              "lastUpdatedOn":"2018-12-03T11:34:19.124+0000",
                              "contentType":"TextBookUnit",
                              "status":"Draft"
                           },
                           {
                              "ownershipType":[
                                 "createdBy"
                              ],
                              "code":"org.sunbird.4UgFDX",
                              "downloadUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar-files/do_112240785235501056165/course-name-update_1498985854349_do_112240785235501056165_32.0.ecar",
                              "channel":"in.ekstep",
                              "questions":[
         
                              ],
                              "description":"Test Content 1-1_1_1 utils",
                              "language":[
                                 "Hindi"
                              ],
                              "lastFlaggedOn":"2017-06-30T14:17:14.578+0000",
                              "mimeType":"application/vnd.ekstep.content-collection",
                              "variants":{
                                 "spine":{
                                    "ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar-files/do_112240785235501056165/course-name-update_1498985854427_do_112240785235501056165_32.0_spine.ecar",
                                    "size":888
                                 }
                              },
                              "idealScreenSize":"normal",
                              "flaggedBy":[
                                 "177"
                              ],
                              "createdOn":"2017-07-02T08:57:33.328+0000",
                              "children":[
         
                              ],
                              "appId":"dev.sunbird.portal",
                              "usesContent":[
         
                              ],
                              "contentDisposition":"inline",
                              "contentEncoding":"gzip",
                              "lastUpdatedOn":"2017-07-02T08:57:36.137+0000",
                              "sYS_INTERNAL_LAST_UPDATED_ON":"2018-10-11T13:19:18.456+0000",
                              "contentType":"Collection",
                              "owner":"EkStep",
                              "identifier":"do_112240785235501056165",
                              "audience":[
                                 "Learner"
                              ],
                              "visibility":"Default",
                              "os":[
                                 "All"
                              ],
                              "consumerId":"9393568c-3a56-47dd-a9a3-34da3c821638",
                              "index":2,
                              "mediaType":"content",
                              "osId":"org.ekstep.quiz.app",
                              "languageCode":"hi",
                              "pkgVersion":32.0,
                              "versionKey":"1500094649023",
                              "idealScreenDensity":"hdpi",
                              "prevState":"Draft",
                              "framework":"NCF",
                              "s3Key":"ecar_files/do_112240785235501056165/course-name-update_1498985854349_do_112240785235501056165_32.0.ecar",
                              "size":887.0,
                              "lastPublishedOn":"2017-07-02T08:57:34.348+0000",
                              "concepts":[
         
                              ],
                              "createdBy":"389",
                              "compatibilityLevel":1,
                              "name":"Course Name Update",
                              "status":"Live"
                           },
                           {
                              "code":"Test_QA",
                              "keywords":[
                                 "LP_functionalTest"
                              ],
                              "downloadUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_Collection_3850588/lp_nft_3850588_1506426469074_lp_nft_collection_3850588_1.0.ecar",
                              "channel":"in.ekstep",
                              "questions":[
         
                              ],
                              "description":"Test_QA",
                              "language":[
                                 "English"
                              ],
                              "variants":{
                                 "spine":{
                                    "ecarUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/LP_NFT_Collection_3850588/lp_nft_3850588_1506426469355_lp_nft_collection_3850588_1.0_spine.ecar",
                                    "size":1262.0
                                 }
                              },
                              "mimeType":"application/vnd.ekstep.content-collection",
                              "idealScreenSize":"normal",
                              "createdOn":"2017-09-26T11:44:39.868+0000",
                              "children":[
         
                              ],
                              "usesContent":[
         
                              ],
                              "contentDisposition":"inline",
                              "contentEncoding":"gzip",
                              "lastUpdatedOn":"2017-09-26T11:45:29.927+0000",
                              "mimeTypesCount":"{\"application/vnd.ekstep.ecml-archive\":2}",
                              "sYS_INTERNAL_LAST_UPDATED_ON":"2017-09-26T11:47:49.485+0000",
                              "contentType":"Collection",
                              "owner":"EkStep",
                              "lastUpdatedBy":"Test",
                              "identifier":"LP_NFT_Collection_3850588",
                              "audience":[
                                 "Learner"
                              ],
                              "visibility":"Default",
                              "toc_url":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_nft_collection_3850588/artifact/lp_nft_collection_3850588toc.json",
                              "os":[
                                 "All"
                              ],
                              "contentTypesCount":"{\"Story\":2}",
                              "consumerId":"a6654129-b58d-4dd8-9cf2-f8f3c2f458bc",
                              "index":3,
                              "mediaType":"content",
                              "osId":"org.ekstep.quiz.app",
                              "lastPublishedBy":"Test",
                              "pkgVersion":1.0,
                              "versionKey":"1506426329927",
                              "tags":[
                                 "LP_functionalTest"
                              ],
                              "idealScreenDensity":"hdpi",
                              "s3Key":"ecar_files/LP_NFT_Collection_3850588/lp_nft_3850588_1506426469074_lp_nft_collection_3850588_1.0.ecar",
                              "framework":"NCF",
                              "size":1372662.0,
                              "lastPublishedOn":"2017-09-26T11:47:47.453+0000",
                              "concepts":[
         
                              ],
                              "leafNodesCount":2,
                              "compatibilityLevel":1.0,
                              "name":"LP_NFT_3850588",
                              "status":"Live"
                           }
                        ],
                        "name":"Untitled TextBookdd test",
                        "lastUpdatedOn":"2018-12-03T11:33:13.145+0000",
                        "contentType":"TextBookUnit",
                        "status":"Draft"
                     }
                  ],
                  "appId":"dev.sunbird.portal",
                  "contentDisposition":"inline",
                  "contentEncoding":"gzip",
                  "lastUpdatedOn":"2018-12-03T11:38:20.742+0000",
                  "sYS_INTERNAL_LAST_UPDATED_ON":"2018-12-03T11:11:06.307+0000",
                  "contentType":"TextBook",
                  "lastUpdatedBy":"874ed8a5-782e-4f6c-8f36-e0288455901e",
                  "identifier":"do_1126448093921853441209",
                  "creator":"Cretation User New",
                  "audience":[
                     "Learner"
                  ],
                  "createdFor":[
                     "0123653943740170242",
                     "ORG_001"
                  ],
                  "visibility":"Default",
                  "os":[
                     "All"
                  ],
                  "consumerId":"9393568c-3a56-47dd-a9a3-34da3c821638",
                  "mediaType":"content",
                  "osId":"org.ekstep.quiz.app",
                  "versionKey":"1543837100742",
                  "idealScreenDensity":"hdpi",
                  "framework":"NCFCOPY",
                  "createdBy":"874ed8a5-782e-4f6c-8f36-e0288455901e",
                  "compatibilityLevel":1.0,
                  "name":"Untitled Textbook",
                  "resourceType":"Book",
                  "status":"Draft"
               }
            }
         };
         console.log("$scope.content: ", $scope.content)
        $scope.$safeApply();
    }

    ecEditor.addEventListener("title:update:collection", $scope.updateTitle, $scope);
    $scope.showSubCollection = true;

    $scope.updateNode = function() {
        if (!_.isEmpty($scope.nodeId) && !_.isUndefined($scope.nodeId)) {
            var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
            $scope.nodeId = activeNode.data.id;
            if (!_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) {
                $scope.newNode = false;
            }
            if (_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) {
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId] = {};
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["isNew"] = $scope.newNode;
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["root"] = false;
            }
            if (_.isString($scope.content.keywords)) {
                $scope.content.keywords = $scope.content.keywords.split(',');
            }
            if (!_.isEmpty($scope.content.language) && _.isString($scope.content.language)) {
                $scope.content.language = [$scope.content.language];
            }
            var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
            $scope.content.contentType = $scope.nodeType;
            org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata = _.assign(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata, $scope.getUpdatedMetadata($scope.metadataCloneObj, $scope.content));;
            var keywords = org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata.keywords
            if (keywords) {
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata.keywords = keywords.map(function(a) {
                    return a.lemma ? a.lemma : a
                })
            }
            $scope.metadataCloneObj = _.clone($scope.content);
            ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:modified');
            $scope.editMode = $scope.editable;
            if (activeNode.data && activeNode.data.root) ecEditor.dispatchEvent("content:title:update", $scope.content.name);
            ecEditor.dispatchEvent('org.ekstep.collectioneditor:breadcrumb');
            $scope.submitted = true;
            $scope.$safeApply();
        } 
    };

    $scope.initDropdown = function() {
        $timeout(function() {                        
            if ($scope.content.language) $('#contentmeta-language').dropdown('set selected', $scope.content.language[0]);            
        });
    };

    $scope.getUpdatedMetadata = function(originalMetadata, currentMetadata) {
        var metadata = {};
        if (_.isEmpty(originalMetadata)) {
            _.forEach(currentMetadata, function(value, key) {
                metadata[key] = value;
            });
        } else {
            _.forEach(currentMetadata, function(value, key) {
                if (_.isUndefined(originalMetadata[key])) {
                    metadata[key] = value;
                } else if (value != originalMetadata[key]) {
                    metadata[key] = value;
                }
            });
        }
        if (_.isUndefined(metadata['name'])) {
            metadata['name'] = currentMetadata['name'];
        }
        if (_.isUndefined(metadata['code'])) {
            metadata['code'] = $scope.nodeId;
        }
        if (_.isUndefined(metadata['mimeType'])) {
            metadata['mimeType'] = "application/vnd.ekstep.content-collection";
        }
        if(_.isUndefined(metadata['description'])){
            metadata['description'] = currentMetadata['description'];
        }
        if(_.isUndefined(metadata['contentType'])){
            metadata['contentType'] = currentMetadata['contentType'];
        }
        if (_.isUndefined(metadata['keywords'])) {
            metadata['keywords'] = currentMetadata['keywords'];
        }
        return metadata;
    }

    $scope.addlesson = function() {
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show");
    }

    $scope.onNodeSelect = function(event, data) {
        var contentArr = ["Story", "Collection", "Game", "Worksheet", "Resource"];
        $scope.editable = (!data.data.root && data.data.metadata.visibility === 'Default') ? false : true;
        if (_.indexOf(contentArr, data.data.objectType) != -1) {
            $scope.nodeId = data.data.id;
            var cache = org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId];            
            $scope.nodeType = data.data.objectType;
            $scope.content = {};
            $scope.editMode = true;
            $scope.newNode = false;
            $scope.tokenMode = 'edit';
            var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
            $scope.content = (_.isUndefined(cache)) ? activeNode.data.metadata : _.assign(activeNode.data.metadata, cache.metadata);
            $scope.showSubCollection = !activeNode.folder;
            if ($scope.mode === "Edit" && $scope.editable === true) {
                $('.ui.dropdown').dropdown('refresh');
                $scope.metadataCloneObj = _.clone($scope.content);
                $('#contentmeta-language').dropdown('clear');
            }
            if (!_.isEmpty(activeNode.data.metadata) && _.has(activeNode.data.metadata, ["name"])) {
                if(!$scope.editable){
                    $scope.editMode = false;
                    $scope.tokenMode = 'view';
                }
                $scope.content = (_.isUndefined(cache)) ? activeNode.data.metadata : _.assign(activeNode.data.metadata, cache.metadata);
                $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
                $('#contentmeta-language').dropdown('set selected', $scope.content.language);
            } else if (cache && _.has(cache.metadata, ["name"])) {
                $scope.content = _.assign(activeNode.data.metadata, cache.metadata);
                $scope.metadataCloneObj = _.clone(cache.metadata);
                $('#contentmeta-language').dropdown('set selected', $scope.content.language);
            } else {
                $scope.newNode = true;
            }
            $scope.content.name = $scope.content.name || 'Untitled Collection';
            ecEditor.dispatchEvent('org.ekstep.collectioneditor:breadcrumb');
            $scope.changeTitle();
        }
        $scope.$safeApply();
    }
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.onNodeSelect);


    $scope.getPartentNode = function() {
        var activeNode = org.ekstep.services.collectionService.getActiveNode();
        var parentList = activeNode.getParentList();
        var parentNode = {};
        if (parentList && parentList.length > 0) {
            parentNode = parentList.length > 1 ? parentList[1] : parentList[0];
        }
        return parentNode;
    }

    $scope.setActiveNode = function(data) {
        if (data.nodeId) {
            var activeNode = org.ekstep.services.collectionService.getActiveNode();
            activeNode ? org.ekstep.services.collectionService.getActiveNode().setActive(false) : '';
            org.ekstep.collectioneditor.api.getService('collection').setActiveNode(data.nodeId);
        } else {
            ecEditor.dispatchEvent('org.ekstep.collectioneditor:node:selected', {'data':data})
            $scope.updateCollectionBreadcrumb(data);
        }
    }

    $scope.previewContent = function(event, data) {
        $scope.nodeId = data && data.id || $scope.nodeId;
        var mainContentId = ecEditor.getContext('contentId');
        ecEditor.setContext('contentId', $scope.nodeId);
        org.ekstep.services.contentService.getContent($scope.nodeId, function(err, content) {
            if (!err) {
                var contentBody = content.body;
                org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: content.body, 'currentStage': false });
                console.log('contentBody ', contentBody);
            } else {
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Unable to preview the content, please try again later',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
                org.ekstep.services.telemetryService.error({ "env": "content", "stage": "", "action": "show error", "err": "Unable to fetch content from remote", "type": "API", "data": err, "severity": "fatal" });
            }
            // reset the ID back to main content ID, otherwise this will break download, save functionalities
            ecEditor.setContext('contentId', mainContentId);
        });
    }

    $scope.generateTelemetry = function(data) {
        if (data) org.ekstep.services.telemetryService.interact({ "type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.contentmeta", "pluginver": "1.2", "objectid": $scope.nodeId, "stage": $scope.nodeId })
    }

    ecEditor.addEventListener("org.ekstep.contentmeta:preview", $scope.previewContent);

    setTimeout(function() {
        ecEditor.jQuery('.popup-item').popup();
    }, 0);

    $scope.init = function() {
        $scope.$watch('content', function() {
            if($scope.content) {
                $scope.content.name = org.ekstep.services.collectionService.removeSpecialChars($scope.content.name);
                var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
                if ($scope.nodeType === DEFAULT_NODETYPE && ((activeNode && activeNode.data.root) || $scope.content.visibility != 'Default')) {
                    $scope.updateNode();
                }
            }
        }, true);
        $scope.onNodeSelect(undefined, org.ekstep.services.collectionService.getActiveNode())
    }
    $scope.changeTitle = function() {
        if ($scope.content) {
            if($scope.content.visibility === 'Parent')
                $scope.content.name = org.ekstep.services.collectionService.removeSpecialChars($scope.content.name);
            org.ekstep.collectioneditor.api.getService('collection').setNodeTitle($scope.content.name);   
        }
    }

    $scope.loadKeywords = function($query) {
        if ($query.length >= 3) {
            return org.ekstep.services.collectionService.fetchKeywords($query).then(function(keywords) {
                return keywords.filter(function(keyword) {
                    return keyword.lemma.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            })
        }
    };

    $scope.updateRootNode = function(){
        if ($scope.nodeType === DEFAULT_NODETYPE){
            var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
            if(activeNode && activeNode.data.root){
                $scope.content = ecEditor.getService('content').getContentMeta(org.ekstep.contenteditor.api.getContext('contentId'));
                ecEditor.dispatchEvent('org.ekstep.collectioneditor:breadcrumb');
                $scope.changeTitle();
            }
        }
    }   

    ecEditor.addEventListener("org.ekstep.collectioneditor:content:update", $scope.updateContent, $scope);
    ecEditor.addEventListener("org.ekstep.contenteditor:after-save", $scope.updateRootNode, $scope);
    ecEditor.addEventListener("meta:after:save", $scope.updateRootNode, $scope)

    $scope.init();
}]);
//# sourceURL=contentmetaApp.js