var contentBody = JSON.parse('{"theme":{"stage":{"manifest":{"media":[]},"x":0,"y":0,"w":100,"h":100,"id":"stage1","rotate":""},"manifest":{"media":[]},"plugin-manifest":"","compatibilityVersion":2,"id":"theme","version":1,"startStage":"stage1"}}');
function setUpRenderer() {
   window.Renderer = {};
   jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
   var canvas = "<div ng-app='genie-canvas' id='gameArea'><div id='overlay'></div><canvas id='gameCanvas' style='top: 10px;left: 10px;position: absolute;'></canvas></div>";
   var body = document.getElementsByTagName("body")[0];
   var div = document.createElement('div');
   div.innerHTML = canvas;
   body.appendChild(div.children[0]);
   var testContext = {
      uid: 'unittest',
      sid: 'testsession',
      contentId: 'do_212510946870812672120616'
   }
   var defaultPlugins = [{"id":"org.ekstep.launcher","ver":1,"type":"plugin"},{"id":"org.ekstep.repo","ver":1,"type":"plugin"},{"id":"org.ekstep.telemetrysync","ver":1,"type":"plugin"},{"id":"org.ekstep.toaster","ver":1,"type":"plugin"},{"id":"org.ekstep.alert","ver":1,"type":"plugin"},{"id":"org.ekstep.userswitcher","ver":1,"type":"plugin"}];
   var testConfig = {
      dispatcher: 'console',
      pluginRepo: 'http://localhost:9876/base',
      corePluginsPackaged: true,
   }
   
   setGlobalConfig({ 'context': testContext, 'config': testConfig });
   window.isMobile = window.cordova ? true : false;
   window.content = JSON.parse('{"baseDir":"/base/test/testContent", "path":"/base/test/testContent", "identifier": "org.ekstep.item.sample", "mimeType": "application/vnd.ekstep.ecml-archive", "name": "Content Preview ", "author": "EkStep", "localData": {"name": "Content Preview ", "loadingMessage": "Without requirements or design, programming is the art of adding bugs to an empty text file. ...", "identifier": "org.ekstep.item.sample" }, "pkgVersion": 1, "isAvailable": true}');
   window.content.body = JSON.parse(JSON.stringify(contentBody));
   org.ekstep.service.init();
   AppConfig.corePluginspath = 'http://localhost:9876/base/coreplugins';
   
   org.ekstep.contentrenderer.initPlugins('', AppConfig.corePluginspath);
      var r = EkstepRendererAPI.getGlobalConfig();
      org.ekstep.pluginframework.config.pluginRepo = 'http://localhost:9876/base/coreplugins';
      org.ekstep.contentrenderer.loadPlugins(r.defaultPlugins, [], function() {
      
         org.ekstep.pluginframework.config.pluginRepo = 'http://localhost:9876/base';
          GlobalContext.game.id = packageName;
          GlobalContext.game.ver = version;
          startTelemetry(GlobalContext.game.id, GlobalContext.game.ver);
          this.contentMetaData = window.content;
          this.gdata = content.body;
          content.body.theme.canvasId = 'gameCanvas'
          Renderer.divIds = {'canvas': 'ganmeCanvas', 'gameArea': 'gameArea'};
          Renderer.theme = new ThemePlugin(content.body.theme);
          Renderer.theme.baseDir = globalConfig.basepath || content.path;
          Renderer.theme.start(content.path.replace('file:///', '') + "/assets/");
          createjs.Ticker.addEventListener("tick", function () {
             if (Renderer.update && (typeof Renderer.theme !== 'undefined')) {
                Renderer.theme.update();
                Renderer.update = false;
             } else if (Renderer.theme) {
                Renderer.theme.tick();
             }
          });
      
      
         });
  
};

function startRenderer(data) {
   window.content.body = JSON.parse(JSON.stringify(data));
   Renderer.start("", "gameCanvas", {}, data);
}

setUpRenderer();

