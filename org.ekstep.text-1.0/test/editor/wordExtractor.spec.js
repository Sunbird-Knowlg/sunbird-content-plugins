describe("WordExtractor", function() {

	it("should should call getCurrentObject",function(){
		spyOn(org.ekstep.contenteditor.api, "getCurrentObject");
		var wordExtractor = new org.ekstep.plugins.text.WordExtractor();
		
		wordExtractor.extractText();
		
		expect(org.ekstep.contenteditor.api.getCurrentObject).toHaveBeenCalled();

	});

	it("should get text from the selected text plugin",function(){
		
		var obj = {manifest:{id:"org.ekstep.text"},editorObj:{text:"hello world!"}};
		spyOn(org.ekstep.contenteditor.api, "getCurrentObject").and.returnValue(obj);
		var wordExtractor = new org.ekstep.plugins.text.WordExtractor();
		
		var val = wordExtractor.extractText();
		
		expect(val).toBe("hello world!");

	});

	it("should retun undefined if the selected plugin isn't text",function(){
		
		var obj = {manifest:{id:"org.ekstep.shape"}};

		spyOn(org.ekstep.contenteditor.api, "getCurrentObject").and.returnValue(obj);
		var wordExtractor = new org.ekstep.plugins.text.WordExtractor();
		
		var val = wordExtractor.extractText();
		
		expect(val).toBe(undefined);

	});

	it("should retun undefined if nothing is selected",function(){
		
		var obj = false;

		spyOn(org.ekstep.contenteditor.api, "getCurrentObject").and.returnValue(obj);
		var wordExtractor = new org.ekstep.plugins.text.WordExtractor();
		
		var val = wordExtractor.extractText();
		
		expect(val).toBe(undefined);

	});
	
	

});