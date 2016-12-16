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

		widgetRef = jQuery("#pageLevelTodos");

		/**Update widget attribute as per page**/
		jQuery(widgetRef).attr('data-jlike-url', "index.php?option=com_ekcontent&view=content&id=3103");
		jQuery(widgetRef).attr('data-jlike-cont-id', "3103");
		jQuery(widgetRef).attr('data-jlike-subtype', "reviewer#" + "splash");

		/**Unchecked all page level checks on page changes**/
		jQuery(".page-level-todo").each(function(){
			jQuery(this).attr("checked", false);
		});

		jQuery(".pagelevel-todo").each(function(){
			jQuery(this).attr("checked", false);
		});

		var tempRender1 = [

		"<div class='item' data-jlike-todoid='<%= id %>'>",
				"<input type='checkbox' id='todo<%= id %>' data-jlike-id='<%= id %>' name='todo<%= id %>' data-ek-todomsg='<%= sender_msg %>' onClick='ctrl.updateStatus(this)'>",
			"<div style='display:inline-block; padding:5px;'>",
				"<div class='header'><%= sender_msg %></div>",
				"<div class='description'>Reported on <%= formatDate(created) %></div>",
			"</div>",
		"</div>",
		];

		var tempRender = [
		"<li>",
			"<%= sender_msg %>",
		"</li>",
		];

		/**Init**/
		jQuery(widgetRef).jltodos();

		obj["url"]=jQuery(widgetRef).attr("data-jlike-url");
		obj["cont_id"]=jQuery(widgetRef).attr("data-jlike-cont-id");
		obj["type"]=jQuery(widgetRef).attr("data-jlike-type");
		obj["subtype"]=jQuery(widgetRef).attr("data-jlike-subtype");
		obj["client"]=jQuery(widgetRef).attr("data-jlike-client");
		obj["content_id"]=jQuery(widgetRef).attr("data-jlike-contentid");
		obj["assigned_by"]=jQuery(widgetRef).attr("data-jlike-assigned_by");
		obj["assigned_to"]=jQuery(widgetRef).attr("data-jlike-assigned_to");
		obj["state"]=1;
		obj["status"] = "I";

		/*TODO*/
		setTimeout(function(){

			/**Render todos**/
			jQuery("#pageLevelTodos").jltodos({obj:obj, action:'renderTodos', tempRender:tempRender});

			obj["status"] = "C";
			/**Render resovled todos**/
			jQuery("#pageLevelResolvedTodos").jltodos({obj:obj, action:'renderTodos'});
		}, 3000);

		setTimeout(function(){
			// Add a "checked" symbol when clicking on a list item
			var list = document.querySelector('ul');
			list.addEventListener('click', function(ev) {
			  if (ev.target.tagName === 'LI') {
				ev.target.classList.toggle('checked');
			  }
			}, false);
		}, 3000);

		ctrl.updateStatus = function(ref)
		{
			var widgetRef = jQuery(ref).closest('ul');
			var status  = 'I';

			if ((ref).checked == true){
				status = 'C';
			}

			id=jQuery(ref).attr("data-jlike-id");
			todotext=jQuery(ref).attr("data-ek-todomsg");

			/**Update todo status**/
			ctrl.save(widgetRef, status, id, todotext);
		},
		ctrl.save = function(widgetRef, status, id, todotext)
		{
			var obj = {};

			obj['id']=id;
			obj["sender_msg"]=todotext;

			obj["url"]=jQuery(widgetRef).attr("data-jlike-url");
			obj["cont_id"]=jQuery(widgetRef).attr("data-jlike-cont-id");
			obj["type"]=jQuery(widgetRef).attr("data-jlike-type");
			obj["subtype"]=jQuery(widgetRef).attr("data-jlike-subtype");
			obj["client"]=jQuery(widgetRef).attr("data-jlike-client");
			obj["content_id"]=jQuery(widgetRef).attr("data-jlike-contentid");
			obj["assigned_by"]=jQuery(widgetRef).attr("data-jlike-assigned_by");
			obj["assigned_to"]=jQuery(widgetRef).attr("data-jlike-assigned_to");

			obj["state"]=1;

			if (status != null  && status != undefined)
			{
				obj["status"] = status;
			}

			/**Create/Edit Todo**/
			jQuery('.live').addClass('disabled');
			hasCreatedTodo = true;
			jQuery(widgetRef).jltodos({obj:obj,action: 'createTodo'});
		},
        ctrl.cancel = function() {
            EkstepEditorAPI.jQuery('.ui.modal').modal('hide');
        };
    }
});
//# sourceURL=todo.js
