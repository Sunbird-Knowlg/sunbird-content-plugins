(function( $ ) {

$.fn.jltodos = function(options){
	var defaults = {action:'',
		tempRender:[
		"<div class='item' data-jlike-todoid='<%= id %>'>",
				"<i class='large info circle icon image'></i>",
				"<div class='content'>",
					"<div class=''><%= sender_msg %></div>",
					"<div><small style='opacity:.5;'>Resolved on <%= moment(modified_date).fromNow() %></small></div>",
				"</div>",
		"</div>"],
		no_data_msg:"No record found.",
		outTempRender: null
	};

	var templates = {};
	var outTempRender = '';

	// Merge options into defaults and also override default options if already exist in default
	$.extend(defaults, options);

	templates.todo = "";

	outTempRender = defaults.outTempRender;
	if (defaults.tempRender != "")
	{
		templates.todo = (defaults.tempRender).join("");
	}

	if (defaults.action == "createTodo")
	{
		createTodo(defaults.obj);
	}
	else if (defaults.action == "deleteTodo")
	{
		deleteTodo(defaults.id);
	}
	else if (defaults.action == "renderTodos")
	{
		var element = $(this);
		renderTodos(defaults.obj, element);
	}
	else if (defaults.action == "init")
	{
		var element = $(this);
		init(defaults.obj, element);
	}
	else
	{
		return this.each(function(){
			var element = $(this);
			var dataSuccess = [];
			var obj= {};

			obj["url"]      = element.attr("data-jlike-url");
			obj["status"]   = element.attr("data-jlike-status");
			obj["type"]     = element.attr("data-jlike-type");
			obj["subtype"]  = element.attr("data-jlike-subtype");
			obj["client"]   = element.attr("data-jlike-client");
			obj["cont_id"]  = element.attr("data-jlike-cont-id");
			obj["title"]    = element.attr("data-jlike-title");
			var ordering    = element.attr("data-jlike-ordering");
			var direction   = element.attr("data-jlike-direction");

			var limit       = parseInt(element.attr("data-jlike-limit"), 10);
			var limitstart  = parseInt(element.attr("data-jlike-limitstart"), 10);
			init(obj, element);
		});
	}

	function init(obj, element)
	{
		EkstepEditorAPI.jQuery.ajax({
			url: "index.php?option=com_api&app=jlike&resource=init&format=raw",
			headers: {
				'x-auth':'session'
			},
			type: "POST",
			data: obj,
			async:false,
			success:function(result){
				if (result.success == true)
				{
					element.attr("data-jlike-contentid", result.data.content_id);
					obj['content_id'] = result.data.content_id;
					//renderTodos(obj, element);
				}
			},
			error:function(){
				console.log("Error");
			}
		});
	}

	function createTodo(obj){
		EkstepEditorAPI.jQuery.ajax({
			url: 'index.php?option=com_api&app=jlike&resource=todos&format=raw',
			headers: {
				'x-auth':'session'
			},
			data:obj,
			type: 'POST',
			success: function(data) {
				if(data.success == true){

				}
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	 function deleteTodo(id){
		/*EkstepEditorAPI.jQuery.ajax({
			url:'localhost/Community-Portal-Joomla-Gourav/src/index.php?option=com_api&app=jlike&resource=todos&format=raw&id=' + id,
			headers: {
				'x-auth':'session'
			},
			type: 'DELETE',
			success: function(data) {
				tdl.renderAllTasks();
			},
		  error: function(err) {
			console.log(err);
			}
		});*/
	}

	function renderTodos(obj, addhtmlto)
	{
		EkstepEditorAPI.jQuery.ajax({
			url: 'index.php?option=com_api&app=jlike&resource=todos&format=raw',
			headers: {
				'x-auth':'session'
			},
			type: 'GET',
			data:obj,
			async:false,
			beforeSend: function ()
			{
				//~ //jQuery('#renderTodos').button('loading');
			},
			success: function(result)
			{
				var markup = null;

				if (result.success == true)
				{
					var rows = result['data']['result'];

					markup = "";

					if (rows != undefined)
					{
						var compiled = EkstepEditorAPI._.template(templates.todo);
						rows.forEach(function(item, idx, array){
							markup += compiled(item);
						});
					}
				}

				if (markup == null)
				{
					EkstepEditorAPI.jQuery(element).html(defaults.no_data_msg);
				}
				else
				{
					if (outTempRender != null)
					{
						EkstepEditorAPI.jQuery(element).html(outTempRender);
						EkstepEditorAPI.jQuery('#reportedIssue').html(markup);
					}
					else
					{
						EkstepEditorAPI.jQuery(element).html(markup);
					}
				}
			},
			error: function(err) {
				console.log(err);
			}
		});
	}
}
})( EkstepEditorAPI.jQuery );
