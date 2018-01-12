/**
 *
 * Question Unit plugin to render a mcqlongtext question
 * @class org.ekstep.questionunit.mcqlongtext
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.contentrenderer.questionUnitPlugin.extend({
    _type: 'org.ekstep.questionunit.mcqlongtext',
    _isContainer: true,
    _render: true,
    _selectedanswere:undefined,
    initPlugin: function (data) {
        //TODO: Implement logic and define interfaces from org.ekstep.questionunit

        //TODO: Remove placeholder images from assets (no.png and yes.png)
    },
    evaluate: function (data) {
        console.log(data);

        EkstepRendererAPI.dispatchEvent(this._manifest.id + ":evaluate");
        // var evaluator = new mcqEvaluator();
        // return evaluator.evaluate(data);
    }
});
//# sourceURL=questionunitMCQlongtextPlugin.js