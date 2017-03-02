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
		setTimeout(function(){
			ctrl.initializeTodoWidget();
		}, 3000);

		ctrl.initializeTodoWidget = function ()
		{
			var requestParams = {};
			var widgetRef;

			if (!EkstepEditorAPI._.isUndefined(window.context))
			{
				if(!EkstepEditorAPI._.isUndefined(window.context.content_id) && window.context.content_id != "")
				{
					// Content url
					requestParams["url"]      = "index.php?option=com_ekcontent&view=content&id="+window.context.id;
					requestParams["type"]     = "todos";

					// Stage id
					requestParams["subtype"]  = "reviewer#"+data.stageId;
					requestParams["client"]   = "content.jlike_ekcontent";

					// Content id
					requestParams["cont_id"]  = window.context.id;

					// Content title
					requestParams["title"]    = EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name;

					widgetRef = EkstepEditorAPI.jQuery("#pageLevelTodos");

					/**Update widget attribute as per page**/
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-url', requestParams["url"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-status', requestParams["status"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-type', requestParams["type"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-subtype', requestParams["subtype"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-client', requestParams["client"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-cont-id', requestParams["cont_id"] );
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-title', requestParams["title"]);

					requestParams["content_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
					requestParams["assigned_by"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
					requestParams["assigned_to"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");

					// State 1 = Publish
					requestParams["state"]=1;

					// Status I = Incomplete(Unresolved todo)
					requestParams["status"] = "I";
					ctrl.getTodos(widgetRef, requestParams, "#pageLevelTodos");

					// Status C = Complete(resolved todo)
					requestParams["status"] = "C";
					ctrl.getTodos(widgetRef, requestParams, "#pageLevelResolvedTodos");
				}
			}
		}

		/**
		 * WidgetRef = widget id
		 * apiRequestParams  = APIs request params
		 * todoThreadsWrapperDiv = to append widget
		 **/
		ctrl.getTodos = function(widgetRef, apiRequestParams, todoThreadsWrapperDiv)
		{
			var status = ''
			status     = apiRequestParams["status"];
			EkstepEditorAPI.jQuery(widgetRef).hybridtodo({apiRequestParams:apiRequestParams, action:'getTodosAndComments', callback: function(result){
					ctrl.renderHybridTodos(result, status, todoThreadsWrapperDiv);
				}
			});
		}

		// Function to initilize widget when creator click on resolve button
		ctrl.updateStatus = function(ref)
		{
			var widgetRef, status, id, todotext, context;

			// Status C = resolved todo
			status = 'C';

			// Id = joomla todo id. Todotext = todo title. content = joomla subtype
			id       = EkstepEditorAPI.jQuery(ref).attr("data-jlike-id");
			todotext = EkstepEditorAPI.jQuery(ref).attr("data-ek-todomsg");
			context  = EkstepEditorAPI.jQuery(ref).attr("data-jlike-context");

			widgetRef = EkstepEditorAPI.jQuery("#todoThreadId"+ parseInt(id));

			/**Update todo status**/
			setTimeout(function(){
				ctrl.save(widgetRef, status, id, todotext, context);
			}, 300);

			jQuery("#" + id).prop("disabled", true);
			jQuery("#todoWrapper" + id).hide(1000);
		},

		ctrl.save = function(widgetRef, status, id, todotext, context)
		{
			var apiPostParams = {};

			// Joomla id
			apiPostParams['id'] = id;

			// Todo title
			apiPostParams["sender_msg"] = todotext;

			// Content url
			apiPostParams["url"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-url");
			apiPostParams["cont_id"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-cont-id");
			apiPostParams["type"] = 'todos'

			// Joomla subtype along with stage Id
			apiPostParams["subtype"] = context
			apiPostParams["client"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-client");
			apiPostParams["content_id"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
			apiPostParams["assigned_by"]= EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
			apiPostParams["assigned_to"]= EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");

			// State 1 = Publish
			apiPostParams["state"] = 1;

			// Status C = complete
			apiPostParams["status"] = "C";

			EkstepEditorAPI.jQuery(widgetRef).hybridtodo({apiPostParams:apiPostParams,action: 'createTodo'});
		}

		ctrl.renderHybridTodos = function(result, status, todoThreadsWrapperDiv)
		{
			/**
			 * disabledAttr = If todo is resolved then disabled resolve todo button
			 * readOnly     = Hide comment box if todo is already resolved
			 * buttonName   = Resolve/Resolved based on todo status
			 **/

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
							widget += '<label class="left floated" style="padding-left:12px">';
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

					// Append widget data
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
				// Show empty message in case either APIs return empty data or API may fails
				var emptyMessage = '';

				// Clear html
				jQuery(todoThreadsWrapperDiv).html('');

				// Prepare empty message based on status = Unresolved/resolved
				emptyMessage = todoThreadsWrapperDiv === '#pageLevelTodos' ? 'No Todo' : 'No issue(s)';

				// Append empty message
				EkstepEditorAPI.jQuery(todoThreadsWrapperDiv).html(emptyMessage);
			}
		}
    }
});
//# sourceURL=todo.js
