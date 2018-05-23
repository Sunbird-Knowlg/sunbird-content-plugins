/**
 *
 * Question Unit plugin to render a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
 org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mtf',
  _isContainer: true,
  _render: true,
  _selectedanswere: undefined,
  initPlugin: function(data) {

  },
  initialize: function() {
    this._template = QS_MTFTemplate;
    this._super();
  },
  postShow: function(currentquesObj) {
    sortable('.mtf-lhs', {
      forcePlaceholderSize: true,
      acceptFrom: '.mtf-rhs',
    });
    sortable('.mtf-rhs', {
      forcePlaceholderSize: true,
      acceptFrom: '.mtf-lhs',
      customDragImage: function(draggedElement, elementOffset, event) {
        draggedElement.style.border = "1px solid black";
        return {
          element: draggedElement,
          posX: event.pageX - elementOffset.left,
          posY: event.pageY - elementOffset.top
        }
      }
    });
  },
  evaluate: function(data) {
    EkstepRendererAPI.dispatchEvent(this._manifest.id + ":evaluate");
  }
});
//# sourceURL=questionunitMCQPlugin.js