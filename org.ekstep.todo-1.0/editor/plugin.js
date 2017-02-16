
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

		/**Function to initialize and prepare API request**/
		ctrl.initializeTodoWidget = function ()
		{
			/*Object to post request to APIs*/
			var obj = {};
			var getTodoParams = {};
			var widgetRef;

			if (!EkstepEditorAPI._.isUndefined(window.context))
			{
				if(!EkstepEditorAPI._.isUndefined(window.context.content_id) && window.context.content_id != "")
				{
					// Prepare APIs request params
					// Content URL
					getTodoParams["url"] = "index.php?option=com_ekcontent&view=content&id="+window.context.id;
					getTodoParams["type"] = "todos";

					// Update subtype based on selected stage id
					getTodoParams["subtype"] = "reviewer#"+data.stageId;
					getTodoParams["client"] = "content.jlike_ekcontent";

					// Joomla content id
					getTodoParams["cont_id"] = window.context.id;

					// Content titte
					getTodoParams["title"] = EkstepEditorAPI.getService('content').getContentMeta(window.context.content_id).contentMeta.name;

					// Div id to append todo html
					widgetRef = EkstepEditorAPI.jQuery("#pageLevelTodos");

					/*Update widget attribute as per stage*/
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-url', getTodoParams["url"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-status', getTodoParams["status"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-type', getTodoParams["type"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-subtype', getTodoParams["subtype"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-client', getTodoParams["client"]);
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-cont-id', getTodoParams["cont_id"] );
					EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-title', getTodoParams["title"]);

					// Joomla JLike content id
					getTodoParams["content_id"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");

					// Todo - assigned by
					getTodoParams["assigned_by"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");

					// Todo - assigned to
					getTodoParams["assigned_to"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");

					// State = publish/unpublish
					getTodoParams["state"] = 1;

					// Stats 'I' = Incomplete todo
					getTodoParams["status"] = "I";

					// Call gettodo function to show unresolved todo
					ctrl.getTodos(widgetRef, getTodoParams, "#pageLevelTodos");

					// Call gettodo function to show resolved todo
					getTodoParams["status"] = "C";
					ctrl.getTodos(widgetRef, getTodoParams, "#pageLevelResolvedTodos");
				}
			}
		}

		/*Finction to get Stage wise todo data*/
		ctrl.getTodos = function(widgetRef, getTodoParams, todoThreadsWrapperDiv)
		{
			var status = ''
			status     = getTodoParams["status"];

			// hybridtodo({}) is jQuery plugin to make APIs call
			EkstepEditorAPI.jQuery(widgetRef).hybridtodo({getTodoParams:getTodoParams, action:'getTodosAndComments', callback: function(result){
					ctrl.renderHybridTodos(result, status, todoThreadsWrapperDiv);
				}
			});
		}

		/*Function to initilize widget when creator click on resolve button*/
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

		// Function to update todo status
		ctrl.save = function(widgetRef, status, id, todotext, context)
		{
			// Prepare APIs request to post widget data
			var resolveTodoParams = {};

			// Joomla id
			resolveTodoParams['id'] = id;

			// Todo title
			resolveTodoParams["sender_msg"] = todotext;

			// Content url
			resolveTodoParams["url"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-url");
			resolveTodoParams["cont_id"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-cont-id");
			resolveTodoParams["type"] = 'todos'

			// Joomla subtype along with stage Id
			resolveTodoParams["subtype"] = context
			resolveTodoParams["client"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-client");
			resolveTodoParams["content_id"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
			resolveTodoParams["assigned_by"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
			resolveTodoParams["assigned_to"] = EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");

			// State 1 = Publish
			resolveTodoParams["state"] = 1;

			// Status C = complete
			resolveTodoParams["status"] = status;

			EkstepEditorAPI.jQuery(widgetRef).hybridtodo({resolveTodoParams:resolveTodoParams,action: 'createTodo'});
		}

		// Function to render widget html
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
				// Initially clear html
				EkstepEditorAPI.jQuery(todoThreadsWrapperDiv).html('');

				// Loop to interate todo and comment data
				for (var i = 0; i < result.data.result.length; i++)
				{
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
							widget += 'data-jlike-limitstart="0" ';
							widget += 'data-jlike-limit="2" ';
							if(readOnly) widget += 'data-jlike-readonly="'+readOnly+'" ';
							widget += 'data-jlike-contentid="'+result.data.result[i].content_id+'" ';
							widget += 'data-jlike-ordering="annotation_date" >';
						widget += '</div>';
					widget += '</div>';

					// Iterate comment array data
					for (var c = 0; c < result.data.result[i].comments.length; c++)
					{
						// User name
						result.data.result[i].comments[c].user_name = result.data.result[i].comments[c].user.name;
						result.data.result[i].comments[c].user_id = result.data.result[i].comments[c].user.id;

						// User avatar
						result.data.result[i].comments[c].profile_picture_url = result.data.result[i].comments[c].user.avatar;

						// user profile link
						result.data.result[i].comments[c].profile_url = result.data.result[i].comments[c].user.profile_link;

						// Date
						result.data.result[i].comments[c].created =  moment(result.data.result[i].comments[c].annotation_date).format('HH:mm, MMM Do YYYY');
					}

					// Append widget data
					result.data.result[i].status == "I" ? EkstepEditorAPI.jQuery(todoThreadsWrapperDiv).append(widget) : EkstepEditorAPI.jQuery(todoThreadsWrapperDiv).append(widget);

					// Call plugin
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
