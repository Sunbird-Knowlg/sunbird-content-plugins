(function( $ ) {

$.fn.jltodos = function(options){
	var defaults = {action:'',
		tempRender:[
		"<div class='item' data-jlike-todoid='<%= id %>'>",
				"<i class='large info circle icon image'></i>",
				"<div class='content'>",
					"<div class='header'><%= sender_msg %></div>",
					"<div class='description'>Reported on <%= formatDate(created) %></div>",
				"</div>",
		"</div>"],
		no_data_msg:"No record found."
	};

	var templates = {};

	// Merge options into defaults and also override default options if already exist in default
	 $.extend(defaults, options);

	templates.todo = "";

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
		//~ jQuery.ajax({
			//~ url: "localhost/Community-Portal-Joomla-Gourav/src/index.php?option=com_api&app=jlike&resource=init&format=raw",
			//~ headers: {
				//~ 'x-auth':'session'
			//~ },
			//~ type: "POST",
			//~ data: obj,
			//~ async:false,
			//~ success:function(result){
				//~ if (result.success == true)
				//~ {
					//~ element.attr("data-jlike-contentid", result.data.content_id);
					//~ obj['content_id'] = result.data.content_id;
					//~ //renderTodos(obj, element);
				//~ }
			//~ },
			//~ error:function(){
				//~ console.log("Error");
			//~ }
		//~ });
	}

	function createTodo(obj){
		//~ jQuery.ajax({
			//~ url: 'localhost/Community-Portal-Joomla-Gourav/src/index.php?option=com_api&app=jlike&resource=todos&format=raw',
			//~ headers: {
				//~ 'x-auth':'session'
			//~ },
			//~ data:obj,
			//~ type: 'POST',
			//~ success: function(data) {
				//~ if(data.success == true){
					//~ //jQuery('input[name="'+name+'"]').each(function(){
						//~ //jQuery(this).attr("data-jlike-id", data.id);
					//~ //});
				//~ }
			//~ },
			//~ error: function(err) {
				//~ console.log(err);
			//~ }
		//~ });
	}

	 function deleteTodo(id){
		//~ jQuery.ajax({
			//~ url:'localhost/Community-Portal-Joomla-Gourav/src/index.php?option=com_api&app=jlike&resource=todos&format=raw&id=' + id,
			//~ headers: {
				//~ 'x-auth':'session'
			//~ },
			//~ type: 'DELETE',
			//~ success: function(data) {
				//~ tdl.renderAllTasks();
			//~ },
		  //~ error: function(err) {
			//~ console.log(err);
			//~ }
		//~ });
	}

	function renderTodos(obj, addhtmlto)
	{
		//~ jQuery.ajax({
			//~ url: 'localhost/Community-Portal-Joomla-Gourav/src/index.php?option=com_api&app=jlike&resource=todos&format=raw',
			//~ headers: {
				//~ 'x-auth':'session'
			//~ },
			//~ type: 'GET',
			//~ data:obj,
			//~ async:false,
			//~ beforeSend: function ()
			//~ {
				//jQuery('#renderTodos').button('loading');
			//~ },
			//~ success: function(result1)
			//~ {
				result = {"data":{"result":[{"id":"145","asset_id":"407","ordering":"144","state":"1","checked_out":"0","checked_out_time":"0000-00-00 00:00:00","created_by":"80","sender_msg":"Harmful or dangerous content","created":"2016-12-13 16:12:59","content_id":"3627","created_date":"0000-00-00 00:00:00","start_date":"0000-00-00 00:00:00","due_date":"0000-00-00 00:00:00","status":"C","title":"","type":"todos","context":"reviewer","system_generated":"1","parent_id":"0","list_id":"0","modified_date":"0000-00-00 00:00:00","modified_by":"0","can_override":"0","overriden":"0","params":"","todo_list_id":"0","ideal_time":"0","content_title":"tesst","content_url":"index.php?option=com_ekcontent&view=content&id=3103","editor":null,"status_title":"COM_JLIKE_COMPLETED","assigned_by":{"id":"80","name":"Madhuchandra R","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/80-madhuchandra-r","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"},"assigned_to":{"id":"381","name":"gourav_test","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/381-gourav-test","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"}},{"id":"145","asset_id":"407","ordering":"144","state":"1","checked_out":"0","checked_out_time":"0000-00-00 00:00:00","created_by":"80","sender_msg":"test","created":"2016-12-13 16:12:59","content_id":"3627","created_date":"0000-00-00 00:00:00","start_date":"0000-00-00 00:00:00","due_date":"0000-00-00 00:00:00","status":"C","title":"","type":"todos","context":"reviewer","system_generated":"1","parent_id":"0","list_id":"0","modified_date":"0000-00-00 00:00:00","modified_by":"0","can_override":"0","overriden":"0","params":"","todo_list_id":"0","ideal_time":"0","content_title":"tesst","content_url":"index.php?option=com_ekcontent&view=content&id=3103","editor":null,"status_title":"COM_JLIKE_COMPLETED","assigned_by":{"id":"80","name":"Madhuchandra R","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/80-madhuchandra-r","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"},"assigned_to":{"id":"381","name":"gourav_test","profile_link":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/index.php\/my-profile\/381-gourav-test","avatar":"http:\/\/localhost\/Community-Portal-Joomla-Gourav\/src\/media\/com_easysocial\/defaults\/avatars\/user\/medium.png"}}],"total":"2"},"success":true};
				var markup = null;

				if (result.success == true)
				{
					var rows = result['data']['result'];

					markup = "";

					if (rows != undefined)
					{
						var compiled = _.template(templates.todo);
						rows.forEach(function(item, idx, array){
							markup += compiled(item);
						});
					}
				}

				if (markup == null)
				{
					jQuery(element).html(defaults.no_data_msg);
				}
				else
				{
					jQuery(element).html(markup);
				}
			//~ },
			//~ error: function(err) {
				//~ console.log(err);
			//~ }
		//~ });
	}
}
})( jQuery );

// @Hack/ Remove this hack
function formatDate(dateString)
{
	var rightNow = new Date();
	var then = new Date(dateString);

	var diff = rightNow - then;

	var second = 1000,
	minute = second * 60,
	hour = minute * 60,
	day = hour * 24,
	week = day * 7;

	if (isNaN(diff) || diff < 0) {
		return ""; // return blank string if unknown
	}

	if (diff < second * 2) {
		// within 2 seconds
		return "right now";
	}

	if (diff < minute) {
		return Math.floor(diff / second) + " seconds ago";
	}

	if (diff < minute * 2) {
		return "about 1 minute ago";
	}

	if (diff < hour) {
		return Math.floor(diff / minute) + " minutes ago";
	}

	if (diff < hour * 2) {
		return "about 1 hour ago";
	}

	if (diff < day) {             return  Math.floor(diff / hour) + " hours ago";         }           if (diff > day && diff < day * 2) {
		return "yesterday";
	}

	if (diff < day * 365) {
		return Math.floor(diff / day) + " days ago";
	}

	else {
		return "over a year ago";
	}
}
