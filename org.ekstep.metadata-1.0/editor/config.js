window.fixedLayoutConfigurations = [{
    "code": "image",
    "name": "App Icon",
    "description": "Edit App Icon",
    "inputType": "text",
    "editable": true,
    "required": true,
    "placeholder": "Select concept",
    "renderingHints": {
        "visible": true
    },
}, {
    "code": "name",
    "name": "Name",
    "description": "Title of the content",
    "inputType": "text",
    "editable": true,
    "required": true,
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
    "code": "keyword",
    "name": "Keywords",
    "description": "Keywords for the content",
    "inputType": "autoComplete",
    "label": "keyword",
    "editable": true,
    "required": false,
    "placeholder": "Keywords",
    "renderingHints": {
        "visible": true
    }
}, {
    "code": "subject",
    "name": "Subject",
    "description": "",
    "inputType": "select",
    "editable": true,
    "required": false,
    "dependsOn": [
        "field1"
    ],
    "placeholder": "Subject",
    "terms": [{
            "code": "field2value1",
            "name": "field2value1",
            "association": [{
                    "code": "field3value1",
                    "name": "field3value1"
                },
                {
                    "code": "field3value2",
                    "name": "field3value2"
                }
            ]
        },
        {
            "code": "field2value2",
            "name": "field2value2",
            "association": [{
                    "code": "field3value1",
                    "name": "field3value1"
                },
                {
                    "code": "field3value2",
                    "name": "field3value2"
                }
            ]
        }
    ],
    "renderingHints": {
        "maxLength": 50
    },
    "index": 2
}, {
    "code": "field3",
    "name": "fieldName",
    "description": "description",
    "inputType": "select/multiselect",
    "editable/readOnly": false,
    "required": false,
    "dependsOn": [
        "field1"
    ],
    "placeholder": "fieldName",
    "terms": [{
            "code": "field3value1",
            "name": "field3value1"
        },
        {
            "code": "field3value2",
            "name": "field3value2"
        }
    ],
    "renderingHints": {
        "maxLength": 50
    },
    "index": 2
}, {
    "code": "field4",
    "name": "fieldName",
    "description": "description",
    "inputType": "select/multiselect",
    "editable/readOnly": false,
    "required": false,
    "placeholder": "fieldName",
    "terms": "framework.categories.terms",
    "renderingHints": {
        "maxLength": 50
    },
    "index": 2
}, {
    "code": "field5",
    "name": "fieldName",
    "description": "description",
    "inputType": "imageBrowser/autoComplete/conceptSelector",
    "editable/readOnly": false,
    "required": false,
    "placeholder": "fieldName",
    "renderingHints": {
        "maxLength": 50
    },
    "index": 3,
    "apiUrl": "/keywors"
}];

window.dynamicLayoutConfigurations = [{
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
    }, {
        "code": "board",
        "name": "Curriculum",
        "description": "Board Concept",
        "inputType": "select",
        "label": "Curriculum",
        "editable": true,
        "required": true,
        "placeholder": "Curriculum",
        "renderingHints": {
            "visible": true
        },
        "index": 5
    }, {
        "code": "gradeLevel",
        "name": "Class",
        "description": "Description of the class",
        "inputType": "select",
        "label": "Class",
        "editable": true,
        "required": true,
        "placeholder": "Description",
        "renderingHints": {
            "visible": true
        },
        "index": 4
    },
    {
        "code": "subject",
        "name": "Subject",
        "description": "Description of the Subject",
        "inputType": "select",
        "label": "Subject",
        "editable": true,
        "required": true,
        "placeholder": "Description",
        "renderingHints": {
            "visible": true
        },
        "index": 1
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
        "index": 0
    }

]