/**
 * The base class for content provider repo  plugins to inherit.
 *
 * @class org.ekstep.collectioneditor.contentProviderRepo
 * @author G S Bajaj <gourishanker.bajaj@tarento.com>
 */
org.ekstep.collectioneditor.contentProviderRepo = Class.extend({
	id: undefined,
	label: undefined,

	init: function() {

	},

	getTemplate: function() {
		throw "cannot invoke abstract method"
	},

	// getLessons: function($filters) {

	// }
});