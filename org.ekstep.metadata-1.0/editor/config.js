window.formConfigurations = {
    templateName: "template",
    action: "save",
    fields: [{
            "code": "conceptselector",
            "name": "conceptselector",
            "description": "Choose a concept",
            "inputType": "concetpselector",
            "label": "Concept",
            "editable": true,
            "required": false,
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