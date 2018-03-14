window.formConfigurations = {
    templateName: "template",
    action: "save",
    fields: [{
            "code": "concetpselector",
            "name": "conceptselector",
            "description": "Choose a concept",
            "inputType": "concetpselector",
            "label": "Concept",
            "editable": true,
            "required": true,
            "placeholder": "Edit App Icon",
            "renderingHints": {
                "visible": true
            },
            "index": 2
        },
        {
            "code": "year",
            "name": "Year",
            "description": "Description of the content",
            "inputType": "select",
            "label": "Year",
            "editable": true,
            "required": true,
            "placeholder": "Description",
            "renderingHints": {
                "visible": true
            },
            "index": 1
        },
        {
            "code": "name",
            "name": "Name",
            "description": "Title of the content",
            "inputType": "text",
            "required": true,
            "editable": true,
            "label": "Name",
            "placeholder": "fieldName",
            "renderingHints": {
                "maxLength": 50,
                "visible": true
            },
            "index": 1
        }, {
            "code": "description",
            "name": "Description",
            "label": "Description",
            "description": "Description of the content",
            "inputType": "text",
            "editable": true,
            "required": true,
            "placeholder": "Description",
            "renderingHints": {
                "visible": true
            }
        }, {
            "code": "keywords",
            "name": "Keywords",
            "description": "Keywords for the content",
            "inputType": "autoComplete",
            "label": "keyword",
            "editable": true,
            "required": true,
            "placeholder": "Keywords",
            "renderingHints": {
                "visible": true
            }
        },
        {
            "code": "appIcon",
            "name": "App Icon",
            "description": "App Icon",
            "inputType": "file",
            "label": "App Icon",
            "editable": true,
            "required": true,
            "placeholder": "App Icon",
            "renderingHints": {
                "visible": true
            }
        },
        {
            "code": "board",
            "name": "Curriculum",
            "description": "Curriculum",
            "inputType": "select",
            "label": "Curriculum",
            "editable": true,
            "required": true,
            "placeholder": "Curriculum",
            "renderingHints": {
                "visible": true
            },
            "depends": ['gradeLevel']

        },
        {
            "code": "gradeLevel",
            "name": "Class",
            "description": "Class",
            "inputType": "multiSelect",
            "label": "Class",
            "editable": true,
            "required": true,
            "placeholder": "Curriculum",
            "renderingHints": {
                "visible": true
            },
            "depends": ["subject"]
        }, {
            "code": "subject",
            "name": "Subject",
            "description": "Subject",
            "inputType": "select",
            "label": "Subject",
            "editable": true,
            "required": true,
            "placeholder": "Curriculum",
            "renderingHints": {
                "visible": true
            }
        },
        {
            "code": "medium",
            "name": "medium",
            "description": "Subject",
            "inputType": "select",
            "label": "medium",
            "editable": true,
            "required": true,
            "placeholder": "Curriculum",
            "renderingHints": {
                "visible": true
            }
        }
    ]
}

