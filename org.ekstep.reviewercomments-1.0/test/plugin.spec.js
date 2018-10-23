describe('Reviewer comments plugin', function () {
    var manifest, pluginInstance;
    beforeAll(function (done) {
        manifest = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.reviewercomments");
        pluginInstance = ecEditor.instantiatePlugin("org.ekstep.reviewercomments");
    });

    it("Should invoke plugin initialize method for the event `stage:select`", function(done) {
        done();
    });
    it("Should call the reviewersComments function from content Service", function() {

    }); 
    
    it("If reviewersComments function returns null display `no comments message`", function() {

    });
    it("If reviewersComments function throws error, display the error message", function() {

    });
});