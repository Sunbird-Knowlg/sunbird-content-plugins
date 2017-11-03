'use strict';
angular.module('activityBrowserApp', [])
    .controller('activityBrowserCtrl', ['$scope', 'instance', function($scope, instance) {
        var ctrl = this,
            angScope = ecEditor.getAngularScope();

        ctrl.errorLoadingActivities = false;
        ctrl.activitiesList = [];
        ctrl.noActivities = false;
        ctrl.loading = false;
        ctrl.defaultActivityImage = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, "assets/default-activity.png");
        ctrl.activityOptions = {
            searchQuery: "",
            conceptsPlaceHolder: '(0) Concepts',
            concepts: {},
            categories: {}

        };
        ctrl.categories = {
            "core": "core",
            "learning": "learning",
            "literacy": "literacy",
            "math": "math",
            "science": "science",
            "time": "time",
            "wordnet": "wordnet",
            "game": "game",
            "mcq": "mcq",
            "mtf": "mtf",
            "ftb": "ftb"
        };

        ctrl.activityPageApiResponse = {
            "id": "api.page.assemble",
            "ver": "v1",
            "ts": "2017-10-30 09:27:08:446+0000",
            "params": {
                "resmsgid": null,
                "msgid": "0beabeef-afc2-4d33-bff3-e64a3bd8908b",
                "err": null,
                "status": "success",
                "errmsg": null
            },
            "responseCode": "OK",
            "result": {
                "response": {
                    "name": "Course",
                    "id": "01228382486252748821",
                    "sections": [{
                            "imgUrl": null,
                            "contents": [{
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610248886435841486/1course_1508914574906_do_2123610248886435841486_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610248886435841486/1course_1508914575072_do_2123610248886435841486_1.0_spine.ecar",
                                            "size": 50989
                                        }
                                    },
                                    "c_null_private_batch_count": 1,
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Kindergarten"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123610248886435841486/artifact/b5c2ff92ab5512754a24b7ed0a09e97f_1478082514640.thumb.jpeg",
                                    "children": [
                                        "do_2123610112800686081481"
                                    ],
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123610248886435841486",
                                    "lastUpdatedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123610248886435841486/artifact/do_2123610248886435841486toc.json",
                                    "contentTypesCount": "{\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "tutor": [],
                                    "concepts": [
                                        "LO39"
                                    ],
                                    "size": 51870,
                                    "lastPublishedOn": "2017-10-25T06:56:14.267+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "1Course",
                                    "status": "Live",
                                    "code": "do_2123610248886435841486",
                                    "description": "Oct 25",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_20051856/artifact/b5c2ff92ab5512754a24b7ed0a09e97f_1478082514640.jpeg",
                                    "createdOn": "2017-10-25T06:49:30.977+0000",
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-10-25T06:56:21.342+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-10-25T23:58:45.800+0000",
                                    "creator": "CreatorPerson1",
                                    "createdFor": [
                                        "012315809814749184151"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123610248886435841486",
                                    "pkgVersion": 1,
                                    "versionKey": "1508975925800",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123610248886435841486/1course_1508914574906_do_2123610248886435841486_1.0.ecar",
                                    "lastSubmittedOn": "2017-10-25T06:52:58.284+0000",
                                    "createdBy": "65485dca-760c-4d10-b803-8f487996d073",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123610248886435841486",
                                    "board": "CBSE",
                                    "resourceType": "Story",
                                    "node_id": 80510
                                },
                                {
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123163336542617601352/23082017-course-1_1503459447262_do_2123163336542617601352_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123163336542617601352/23082017-course-1_1503459447352_do_2123163336542617601352_1.0_spine.ecar",
                                            "size": 937
                                        }
                                    },
                                    "c_null_private_batch_count": 8,
                                    "objectType": "Content",
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{}",
                                    "contentType": "Course",
                                    "identifier": "do_2123163336542617601352",
                                    "lastUpdatedBy": "be9e7184-dffd-45af-9e3c-147fdf2c771d",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123163336542617601352/artifact/do_2123163336542617601352toc.json",
                                    "contentTypesCount": "{}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "be9e7184-dffd-45af-9e3c-147fdf2c771d",
                                    "prevState": "Review",
                                    "size": 936,
                                    "lastPublishedOn": "2017-08-23T03:37:27.261+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "23082017 Course 1",
                                    "status": "Live",
                                    "code": "org.sunbird.XBEa9i",
                                    "description": "Test content uploaded by Creator user",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-08-23T03:24:58.030+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-08-23T03:37:55.662+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-12T23:58:59.340+0000",
                                    "me_totalDownloads": 5,
                                    "creator": "Qa mentor 1",
                                    "createdFor": [
                                        "01231515334617497640"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123163336542617601352",
                                    "pkgVersion": 1,
                                    "versionKey": "1505260739340",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123163336542617601352/23082017-course-1_1503459447262_do_2123163336542617601352_1.0.ecar",
                                    "lastSubmittedOn": "0003-09-11T03:36:55.241+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "ebec55da-7bd5-4e48-b895-34630e16975f",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123163336542617601352",
                                    "node_id": 0
                                },
                                {
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123178763415470081573/25082017-batch_1503647099901_do_2123178763415470081573_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123178763415470081573/25082017-batch_1503647100090_do_2123178763415470081573_1.0_spine.ecar",
                                            "size": 175511
                                        }
                                    },
                                    "c_null_private_batch_count": 5,
                                    "objectType": "Content",
                                    "children": [
                                        "do_2122162678233579521298"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123178763415470081573",
                                    "lastUpdatedBy": "0db290dc-d1f6-4e33-99c3-8860b1313a63",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123178763415470081573/artifact/do_2123178763415470081573toc.json",
                                    "contentTypesCount": "{\"Story\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "0db290dc-d1f6-4e33-99c3-8860b1313a63",
                                    "prevState": "Review",
                                    "size": 176057,
                                    "lastPublishedOn": "2017-08-25T07:44:59.370+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "25082017 Batch",
                                    "status": "Live",
                                    "code": "org.sunbird.JyJKB6",
                                    "description": "test",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-08-25T07:43:34.348+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-08-25T07:45:28.747+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-26T23:58:54.576+0000",
                                    "me_totalDownloads": 4,
                                    "creator": "NTPUser",
                                    "createdFor": [
                                        "01231711180382208027"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123178763415470081573",
                                    "pkgVersion": 1,
                                    "versionKey": "1506470334576",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123178763415470081573/25082017-batch_1503647099901_do_2123178763415470081573_1.0.ecar",
                                    "lastSubmittedOn": "2017-08-25T07:44:30.454+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "3850fd8c-e09e-4544-9a0f-20040e34eed8",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123178763415470081573",
                                    "node_id": 0
                                },
                                {
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123412199319552001265/27-sept_1507008402281_do_2123412199319552001265_2.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123412199319552001265/27-sept_1507008402453_do_2123412199319552001265_2.0_spine.ecar",
                                            "size": 35342
                                        }
                                    },
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Kindergarten"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123412199319552001265/artifact/a2b1d5cf96ad28f15e79df61dbb21fdf_1478083821843.thumb.jpeg",
                                    "children": [
                                        "do_2123412207108341761266"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.content-collection\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123412199319552001265",
                                    "lastUpdatedBy": "logan s",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123412199319552001265/artifact/do_2123412199319552001265toc.json",
                                    "contentTypesCount": "{\"CourseUnit\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "349",
                                    "tutor": [],
                                    "concepts": [
                                        "C27"
                                    ],
                                    "size": 35342,
                                    "lastPublishedOn": "2017-10-03T05:26:41.674+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "27-sept",
                                    "status": "Live",
                                    "code": "do_2123412199319552001265",
                                    "description": "test",
                                    "lastFlaggedOn": "2017-10-09T10:40:09.473+0000",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_20051864/artifact/a2b1d5cf96ad28f15e79df61dbb21fdf_1478083821843.jpeg",
                                    "flaggedBy": [
                                        "logan s"
                                    ],
                                    "createdOn": "2017-09-27T07:16:13.725+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-10-12T08:14:50.664+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-10-03T05:26:42.739+0000",
                                    "me_totalDownloads": 3,
                                    "createdFor": [
                                        "ORG_001"
                                    ],
                                    "creator": "AmitKumar",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123412199319552001265",
                                    "pkgVersion": 2,
                                    "versionKey": "1507796090664",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123412199319552001265/27-sept_1507008402281_do_2123412199319552001265_2.0.ecar",
                                    "lastSubmittedOn": "2017-09-27T07:18:09.901+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "c7e35899-2ed1-47ad-9338-b1d8e2170483",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 0,
                                    "IL_UNIQUE_ID": "do_2123412199319552001265",
                                    "board": "CBSE",
                                    "node_id": 74569,
                                    "resourceType": "Story"
                                },
                                {
                                    "subject": "Hindi",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610297412976641489/2course_1508915169320_do_2123610297412976641489_1.0.ecar",
                                    "language": [
                                        "Kannada"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610297412976641489/2course_1508915169458_do_2123610297412976641489_1.0_spine.ecar",
                                            "size": 23231
                                        }
                                    },
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Grade 12"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/e1d5586c663df0fc846487bcf46df45f_1475564053985.jpeg",
                                    "children": [
                                        "do_2123610306447032321490"
                                    ],
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.content-collection\":1,\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123610297412976641489",
                                    "lastUpdatedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "audience": [
                                        "Instructor"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123610297412976641489/artifact/do_2123610297412976641489toc.json",
                                    "contentTypesCount": "{\"CourseUnit\":1,\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "tutor": [],
                                    "concepts": [
                                        "SC5",
                                        "LO39",
                                        "LO37",
                                        "LO45",
                                        "LO14",
                                        "LO7",
                                        "LO47",
                                        "LO30",
                                        "LO46",
                                        "LO17",
                                        "LO4",
                                        "LO16",
                                        "LO3",
                                        "LO31",
                                        "LO12",
                                        "LO28",
                                        "LO29"
                                    ],
                                    "size": 24590,
                                    "lastPublishedOn": "2017-10-25T07:06:08.073+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "2Course",
                                    "status": "Live",
                                    "code": "do_2123610297412976641489",
                                    "description": "oct 25",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-10-25T06:59:23.342+0000",
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-10-25T07:06:15.493+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-10-25T07:06:10.051+0000",
                                    "creator": "CreatorPerson1",
                                    "createdFor": [
                                        "012315809814749184151"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123610297412976641489",
                                    "pkgVersion": 1,
                                    "versionKey": "1508915175493",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123610297412976641489/2course_1508915169320_do_2123610297412976641489_1.0.ecar",
                                    "lastSubmittedOn": "2017-10-25T07:02:32.719+0000",
                                    "createdBy": "65485dca-760c-4d10-b803-8f487996d073",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123610297412976641489",
                                    "board": "CBSE",
                                    "resourceType": "Story",
                                    "node_id": 80521
                                },
                                {
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348158656184321304/2course-sep18_1505714931526_do_2123348158656184321304_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348158656184321304/2course-sep18_1505714932058_do_2123348158656184321304_1.0_spine.ecar",
                                            "size": 19987
                                        }
                                    },
                                    "objectType": "Content",
                                    "gradeLevel": [
                                        "Grade 3"
                                    ],
                                    "children": [
                                        "do_2123348141878968321302"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "c_null_open_batch_count": 0,
                                    "identifier": "do_2123348158656184321304",
                                    "lastUpdatedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348158656184321304/artifact/do_2123348158656184321304toc.json",
                                    "contentTypesCount": "{\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "concepts": [
                                        "C2"
                                    ],
                                    "size": 21345,
                                    "lastPublishedOn": "2017-09-18T06:08:50.943+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "2Course-Sep18",
                                    "status": "Live",
                                    "code": "org.sunbird.GwRAlz",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-09-18T06:07:07.346+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-18T06:14:29.253+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-19T23:58:57.044+0000",
                                    "me_totalDownloads": 9,
                                    "createdFor": [
                                        "01231711180382208027"
                                    ],
                                    "creator": "Mentor1User",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123348158656184321304",
                                    "pkgVersion": 1,
                                    "versionKey": "1505865537044",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123348158656184321304/2course-sep18_1505714931526_do_2123348158656184321304_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-18T06:09:10.364+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "c1714d03-8861-41f3-86d2-f9989e218635",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123348158656184321304",
                                    "board": "CBSE",
                                    "node_id": 0,
                                    "resourceType": "Story"
                                },
                                {
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348853773926401333/3course-sep18_1505723337003_do_2123348853773926401333_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348853773926401333/3course-sep18_1505723337339_do_2123348853773926401333_1.0_spine.ecar",
                                            "size": 29297
                                        }
                                    },
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Grade 2"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348853773926401333/artifact/c1_1505714879591.thumb.png",
                                    "children": [
                                        "do_2123348141878968321302"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "c_null_open_batch_count": 0,
                                    "identifier": "do_2123348853773926401333",
                                    "lastUpdatedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "audience": [
                                        "Instructor"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348853773926401333/artifact/do_2123348853773926401333toc.json",
                                    "contentTypesCount": "{\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "tutor": [],
                                    "concepts": [
                                        "SC9"
                                    ],
                                    "size": 30656,
                                    "lastPublishedOn": "2017-09-18T08:28:56.411+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "3Course-Sep18",
                                    "status": "Live",
                                    "code": "do_2123348853773926401333",
                                    "description": "by KS",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348162911436801305/artifact/c1_1505714879591.png",
                                    "createdOn": "2017-09-18T08:28:32.670+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-18T08:34:34.756+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-19T23:58:56.932+0000",
                                    "me_totalDownloads": 12,
                                    "createdFor": [
                                        "01231711180382208027"
                                    ],
                                    "creator": "Mentor1User",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123348853773926401333",
                                    "pkgVersion": 1,
                                    "versionKey": "1505865536932",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123348853773926401333/3course-sep18_1505723337003_do_2123348853773926401333_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-18T08:30:34.600+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "c1714d03-8861-41f3-86d2-f9989e218635",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123348853773926401333",
                                    "board": "TN Board",
                                    "node_id": 0,
                                    "resourceType": "Story"
                                },
                                {
                                    "keywords": [
                                        "abc"
                                    ],
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123250070645637121480/abc1_1504517565792_do_2123250070645637121480_1.0.ecar",
                                    "language": [
                                        "Hindi"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123250070645637121480/abc1_1504517566014_do_2123250070645637121480_1.0_spine.ecar",
                                            "size": 88952
                                        }
                                    },
                                    "conceptData": "(1) concepts selected",
                                    "c_null_private_batch_count": 0,
                                    "objectType": "Content",
                                    "faculty": [
                                        "science"
                                    ],
                                    "gradeLevel": [
                                        "Grade 1"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123250070645637121480/artifact/check-mark_1501237447102.thumb.png",
                                    "children": [
                                        "do_2122182330347274241121",
                                        "do_20044788"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.content-collection\":1,\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123250070645637121480",
                                    "lastUpdatedBy": "f24442ca-8d5e-4672-8885-493fe0b39067",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123250070645637121480/artifact/do_2123250070645637121480toc.json",
                                    "contentTypesCount": "{\"Worksheet\":1,\"Collection\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "f24442ca-8d5e-4672-8885-493fe0b39067",
                                    "tutor": [
                                        "somesh"
                                    ],
                                    "concepts": [
                                        "LO45"
                                    ],
                                    "size": 89211,
                                    "lastPublishedOn": "2017-09-04T09:32:45.013+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "abc1",
                                    "attributions": [
                                        "abc"
                                    ],
                                    "status": "Live",
                                    "code": "do_2123250070645637121480",
                                    "description": "abc to xyz",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2122981371648737281164/artifact/check-mark_1501237447102.png",
                                    "createdOn": "2017-09-04T09:31:03.936+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-04T09:37:30.267+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-08T23:59:00.600+0000",
                                    "me_totalDownloads": 2,
                                    "creator": "RaghavRaaa",
                                    "createdFor": [
                                        "01229319659233280026",
                                        "0122962363484733440",
                                        "ORG_001"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123250070645637121480",
                                    "pkgVersion": 1,
                                    "versionKey": "1504915140600",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123250070645637121480/abc1_1504517565792_do_2123250070645637121480_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-04T09:33:51.761+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "98e09d6e-b95b-4832-bfab-421e63d36aa7",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123250070645637121480",
                                    "board": "CBSE",
                                    "node_id": 0,
                                    "resourceType": "Story"
                                },
                                {
                                    "keywords": [],
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123206922887413761744/activitycourse_1503990936611_do_2123206922887413761744_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123206922887413761744/activitycourse_1503990937757_do_2123206922887413761744_1.0_spine.ecar",
                                            "size": 24847
                                        }
                                    },
                                    "c_null_private_batch_count": 0,
                                    "objectType": "Content",
                                    "faculty": [],
                                    "children": [
                                        "do_212305198230396928111"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"video/mp4\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123206922887413761744",
                                    "lastUpdatedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123206922887413761744/artifact/do_2123206922887413761744toc.json",
                                    "contentTypesCount": "{\"Story\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
                                    "tutor": [],
                                    "prevState": "Review",
                                    "size": 5258574,
                                    "lastPublishedOn": "2017-08-29T07:15:36.024+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "ActivityCourse",
                                    "status": "Live",
                                    "code": "do_2123206922887413761744",
                                    "description": "Desc",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-08-29T07:12:37.902+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-08-29T07:16:05.952+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-12T23:58:59.824+0000",
                                    "me_totalDownloads": 3,
                                    "createdFor": [
                                        "01232002070124134414"
                                    ],
                                    "creator": "CreatorUser",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123206922887413761744",
                                    "pkgVersion": 1,
                                    "versionKey": "1505260739824",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123206922887413761744/activitycourse_1503990936611_do_2123206922887413761744_1.0.ecar",
                                    "lastSubmittedOn": "2017-08-29T07:14:22.929+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "2aade7d9-6abf-433b-9a05-3b02cd2eb664",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123206922887413761744",
                                    "keywords_bkp": [],
                                    "node_id": 0
                                },
                                {
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123319876723179521138/algebra_1505371020551_do_2123319876723179521138_1.0.ecar",
                                    "language": [
                                        "Hindi"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123319876723179521138/algebra_1505371020646_do_2123319876723179521138_1.0_spine.ecar",
                                            "size": 1490
                                        }
                                    },
                                    "conceptData": "(3) concepts selected",
                                    "objectType": "Content",
                                    "faculty": [],
                                    "children": [
                                        "do_2123229899918458881680"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"video/x-youtube\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123319876723179521138",
                                    "lastUpdatedBy": "306b9b31-3c14-487d-83a3-33d7203bd5f0",
                                    "audience": [
                                        "Instructor"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123319876723179521138/artifact/do_2123319876723179521138toc.json",
                                    "contentTypesCount": "{\"Story\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "306b9b31-3c14-487d-83a3-33d7203bd5f0",
                                    "concepts": [
                                        "C423",
                                        "C422",
                                        "C27"
                                    ],
                                    "size": 1490,
                                    "lastPublishedOn": "2017-09-14T06:36:59.975+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "Algebra",
                                    "status": "Live",
                                    "code": "do_2123319876723179521138",
                                    "description": "Algebra",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-09-14T06:13:08.906+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-14T06:42:30.892+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-14T06:37:00.884+0000",
                                    "me_totalDownloads": 5,
                                    "creator": "NileshMore",
                                    "createdFor": [
                                        "ORG_001"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123319876723179521138",
                                    "pkgVersion": 1,
                                    "versionKey": "1505371350892",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123319876723179521138/algebra_1505371020551_do_2123319876723179521138_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-14T06:25:42.945+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "5205332d-3693-40e4-88fc-4025f1c1d6fb",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123319876723179521138",
                                    "node_id": 0
                                }
                            ],
                            "display": "{\"name\":{\"en\":\"Latest Courses\",\"hi\":\"????????\"}}",
                            "searchQuery": "{\"request\":{\"filters\":{\"contentType\":[\"Course\"],\"objectType\":[\"Content\"],\"status\":[\"Live\"]},\"sort_by\":{\"lastPublishedOn\":\"desc\"},\"limit\":10}}",
                            "alt": null,
                            "name": "Latest Courses",
                            "description": null,
                            "index": 1,
                            "id": "01228382278062080019",
                            "sectionDataType": "course",
                            "group": 1
                        },
                        {
                            "imgUrl": null,
                            "contents": [{
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610248886435841486/1course_1508914574906_do_2123610248886435841486_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610248886435841486/1course_1508914575072_do_2123610248886435841486_1.0_spine.ecar",
                                            "size": 50989
                                        }
                                    },
                                    "c_null_private_batch_count": 1,
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Kindergarten"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123610248886435841486/artifact/b5c2ff92ab5512754a24b7ed0a09e97f_1478082514640.thumb.jpeg",
                                    "children": [
                                        "do_2123610112800686081481"
                                    ],
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123610248886435841486",
                                    "lastUpdatedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123610248886435841486/artifact/do_2123610248886435841486toc.json",
                                    "contentTypesCount": "{\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "tutor": [],
                                    "concepts": [
                                        "LO39"
                                    ],
                                    "size": 51870,
                                    "lastPublishedOn": "2017-10-25T06:56:14.267+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "1Course",
                                    "status": "Live",
                                    "code": "do_2123610248886435841486",
                                    "description": "Oct 25",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_20051856/artifact/b5c2ff92ab5512754a24b7ed0a09e97f_1478082514640.jpeg",
                                    "createdOn": "2017-10-25T06:49:30.977+0000",
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-10-25T06:56:21.342+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-10-25T23:58:45.800+0000",
                                    "creator": "CreatorPerson1",
                                    "createdFor": [
                                        "012315809814749184151"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123610248886435841486",
                                    "pkgVersion": 1,
                                    "versionKey": "1508975925800",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123610248886435841486/1course_1508914574906_do_2123610248886435841486_1.0.ecar",
                                    "lastSubmittedOn": "2017-10-25T06:52:58.284+0000",
                                    "createdBy": "65485dca-760c-4d10-b803-8f487996d073",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123610248886435841486",
                                    "board": "CBSE",
                                    "resourceType": "Story",
                                    "node_id": 80510
                                },
                                {
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123163336542617601352/23082017-course-1_1503459447262_do_2123163336542617601352_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123163336542617601352/23082017-course-1_1503459447352_do_2123163336542617601352_1.0_spine.ecar",
                                            "size": 937
                                        }
                                    },
                                    "c_null_private_batch_count": 8,
                                    "objectType": "Content",
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{}",
                                    "contentType": "Course",
                                    "identifier": "do_2123163336542617601352",
                                    "lastUpdatedBy": "be9e7184-dffd-45af-9e3c-147fdf2c771d",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123163336542617601352/artifact/do_2123163336542617601352toc.json",
                                    "contentTypesCount": "{}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "be9e7184-dffd-45af-9e3c-147fdf2c771d",
                                    "prevState": "Review",
                                    "size": 936,
                                    "lastPublishedOn": "2017-08-23T03:37:27.261+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "23082017 Course 1",
                                    "status": "Live",
                                    "code": "org.sunbird.XBEa9i",
                                    "description": "Test content uploaded by Creator user",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-08-23T03:24:58.030+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-08-23T03:37:55.662+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-12T23:58:59.340+0000",
                                    "me_totalDownloads": 5,
                                    "creator": "Qa mentor 1",
                                    "createdFor": [
                                        "01231515334617497640"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123163336542617601352",
                                    "pkgVersion": 1,
                                    "versionKey": "1505260739340",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123163336542617601352/23082017-course-1_1503459447262_do_2123163336542617601352_1.0.ecar",
                                    "lastSubmittedOn": "0003-09-11T03:36:55.241+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "ebec55da-7bd5-4e48-b895-34630e16975f",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123163336542617601352",
                                    "node_id": 0
                                },
                                {
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123178763415470081573/25082017-batch_1503647099901_do_2123178763415470081573_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123178763415470081573/25082017-batch_1503647100090_do_2123178763415470081573_1.0_spine.ecar",
                                            "size": 175511
                                        }
                                    },
                                    "c_null_private_batch_count": 5,
                                    "objectType": "Content",
                                    "children": [
                                        "do_2122162678233579521298"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123178763415470081573",
                                    "lastUpdatedBy": "0db290dc-d1f6-4e33-99c3-8860b1313a63",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123178763415470081573/artifact/do_2123178763415470081573toc.json",
                                    "contentTypesCount": "{\"Story\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "0db290dc-d1f6-4e33-99c3-8860b1313a63",
                                    "prevState": "Review",
                                    "size": 176057,
                                    "lastPublishedOn": "2017-08-25T07:44:59.370+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "25082017 Batch",
                                    "status": "Live",
                                    "code": "org.sunbird.JyJKB6",
                                    "description": "test",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-08-25T07:43:34.348+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-08-25T07:45:28.747+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-26T23:58:54.576+0000",
                                    "me_totalDownloads": 4,
                                    "creator": "NTPUser",
                                    "createdFor": [
                                        "01231711180382208027"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123178763415470081573",
                                    "pkgVersion": 1,
                                    "versionKey": "1506470334576",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123178763415470081573/25082017-batch_1503647099901_do_2123178763415470081573_1.0.ecar",
                                    "lastSubmittedOn": "2017-08-25T07:44:30.454+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "3850fd8c-e09e-4544-9a0f-20040e34eed8",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123178763415470081573",
                                    "node_id": 0
                                },
                                {
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123412199319552001265/27-sept_1507008402281_do_2123412199319552001265_2.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123412199319552001265/27-sept_1507008402453_do_2123412199319552001265_2.0_spine.ecar",
                                            "size": 35342
                                        }
                                    },
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Kindergarten"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123412199319552001265/artifact/a2b1d5cf96ad28f15e79df61dbb21fdf_1478083821843.thumb.jpeg",
                                    "children": [
                                        "do_2123412207108341761266"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.content-collection\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123412199319552001265",
                                    "lastUpdatedBy": "logan s",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123412199319552001265/artifact/do_2123412199319552001265toc.json",
                                    "contentTypesCount": "{\"CourseUnit\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "349",
                                    "tutor": [],
                                    "concepts": [
                                        "C27"
                                    ],
                                    "size": 35342,
                                    "lastPublishedOn": "2017-10-03T05:26:41.674+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "27-sept",
                                    "status": "Live",
                                    "code": "do_2123412199319552001265",
                                    "description": "test",
                                    "lastFlaggedOn": "2017-10-09T10:40:09.473+0000",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_20051864/artifact/a2b1d5cf96ad28f15e79df61dbb21fdf_1478083821843.jpeg",
                                    "flaggedBy": [
                                        "logan s"
                                    ],
                                    "createdOn": "2017-09-27T07:16:13.725+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-10-12T08:14:50.664+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-10-03T05:26:42.739+0000",
                                    "me_totalDownloads": 3,
                                    "createdFor": [
                                        "ORG_001"
                                    ],
                                    "creator": "AmitKumar",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123412199319552001265",
                                    "pkgVersion": 2,
                                    "versionKey": "1507796090664",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123412199319552001265/27-sept_1507008402281_do_2123412199319552001265_2.0.ecar",
                                    "lastSubmittedOn": "2017-09-27T07:18:09.901+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "c7e35899-2ed1-47ad-9338-b1d8e2170483",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 0,
                                    "IL_UNIQUE_ID": "do_2123412199319552001265",
                                    "board": "CBSE",
                                    "node_id": 74569,
                                    "resourceType": "Story"
                                },
                                {
                                    "subject": "Hindi",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610297412976641489/2course_1508915169320_do_2123610297412976641489_1.0.ecar",
                                    "language": [
                                        "Kannada"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123610297412976641489/2course_1508915169458_do_2123610297412976641489_1.0_spine.ecar",
                                            "size": 23231
                                        }
                                    },
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Grade 12"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/e1d5586c663df0fc846487bcf46df45f_1475564053985.jpeg",
                                    "children": [
                                        "do_2123610306447032321490"
                                    ],
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.content-collection\":1,\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123610297412976641489",
                                    "lastUpdatedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "audience": [
                                        "Instructor"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123610297412976641489/artifact/do_2123610297412976641489toc.json",
                                    "contentTypesCount": "{\"CourseUnit\":1,\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "f2535a14-b404-4a52-a408-bbe9aa0b2ea5",
                                    "tutor": [],
                                    "concepts": [
                                        "SC5",
                                        "LO39",
                                        "LO37",
                                        "LO45",
                                        "LO14",
                                        "LO7",
                                        "LO47",
                                        "LO30",
                                        "LO46",
                                        "LO17",
                                        "LO4",
                                        "LO16",
                                        "LO3",
                                        "LO31",
                                        "LO12",
                                        "LO28",
                                        "LO29"
                                    ],
                                    "size": 24590,
                                    "lastPublishedOn": "2017-10-25T07:06:08.073+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "2Course",
                                    "status": "Live",
                                    "code": "do_2123610297412976641489",
                                    "description": "oct 25",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-10-25T06:59:23.342+0000",
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-10-25T07:06:15.493+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-10-25T07:06:10.051+0000",
                                    "creator": "CreatorPerson1",
                                    "createdFor": [
                                        "012315809814749184151"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123610297412976641489",
                                    "pkgVersion": 1,
                                    "versionKey": "1508915175493",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123610297412976641489/2course_1508915169320_do_2123610297412976641489_1.0.ecar",
                                    "lastSubmittedOn": "2017-10-25T07:02:32.719+0000",
                                    "createdBy": "65485dca-760c-4d10-b803-8f487996d073",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123610297412976641489",
                                    "board": "CBSE",
                                    "resourceType": "Story",
                                    "node_id": 80521
                                },
                                {
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348158656184321304/2course-sep18_1505714931526_do_2123348158656184321304_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348158656184321304/2course-sep18_1505714932058_do_2123348158656184321304_1.0_spine.ecar",
                                            "size": 19987
                                        }
                                    },
                                    "objectType": "Content",
                                    "gradeLevel": [
                                        "Grade 3"
                                    ],
                                    "children": [
                                        "do_2123348141878968321302"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "c_null_open_batch_count": 0,
                                    "identifier": "do_2123348158656184321304",
                                    "lastUpdatedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348158656184321304/artifact/do_2123348158656184321304toc.json",
                                    "contentTypesCount": "{\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "concepts": [
                                        "C2"
                                    ],
                                    "size": 21345,
                                    "lastPublishedOn": "2017-09-18T06:08:50.943+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "2Course-Sep18",
                                    "status": "Live",
                                    "code": "org.sunbird.GwRAlz",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-09-18T06:07:07.346+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-18T06:14:29.253+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-19T23:58:57.044+0000",
                                    "me_totalDownloads": 9,
                                    "createdFor": [
                                        "01231711180382208027"
                                    ],
                                    "creator": "Mentor1User",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123348158656184321304",
                                    "pkgVersion": 1,
                                    "versionKey": "1505865537044",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123348158656184321304/2course-sep18_1505714931526_do_2123348158656184321304_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-18T06:09:10.364+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "c1714d03-8861-41f3-86d2-f9989e218635",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123348158656184321304",
                                    "board": "CBSE",
                                    "node_id": 0,
                                    "resourceType": "Story"
                                },
                                {
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348853773926401333/3course-sep18_1505723337003_do_2123348853773926401333_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123348853773926401333/3course-sep18_1505723337339_do_2123348853773926401333_1.0_spine.ecar",
                                            "size": 29297
                                        }
                                    },
                                    "objectType": "Content",
                                    "faculty": [],
                                    "gradeLevel": [
                                        "Grade 2"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348853773926401333/artifact/c1_1505714879591.thumb.png",
                                    "children": [
                                        "do_2123348141878968321302"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "c_null_open_batch_count": 0,
                                    "identifier": "do_2123348853773926401333",
                                    "lastUpdatedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "audience": [
                                        "Instructor"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348853773926401333/artifact/do_2123348853773926401333toc.json",
                                    "contentTypesCount": "{\"Resource\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "72d4e213-6167-413d-8cb4-252e90508e38",
                                    "tutor": [],
                                    "concepts": [
                                        "SC9"
                                    ],
                                    "size": 30656,
                                    "lastPublishedOn": "2017-09-18T08:28:56.411+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "3Course-Sep18",
                                    "status": "Live",
                                    "code": "do_2123348853773926401333",
                                    "description": "by KS",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123348162911436801305/artifact/c1_1505714879591.png",
                                    "createdOn": "2017-09-18T08:28:32.670+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-18T08:34:34.756+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-19T23:58:56.932+0000",
                                    "me_totalDownloads": 12,
                                    "createdFor": [
                                        "01231711180382208027"
                                    ],
                                    "creator": "Mentor1User",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123348853773926401333",
                                    "pkgVersion": 1,
                                    "versionKey": "1505865536932",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123348853773926401333/3course-sep18_1505723337003_do_2123348853773926401333_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-18T08:30:34.600+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "c1714d03-8861-41f3-86d2-f9989e218635",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123348853773926401333",
                                    "board": "TN Board",
                                    "node_id": 0,
                                    "resourceType": "Story"
                                },
                                {
                                    "keywords": [
                                        "abc"
                                    ],
                                    "subject": "English",
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123250070645637121480/abc1_1504517565792_do_2123250070645637121480_1.0.ecar",
                                    "language": [
                                        "Hindi"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123250070645637121480/abc1_1504517566014_do_2123250070645637121480_1.0_spine.ecar",
                                            "size": 88952
                                        }
                                    },
                                    "conceptData": "(1) concepts selected",
                                    "c_null_private_batch_count": 0,
                                    "objectType": "Content",
                                    "faculty": [
                                        "science"
                                    ],
                                    "gradeLevel": [
                                        "Grade 1"
                                    ],
                                    "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123250070645637121480/artifact/check-mark_1501237447102.thumb.png",
                                    "children": [
                                        "do_2122182330347274241121",
                                        "do_20044788"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"application/vnd.ekstep.content-collection\":1,\"application/vnd.ekstep.ecml-archive\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123250070645637121480",
                                    "lastUpdatedBy": "f24442ca-8d5e-4672-8885-493fe0b39067",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123250070645637121480/artifact/do_2123250070645637121480toc.json",
                                    "contentTypesCount": "{\"Worksheet\":1,\"Collection\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "f24442ca-8d5e-4672-8885-493fe0b39067",
                                    "tutor": [
                                        "somesh"
                                    ],
                                    "concepts": [
                                        "LO45"
                                    ],
                                    "size": 89211,
                                    "lastPublishedOn": "2017-09-04T09:32:45.013+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "abc1",
                                    "attributions": [
                                        "abc"
                                    ],
                                    "status": "Live",
                                    "code": "do_2123250070645637121480",
                                    "description": "abc to xyz",
                                    "idealScreenSize": "normal",
                                    "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2122981371648737281164/artifact/check-mark_1501237447102.png",
                                    "createdOn": "2017-09-04T09:31:03.936+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-04T09:37:30.267+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-08T23:59:00.600+0000",
                                    "me_totalDownloads": 2,
                                    "creator": "RaghavRaaa",
                                    "createdFor": [
                                        "01229319659233280026",
                                        "0122962363484733440",
                                        "ORG_001"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123250070645637121480",
                                    "pkgVersion": 1,
                                    "versionKey": "1504915140600",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123250070645637121480/abc1_1504517565792_do_2123250070645637121480_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-04T09:33:51.761+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "98e09d6e-b95b-4832-bfab-421e63d36aa7",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123250070645637121480",
                                    "board": "CBSE",
                                    "node_id": 0,
                                    "resourceType": "Story"
                                },
                                {
                                    "keywords": [],
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123206922887413761744/activitycourse_1503990936611_do_2123206922887413761744_1.0.ecar",
                                    "language": [
                                        "English"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123206922887413761744/activitycourse_1503990937757_do_2123206922887413761744_1.0_spine.ecar",
                                            "size": 24847
                                        }
                                    },
                                    "c_null_private_batch_count": 0,
                                    "objectType": "Content",
                                    "faculty": [],
                                    "children": [
                                        "do_212305198230396928111"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"video/mp4\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123206922887413761744",
                                    "lastUpdatedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
                                    "audience": [
                                        "Learner"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123206922887413761744/artifact/do_2123206922887413761744toc.json",
                                    "contentTypesCount": "{\"Story\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
                                    "tutor": [],
                                    "prevState": "Review",
                                    "size": 5258574,
                                    "lastPublishedOn": "2017-08-29T07:15:36.024+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "ActivityCourse",
                                    "status": "Live",
                                    "code": "do_2123206922887413761744",
                                    "description": "Desc",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-08-29T07:12:37.902+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-08-29T07:16:05.952+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-12T23:58:59.824+0000",
                                    "me_totalDownloads": 3,
                                    "createdFor": [
                                        "01232002070124134414"
                                    ],
                                    "creator": "CreatorUser",
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123206922887413761744",
                                    "pkgVersion": 1,
                                    "versionKey": "1505260739824",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123206922887413761744/activitycourse_1503990936611_do_2123206922887413761744_1.0.ecar",
                                    "lastSubmittedOn": "2017-08-29T07:14:22.929+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "2aade7d9-6abf-433b-9a05-3b02cd2eb664",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123206922887413761744",
                                    "keywords_bkp": [],
                                    "node_id": 0
                                },
                                {
                                    "channel": "in.ekstep",
                                    "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123319876723179521138/algebra_1505371020551_do_2123319876723179521138_1.0.ecar",
                                    "language": [
                                        "Hindi"
                                    ],
                                    "mimeType": "application/vnd.ekstep.content-collection",
                                    "variants": {
                                        "spine": {
                                            "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123319876723179521138/algebra_1505371020646_do_2123319876723179521138_1.0_spine.ecar",
                                            "size": 1490
                                        }
                                    },
                                    "conceptData": "(3) concepts selected",
                                    "objectType": "Content",
                                    "faculty": [],
                                    "children": [
                                        "do_2123229899918458881680"
                                    ],
                                    "me_totalRatings": 0,
                                    "contentEncoding": "gzip",
                                    "mimeTypesCount": "{\"video/x-youtube\":1}",
                                    "contentType": "Course",
                                    "identifier": "do_2123319876723179521138",
                                    "lastUpdatedBy": "306b9b31-3c14-487d-83a3-33d7203bd5f0",
                                    "audience": [
                                        "Instructor"
                                    ],
                                    "visibility": "Default",
                                    "toc_url": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123319876723179521138/artifact/do_2123319876723179521138toc.json",
                                    "contentTypesCount": "{\"Story\":1}",
                                    "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
                                    "mediaType": "content",
                                    "osId": "org.ekstep.quiz.app",
                                    "graph_id": "domain",
                                    "nodeType": "DATA_NODE",
                                    "lastPublishedBy": "306b9b31-3c14-487d-83a3-33d7203bd5f0",
                                    "concepts": [
                                        "C423",
                                        "C422",
                                        "C27"
                                    ],
                                    "size": 1490,
                                    "lastPublishedOn": "2017-09-14T06:36:59.975+0000",
                                    "IL_FUNC_OBJECT_TYPE": "Content",
                                    "name": "Algebra",
                                    "status": "Live",
                                    "code": "do_2123319876723179521138",
                                    "description": "Algebra",
                                    "idealScreenSize": "normal",
                                    "createdOn": "2017-09-14T06:13:08.906+0000",
                                    "me_totalSideloads": 0,
                                    "me_totalComments": 0,
                                    "contentDisposition": "inline",
                                    "lastUpdatedOn": "2017-09-14T06:42:30.892+0000",
                                    "SYS_INTERNAL_LAST_UPDATED_ON": "2017-09-14T06:37:00.884+0000",
                                    "me_totalDownloads": 5,
                                    "creator": "NileshMore",
                                    "createdFor": [
                                        "ORG_001"
                                    ],
                                    "IL_SYS_NODE_TYPE": "DATA_NODE",
                                    "os": [
                                        "All"
                                    ],
                                    "es_metadata_id": "do_2123319876723179521138",
                                    "pkgVersion": 1,
                                    "versionKey": "1505371350892",
                                    "idealScreenDensity": "hdpi",
                                    "s3Key": "ecar_files/do_2123319876723179521138/algebra_1505371020551_do_2123319876723179521138_1.0.ecar",
                                    "lastSubmittedOn": "2017-09-14T06:25:42.945+0000",
                                    "me_averageRating": 0,
                                    "createdBy": "5205332d-3693-40e4-88fc-4025f1c1d6fb",
                                    "compatibilityLevel": 4,
                                    "leafNodesCount": 1,
                                    "IL_UNIQUE_ID": "do_2123319876723179521138",
                                    "node_id": 0
                                }
                            ],
                            "display": "{\"name\":{\"en\":\"Popular Courses\",\"hi\":\"????????\"}}",
                            "searchQuery": "{\"request\":{\"filters\":{\"contentType\":[\"Course\"],\"objectType\":[\"Content\"],\"status\":[\"Live\"]},\"sort_by\":{\"name\":\"asc\"},\"limit\":10}}",
                            "alt": null,
                            "name": "Popular Courses",
                            "description": null,
                            "index": 1,
                            "id": "01228382243946496017",
                            "sectionDataType": "course",
                            "group": 2
                        }
                    ]
                }
            }
        };

        ctrl.activityGroupsList=ctrl.activityPageApiResponse.result.response.sections;
        ctrl.viewMorePluginsFlag = false;
        ctrl.clickedViewMoreLinkId = '';
        ctrl.expandedGroupId = '';
        ctrl.showPluginDetails = false;

        ctrl.pluginDetails = {};
        ctrl.images = $scope.images = [];


        ctrl.viewMorePlugins = function(event){
            ctrl.viewMorePluginsFlag = true;
            ctrl.clickedViewMoreLinkId = event.target.id;
            ctrl.expandedGroupId = ctrl.clickedViewMoreLinkId.replace('ViewMore','');
            $scope.$safeApply();
        };
        
        ctrl.viewPluginDetails = function(activity) {
            ctrl.hideMainPage = true;
            ctrl.getPluginDetails(activity.identifier);
            ctrl.selectedPlugin = activity;
            $scope.$safeApply();
        };

        ctrl.closePluginDetails = function() {
            ctrl.showPluginDetails = false;
            ctrl.viewMorePluginsFlag = false;
            ctrl.clickedViewMoreLinkId = '';
            ctrl.expandedGroupId = '';
            ctrl.hideMainPage = false;
            ctrl.applyDimmerToCard();
            $scope.$safeApply();
        };

        ctrl.getActivities = function() {
            ctrl.loading = true;
            ctrl.hideMainPage = false;
            ctrl.errorLoadingActivities = false;
            ctrl.noActivities = false;
            ctrl.activitiesList = [];
            $scope.$safeApply();
            var data = {
                "request": {
                    "query": ctrl.activityOptions.searchQuery,
                    "filters": {
                        "objectType": ["Content"],
                        "contentType": ["plugin"],
                        "status": ["live"],
                        "concepts": ctrl.activityOptions.concepts,
                        "category": ctrl.activityOptions.categories
                    },
                    "sort_by": { "lastUpdatedOn": "desc" },
                    "limit": 200
                }
            };
            ecEditor.getService('search').search(data, function(err, resp) {
                ctrl.loading = false;
                $scope.$safeApply();
                if (err) {
                    ctrl.errorLoadingActivities = true;
                    return;
                }
                if (resp.data.result.count <= 0) {
                    ctrl.noActivities = true;
                    return;
                }
                //ctrl.activitiesList = resp.data.result.content;
                ecEditor._.forEach(resp.data.result.content, function(val) {
                    if (_.isUndefined(val.category)) {
                        ctrl.activitiesList.push(val);
                    } else if (val.category && val.category.indexOf('library') == -1) {
                        ctrl.activitiesList.push(val);
                    }
                })
                ctrl.applyDimmerToCard();
            });
        };
        ctrl.addPlugin = function(activity) {
            var publishedDate = new Date((activity['lastPublishedOn'] || new Date().toString())).getTime();
            ecEditor.loadAndInitPlugin(activity.code, activity.semanticVersion, publishedDate);
            $scope.closeThisDialog();
        }
        ctrl.getActivities();
        ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
            element: 'activityConceptSelector',
            selectedConcepts: [], // All composite keys except mediaType
            callback: function(data) {
                ctrl.activityOptions.conceptsPlaceHolder = '(' + data.length + ') concepts selected';
                ctrl.activityOptions.concepts = _.map(data, function(concept) {
                    return concept.id;
                });
                $scope.$safeApply();
                ctrl.getActivities();
            }
        });

        ctrl.applyDimmerToCard = function() {
            setTimeout(function() {
                ecEditor.jQuery(".activity-cards .image").dimmer({
                    on: 'hover'
                });
            }, 500);
        }

        $scope.$on("ngDialog.opened", function() {
            ecEditor.jQuery('.ui.dropdown.lableCls').dropdown({ useLabels: false, forceSelection: false });
        });


        ctrl.generateTelemetry = function(data) {
            if (data) {
                org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE).interact({
                    "type": data.type,
                    "subtype": data.subtype,
                    "target": data.target,
                    "pluginid": instance.manifest.id,
                    "pluginver": instance.manifest.ver,
                    "objectid": "",
                    "stage": ecEditor.getCurrentStage().id
                });
            }
        };

        ctrl.getPluginDetails = function(pluginId) {
            pluginId = 'org.ekstep.plugins.wordcard';
            ctrl.loading = true;
            ctrl.imageAvailable = false;
            ctrl.errorLoadingActivities = false;
            ctrl.pluginDetails = {};
            ctrl.images = $scope.images = [];

            ecEditor.getService('content').getContent(pluginId, function(err, res) {
                ctrl.loading = false
                if (res) {
                    ctrl.pluginDetails = res;
                    if (res.usedByContent && res.usedByContent.length) ctrl.getPluginScreenshots(res.usedByContent);
                    else {
                        ctrl.images.push({
                            image: ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'assets/default-activity.png')
                        });
                        ctrl.imageAvailable = true;
                    }
                    ctrl.showPluginDetails = true;
                } else {
                    ctrl.errorLoadingActivities = true;
                }
                $scope.$safeApply();
            });
        };

        ctrl.getPluginScreenshots = function(assetList) {
            var request = {
                "request": {
                    "filters": {
                        "contentType": ["asset"],
                        "identifier": assetList
                    }
                }
            };

            ecEditor.getService('search').search(request, function(err, res) {
                if (res.data) res = res.data;
                if (res && res.responseCode === "OK" && res.result.count > 0) {
                    res.result.content.forEach(function(content) {
                        if (content.downloadUrl) ctrl.images.push({ image: content.downloadUrl });
                    });
                } else {
                    ctrl.images.push({
                        image: ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'assets/default-activity.png')
                    });
                }
                ctrl.imageAvailable = true;
                $scope.$safeApply();
            });
        };

    }]);
