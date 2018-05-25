org.ekstep.contentrenderer.questionUnitPlugin = Plugin.extend({
  _type: 'org.ekstep.questionUnitPlugin'
});
QSTelemetryLogger = {
  EVENT_TYPES: {
    TOUCH: 'TOUCH',
    RESPONSE: 'RESPONSE',
    ASSESS: 'ASSESS',
    ASSESSEND: 'ASSESSEND'
  },
  _plugin: {},
  _question: {},
  _assessStart: {},
  _qData: {},
  _qConfig: {}
};
QSTelemetryLogger.logEvent = function(type, data) {
  switch (type.toUpperCase()) {
    case 'DEFAULT':
      return true;
  }
};