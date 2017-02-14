
 /**
 * Plugin to get todos from community portal
 * @class Todo
 * @constructor
 * @extends EkstepEditor.basePlugin
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

EkstepEditor.basePlugin.extend({
    initialize: function() {
		this.initData();
		EkstepEditorAPI.addEventListener("stage:select", this.controllerCallback, this);
    },
    initData: function(){
		var instance = this;
	},
    controllerCallback: function(event, data) {
		ctrl = this;
		/*TODO*/
		setTimeout(function(){
			//ctrl.getTodos();
			ctrl.initializeTodoWidget();
		}, 3000);

		ctrl.initializeTodoWidget = function ()
		{
			console.log(data.stageId);
			var obj = {};
			var widgetRef;

			if (!EkstepEditorAPI._.isUndefined(window.context))
			{
				obj["status"]   = "";
				if(!EkstepEditorAPI._.isUndefined(window.context.content_id) && window.context.content_id != "")
				{
					obj["url"]      = "index.php?option=com_ekcontent&view=content&id="+window.context.id;
					obj["type"]     = "todos";
					obj["subtype"]  = "reviewer#"+data.stageId;
					obj["client"]   = "content.jlike_ekcontent";
					obj["cont_id"]  = window.context.id;
					obj["title"]    = EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name;

					widgetRef = EkstepEditorAPI.jQuery("#pageLevelTodos");

					/**Update widget attribute as per page**/
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-url', obj["url"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-status', obj["status"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-type', obj["type"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-subtype', obj["subtype"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-client', obj["client"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-cont-id', obj["cont_id"] );
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-title', obj["title"]);

					obj["content_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
					obj["assigned_by"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
					obj["assigned_to"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");
					obj["state"]=1;

					obj["status"] = "I";
					ctrl.getTodos(widgetRef, obj, "#pageLevelTodos");

					obj["status"] = "C";
					ctrl.getTodos(widgetRef, obj, "#pageLevelResolvedTodos");
				}
			}
		}

		ctrl.getTodos = function(widgetRef, obj, todoThreadsWrapperDiv)
		{
			var status = ''
			status = obj["status"];
			EkstepEditorAPI.jQuery(widgetRef).hybridtodo({obj:obj, action:'getTodosAndComments', callback: function(result){
					ctrl.renderHybridTodos(result, status, todoThreadsWrapperDiv);
				}
			});
		}

		ctrl.updateStatus = function(ref)
		{
			var widgetRef, status, id, todotext, context;

			status    = 'C';
			id        = EkstepEditorAPI.jQuery(ref).attr("data-jlike-id");
			todotext  = EkstepEditorAPI.jQuery(ref).attr("data-ek-todomsg");
			context  = EkstepEditorAPI.jQuery(ref).attr("data-jlike-context");

			widgetRef = EkstepEditorAPI.jQuery("#todoThreadId"+ parseInt(id));

			/**Update todo status**/
			setTimeout(function(){
				ctrl.save(widgetRef, status, id, todotext, context);
			}, 300);
		},
		ctrl.save = function(widgetRef, status, id, todotext, context)
		{
			var obj = {};

			obj['id']         = id;
			obj["sender_msg"] = todotext;
			obj["url"]        = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-url");
			obj["cont_id"]    = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-cont-id");
			obj["type"]       = 'todos'
			obj["subtype"]    = context
			obj["client"]     = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-client");
			obj["content_id"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
			obj["assigned_by"]= EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
			obj["assigned_to"]= EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");
			obj["state"]      = 1;
			obj["status"]     = "C";

			EkstepEditorAPI.jQuery(widgetRef).jltodos({obj:obj,action: 'createTodo'});
		}

		ctrl.renderHybridTodos = function(result, status, todoThreadsWrapperDiv)
		{
			var disabledAttr, readOnly, buttonName;

			if (result.success == true)
			{
				EkstepEditorAPI.jQuery(todoThreadsWrapperDiv).html('');
				var hideDiv = '';
				hideDiv     = todoThreadsWrapperDiv.substring(1, todoThreadsWrapperDiv.length);
				EkstepEditorAPI.jQuery("."+hideDiv).show();
				/*Pagination end*/
				for (var i = 0; i < result.data.result.length; i++)
				{
					todoStatus   = result.data.result[i].status;
					buttonName   = result.data.result[i].status == "I" ? 'Resolve' : 'Resolved';
					disabledAttr = result.data.result[i].status == "I" ? '' : 'disabled';
					readOnly     = result.data.result[i].status == "I" ? false : true;
					var widget = '';
					widget += '<div class="todo-wrapper ui segments" id="todoWrapper'+result.data.result[i].id+'"  style="background-color:#fff; margin-bottom: 5px; padding: 5px"></br>';
						widget += '<div class="row">';
							widget += '<label class="left floated" style="padding-left:0px">';
								widget += result.data.result[i].sender_msg;
							widget += '</label>';
							widget += '<span class="right floated" style="margin-left: 74px">';
								widget += '<button type="button" class="ui tiny icon button right floated basic" id="'+result.data.result[i].id+'" data-jlike-id="'+result.data.result[i].id+'"  data-ek-todomsg="'+result.data.result[i].sender_msg+'" data-jlike-context="'+result.data.result[i].context+'" onClick="ctrl.updateStatus(this)" '+disabledAttr+'>'+buttonName+'</button>';
							widget += '</span>';
						widget += '</div>';

						widget += '<div id="todoThreadId'+result.data.result[i].id+'" class="list-unstyled" ';
							widget += 'data-jlike-client="content.jlike_ekcontent" ';
							widget += 'data-jlike-type="annotations" ';
							widget += 'data-jlike-subtype="com_ekcontent.reviewers" ';
							widget += 'data-jlike-context="reviewer#todo#'+result.data.result[i].id+'" ';
							//widget += 'data-jlike-url="'+obj['url']+'" ';
							widget += 'data-jlike-limitstart="0" ';
							widget += 'data-jlike-limit="2" ';
							if(readOnly) widget += 'data-jlike-readonly="'+readOnly+'" ';
							widget += 'data-jlike-contentid="'+result.data.result[i].content_id+'" ';
							widget += 'data-jlike-ordering="annotation_date" >';
						widget += '</div>';
					widget += '</div>';

					for (var c = 0; c < result.data.result[i].comments.length; c++)
					{
						result.data.result[i].comments[c].user_name = result.data.result[i].comments[c].user.name;
						result.data.result[i].comments[c].user_id = result.data.result[i].comments[c].user.id;
						result.data.result[i].comments[c].profile_picture_url = result.data.result[i].comments[c].user.avatar;
						result.data.result[i].comments[c].profile_url = result.data.result[i].comments[c].user.profile_link;
						result.data.result[i].comments[c].created =  moment(result.data.result[i].comments[c].annotation_date).format('HH:mm, MMM Do YYYY');
					}

					result.data.result[i].status == "I" ? EkstepEditorAPI.jQuery(todoThreadsWrapperDiv).append(widget) : EkstepEditorAPI.jQuery(todoThreadsWrapperDiv).append(widget);

					jQuery("#todoThreadId"+ result.data.result[i].id).hybridtodo({
						arrData:result.data.result[i].comments,
						action:'renderHybridTodos',
						userProfile:result.data.userinfo
					});
				}
			}
			else
			{
				var hideDiv = '';
				hideDiv     = todoThreadsWrapperDiv.substring(1, todoThreadsWrapperDiv.length);
				EkstepEditorAPI.jQuery("."+hideDiv).hide();
			}
		}
    }
});
//# sourceURL=todo.js
