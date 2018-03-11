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
            "index": 5
        },
        {
            "code": "name",
            "name": "Name",
            "description": "Title of the content",
            "inputType": "text",

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
        },
        {
            "code": "sets",
            "name": "Boards",
            "description": "Keywords for the content",
            "inputType": "select",
            "label": "Boards",
            "editable": true,
            "required": false,
            "placeholder": "Boards",
            "renderingHints": {
                "visible": true
            }
        },
        {
            "code": "class",
            "name": "Class",
            "description": "Class for the content",
            "inputType": "select",
            "label": "Class",
            "editable": true,
            "required": false,
            "placeholder": "Class",
            "renderingHints": {
                "visible": true,
                "multiSelect": true
            },
            "depends": "subject",
            "index": 0

        },
        {
            "code": "subject",
            "name": "Subject",
            "description": "Subject for the content",
            "inputType": "select",
            "label": "Subject",
            "editable": true,
            "required": false,
            "placeholder": "Subject",
            "renderingHints": {
                "visible": true
            },
            "index": 1
        },
        {
            "code": "medium",
            "name": "Medium",
            "description": "Medium for the content",
            "inputType": "select",
            "label": "Medium",
            "editable": false,
            "required": false,
            "placeholder": "Medium",
            "index": 4,
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
        }
    ]
}