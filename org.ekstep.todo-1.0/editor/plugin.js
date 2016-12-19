/**
 *
 * Plugin to get todos form community portal
 * @class todos
 * @extends EkstepEditor.basePlugin
 *
 * @author Gourav More <gourav_m@tekditechnologies.com>
 * @listens
 */

EkstepEditor.basePlugin.extend({
    initialize: function() {
		this.initData();
    },
    initData: function(){
		var instance = this;

		this.controllerCallback(this);
	},
    showTodo: function(err, data) {
        var instance = this,
            popupConfig;

        popupConfig = {
            template: data,
            data: { instance: instance }
        };

        EkstepEditorAPI.getService('popup').open(popupConfig, instance.controllerCallback);
    },
    controllerCallback: function(ctrl, scope, data) {
		ctrl.reportedTodo = {"data":{"result":[{"id":"146","asset_id":"408","ordering":"145","state":"1","checked_out":"0","checked_out_time":"0000-00-00 00:00:00","created_by":"80","sender_msg":"TEST","created":"2016-12-13 16:12:59","content_id":"3627","created_date":"0000-00-00 00:00:00","start_date":"0000-00-00 00:00:00","due_date":"0000-00-00 00:00:00","status":"I","title":"","type":"todos","context":"reviewer","system_generated":"1","parent_id":"0","list_id":"0","modified_date":"0000-00-00 00:00:00","modified_by":"0","can_override":"0","overriden":"0","params":"","todo_list_id":"0","ideal_time":"0","content_title":"tesst","content_url":"index.php?option=com_ekcontent&view=content&id=3103","editor":null,"status_title":"COM_JLIKE_INCOMPLETE","assigned_by":{"id":"80","name":"Madhuchandra R","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/80-madhuchandra-r","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"},"assigned_to":{"id":"381","name":"gourav_test","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/381-gourav-test","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"}}],"total":"2"},"success":true};

		ctrl.resolvedTodo = {"data":{"result":[{"id":"145","asset_id":"407","ordering":"144","state":"1","checked_out":"0","checked_out_time":"0000-00-00 00:00:00","created_by":"80","sender_msg":"Harmful or dangerous content","created":"2016-12-13 16:12:59","content_id":"3627","created_date":"0000-00-00 00:00:00","start_date":"0000-00-00 00:00:00","due_date":"0000-00-00 00:00:00","status":"C","title":"","type":"todos","context":"reviewer","system_generated":"1","parent_id":"0","list_id":"0","modified_date":"0000-00-00 00:00:00","modified_by":"0","can_override":"0","overriden":"0","params":"","todo_list_id":"0","ideal_time":"0","content_title":"tesst","content_url":"index.php?option=com_ekcontent&view=content&id=3103","editor":null,"status_title":"COM_JLIKE_COMPLETED","assigned_by":{"id":"80","name":"Madhuchandra R","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/80-madhuchandra-r","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"},"assigned_to":{"id":"381","name":"gourav_test","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/381-gourav-test","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"}}],"total":"2"},"success":true};

		var obj = {};
		var widgetRef;

		widgetRef = EkstepEditorAPI.jQuery("#pageLevelTodos");


		/**Update widget attribute as per page**/
		EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-url', "index.php?option=com_ekcontent&view=content&id=3103");
		EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-cont-id', "3103");
		EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-subtype', "reviewer#" + "splash");

		/**Unchecked all page level checks on page changes**/
		EkstepEditorAPI.jQuery(".page-level-todo").each(function(){
			EkstepEditorAPI.jQuery(this).attr("checked", false);
		});

		EkstepEditorAPI.jQuery(".pagelevel-todo").each(function(){
			EkstepEditorAPI.jQuery(this).attr("checked", false);
		});

		var outTempRender = '';
		outTempRender += '<table class="ui small compact celled definition table">';
		outTempRender += '<tbody id="reportedIssue">';
		outTempRender += '</tbody>';
		outTempRender += '</tbody>';

		var tempRender = [
			'<tr>',
			  '<td class="collapsing">',
				'<div class="ui fitted slider checkbox">',
				  '<input type="checkbox"> <label></label>',
				'</div>',
			 '</td>',
			  '<td>Harmful or dangerous content<div><small style="opacity:.5;">Reprted on 2 days ago</small></div></td>',
			'</tr>',
		];

		/**Init**/
		EkstepEditorAPI.jQuery(widgetRef).jltodos();

		obj["url"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-url");
		obj["cont_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-cont-id");
		obj["type"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-type");
		obj["subtype"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-subtype");
		obj["client"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-client");
		obj["content_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
		obj["assigned_by"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
		obj["assigned_to"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");
		obj["state"]=1;
		obj["status"] = "I";

		/*TODO*/
		setTimeout(function(){

			/**Render todos**/
			EkstepEditorAPI.jQuery("#pageLevelTodos").jltodos({obj:obj, action:'renderTodos', tempRender:tempRender, outTempRender:outTempRender});

			obj["status"] = "C";
			/**Render resovled todos**/
			EkstepEditorAPI.jQuery("#pageLevelResolvedTodos").addClass('ui relaxed divided list');
			EkstepEditorAPI.jQuery("#pageLevelResolvedTodos").jltodos({obj:obj, action:'renderTodos'});
		}, 3000);

		ctrl.updateStatus = function(ref)
		{
			var widgetRef = EkstepEditorAPI.jQuery(ref).closest('ul');
			var status  = 'I';

			if ((ref).checked == true){
				status = 'C';
			}

			id=EkstepEditorAPI.jQuery(ref).attr("data-jlike-id");
			todotext=EkstepEditorAPI.jQuery(ref).attr("data-ek-todomsg");

			/**Update todo status**/
			ctrl.save(widgetRef, status, id, todotext);
		},
		ctrl.save = function(widgetRef, status, id, todotext)
		{
			var obj = {};

			obj['id']=id;
			obj["sender_msg"]=todotext;

			obj["url"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-url");
			obj["cont_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-cont-id");
			obj["type"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-type");
			obj["subtype"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-subtype");
			obj["client"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-client");
			obj["content_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
			obj["assigned_by"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
			obj["assigned_to"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");

			obj["state"]=1;

			if (status != null  && status != undefined)
			{
				obj["status"] = status;
			}

			/**Create/Edit Todo**/
			EkstepEditorAPI.jQuery('.live').addClass('disabled');
			hasCreatedTodo = true;
			EkstepEditorAPI.jQuery(widgetRef).jltodos({obj:obj,action: 'createTodo'});
		},
        ctrl.cancel = function() {
            EkstepEditorAPI.jQuery('.ui.modal').modal('hide');
        };
    }
});
//# sourceURL=todo.js