/* istanbul ignore next */
angular.module('activityBrowserApp').directive('slider', function() {
    return {
        restrict: 'EA',
        scope: {
            images: '=',
            group: '=?'
        },
        controller: ['$scope', function($scope) {
            $scope.group = $scope.group || 1;
            $scope.currentIndex = 0;
            $scope.direction = 'left';

            var init = function() {
                var images = [];
                var source = [];

                angular.copy($scope.images, source);

                for (var i = 0; i < source.length; i + $scope.group) {
                    if (source[i]) {
                        images.push(source.splice(i, $scope.group));
                    }
                }
                $scope.setCurrent(0);
                $scope.slides = $scope.images;
            };

            $scope.$watch('group', init);

            $scope.setCurrent = function(index) {
                $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
                $scope.currentIndex = index;
            };

            $scope.isCurrent = function(index) {
                return $scope.currentIndex === index;
            };

            $scope.next = function() {
                $scope.direction = 'left';
                $scope.currentIndex = $scope.currentIndex < $scope.slides.length - 1 ? ++$scope.currentIndex : 0;
            };

            $scope.prev = function() {
                $scope.direction = 'right';
                $scope.currentIndex = $scope.currentIndex > 0 ? --$scope.currentIndex : $scope.slides.length - 1;
            };
        }],
        template: '<div class="slides group-{{group}}"><div ng-repeat="slide in slides"><div ng-show="isCurrent($index)" class="slide slide-animation"><div ng-repeat="item in slide" class="ui small image"><img ng-src="{{item}}"/></div></div></div><div class="controls" ng-if="slides.length > 1"><div class="navigation"><a ng-click="prev()" class="prev"><span><i class="chevron circle left big icon"></i></span></a><a ng-click="next()" class="next"><span><i class="chevron circle right big icon"></i></span></a></div></div></div>',
        link: function(scope, element, attrs) {}
    };
});

//# sourceURL=activitybrowserapp.js