// window.frameword = {
//     "id": "ekstep.learning.framework.read",
//     "ver": "1.0",
//     "ts": "2018-03-13T11:36:13ZZ",
//     "params": {
//         "resmsgid": "f0b84d29-3e60-47f5-b033-4bf00f8140bd",
//         "msgid": null,
//         "err": null,
//         "status": "successful",
//         "errmsg": null
//     },
//     "responseCode": "OK",
//     "result": {
//         "framework": {
//             "owner": "in.ekstep",
//             "identifier": "NCFCOPY",
//             "code": "NCFCOPY",
//             "consumerId": "72e54829-6402-4cf0-888e-9b30733c1b88",
//             "channel": "in.ekstep",
//             "description": " NCF framework..",
//             "type": "K-12",
//             "createdOn": "2018-01-23T09:53:50.189+0000",
//             "versionKey": "1520940624557",
//             "channels": [],
//             "appId": "ekstep_portal",
//             "name": "NCF framework",
//             "lastUpdatedOn": "2018-03-13T11:30:24.557+0000",
//             "categories": [{
//                     "identifier": "ncfcopy_board",
//                     "code": "board",
//                     "terms": [{
//                             "associations": [{
//                                     "identifier": "ncfcopy_gradelevel_kindergarten",
//                                     "code": "kindergarten",
//                                     "name": "Kindergarten",
//                                     "description": "",
//                                     "category": "gradeLevel",
//                                     "status": "Live"
//                                 },
//                                 {
//                                     "identifier": "ncfcopy_gradelevel_grade5",
//                                     "code": "grade5",
//                                     "name": "Grade 5",
//                                     "description": "",
//                                     "category": "gradeLevel",
//                                     "status": "Live"
//                                 },
//                                 {
//                                     "identifier": "ncfcopy_gradelevel_grade1",
//                                     "code": "grade1",
//                                     "name": "Grade 1",
//                                     "description": "",
//                                     "category": "gradeLevel",
//                                     "status": "Live"
//                                 },
//                                 {
//                                     "identifier": "ncfcopy_gradelevel_grade2",
//                                     "code": "grade2",
//                                     "name": "Grade 2",
//                                     "description": "",
//                                     "category": "gradeLevel",
//                                     "status": "Live"
//                                 },
//                                 {
//                                     "identifier": "ncfcopy_gradelevel_grade4",
//                                     "code": "grade4",
//                                     "name": "Grade 4",
//                                     "description": "",
//                                     "category": "gradeLevel",
//                                     "status": "Live"
//                                 },
//                                 {
//                                     "identifier": "ncfcopy_gradelevel_grade3",
//                                     "code": "grade3",
//                                     "name": "Grade 3",
//                                     "description": "",
//                                     "category": "gradeLevel",
//                                     "status": "Live"
//                                 }
//                             ],
//                             "identifier": "ncfcopy_board_ncert",
//                             "code": "ncert",
//                             "name": "NCERT",
//                             "description": "",
//                             "index": 1,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_cbse",
//                             "code": "cbse",
//                             "name": "CBSE",
//                             "description": "",
//                             "index": 2,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_icse",
//                             "code": "icse",
//                             "name": "ICSE",
//                             "description": "",
//                             "index": 3,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_upboard",
//                             "code": "upboard",
//                             "name": "UP Board",
//                             "description": "",
//                             "index": 4,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_apboard",
//                             "code": "apboard",
//                             "name": "AP Board",
//                             "description": "",
//                             "index": 5,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_tnboard",
//                             "code": "tnboard",
//                             "name": "TN Board",
//                             "description": "",
//                             "index": 6,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_ncte",
//                             "code": "ncte",
//                             "name": "NCTE",
//                             "description": "",
//                             "index": 7,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_mscert",
//                             "code": "mscert",
//                             "name": "MSCERT",
//                             "description": "",
//                             "index": 8,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_bser",
//                             "code": "bser",
//                             "name": "BSER",
//                             "description": "",
//                             "index": 9,
//                             "category": "board",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_board_others",
//                             "code": "others",
//                             "name": "Others",
//                             "description": "",
//                             "index": 10,
//                             "category": "board",
//                             "status": "Live"
//                         }
//                     ],
//                     "name": "Curriculum",
//                     "description": "",
//                     "index": 1,
//                     "status": "Live"
//                 },
//                 {
//                     "identifier": "ncfcopy_gradelevel",
//                     "code": "gradeLevel",
//                     "terms": [{
//                             "associations": [{
//                                     "identifier": "ncfcopy_subject_english",
//                                     "code": "english",
//                                     "name": "English",
//                                     "description": "",
//                                     "category": "subject",
//                                     "status": "Live"
//                                 },
//                                 {
//                                     "identifier": "ncfcopy_subject_mathematics",
//                                     "code": "mathematics",
//                                     "name": "Mathematics",
//                                     "description": "",
//                                     "category": "subject",
//                                     "status": "Live"
//                                 }
//                             ],
//                             "identifier": "ncfcopy_gradelevel_kindergarten",
//                             "code": "kindergarten",
//                             "name": "Kindergarten",
//                             "description": "",
//                             "index": 1,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade1",
//                             "code": "grade1",
//                             "name": "Grade 1",
//                             "description": "",
//                             "index": 2,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade2",
//                             "code": "grade2",
//                             "name": "Grade 2",
//                             "description": "",
//                             "index": 3,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade3",
//                             "code": "grade3",
//                             "name": "Grade 3",
//                             "description": "",
//                             "index": 4,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade4",
//                             "code": "grade4",
//                             "name": "Grade 4",
//                             "description": "",
//                             "index": 5,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade5",
//                             "code": "grade5",
//                             "name": "Grade 5",
//                             "description": "",
//                             "index": 6,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade6",
//                             "code": "grade6",
//                             "name": "Grade 6",
//                             "description": "",
//                             "index": 7,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade7",
//                             "code": "grade7",
//                             "name": "Grade 7",
//                             "description": "",
//                             "index": 8,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade8",
//                             "code": "grade8",
//                             "name": "Grade 8",
//                             "description": "",
//                             "index": 9,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade9",
//                             "code": "grade9",
//                             "name": "Grade 9",
//                             "description": "",
//                             "index": 10,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade10",
//                             "code": "grade10",
//                             "name": "Grade 10",
//                             "description": "",
//                             "index": 11,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade11",
//                             "code": "grade11",
//                             "name": "Grade 11",
//                             "description": "",
//                             "index": 12,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_grade12",
//                             "code": "grade12",
//                             "name": "Grade 12",
//                             "description": "",
//                             "index": 13,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_gradelevel_others",
//                             "code": "others",
//                             "name": "Other",
//                             "description": "",
//                             "index": 14,
//                             "category": "gradeLevel",
//                             "status": "Live"
//                         }
//                     ],
//                     "name": "Class",
//                     "description": "",
//                     "index": 2,
//                     "status": "Live"
//                 },
//                 {
//                     "identifier": "ncfcopy_subject",
//                     "code": "subject",
//                     "terms": [{
//                             "identifier": "ncfcopy_subject_mathematics",
//                             "code": "mathematics",
//                             "name": "Mathematics",
//                             "description": "",
//                             "index": 1,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_english",
//                             "code": "english",
//                             "name": "English",
//                             "description": "",
//                             "index": 2,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_tamil",
//                             "code": "tamil",
//                             "name": "Tamil",
//                             "description": "",
//                             "index": 3,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_telugu",
//                             "code": "telugu",
//                             "name": "Telugu",
//                             "description": "",
//                             "index": 4,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_geography",
//                             "code": "geography",
//                             "name": "Geography",
//                             "description": "",
//                             "index": 5,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_urdu",
//                             "code": "urdu",
//                             "name": "Urdu",
//                             "description": "",
//                             "index": 6,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_kannada",
//                             "code": "kannada",
//                             "name": "Kannada",
//                             "description": "",
//                             "index": 7,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_assamese",
//                             "code": "assamese",
//                             "name": "Assamese",
//                             "description": "",
//                             "index": 8,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_physics",
//                             "code": "physics",
//                             "name": "Physics",
//                             "description": "",
//                             "index": 9,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_chemistry",
//                             "code": "chemistry",
//                             "name": "Chemistry",
//                             "description": "",
//                             "index": 10,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_hindi",
//                             "code": "hindi",
//                             "name": "Hindi",
//                             "description": "",
//                             "index": 11,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_marathi",
//                             "code": "marathi",
//                             "name": "Marathi",
//                             "description": "",
//                             "index": 12,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_environmentalstudies",
//                             "code": "environmentalstudies",
//                             "name": "Environmental Studies",
//                             "description": "",
//                             "index": 13,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_politicalscience",
//                             "code": "politicalscience",
//                             "name": "Political Science",
//                             "description": "",
//                             "index": 14,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_bengali",
//                             "code": "bengali",
//                             "name": "Bengali",
//                             "description": "",
//                             "index": 15,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_history",
//                             "code": "history",
//                             "name": "History",
//                             "description": "",
//                             "index": 16,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_gujarati",
//                             "code": "gujarati",
//                             "name": "Gujarati",
//                             "description": "",
//                             "index": 17,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_biology",
//                             "code": "biology",
//                             "name": "Biology",
//                             "description": "",
//                             "index": 18,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_oriya",
//                             "code": "oriya",
//                             "name": "Oriya",
//                             "description": "",
//                             "index": 19,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_punjabi",
//                             "code": "punjabi",
//                             "name": "Punjabi",
//                             "description": "",
//                             "index": 20,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_nepali",
//                             "code": "nepali",
//                             "name": "Nepali",
//                             "description": "",
//                             "index": 21,
//                             "category": "subject",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_subject_malayalam",
//                             "code": "malayalam",
//                             "name": "Malayalam",
//                             "description": "",
//                             "index": 22,
//                             "category": "subject",
//                             "status": "Live"
//                         }
//                     ],
//                     "name": "Subject",
//                     "description": "",
//                     "index": 3,
//                     "status": "Live"
//                 },
//                 {
//                     "identifier": "ncfcopy_medium",
//                     "code": "medium",
//                     "terms": [{
//                             "identifier": "ncfcopy_medium_english",
//                             "code": "english",
//                             "name": "English",
//                             "description": "",
//                             "index": 1,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_hindi",
//                             "code": "hindi",
//                             "name": "Hindi",
//                             "description": "",
//                             "index": 2,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_oriya",
//                             "code": "oriya",
//                             "name": "Oriya",
//                             "description": "",
//                             "index": 3,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_telugu",
//                             "code": "telugu",
//                             "name": "Telugu",
//                             "description": "",
//                             "index": 4,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_kannada",
//                             "code": "kannada",
//                             "name": "Kannada",
//                             "description": "",
//                             "index": 5,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_marathi",
//                             "code": "marathi",
//                             "name": "Marathi",
//                             "description": "",
//                             "index": 6,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_assamese",
//                             "code": "assamese",
//                             "name": "Assamese",
//                             "description": "",
//                             "index": 7,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_bengali",
//                             "code": "bengali",
//                             "name": "Bengali",
//                             "description": "",
//                             "index": 8,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_gujarati",
//                             "code": "gujarati",
//                             "name": "Gujarati",
//                             "description": "",
//                             "index": 9,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_urdu",
//                             "code": "urdu",
//                             "name": "Urdu",
//                             "description": "",
//                             "index": 10,
//                             "category": "medium",
//                             "status": "Live"
//                         },
//                         {
//                             "identifier": "ncfcopy_medium_other",
//                             "code": "other",
//                             "name": "Other",
//                             "description": "",
//                             "index": 11,
//                             "category": "medium",
//                             "status": "Live"
//                         }
//                     ],
//                     "name": "Medium",
//                     "description": "",
//                     "index": 4,
//                     "status": "Live"
//                 }
//             ],
//             "status": "Live"
//         }
//     }
// }