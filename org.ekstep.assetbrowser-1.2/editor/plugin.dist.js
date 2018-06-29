/*! wavesurfer.js 1.0.58 (Sun, 28 Feb 2016 19:39:50 GMT)
* https://github.com/katspaugh/wavesurfer.js
* @license CC-BY-3.0 */
!function(a,b){"function"==typeof define&&define.amd?define("wavesurfer",[],function(){return a.WaveSurfer=b()}):"object"==typeof exports?module.exports=b():a.WaveSurfer=b()}(this,function(){"use strict";var a={defaultParams:{height:120,waveColor:"#999",progressColor:"#31ADE0",cursorColor:"#333",cursorWidth:1,skipLength:2,minPxPerSec:20,pixelRatio:window.devicePixelRatio||screen.deviceXDPI/screen.logicalXDPI,fillParent:!0,scrollParent:!1,hideScrollbar:!1,normalize:!1,audioContext:null,container:null,dragSelection:!0,loopSelection:!0,audioRate:1,interact:!0,splitChannels:!1,mediaContainer:null,mediaControls:!1,renderer:"Canvas",backend:"WebAudio",mediaType:"audio",autoCenter:!0},init:function(b){if(this.params=a.util.extend({},this.defaultParams,b),this.container="string"==typeof b.container?document.querySelector(this.params.container):this.params.container,!this.container)throw new Error("Container element not found");if(null==this.params.mediaContainer?this.mediaContainer=this.container:"string"==typeof this.params.mediaContainer?this.mediaContainer=document.querySelector(this.params.mediaContainer):this.mediaContainer=this.params.mediaContainer,!this.mediaContainer)throw new Error("Media Container element not found");this.savedVolume=0,this.isMuted=!1,this.tmpEvents=[],this.createDrawer(),this.createBackend()},createDrawer:function(){var b=this;this.drawer=Object.create(a.Drawer[this.params.renderer]),this.drawer.init(this.container,this.params),this.drawer.on("redraw",function(){b.drawBuffer(),b.drawer.progress(b.backend.getPlayedPercents())}),this.drawer.on("click",function(a,c){setTimeout(function(){b.seekTo(c)},0)}),this.drawer.on("scroll",function(a){b.fireEvent("scroll",a)})},createBackend:function(){var b=this;this.backend&&this.backend.destroy(),"AudioElement"==this.params.backend&&(this.params.backend="MediaElement"),"WebAudio"!=this.params.backend||a.WebAudio.supportsWebAudio()||(this.params.backend="MediaElement"),this.backend=Object.create(a[this.params.backend]),this.backend.init(this.params),this.backend.on("finish",function(){b.fireEvent("finish")}),this.backend.on("play",function(){b.fireEvent("play")}),this.backend.on("pause",function(){b.fireEvent("pause")}),this.backend.on("audioprocess",function(a){b.fireEvent("audioprocess",a)})},startAnimationLoop:function(){var a=this,b=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,c=function(){if(!a.backend.isPaused()){var d=a.backend.getPlayedPercents();a.drawer.progress(d),a.fireEvent("audioprocess",a.getCurrentTime()),b(c)}};c()},getDuration:function(){return this.backend.getDuration()},getCurrentTime:function(){return this.backend.getCurrentTime()},play:function(a,b){this.backend.play(a,b),this.startAnimationLoop()},pause:function(){this.backend.pause()},playPause:function(){this.backend.isPaused()?this.play():this.pause()},isPlaying:function(){return!this.backend.isPaused()},skipBackward:function(a){this.skip(-a||-this.params.skipLength)},skipForward:function(a){this.skip(a||this.params.skipLength)},skip:function(a){var b=this.getCurrentTime()||0,c=this.getDuration()||1;b=Math.max(0,Math.min(c,b+(a||0))),this.seekAndCenter(b/c)},seekAndCenter:function(a){this.seekTo(a),this.drawer.recenter(a)},seekTo:function(a){var b=this.backend.isPaused(),c=this.params.scrollParent;b&&(this.params.scrollParent=!1),this.backend.seekTo(a*this.getDuration()),this.drawer.progress(this.backend.getPlayedPercents()),b||(this.backend.pause(),this.backend.play()),this.params.scrollParent=c,this.fireEvent("seek",a)},stop:function(){this.pause(),this.seekTo(0),this.drawer.progress(0)},setVolume:function(a){this.backend.setVolume(a)},setPlaybackRate:function(a){this.backend.setPlaybackRate(a)},toggleMute:function(){this.isMuted?(this.backend.setVolume(this.savedVolume),this.isMuted=!1):(this.savedVolume=this.backend.getVolume(),this.backend.setVolume(0),this.isMuted=!0)},toggleScroll:function(){this.params.scrollParent=!this.params.scrollParent,this.drawBuffer()},toggleInteraction:function(){this.params.interact=!this.params.interact},drawBuffer:function(){var a=Math.round(this.getDuration()*this.params.minPxPerSec*this.params.pixelRatio),b=this.drawer.getWidth(),c=a;this.params.fillParent&&(!this.params.scrollParent||b>a)&&(c=b);var d=this.backend.getPeaks(c);this.drawer.drawPeaks(d,c),this.fireEvent("redraw",d,c)},zoom:function(a){this.params.minPxPerSec=a,this.params.scrollParent=!0,this.drawBuffer(),this.seekAndCenter(this.getCurrentTime()/this.getDuration()),this.fireEvent("zoom",a)},loadArrayBuffer:function(a){this.decodeArrayBuffer(a,function(a){this.loadDecodedBuffer(a)}.bind(this))},loadDecodedBuffer:function(a){this.backend.load(a),this.drawBuffer(),this.fireEvent("ready")},loadBlob:function(a){var b=this,c=new FileReader;c.addEventListener("progress",function(a){b.onProgress(a)}),c.addEventListener("load",function(a){b.loadArrayBuffer(a.target.result)}),c.addEventListener("error",function(){b.fireEvent("error","Error reading file")}),c.readAsArrayBuffer(a),this.empty()},load:function(a,b){switch(this.params.backend){case"WebAudio":return this.loadBuffer(a);case"MediaElement":return this.loadMediaElement(a,b)}},loadBuffer:function(a){return this.empty(),this.getArrayBuffer(a,this.loadArrayBuffer.bind(this))},loadMediaElement:function(a,b){this.empty(),this.backend.load(a,this.mediaContainer,b),this.tmpEvents.push(this.backend.once("canplay",function(){this.drawBuffer(),this.fireEvent("ready")}.bind(this)),this.backend.once("error",function(a){this.fireEvent("error",a)}.bind(this))),!b&&this.backend.supportsWebAudio()&&this.getArrayBuffer(a,function(a){this.decodeArrayBuffer(a,function(a){this.backend.buffer=a,this.drawBuffer()}.bind(this))}.bind(this))},decodeArrayBuffer:function(a,b){this.backend.decodeArrayBuffer(a,this.fireEvent.bind(this,"decoded"),this.fireEvent.bind(this,"error","Error decoding audiobuffer")),this.tmpEvents.push(this.once("decoded",b))},getArrayBuffer:function(b,c){var d=this,e=a.util.ajax({url:b,responseType:"arraybuffer"});return this.tmpEvents.push(e.on("progress",function(a){d.onProgress(a)}),e.on("success",c),e.on("error",function(a){d.fireEvent("error","XHR error: "+a.target.statusText)})),e},onProgress:function(a){if(a.lengthComputable)var b=a.loaded/a.total;else b=a.loaded/(a.loaded+1e6);this.fireEvent("loading",Math.round(100*b),a.target)},exportPCM:function(a,b,c){a=a||1024,b=b||1e4,c=c||!1;var d=this.backend.getPeaks(a,b),e=[].map.call(d,function(a){return Math.round(a*b)/b}),f=JSON.stringify(e);return c||window.open("data:application/json;charset=utf-8,"+encodeURIComponent(f)),f},clearTmpEvents:function(){this.tmpEvents.forEach(function(a){a.un()})},empty:function(){this.backend.isPaused()||(this.stop(),this.backend.disconnectSource()),this.clearTmpEvents(),this.drawer.progress(0),this.drawer.setWidth(0),this.drawer.drawPeaks({length:this.drawer.getWidth()},0)},destroy:function(){this.fireEvent("destroy"),this.clearTmpEvents(),this.unAll(),this.backend.destroy(),this.drawer.destroy()}};return a.create=function(b){var c=Object.create(a);return c.init(b),c},a.util={extend:function(a){var b=Array.prototype.slice.call(arguments,1);return b.forEach(function(b){Object.keys(b).forEach(function(c){a[c]=b[c]})}),a},getId:function(){return"wavesurfer_"+Math.random().toString(32).substring(2)},ajax:function(b){var c=Object.create(a.Observer),d=new XMLHttpRequest,e=!1;return d.open(b.method||"GET",b.url,!0),d.responseType=b.responseType||"json",d.addEventListener("progress",function(a){c.fireEvent("progress",a),a.lengthComputable&&a.loaded==a.total&&(e=!0)}),d.addEventListener("load",function(a){e||c.fireEvent("progress",a),c.fireEvent("load",a),200==d.status||206==d.status?c.fireEvent("success",d.response,a):c.fireEvent("error",a)}),d.addEventListener("error",function(a){c.fireEvent("error",a)}),d.send(),c.xhr=d,c}},a.Observer={on:function(a,b){this.handlers||(this.handlers={});var c=this.handlers[a];return c||(c=this.handlers[a]=[]),c.push(b),{name:a,callback:b,un:this.un.bind(this,a,b)}},un:function(a,b){if(this.handlers){var c=this.handlers[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]==b&&c.splice(d,1);else c.length=0}},unAll:function(){this.handlers=null},once:function(a,b){var c=this,d=function(){b.apply(this,arguments),setTimeout(function(){c.un(a,d)},0)};return this.on(a,d)},fireEvent:function(a){if(this.handlers){var b=this.handlers[a],c=Array.prototype.slice.call(arguments,1);b&&b.forEach(function(a){a.apply(null,c)})}}},a.util.extend(a,a.Observer),a.WebAudio={scriptBufferSize:256,PLAYING_STATE:0,PAUSED_STATE:1,FINISHED_STATE:2,supportsWebAudio:function(){return!(!window.AudioContext&&!window.webkitAudioContext)},getAudioContext:function(){return a.WebAudio.audioContext||(a.WebAudio.audioContext=new(window.AudioContext||window.webkitAudioContext)),a.WebAudio.audioContext},getOfflineAudioContext:function(b){return a.WebAudio.offlineAudioContext||(a.WebAudio.offlineAudioContext=new(window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,2,b)),a.WebAudio.offlineAudioContext},init:function(b){this.params=b,this.ac=b.audioContext||this.getAudioContext(),this.lastPlay=this.ac.currentTime,this.startPosition=0,this.scheduledPause=null,this.states=[Object.create(a.WebAudio.state.playing),Object.create(a.WebAudio.state.paused),Object.create(a.WebAudio.state.finished)],this.createVolumeNode(),this.createScriptNode(),this.createAnalyserNode(),this.setState(this.PAUSED_STATE),this.setPlaybackRate(this.params.audioRate)},disconnectFilters:function(){this.filters&&(this.filters.forEach(function(a){a&&a.disconnect()}),this.filters=null,this.analyser.connect(this.gainNode))},setState:function(a){this.state!==this.states[a]&&(this.state=this.states[a],this.state.init.call(this))},setFilter:function(){this.setFilters([].slice.call(arguments))},setFilters:function(a){this.disconnectFilters(),a&&a.length&&(this.filters=a,this.analyser.disconnect(),a.reduce(function(a,b){return a.connect(b),b},this.analyser).connect(this.gainNode))},createScriptNode:function(){this.ac.createScriptProcessor?this.scriptNode=this.ac.createScriptProcessor(this.scriptBufferSize):this.scriptNode=this.ac.createJavaScriptNode(this.scriptBufferSize),this.scriptNode.connect(this.ac.destination)},addOnAudioProcess:function(){var a=this;this.scriptNode.onaudioprocess=function(){var b=a.getCurrentTime();b>=a.getDuration()?(a.setState(a.FINISHED_STATE),a.fireEvent("pause")):b>=a.scheduledPause?(a.setState(a.PAUSED_STATE),a.fireEvent("pause")):a.state===a.states[a.PLAYING_STATE]&&a.fireEvent("audioprocess",b)}},removeOnAudioProcess:function(){this.scriptNode.onaudioprocess=null},createAnalyserNode:function(){this.analyser=this.ac.createAnalyser(),this.analyser.connect(this.gainNode)},createVolumeNode:function(){this.ac.createGain?this.gainNode=this.ac.createGain():this.gainNode=this.ac.createGainNode(),this.gainNode.connect(this.ac.destination)},setVolume:function(a){this.gainNode.gain.value=a},getVolume:function(){return this.gainNode.gain.value},decodeArrayBuffer:function(a,b,c){this.offlineAc||(this.offlineAc=this.getOfflineAudioContext(this.ac?this.ac.sampleRate:44100)),this.offlineAc.decodeAudioData(a,function(a){b(a)}.bind(this),c)},getPeaks:function(a){for(var b=this.buffer.length/a,c=~~(b/10)||1,d=this.buffer.numberOfChannels,e=[],f=[],g=0;d>g;g++)for(var h=e[g]=[],i=this.buffer.getChannelData(g),j=0;a>j;j++){for(var k=~~(j*b),l=~~(k+b),m=i[0],n=i[0],o=k;l>o;o+=c){var p=i[o];p>n&&(n=p),m>p&&(m=p)}h[2*j]=n,h[2*j+1]=m,(0==g||n>f[2*j])&&(f[2*j]=n),(0==g||m<f[2*j+1])&&(f[2*j+1]=m)}return this.params.splitChannels?e:f},getPlayedPercents:function(){return this.state.getPlayedPercents.call(this)},disconnectSource:function(){this.source&&this.source.disconnect()},destroy:function(){this.isPaused()||this.pause(),this.unAll(),this.buffer=null,this.disconnectFilters(),this.disconnectSource(),this.gainNode.disconnect(),this.scriptNode.disconnect(),this.analyser.disconnect()},load:function(a){this.startPosition=0,this.lastPlay=this.ac.currentTime,this.buffer=a,this.createSource()},createSource:function(){this.disconnectSource(),this.source=this.ac.createBufferSource(),this.source.start=this.source.start||this.source.noteGrainOn,this.source.stop=this.source.stop||this.source.noteOff,this.source.playbackRate.value=this.playbackRate,this.source.buffer=this.buffer,this.source.connect(this.analyser)},isPaused:function(){return this.state!==this.states[this.PLAYING_STATE]},getDuration:function(){return this.buffer?this.buffer.duration:0},seekTo:function(a,b){return this.scheduledPause=null,null==a&&(a=this.getCurrentTime(),a>=this.getDuration()&&(a=0)),null==b&&(b=this.getDuration()),this.startPosition=a,this.lastPlay=this.ac.currentTime,this.state===this.states[this.FINISHED_STATE]&&this.setState(this.PAUSED_STATE),{start:a,end:b}},getPlayedTime:function(){return(this.ac.currentTime-this.lastPlay)*this.playbackRate},play:function(a,b){this.createSource();var c=this.seekTo(a,b);a=c.start,b=c.end,this.scheduledPause=b,this.source.start(0,a,b-a),this.setState(this.PLAYING_STATE),this.fireEvent("play")},pause:function(){this.scheduledPause=null,this.startPosition+=this.getPlayedTime(),this.source&&this.source.stop(0),this.setState(this.PAUSED_STATE),this.fireEvent("pause")},getCurrentTime:function(){return this.state.getCurrentTime.call(this)},setPlaybackRate:function(a){a=a||1,this.isPaused()?this.playbackRate=a:(this.pause(),this.playbackRate=a,this.play())}},a.WebAudio.state={},a.WebAudio.state.playing={init:function(){this.addOnAudioProcess()},getPlayedPercents:function(){var a=this.getDuration();return this.getCurrentTime()/a||0},getCurrentTime:function(){return this.startPosition+this.getPlayedTime()}},a.WebAudio.state.paused={init:function(){this.removeOnAudioProcess()},getPlayedPercents:function(){var a=this.getDuration();return this.getCurrentTime()/a||0},getCurrentTime:function(){return this.startPosition}},a.WebAudio.state.finished={init:function(){this.removeOnAudioProcess(),this.fireEvent("finish")},getPlayedPercents:function(){return 1},getCurrentTime:function(){return this.getDuration()}},a.util.extend(a.WebAudio,a.Observer),a.MediaElement=Object.create(a.WebAudio),a.util.extend(a.MediaElement,{init:function(a){this.params=a,this.media={currentTime:0,duration:0,paused:!0,playbackRate:1,play:function(){},pause:function(){}},this.mediaType=a.mediaType.toLowerCase(),this.elementPosition=a.elementPosition,this.setPlaybackRate(this.params.audioRate)},load:function(a,b,c){var d=this,e=document.createElement(this.mediaType);e.controls=this.params.mediaControls,e.autoplay=this.params.autoplay||!1,e.preload="auto",e.src=a,e.style.width="100%",e.addEventListener("error",function(){d.fireEvent("error","Error loading media element")}),e.addEventListener("canplay",function(){d.fireEvent("canplay")}),e.addEventListener("ended",function(){d.fireEvent("finish")}),e.addEventListener("timeupdate",function(){d.fireEvent("audioprocess",d.getCurrentTime())});var f=b.querySelector(this.mediaType);f&&b.removeChild(f),b.appendChild(e),this.media=e,this.peaks=c,this.onPlayEnd=null,this.buffer=null,this.setPlaybackRate(this.playbackRate)},isPaused:function(){return!this.media||this.media.paused},getDuration:function(){var a=this.media.duration;return a>=1/0&&(a=this.media.seekable.end()),a},getCurrentTime:function(){return this.media&&this.media.currentTime},getPlayedPercents:function(){return this.getCurrentTime()/this.getDuration()||0},setPlaybackRate:function(a){this.playbackRate=a||1,this.media.playbackRate=this.playbackRate},seekTo:function(a){null!=a&&(this.media.currentTime=a),this.clearPlayEnd()},play:function(a,b){this.seekTo(a),this.media.play(),b&&this.setPlayEnd(b),this.fireEvent("play")},pause:function(){this.media&&this.media.pause(),this.clearPlayEnd(),this.fireEvent("pause")},setPlayEnd:function(a){var b=this;this.onPlayEnd=function(c){c>=a&&(b.pause(),b.seekTo(a))},this.on("audioprocess",this.onPlayEnd)},clearPlayEnd:function(){this.onPlayEnd&&(this.un("audioprocess",this.onPlayEnd),this.onPlayEnd=null)},getPeaks:function(b){return this.buffer?a.WebAudio.getPeaks.call(this,b):this.peaks||[]},getVolume:function(){return this.media.volume},setVolume:function(a){this.media.volume=a},destroy:function(){this.pause(),this.unAll(),this.media&&this.media.parentNode&&this.media.parentNode.removeChild(this.media),this.media=null}}),a.AudioElement=a.MediaElement,a.Drawer={init:function(a,b){this.container=a,this.params=b,this.width=0,this.height=b.height*this.params.pixelRatio,this.lastPos=0,this.createWrapper(),this.createElements()},createWrapper:function(){this.wrapper=this.container.appendChild(document.createElement("wave")),this.style(this.wrapper,{display:"block",position:"relative",userSelect:"none",webkitUserSelect:"none",height:this.params.height+"px"}),(this.params.fillParent||this.params.scrollParent)&&this.style(this.wrapper,{width:"100%",overflowX:this.params.hideScrollbar?"hidden":"auto",overflowY:"hidden"}),this.setupWrapperEvents()},handleEvent:function(a){a.preventDefault();var b=this.wrapper.getBoundingClientRect();return(a.clientX-b.left+this.wrapper.scrollLeft)/this.wrapper.scrollWidth||0},setupWrapperEvents:function(){var a=this;this.wrapper.addEventListener("click",function(b){var c=a.wrapper.offsetHeight-a.wrapper.clientHeight;if(0!=c){var d=a.wrapper.getBoundingClientRect();if(b.clientY>=d.bottom-c)return}a.params.interact&&a.fireEvent("click",b,a.handleEvent(b))}),this.wrapper.addEventListener("scroll",function(b){a.fireEvent("scroll",b)})},drawPeaks:function(a,b){this.resetScroll(),this.setWidth(b),this.params.barWidth?this.drawBars(a):this.drawWave(a)},style:function(a,b){return Object.keys(b).forEach(function(c){a.style[c]!==b[c]&&(a.style[c]=b[c])}),a},resetScroll:function(){null!==this.wrapper&&(this.wrapper.scrollLeft=0)},recenter:function(a){var b=this.wrapper.scrollWidth*a;this.recenterOnPosition(b,!0)},recenterOnPosition:function(a,b){var c=this.wrapper.scrollLeft,d=~~(this.wrapper.clientWidth/2),e=a-d,f=e-c,g=this.wrapper.scrollWidth-this.wrapper.clientWidth;if(0!=g){if(!b&&f>=-d&&d>f){var h=5;f=Math.max(-h,Math.min(h,f)),e=c+f}e=Math.max(0,Math.min(g,e)),e!=c&&(this.wrapper.scrollLeft=e)}},getWidth:function(){return Math.round(this.container.clientWidth*this.params.pixelRatio)},setWidth:function(a){a!=this.width&&(this.width=a,this.params.fillParent||this.params.scrollParent?this.style(this.wrapper,{width:""}):this.style(this.wrapper,{width:~~(this.width/this.params.pixelRatio)+"px"}),this.updateSize())},setHeight:function(a){a!=this.height&&(this.height=a,this.style(this.wrapper,{height:~~(this.height/this.params.pixelRatio)+"px"}),this.updateSize())},progress:function(a){var b=1/this.params.pixelRatio,c=Math.round(a*this.width)*b;if(c<this.lastPos||c-this.lastPos>=b){if(this.lastPos=c,this.params.scrollParent&&this.params.autoCenter){var d=~~(this.wrapper.scrollWidth*a);this.recenterOnPosition(d)}this.updateProgress(a)}},destroy:function(){this.unAll(),this.wrapper&&(this.container.removeChild(this.wrapper),this.wrapper=null)},createElements:function(){},updateSize:function(){},drawWave:function(a,b){},clearWave:function(){},updateProgress:function(a){}},a.util.extend(a.Drawer,a.Observer),a.Drawer.Canvas=Object.create(a.Drawer),a.util.extend(a.Drawer.Canvas,{createElements:function(){var a=this.wrapper.appendChild(this.style(document.createElement("canvas"),{position:"absolute",zIndex:1,left:0,top:0,bottom:0}));if(this.waveCc=a.getContext("2d"),this.progressWave=this.wrapper.appendChild(this.style(document.createElement("wave"),{position:"absolute",zIndex:2,left:0,top:0,bottom:0,overflow:"hidden",width:"0",display:"none",boxSizing:"border-box",borderRightStyle:"solid",borderRightWidth:this.params.cursorWidth+"px",borderRightColor:this.params.cursorColor})),this.params.waveColor!=this.params.progressColor){var b=this.progressWave.appendChild(document.createElement("canvas"));this.progressCc=b.getContext("2d")}},updateSize:function(){var a=Math.round(this.width/this.params.pixelRatio);this.waveCc.canvas.width=this.width,this.waveCc.canvas.height=this.height,this.style(this.waveCc.canvas,{width:a+"px"}),this.style(this.progressWave,{display:"block"}),this.progressCc&&(this.progressCc.canvas.width=this.width,this.progressCc.canvas.height=this.height,this.style(this.progressCc.canvas,{width:a+"px"})),this.clearWave()},clearWave:function(){this.waveCc.clearRect(0,0,this.width,this.height),this.progressCc&&this.progressCc.clearRect(0,0,this.width,this.height)},drawBars:function(a,b){if(a[0]instanceof Array){var c=a;if(this.params.splitChannels)return this.setHeight(c.length*this.params.height*this.params.pixelRatio),void c.forEach(this.drawBars,this);a=c[0]}var d=[].some.call(a,function(a){return 0>a});d&&(a=[].filter.call(a,function(a,b){return b%2==0}));var e=.5/this.params.pixelRatio,f=this.width,g=this.params.height*this.params.pixelRatio,h=g*b||0,i=g/2,j=a.length,k=this.params.barWidth*this.params.pixelRatio,l=Math.max(this.params.pixelRatio,~~(k/2)),m=k+l,n=1;this.params.normalize&&(n=Math.max.apply(Math,a));var o=j/f;this.waveCc.fillStyle=this.params.waveColor,this.progressCc&&(this.progressCc.fillStyle=this.params.progressColor),[this.waveCc,this.progressCc].forEach(function(b){if(b)for(var c=0;f>c;c+=m){var d=Math.round(a[Math.floor(c*o)]/n*i);b.fillRect(c+e,i-d+h,k+e,2*d)}},this)},drawWave:function(a,b){if(a[0]instanceof Array){var c=a;if(this.params.splitChannels)return this.setHeight(c.length*this.params.height*this.params.pixelRatio),void c.forEach(this.drawWave,this);a=c[0]}var d=[].some.call(a,function(a){return 0>a});if(!d){for(var e=[],f=0,g=a.length;g>f;f++)e[2*f]=a[f],e[2*f+1]=-a[f];a=e}var h=.5/this.params.pixelRatio,i=this.params.height*this.params.pixelRatio,j=i*b||0,k=i/2,l=~~(a.length/2),m=1;this.params.fillParent&&this.width!=l&&(m=this.width/l);var n=1;if(this.params.normalize){var o=Math.max.apply(Math,a),p=Math.min.apply(Math,a);n=-p>o?-p:o}this.waveCc.fillStyle=this.params.waveColor,this.progressCc&&(this.progressCc.fillStyle=this.params.progressColor),[this.waveCc,this.progressCc].forEach(function(b){if(b){b.beginPath(),b.moveTo(h,k+j);for(var c=0;l>c;c++){var d=Math.round(a[2*c]/n*k);b.lineTo(c*m+h,k-d+j)}for(var c=l-1;c>=0;c--){var d=Math.round(a[2*c+1]/n*k);b.lineTo(c*m+h,k-d+j)}b.closePath(),b.fill(),b.fillRect(0,k+j-h,this.width,h)}},this)},updateProgress:function(a){var b=Math.round(this.width*a)/this.params.pixelRatio;this.style(this.progressWave,{width:b+"px"})}}),function(){var b=function(){var b=document.querySelectorAll("wavesurfer");Array.prototype.forEach.call(b,function(b){var c=a.util.extend({container:b,backend:"MediaElement",mediaControls:!0},b.dataset);b.style.display="block";var d=a.create(c);if(b.dataset.peaks)var e=JSON.parse(b.dataset.peaks);d.load(b.dataset.url,e)})};"complete"===document.readyState?b():window.addEventListener("load",b)}(),a});
//# sourceMappingURL=wavesurfer.min.js.map

(function() {
  'use strict';
window.cancelAnimationFrame = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame;

window.requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame;

angular.module('angularAudioRecorder', [
  'angularAudioRecorder.config',
  'angularAudioRecorder.services',
  'angularAudioRecorder.controllers',
  'angularAudioRecorder.directives'
]);
angular.module('angularAudioRecorder.config', [])
  .constant('recorderScriptUrl', (function () {
    var scripts = document.getElementsByTagName('script');
    var myUrl = scripts[scripts.length - 1].getAttribute('src');
    var path = myUrl.substr(0, myUrl.lastIndexOf('/') + 1);
    var a = document.createElement('a');
    a.href = path;
    return a.href;
  }()))
  .constant('recorderPlaybackStatus', {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2
  })
;
angular.module('angularAudioRecorder.controllers', [
  'angularAudioRecorder.config',
  'angularAudioRecorder.services'
]);
var createReadOnlyVersion = function (object) {
  var obj = {};
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      Object.defineProperty(obj, property, {
        get: (function (a) {
          var p = a;
          return function () {
            return object[p];
          }
        })(property),
        enumerable: true,
        configurable: true
      });
    }
  }
  return obj;
};


var blobToDataURL = function (blob, callback) {
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
};

var RecorderController = function (element, service, recorderUtils, $scope, $timeout, $interval, PLAYBACK) {
  //used in NON-Angular Async process
  var scopeApply = function (fn) {
    var phase = $scope.$root.$$phase;
    if (phase !== '$apply' && phase !== '$digest') {
      return $scope.$apply(fn);
    }
  };

  var control = this,
    cordovaMedia = {
      recorder: null,
      url: null,
      player: null
    }, timing = null,
    audioObjId = 'recorded-audio-' + control.id,
    status = {
      isRecording: false,
      playback: PLAYBACK.STOPPED,
      isDenied: null,
      isSwfLoaded: null,
      isConverting: false,
      get isPlaying() {
        return status.playback === PLAYBACK.PLAYING;
      },
      get isStopped() {
        return status.playback === PLAYBACK.STOPPED;
      },
      get isPaused() {
        return status.playback === PLAYBACK.PAUSED;
      }
    },
    shouldConvertToMp3 = angular.isDefined(control.convertMp3) ? !!control.convertMp3 : service.shouldConvertToMp3(),
    mp3Converter = shouldConvertToMp3 ? new MP3Converter(service.getMp3Config()) : null;
  ;


  control.timeLimit = control.timeLimit || 0;
  control.status = createReadOnlyVersion(status);
  control.isAvailable = service.isAvailable();
  control.elapsedTime = 0;
  //Sets ID for the element if ID doesn't exists
  if (!control.id) {
    control.id = recorderUtils.generateUuid();
    element.attr("id", control.id);
  }


  if (!service.isHtml5 && !service.isCordova) {
    status.isSwfLoaded = service.swfIsLoaded();
    $scope.$watch(function () {
      return service.swfIsLoaded();
    }, function (n) {
      status.isSwfLoaded = n;
    });
  }


  //register controller with service
  service.setController(control.id, this);

  var playbackOnEnded = function () {
    status.playback = PLAYBACK.STOPPED;
    control.onPlaybackComplete();
    scopeApply();
  };

  var playbackOnPause = function () {
    status.playback = PLAYBACK.PAUSED;
    control.onPlaybackPause();
  };

  var playbackOnStart = function () {
    status.playback = PLAYBACK.PLAYING;
    control.onPlaybackStart();
  };

  var playbackOnResume = function () {
    status.playback = PLAYBACK.PLAYING;
    control.onPlaybackResume();
  };

  var embedPlayer = function (blob) {
    if (document.getElementById(audioObjId) == null) {
      element.append('<audio type="audio/mp3" id="' + audioObjId + '"></audio>');

      var audioPlayer = document.getElementById(audioObjId);
      if (control.showPlayer) {
        audioPlayer.setAttribute('controls', '');
      }

      audioPlayer.addEventListener("ended", playbackOnEnded);
      audioPlayer.addEventListener("pause", function (e) {
        if (this.duration !== this.currentTime) {
          playbackOnPause();
          scopeApply();
        }
      });


      audioPlayer.addEventListener("playing", function (e) {
        if (status.isPaused) {
          playbackOnResume();
        } else {
          playbackOnStart();
        }
        scopeApply();
      });

    }

    if (blob) {
      blobToDataURL(blob, function (url) {
        document.getElementById(audioObjId).src = url;
      });
    } else {
      document.getElementById(audioObjId).removeAttribute('src');
    }
  };

  var doMp3Conversion = function (blobInput, successCallback) {
    if (mp3Converter) {
      status.isConverting = true;
      mp3Converter.convert(blobInput, function (mp3Blob) {
        status.isConverting = false;
        if (successCallback) {
          successCallback(mp3Blob);
        }
        scopeApply(control.onConversionComplete);
      }, function () {
        status.isConverting = false;
      });
      //call conversion started
      control.onConversionStart();
    }
  };

  control.getAudioPlayer = function () {
    return service.isCordova ? cordovaMedia.player : document.getElementById(audioObjId);
  };


  control.startRecord = function () {
    if (!service.isAvailable()) {
      return;
    }

    if (status.isPlaying) {
      control.playbackPause();
      //indicate that this is not paused.
      status.playback = PLAYBACK.STOPPED;
    }

    //clear audio previously recorded
    control.audioModel = null;

    var id = control.id, recordHandler = service.getHandler();
    //Record initiation based on browser type
    var start = function () {
      if (service.isCordova) {
        cordovaMedia.url = recorderUtils.cordovaAudioUrl(control.id);
        //mobile app needs wav extension to save recording
        cordovaMedia.recorder = new Media(cordovaMedia.url, function () {
          console.log('Media successfully played');
        }, function (err) {
          console.log('Media could not be launched' + err.code, err);
        });
        console.log('CordovaRecording');
        cordovaMedia.recorder.startRecord();
      }
      else if (service.isHtml5) {
        //HTML5 recording
        if (!recordHandler) {
          return;
        }
        console.log('HTML5Recording');
        recordHandler.clear();
        recordHandler.record();
      }
      else {
        //Flash recording
        if (!service.isReady) {
          //Stop recording if the flash object is not ready
          return;
        }
        console.log('FlashRecording');
        recordHandler.record(id, 'audio.wav');
      }

      status.isRecording = true;
      control.onRecordStart();
      control.elapsedTime = 0;
      timing = $interval(function () {
        ++control.elapsedTime;
        if (control.timeLimit && control.timeLimit > 0 && control.elapsedTime >= control.timeLimit) {
          control.stopRecord();
        }
      }, 1000);
    };

    if (service.isCordova || recordHandler) {
      start();
    } else if (!status.isDenied) {
      //probably permission was never asked
      service.showPermission({
        onDenied: function () {
          status.isDenied = true;
          $scope.$apply();
        },
        onAllowed: function () {
          status.isDenied = false;
          recordHandler = service.getHandler();
          start();
          scopeApply();
        }
      });
    }
  };

  control.stopRecord = function () {
    var id = control.id;
    if (!service.isAvailable() || !status.isRecording) {
      return false;
    }

    var recordHandler = service.getHandler();
    var completed = function (blob) {
      $interval.cancel(timing);
      status.isRecording = false;
      var finalize = function (inputBlob) {
        control.audioModel = inputBlob;
        embedPlayer(inputBlob);
      };

      if (shouldConvertToMp3) {
        doMp3Conversion(blob, finalize);
      } else {
        finalize(blob)
      }

      embedPlayer(null);
      control.onRecordComplete();
    };

    //To stop recording
    if (service.isCordova) {
      cordovaMedia.recorder.stopRecord();
      window.resolveLocalFileSystemURL(cordovaMedia.url, function (entry) {
        entry.file(function (blob) {
          completed(blob);
        });
      }, function (err) {
        console.log('Could not retrieve file, error code:', err.code);
      });
    } else if (service.isHtml5) {
      recordHandler.stop();
      recordHandler.getBuffer(function () {
        recordHandler.exportWAV(function (blob) {
          completed(blob);
          scopeApply();
        });
      });
    } else {
      recordHandler.stopRecording(id);
      completed(recordHandler.getBlob(id));
    }
  };

  control.playbackRecording = function () {
    if (status.isPlaying || !service.isAvailable() || status.isRecording || !control.audioModel) {
      return false;
    }

    if (service.isCordova) {
      cordovaMedia.player = new Media(cordovaMedia.url, playbackOnEnded, function () {
        console.log('Playback failed');
      });
      cordovaMedia.player.play();
      playbackOnStart();
    } else {
      control.getAudioPlayer().play();
    }

  };

  control.playbackPause = function () {
    if (!status.isPlaying || !service.isAvailable() || status.isRecording || !control.audioModel) {
      return false;
    }

    control.getAudioPlayer().pause();
    if (service.isCordova) {
      playbackOnPause();
    }
  };

  control.playbackResume = function () {
    if (status.isPlaying || !service.isAvailable() || status.isRecording || !control.audioModel) {
      return false;
    }

    if (status.isPaused) {
      //previously paused, just resume
      control.getAudioPlayer().play();
      if (service.isCordova) {
        playbackOnResume();
      }
    } else {
      control.playbackRecording();
    }

  };


  control.save = function (fileName) {
    if (!service.isAvailable() || status.isRecording || !control.audioModel) {
      return false;
    }

    if (!fileName) {
      fileName = 'audio_recording_' + control.id + (control.audioModel.type.indexOf('mp3') > -1 ? 'mp3' : 'wav');
    }

    var blobUrl = window.URL.createObjectURL(control.audioModel);
    var a = document.createElement('a');
    a.href = blobUrl;
    a.target = '_blank';
    a.download = fileName;
    var click = document.createEvent("Event");
    click.initEvent("click", true, true);
    a.dispatchEvent(click);
  };

  control.isHtml5 = function () {
    return service.isHtml5;
  };

  if (control.autoStart) {
    $timeout(function () {
      control.startRecord();
    }, 1000);
  }

  element.on('$destroy', function () {
    $interval.cancel(timing);
  });

};

RecorderController.$inject = ['$element', 'recorderService', 'recorderUtils', '$scope', '$timeout', '$interval', 'recorderPlaybackStatus'];

angular.module('angularAudioRecorder.controllers')
  .controller('recorderController', RecorderController)
;
angular.module('angularAudioRecorder.directives', [
  'angularAudioRecorder.config',
  'angularAudioRecorder.services',
  'angularAudioRecorder.controllers'
]);
angular.module('angularAudioRecorder.directives')
  .directive('ngAudioRecorderAnalyzer', ['recorderService', 'recorderUtils',
    function (service, utils) {

      var link = function (scope, element, attrs, recorder) {
        if (!service.isHtml5) {
          scope.hide = true;
          return;
        }

        var canvasWidth, canvasHeight, rafID, analyserContext, props = service.$html5AudioProps;

        function updateAnalysers(time) {

          if (!analyserContext) {
            var canvas = element.find("canvas")[0];

            if (attrs.width && !isNaN(attrs.width)) {
              canvas.width = attrs.width;
            }

            if (attrs.height && !isNaN(attrs.height)) {
              canvas.height = parseInt(attrs.height);
            }

            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            analyserContext = canvas.getContext('2d');
          }

          // analyzer draw code here
          {
            var SPACING = 3;
            var BAR_WIDTH = 1;
            var numBars = Math.round(canvasWidth / SPACING);
            var freqByteData = new Uint8Array(props.analyserNode.frequencyBinCount);

            props.analyserNode.getByteFrequencyData(freqByteData);

            analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //analyserContext.fillStyle = '#F6D565';
            analyserContext.lineCap = 'round';
            var multiplier = props.analyserNode.frequencyBinCount / numBars;

            // Draw rectangle for each frequency bin.
            for (var i = 0; i < numBars; ++i) {
              var magnitude = 0;
              var offset = Math.floor(i * multiplier);
              // gotta sum/average the block, or we miss narrow-bandwidth spikes
              for (var j = 0; j < multiplier; j++)
                magnitude += freqByteData[offset + j];
              magnitude = magnitude / multiplier;
              var magnitude2 = freqByteData[i * multiplier];
              if (attrs.waveColor)
                analyserContext.fillStyle = attrs.waveColor;
              else
                analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
              analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
            }
          }

          rafID = window.requestAnimationFrame(updateAnalysers);
        }

        function cancelAnalyserUpdates() {
          window.cancelAnimationFrame(rafID);
          rafID = null;
        }

        element.on('$destroy', function () {
          cancelAnalyserUpdates();
        });

        recorder.onRecordStart = (function (original) {
          return function () {
            original.apply();
            updateAnalysers();
          };
        })(recorder.onRecordStart);

        utils.appendActionToCallback(recorder, 'onRecordStart', updateAnalysers, 'analyzer');
        utils.appendActionToCallback(recorder, 'onRecordComplete', cancelAnalyserUpdates, 'analyzer');
      };

      return {
        restrict: 'E',
        require: '^ngAudioRecorder',
        template: '<div ng-if="!hide" class="audioRecorder-analyzer">' +
        '<canvas class="analyzer" width="1200" height="400" style="max-width: 100%;"></canvas>' +
        '</div>',
        link: link
      };

    }
  ]);
angular.module('angularAudioRecorder.directives')
  .directive('ngAudioRecorderWaveView', ['recorderService', 'recorderUtils', '$log',
    function (service, utils, $log) {

      return {
        restrict: 'E',
        require: '^ngAudioRecorder',
        link: function (scope, $element, attrs, recorder) {
          if (!window.WaveSurfer) {
            $log.warn('WaveSurfer was found.');
            return;
          }

          var audioPlayer;
          $element.html('<div class="waveSurfer"></div>');
          var options = angular.extend({container: $element.find('div')[0]}, attrs);
          var waveSurfer = WaveSurfer.create(options);
          waveSurfer.setVolume(0);
          utils.appendActionToCallback(recorder, 'onPlaybackStart|onPlaybackResume', function () {
            waveSurfer.play();
          }, 'waveView');
          utils.appendActionToCallback(recorder, 'onPlaybackComplete|onPlaybackPause', function () {
            waveSurfer.pause();
          }, 'waveView');

          utils.appendActionToCallback(recorder, 'onRecordComplete', function () {
            if (!audioPlayer) {
              audioPlayer = recorder.getAudioPlayer();
              audioPlayer.addEventListener('seeking', function (e) {
                var progress = audioPlayer.currentTime / audioPlayer.duration;
                waveSurfer.seekTo(progress);
              });
            }
          }, 'waveView');


          scope.$watch(function () {
            return recorder.audioModel;
          }, function (newBlob) {
            if (newBlob instanceof Blob) {
              waveSurfer.loadBlob(newBlob);
            }
          });
        }
      };
    }]);
angular.module('angularAudioRecorder.directives')
  .directive('ngAudioRecorder', ['recorderService', '$timeout',
    function (recorderService, $timeout) {
      return {
        restrict: 'EA',
        scope: {
          audioModel: '=',
          id: '@',
          onRecordStart: '&',
          onRecordComplete: '&',
          onPlaybackComplete: '&',
          onPlaybackStart: '&',
          onPlaybackPause: '&',
          onPlaybackResume: '&',
          onConversionStart: '&',
          onConversionComplete: '&',
          showPlayer: '=?',
          autoStart: '=?',
          convertMp3: '=?',
          timeLimit: '=?'
        },
        controllerAs: 'recorder',
        bindToController: true,
        template: function (element, attrs) {
          return '<div class="audioRecorder">' +
            '<div style="width: 250px; margin: 0 auto;"><div id="audioRecorder-fwrecorder"></div></div>' +
            element.html() +
            '</div>';
        },
        controller: 'recorderController',
        link: function (scope, element, attrs) {
          $timeout(function () {
            if (recorderService.isAvailable && !(recorderService.isHtml5 || recorderService.isCordova)) {
              var params = {
                'allowscriptaccess': 'always'
              }, attrs = {
                'id': 'recorder-app',
                'name': 'recorder-app'
              }, flashVars = {
                'save_text': ''
              };
              swfobject.embedSWF(recorderService.getSwfUrl(), "audioRecorder-fwrecorder", "0", "0", "11.0.0", "", flashVars, params, attrs);
            }
          }, 100);

        }
      };
    }
  ]);

angular.module('angularAudioRecorder.services', ['angularAudioRecorder.config']);
angular.module('angularAudioRecorder.services')
  .provider('recorderService', ['recorderScriptUrl',
    function (scriptPath) {
      var handler = null,
        service = {isHtml5: false, isReady: false},
        permissionHandlers = {onDenied: null, onClosed: null, onAllow: null},
        forceSwf = false,
        /*this path is relative to the dist path:*/
        swfUrl = scriptPath + '../lib/recorder.swf',
        utils,
        mp3Covert = false,
        mp3Config = {bitRate: 92, lameJsUrl: scriptPath + '../lib/lame.min.js'}
        ;

      var swfHandlerConfig = {
        isAvailable: false,
        loaded: false,
        configureMic: function () {
          if (!FWRecorder.isReady) {
            return;
          }
          FWRecorder.configure(44, 100, 0, 2000);
          FWRecorder.setUseEchoSuppression(false);
          FWRecorder.setLoopBack(false);
        },
        allowed: false,
        externalEvents: function (eventName) {
          //Actions based on user interaction with flash
          var name = arguments[1];
          switch (arguments[0]) {
            case "ready":
              var width = parseInt(arguments[1]);
              var height = parseInt(arguments[2]);
              FWRecorder.connect('recorder-app', 0);
              FWRecorder.recorderOriginalWidth = 1;
              FWRecorder.recorderOriginalHeight = 1;
              swfHandlerConfig.loaded = true;
              break;

            case "microphone_user_request":
              FWRecorder.showPermissionWindow({permanent: true});
              break;

            case "microphone_connected":
              console.log('Permission to use MIC granted');
              swfHandlerConfig.allowed = true;
              break;

            case "microphone_not_connected":
              console.log('Permission to use MIC denied');
              swfHandlerConfig.allowed = false;
              break;

            case "permission_panel_closed":
              if (swfHandlerConfig.allowed) {
                swfHandlerConfig.setAllowed();
              } else {
                swfHandlerConfig.setDeclined();
              }
              FWRecorder.defaultSize();
              if (angular.isFunction(permissionHandlers.onClosed)) {
                permissionHandlers.onClosed();
              }
              break;

            case "recording":
              FWRecorder.hide();
              break;

            case "recording_stopped":
              FWRecorder.hide();
              break;

            case "playing":

              break;

            case "playback_started":

              var latency = arguments[2];
              break;

            case "save_pressed":
              FWRecorder.updateForm();
              break;

            case "saving":
              break;

            case "saved":
              var data = $.parseJSON(arguments[2]);
              if (data.saved) {

              } else {

              }
              break;

            case "save_failed":
              var errorMessage = arguments[2];
              break;

            case "save_progress":
              var bytesLoaded = arguments[2];
              var bytesTotal = arguments[3];
              break;

            case "stopped":
            case "playing_paused":
            case "no_microphone_found":
            case "observing_level":
            case "microphone_level":
            case "microphone_activity":
            case "observing_level_stopped":
            default:
              //console.log('Event Received: ', arguments);
              break;
          }

        },
        isInstalled: function () {
          return swfobject.getFlashPlayerVersion().major > 0;
        },
        init: function () {
          //Flash recorder external events
          service.isHtml5 = false;
          if (!swfHandlerConfig.isInstalled()) {
            console.log('Flash is not installed, application cannot be initialized');
            return;
          }
          swfHandlerConfig.isAvailable = true;
          //handlers
          window.fwr_event_handler = swfHandlerConfig.externalEvents;
          window.configureMicrophone = swfHandlerConfig.configureMic;
        },
        setAllowed: function () {
          service.isReady = true;
          handler = FWRecorder;
          if (angular.isFunction(permissionHandlers.onAllowed)) {
            permissionHandlers.onAllowed();
          }
        },
        setDeclined: function () {
          service.isReady = false;
          handler = null;
          if (angular.isFunction(permissionHandlers.onDenied)) {
            permissionHandlers.onDenied();
          }
        },
        getPermission: function () {
          if (swfHandlerConfig.isAvailable) {
            if (!FWRecorder.isMicrophoneAccessible()) {
              FWRecorder.showPermissionWindow({permanent: true});
            } else {
              swfHandlerConfig.allowed = true;
              setTimeout(function () {
                swfHandlerConfig.setAllowed();
              }, 100);
            }

          }
        }
      };


      var html5AudioProps = {
        audioContext: null,
        inputPoint: null,
        audioInput: null,
        audioRecorder: null,
        analyserNode: null
      };

      var html5HandlerConfig = {
        gotStream: function (stream) {
          var audioContext = html5AudioProps.audioContext;
          // Create an AudioNode from the stream.
          html5AudioProps.audioInput = audioContext.createMediaStreamSource(stream);
          html5AudioProps.audioInput.connect((html5AudioProps.inputPoint = audioContext.createGain()));

          //analyser
          html5AudioProps.analyserNode = audioContext.createAnalyser();
          html5AudioProps.analyserNode.fftSize = 2048;
          html5AudioProps.inputPoint.connect(html5AudioProps.analyserNode);
          html5AudioProps.audioRecorder = new Recorder(html5AudioProps.audioInput);

          //create Gain
          var zeroGain = audioContext.createGain();
          zeroGain.gain.value = 0.0;
          html5AudioProps.inputPoint.connect(zeroGain);
          zeroGain.connect(audioContext.destination);

          //service booted
          service.isReady = true;
          handler = html5AudioProps.audioRecorder;

          if (angular.isFunction(permissionHandlers.onAllowed)) {
            if (window.location.protocol == 'https:') {
              //to store permission for https websites
              localStorage.setItem("permission", "given");
            }
            permissionHandlers.onAllowed();
          }

        },
        failStream: function (data) {
          if (angular.isDefined(permissionHandlers.onDenied)) {
            permissionHandlers.onDenied();
          }
        },
        getPermission: function () {
          navigator.getUserMedia({
            "audio": true
          }, html5HandlerConfig.gotStream, html5HandlerConfig.failStream);
        },
        init: function () {
          service.isHtml5 = true;
          var AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext && !html5AudioProps.audioContext) {
            html5AudioProps.audioContext = new AudioContext();
          }

          if (localStorage.getItem("permission") !== null) {
            //to get permission from browser cache for returning user
            html5HandlerConfig.getPermission();
          }
        }
      };

      navigator.getUserMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;


      service.isCordova = false;

      var init = function () {
        if ('cordova' in window) {
          service.isCordova = true;
        } else if (!forceSwf && navigator.getUserMedia) {
          html5HandlerConfig.init();
        } else {
          swfHandlerConfig.init();
        }
      };

      var controllers = {};

      service.controller = function (id) {
        return controllers[id];
      };

      service.getSwfUrl = function () {
        return swfUrl;
      };

      service.setController = function (id, controller) {
        controllers[id] = controller;
      };

      service.isAvailable = function () {
        if (service.isCordova) {
          if (!('Media' in window)) {
            throw new Error('The Media plugin for cordova is required for this library, add plugin using "cordova plugin add cordova-plugin-media"');
          }
          return true;
        }

        return service.isHtml5
          || swfHandlerConfig.isInstalled();
      };

      service.getHandler = function () {
        return handler;
      };

      service.showPermission = function (listeners) {
        if (!service.isAvailable()) {
          console.warn("Neither HTML5 nor SWF is supported.");
          return;
        }

        if (listeners) {
          angular.extend(permissionHandlers, listeners);
        }

        if (service.isHtml5) {
          html5HandlerConfig.getPermission();
        } else {
          swfHandlerConfig.getPermission();
        }
      };

      service.swfIsLoaded = function () {
        return swfHandlerConfig.loaded;
      };

      service.shouldConvertToMp3 = function () {
        return mp3Covert;
      };

      service.getMp3Config = function () {
        return mp3Config;
      };

      service.$html5AudioProps = html5AudioProps;

      var provider = {
        $get: ['recorderUtils',
          function (recorderUtils) {
            utils = recorderUtils;
            init();
            return service;
          }
        ],
        forceSwf: function (value) {
          forceSwf = value;
          return provider;
        },
        setSwfUrl: function (path) {
          swfUrl = path;
          return provider;
        },
        withMp3Conversion: function (bool, config) {
          mp3Covert = !!bool;
          mp3Config = angular.extend(mp3Config, config || {});
          return provider;
        }
      };

      return provider;
    }])
;
angular.module('angularAudioRecorder.services')
  .factory('recorderUtils', [
    /**
     * @ngdoc service
     * @name recorderUtils
     *
     */
      function () {

      // Generates UUID
      var factory = {
        generateUuid: function () {
          function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
          }

          return _p8() + _p8(true) + _p8(true) + _p8();
        },
        cordovaAudioUrl: function (id) {
          if (!window.cordova) {
            return 'record-audio' + id + '.wav';
          }

          var url = cordova.file.tempDirectory
            || cordova.file.externalApplicationStorageDirectory
            || cordova.file.sharedDirectory;

          url += Date.now() + '_recordedAudio_' + id.replace('/[^A-Za-z0-9_-]+/gi', '-');
          switch (window.cordova.platformId) {
            case 'ios':
              url += '.wav';
              break;

            case 'android':
              url += '.amr';
              break;

            case 'wp':
              url += '.wma';
              break;

            default :
              url += '.mp3';
          }

          return url;
        }
      };

      factory.appendActionToCallback = function (object, callbacks, action, track) {

        callbacks.split(/\|/).forEach(function (callback) {
          if (!angular.isObject(object) || !angular.isFunction(action) || !(callback in object) || !angular.isFunction(object[callback])) {
            throw new Error('One or more parameter supplied is not valid');
          }
          ;

          if (!('$$appendTrackers' in object)) {
            object.$$appendTrackers = [];
          }

          var tracker = callback + '|' + track;
          if (object.$$appendTrackers.indexOf(tracker) > -1) {
            console.log('Already appended: ', tracker);
            return;
          }

          object[callback] = (function (original) {
            return function () {
              //console.trace('Calling Callback : ', tracker);
              original.apply(object, arguments);
              action.apply(object, arguments);
            };
          })(object[callback]);

          object.$$appendTrackers.push(tracker);
        });
      };

      return factory;
    }
  ]);})();
(function (global) {
  'use strict';

  var Recorder, RECORDED_AUDIO_TYPE = "audio/wav";

  Recorder = {
    recorder: null,
    recorderOriginalWidth: 0,
    recorderOriginalHeight: 0,
    uploadFormId: null,
    uploadFieldName: null,
    isReady: false,

    connect: function (name, attempts) {
      if (navigator.appName.indexOf("Microsoft") != -1) {
        Recorder.recorder = window[name];
      } else {
        Recorder.recorder = document[name];
      }

      if (attempts >= 40) {
        return;
      }

      // flash app needs time to load and initialize
      if (Recorder.recorder && Recorder.recorder.init) {
        Recorder.recorderOriginalWidth = Recorder.recorder.width;
        Recorder.recorderOriginalHeight = Recorder.recorder.height;
        if (Recorder.uploadFormId && $) {
          var frm = $(Recorder.uploadFormId);
          Recorder.recorder.init(frm.attr('action').toString(), Recorder.uploadFieldName, frm.serializeArray());
        }
        return;
      }

      setTimeout(function () {
        Recorder.connect(name, attempts + 1);
      }, 100);
    },

    playBack: function (name) {
      // TODO: Rename to `playback`
      Recorder.recorder.playBack(name);
    },

    pausePlayBack: function (name) {
      // TODO: Rename to `pausePlayback`
      Recorder.recorder.pausePlayBack(name);
    },

    playBackFrom: function (name, time) {
      // TODO: Rename to `playbackFrom`
      Recorder.recorder.playBackFrom(name, time);
    },

    record: function (name, filename) {
      Recorder.recorder.record(name, filename);
    },

    stopRecording: function () {
      Recorder.recorder.stopRecording();
    },

    stopPlayBack: function () {
      // TODO: Rename to `stopPlayback`
      Recorder.recorder.stopPlayBack();
    },

    observeLevel: function () {
      Recorder.recorder.observeLevel();
    },

    stopObservingLevel: function () {
      Recorder.recorder.stopObservingLevel();
    },

    observeSamples: function () {
      Recorder.recorder.observeSamples();
    },

    stopObservingSamples: function () {
      Recorder.recorder.stopObservingSamples();
    },

    resize: function (width, height) {
      Recorder.recorder.width = width + "px";
      Recorder.recorder.height = height + "px";
    },

    defaultSize: function () {
      Recorder.resize(Recorder.recorderOriginalWidth, Recorder.recorderOriginalHeight);
    },

    show: function () {
      Recorder.recorder.show();
    },

    hide: function () {
      Recorder.recorder.hide();
    },

    duration: function (name) {
      // TODO: rename to `getDuration`
      return Recorder.recorder.duration(name || Recorder.uploadFieldName);
    },

    getBase64: function (name) {
      var data = Recorder.recorder.getBase64(name);
      return 'data:' + RECORDED_AUDIO_TYPE + ';base64,' + data;
    },

    getBlob: function (name) {
      var base64Data = Recorder.getBase64(name).split(',')[1];
      return base64toBlob(base64Data, RECORDED_AUDIO_TYPE);
    },

    getCurrentTime: function (name) {
      return Recorder.recorder.getCurrentTime(name);
    },

    isMicrophoneAccessible: function () {
      return Recorder.recorder.isMicrophoneAccessible();
    },

    updateForm: function () {
      var frm = $(Recorder.uploadFormId);
      Recorder.recorder.update(frm.serializeArray());
    },

    showPermissionWindow: function (options) {
      Recorder.resize(240, 160);
      // need to wait until app is resized before displaying permissions screen
      var permissionCommand = function () {
        if (options && options.permanent) {
          Recorder.recorder.permitPermanently();
        } else {
          Recorder.recorder.permit();
        }
      };
      setTimeout(permissionCommand, 1);
    },

    configure: function (rate, gain, silenceLevel, silenceTimeout) {
      rate = parseInt(rate || 22);
      gain = parseInt(gain || 100);
      silenceLevel = parseInt(silenceLevel || 0);
      silenceTimeout = parseInt(silenceTimeout || 4000);
      switch (rate) {
        case 44:
        case 22:
        case 11:
        case 8:
        case 5:
          break;
        default:
          throw("invalid rate " + rate);
      }

      if (gain < 0 || gain > 100) {
        throw("invalid gain " + gain);
      }

      if (silenceLevel < 0 || silenceLevel > 100) {
        throw("invalid silenceLevel " + silenceLevel);
      }

      if (silenceTimeout < -1) {
        throw("invalid silenceTimeout " + silenceTimeout);
      }

      Recorder.recorder.configure(rate, gain, silenceLevel, silenceTimeout);
    },

    setUseEchoSuppression: function (val) {
      if (typeof(val) != 'boolean') {
        throw("invalid value for setting echo suppression, val: " + val);
      }

      Recorder.recorder.setUseEchoSuppression(val);
    },

    setLoopBack: function (val) {
      if (typeof(val) != 'boolean') {
        throw("invalid value for setting loop back, val: " + val);
      }

      Recorder.recorder.setLoopBack(val);
    }
  };

  function base64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }


  global.FWRecorder = Recorder;


})(window);
/**
 * This script adds a new function to a function prototype,
 * which allows a function to be converted to a web worker.
 *
 * Please note that this method copies the function's source code into a Blob, so references to variables
 * outside the function's own scope will be invalid.
 *
 * You can however pass variables that can be serialized into JSON, to this function using the params parameter
 *
 * @usage
 * ```
 * myFunction.toWorker({param1: p1, param2: p2...})
 *```
 *
 */
(function () {
  'use strict';


  var workerToBlobUrl = function (fn, params) {
    if (typeof fn !== 'function') {
      throw("The specified parameter must be a valid function");
    }
    var fnString = fn.toString();
    if (fnString.match(/\[native\s*code\]/i)) {
      throw("You cannot bind a native function to a worker");
    }
    ;

    params = params || {};
    if (typeof params !== 'object') {
      console.warn('Params must be an object that is serializable with JSON.stringify, specified is: ' + (typeof params));
    }

    var blobURL = window.URL.createObjectURL(new Blob(['(', fnString, ')(this,', JSON.stringify(params), ')'], {type: 'application/javascript'}));

    return blobURL;
  };

  Function.prototype.toWorker = function (params) {
    var url = workerToBlobUrl(this, params);
    return new Worker(url);
  };
})();
/*License (MIT)

 Copyright © 2013 Matt Diamond

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.
 */

(function (win) {
  'use strict';

  var RecorderWorker = function (me) {
    var recLength = 0,
      recBuffersL = [],
      recBuffersR = [],
      bits = 16,
      sampleRate;

    me.onmessage = function (e) {
      switch (e.data.command) {
        case 'init':
          init(e.data.config);
          break;
        case 'record':
          record(e.data.buffer);
          break;
        case 'exportWAV':
          exportWAV(e.data.type);
          break;
        case 'getBuffer':
          getBuffer();
          break;
        case 'clear':
          clear();
          break;
      }
    };

    function init(config) {
      sampleRate = config.sampleRate;
    }

    function record(inputBuffer) {
      recBuffersL.push(inputBuffer[0]);
      //recBuffersR.push(inputBuffer[1]);
      recLength += inputBuffer[0].length;
    }

    function exportWAV(type) {
      var bufferL = mergeBuffers(recBuffersL, recLength);
      var dataview = encodeWAV(bufferL);
      var audioBlob = new Blob([dataview], {type: type});

      me.postMessage(audioBlob);
    }

    function getBuffer() {
      var buffers = [];
      buffers.push(mergeBuffers(recBuffersL, recLength));
      buffers.push(mergeBuffers(recBuffersR, recLength));
      me.postMessage(buffers);
    }

    function clear() {
      recLength = 0;
      recBuffersL = [];
      recBuffersR = [];
    }

    function mergeBuffers(recBuffers, recLength) {
      var result = new Float32Array(recLength);
      var offset = 0;
      for (var i = 0; i < recBuffers.length; i++) {
        result.set(recBuffers[i], offset);
        offset += recBuffers[i].length;
      }
      return result;
    }

    //function interleave(inputL, inputR) {
    //  var length = inputL.length + inputR.length;
    //  var result = new Float32Array(length);
    //
    //  var index = 0,
    //    inputIndex = 0;
    //
    //  while (index < length) {
    //    result[index++] = inputL[inputIndex];
    //    result[index++] = inputR[inputIndex];
    //    inputIndex++;
    //  }
    //  return result;
    //}

    function floatTo16BitPCM(output, offset, input) {
      for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }

    function writeString(view, offset, string) {
      for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }


    function encodeWAV(samples) {
      var buffer = new ArrayBuffer(44 + samples.length * 2);
      var view = new DataView(buffer);

      /* RIFF identifier */
      writeString(view, 0, 'RIFF');
      /* file length */
      view.setUint32(4, 32 + samples.length * 2, true);
      /* RIFF type */
      writeString(view, 8, 'WAVE');
      /* format chunk identifier */
      writeString(view, 12, 'fmt ');
      /* format chunk length */
      view.setUint32(16, 16, true);
      /* sample format (raw) */
      view.setUint16(20, 1, true);
      /* channel count */
      //view.setUint16(22, 2, true); /*STEREO*/
      view.setUint16(22, 1, true);
      /*MONO*/
      /* sample rate */
      view.setUint32(24, sampleRate, true);
      /* byte rate (sample rate * block align) */
      //view.setUint32(28, sampleRate * 4, true); /*STEREO*/
      view.setUint32(28, sampleRate * 2, true);
      /*MONO*/
      /* block align (channel count * bytes per sample) */
      //view.setUint16(32, 4, true); /*STEREO*/
      view.setUint16(32, 2, true);
      /*MONO*/
      /* bits per sample */
      view.setUint16(34, 16, true);
      /* data chunk identifier */
      writeString(view, 36, 'data');
      /* data chunk length */
      view.setUint32(40, samples.length * 2, true);

      floatTo16BitPCM(view, 44, samples);

      return view;
    }
  };

  var Recorder = function (source, cfg) {
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    this.node = (this.context.createScriptProcessor ||
    this.context.createJavaScriptNode).call(this.context,
      bufferLen, 2, 2);
    var worker = RecorderWorker.toWorker();
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function (e) {
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
        ]
      });
    };

    this.configure = function (cfg) {
      for (var prop in cfg) {
        if (cfg.hasOwnProperty(prop)) {
          config[prop] = cfg[prop];
        }
      }
    };

    this.record = function () {
      recording = true;
    };

    this.stop = function () {
      recording = false;
    };

    this.clear = function () {
      worker.postMessage({command: 'clear'});
    };

    this.getBuffer = function (cb) {
      currCallback = cb || config.callback;
      worker.postMessage({command: 'getBuffer'})
    };

    this.exportWAV = function (cb, type) {
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    };

    worker.onmessage = function (e) {
      var blob = e.data;
      //console.log("the blob " +  blob + " " + blob.size + " " + blob.type);
      currCallback(blob);
    };


    source.connect(this.node);
    this.node.connect(this.context.destination);    //this should not be necessary
  };

  win.Recorder = Recorder;
})(window);

(function (win) {
  'use strict';

  var MP3ConversionWorker = function (me, params) {
    //should not reference any variable in parent scope as it will executed in its
    //on isolated scope
    console.log('MP3 conversion worker started.');
    if (typeof lamejs === 'undefined') {
      importScripts(params.lameJsUrl);
    }

    var mp3Encoder, maxSamples = 1152, wav, samples, lame, config, dataBuffer;


    var clearBuffer = function () {
      dataBuffer = [];
    };

    var appendToBuffer = function (mp3Buf) {
      dataBuffer.push(new Int8Array(mp3Buf));
    };


    var init = function (prefConfig) {
      config = prefConfig || {};
      lame = new lamejs();
      clearBuffer();
    };

    var encode = function (arrayBuffer) {
      wav = lame.WavHeader.readHeader(new DataView(arrayBuffer));
      console.log('wave:', wav);
      samples = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
      mp3Encoder = new lame.Mp3Encoder(wav.channels, wav.sampleRate, config.bitRate || 128);

      var remaining = samples.length;
      for (var i = 0; remaining >= maxSamples; i += maxSamples) {
        var mono = samples.subarray(i, i + maxSamples);
        var mp3buf = mp3Encoder.encodeBuffer(mono);
        appendToBuffer(mp3buf);
        remaining -= maxSamples;
      }
    };

    var finish = function () {
      var mp3buf = mp3Encoder.flush();
      appendToBuffer(mp3buf);
      self.postMessage({cmd: 'end', buf: dataBuffer});
      console.log('done encoding');
      clearBuffer();//free up memory
    };

    me.onmessage = function (e) {
      switch (e.data.cmd) {
        case 'init':
          init(e.data.config);
          break;

        case 'encode':
          encode(e.data.rawInput);
          break;

        case 'finish':
          finish();
          break;
      }
    };
  };

  var SCRIPT_BASE = (function () {
    var scripts = document.getElementsByTagName('script');
    var myUrl = scripts[scripts.length - 1].getAttribute('src');
    var path = myUrl.substr(0, myUrl.lastIndexOf('/') + 1);
    if (path && !path.match(/:\/\//)) {
      var a = document.createElement('a');
      a.href = path;
      return a.href;
    }
    return path;
  }());

  var MP3Converter = function (config) {

    config = config || {};
    config.lameJsUrl = config.lameJsUrl || (SCRIPT_BASE + '/lame.min.js');
    var busy = false;
    var mp3Worker = MP3ConversionWorker.toWorker(config);

    this.isBusy = function () {
      return busy
    };

    this.convert = function (blob) {
      var conversionId = 'conversion_' + Date.now(),
        tag = conversionId + ":"
        ;
      console.log(tag, 'Starting conversion');
      var preferredConfig = {}, onSuccess, onError;
      switch (typeof arguments[1]) {
        case 'object':
          preferredConfig = arguments[1];
          break;
        case 'function':
          onSuccess = arguments[1];
          break;
        default:
          throw "parameter 2 is expected to be an object (config) or function (success callback)"
      }

      if (typeof arguments[2] === 'function') {
        if (onSuccess) {
          onError = arguments[2];
        } else {
          onSuccess = arguments[2];
        }
      }

      if (typeof arguments[3] === 'function' && !onError) {
        onError = arguments[3];
      }

      if (busy) {
        throw ("Another conversion is in progress");
      }

      var initialSize = blob.size,
        fileReader = new FileReader(),
        startTime = Date.now();

      fileReader.onload = function (e) {
        console.log(tag, "Passed to BG process");
        mp3Worker.postMessage({
          cmd: 'init',
          config: preferredConfig
        });

        mp3Worker.postMessage({cmd: 'encode', rawInput: e.target.result});
        mp3Worker.postMessage({cmd: 'finish'});

        mp3Worker.onmessage = function (e) {
          if (e.data.cmd == 'end') {
            console.log(tag, "Done converting to Mp3");
            var mp3Blob = new Blob(e.data.buf, {type: 'audio/mp3'});
            window.mp3Blob = mp3Blob;
            console.log(tag, "Conversion completed in: " + ((Date.now() - startTime) / 1000) + 's');
            var finalSize = mp3Blob.size;
            console.log(tag +
              "Initial size: = " + initialSize + ", " +
              "Final size = " + finalSize
              + ", Reduction: " + Number((100 * (initialSize - finalSize) / initialSize)).toPrecision(4) + "%");

            busy = false;
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess(mp3Blob);
            }
          }
        };
      };
      busy = true;
      fileReader.readAsArrayBuffer(blob);
    }
  };

  win.MP3Converter = MP3Converter;
})(window);
(function (win) {
  'use strict';

  /*!SWFObject v2.1 <http://code.google.com/p/swfobject/>
   Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
   This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
   */
  win.swfobject = function () {

    var UNDEF = "undefined",
      OBJECT = "object",
      SHOCKWAVE_FLASH = "Shockwave Flash",
      SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
      FLASH_MIME_TYPE = "application/x-shockwave-flash",
      EXPRESS_INSTALL_ID = "SWFObjectExprInst",

      win = window,
      doc = document,
      nav = navigator,

      domLoadFnArr = [],
      regObjArr = [],
      objIdArr = [],
      listenersArr = [],
      script,
      timer = null,
      storedAltContent = null,
      storedAltContentId = null,
      isDomLoaded = false,
      isExpressInstallActive = false;

    /* Centralized function for browser feature detection
     - Proprietary feature detection (conditional compiling) is used to detect Internet Explorer's features
     - User agent string detection is only used when no alternative is possible
     - Is executed directly for optimal performance
     */
    var ua = function () {
      var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
        playerVersion = [0, 0, 0],
        d = null;
      if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
        d = nav.plugins[SHOCKWAVE_FLASH].description;
        if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
          d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
          playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
          playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
          playerVersion[2] = /r/.test(d) ? parseInt(d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
        }
      }
      else if (typeof win.ActiveXObject != UNDEF) {
        var a = null, fp6Crash = false;
        try {
          a = new ActiveXObject(SHOCKWAVE_FLASH_AX + ".7");
        }
        catch (e) {
          try {
            a = new ActiveXObject(SHOCKWAVE_FLASH_AX + ".6");
            playerVersion = [6, 0, 21];
            a.AllowScriptAccess = "always";	 // Introduced in fp6.0.47
          }
          catch (e) {
            if (playerVersion[0] == 6) {
              fp6Crash = true;
            }
          }
          if (!fp6Crash) {
            try {
              a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
            }
            catch (e) {
            }
          }
        }
        if (!fp6Crash && a) { // a will return null when ActiveX is disabled
          try {
            d = a.GetVariable("$version");	// Will crash fp6.0.21/23/29
            if (d) {
              d = d.split(" ")[1].split(",");
              playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
            }
          }
          catch (e) {
          }
        }
      }
      var u = nav.userAgent.toLowerCase(),
        p = nav.platform.toLowerCase(),
        webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
        ie = false,
        windows = p ? /win/.test(p) : /win/.test(u),
        mac = p ? /mac/.test(p) : /mac/.test(u);
      /*@cc_on
       ie = true;
       @if (@_win32)
       windows = true;
       @elif (@_mac)
       mac = true;
       @end
       @*/
      return {w3cdom: w3cdom, pv: playerVersion, webkit: webkit, ie: ie, win: windows, mac: mac};
    }();

    /* Cross-browser onDomLoad
     - Based on Dean Edwards' solution: http://dean.edwards.name/weblog/2006/06/again/
     - Will fire an event as soon as the DOM of a page is loaded (supported by Gecko based browsers - like Firefox -, IE, Opera9+, Safari)
     */
    var onDomLoad = function () {
      if (!ua.w3cdom) {
        return;
      }
      addDomLoadEvent(main);
      if (ua.ie && ua.win) {
        try {	 // Avoid a possible Operation Aborted error
          doc.write("<scr" + "ipt id=__ie_ondomload defer=true src=//:></scr" + "ipt>"); // String is split into pieces to avoid Norton AV to add code that can cause errors
          script = getElementById("__ie_ondomload");
          if (script) {
            addListener(script, "onreadystatechange", checkReadyState);
          }
        }
        catch (e) {
        }
      }
      if (ua.webkit && typeof doc.readyState != UNDEF) {
        timer = setInterval(function () {
          if (/loaded|complete/.test(doc.readyState)) {
            callDomLoadFunctions();
          }
        }, 10);
      }
      if (typeof doc.addEventListener != UNDEF) {
        doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, null);
      }
      addLoadEvent(callDomLoadFunctions);
    }();

    function checkReadyState() {
      if (script.readyState == "complete") {
        script.parentNode.removeChild(script);
        callDomLoadFunctions();
      }
    }

    function callDomLoadFunctions() {
      if (isDomLoaded) {
        return;
      }
      if (ua.ie && ua.win) { // Test if we can really add elements to the DOM; we don't want to fire it too early
        var s = createElement("span");
        try { // Avoid a possible Operation Aborted error
          var t = doc.getElementsByTagName("body")[0].appendChild(s);
          t.parentNode.removeChild(t);
        }
        catch (e) {
          return;
        }
      }
      isDomLoaded = true;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      var dl = domLoadFnArr.length;
      for (var i = 0; i < dl; i++) {
        domLoadFnArr[i]();
      }
    }

    function addDomLoadEvent(fn) {
      if (isDomLoaded) {
        fn();
      }
      else {
        domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
      }
    }

    /* Cross-browser onload
     - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
     - Will fire an event as soon as a web page including all of its assets are loaded
     */
    function addLoadEvent(fn) {
      if (typeof win.addEventListener != UNDEF) {
        win.addEventListener("load", fn, false);
      }
      else if (typeof doc.addEventListener != UNDEF) {
        doc.addEventListener("load", fn, false);
      }
      else if (typeof win.attachEvent != UNDEF) {
        addListener(win, "onload", fn);
      }
      else if (typeof win.onload == "function") {
        var fnOld = win.onload;
        win.onload = function () {
          fnOld();
          fn();
        };
      }
      else {
        win.onload = fn;
      }
    }

    /* Main function
     - Will preferably execute onDomLoad, otherwise onload (as a fallback)
     */
    function main() { // Static publishing only
      var rl = regObjArr.length;
      for (var i = 0; i < rl; i++) { // For each registered object element
        var id = regObjArr[i].id;
        if (ua.pv[0] > 0) {
          var obj = getElementById(id);
          if (obj) {
            regObjArr[i].width = obj.getAttribute("width") ? obj.getAttribute("width") : "0";
            regObjArr[i].height = obj.getAttribute("height") ? obj.getAttribute("height") : "0";
            if (hasPlayerVersion(regObjArr[i].swfVersion)) { // Flash plug-in version >= Flash content version: Houston, we have a match!
              if (ua.webkit && ua.webkit < 312) { // Older webkit engines ignore the object element's nested param elements
                fixParams(obj);
              }
              setVisibility(id, true);
            }
            else if (regObjArr[i].expressInstall && !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac)) { // Show the Adobe Express Install dialog if set by the web page author and if supported (fp6.0.65+ on Win/Mac OS only)
              showExpressInstall(regObjArr[i]);
            }
            else { // Flash plug-in and Flash content version mismatch: display alternative content instead of Flash content
              displayAltContent(obj);
            }
          }
        }
        else {	// If no fp is installed, we let the object element do its job (show alternative content)
          setVisibility(id, true);
        }
      }
    }

    /* Fix nested param elements, which are ignored by older webkit engines
     - This includes Safari up to and including version 1.2.2 on Mac OS 10.3
     - Fall back to the proprietary embed element
     */
    function fixParams(obj) {
      var nestedObj = obj.getElementsByTagName(OBJECT)[0];
      if (nestedObj) {
        var e = createElement("embed"), a = nestedObj.attributes;
        if (a) {
          var al = a.length;
          for (var i = 0; i < al; i++) {
            if (a[i].nodeName == "DATA") {
              e.setAttribute("src", a[i].nodeValue);
            }
            else {
              e.setAttribute(a[i].nodeName, a[i].nodeValue);
            }
          }
        }
        var c = nestedObj.childNodes;
        if (c) {
          var cl = c.length;
          for (var j = 0; j < cl; j++) {
            if (c[j].nodeType == 1 && c[j].nodeName == "PARAM") {
              e.setAttribute(c[j].getAttribute("name"), c[j].getAttribute("value"));
            }
          }
        }
        obj.parentNode.replaceChild(e, obj);
      }
    }

    /* Show the Adobe Express Install dialog
     - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
     */
    function showExpressInstall(regObj) {
      isExpressInstallActive = true;
      var obj = getElementById(regObj.id);
      if (obj) {
        if (regObj.altContentId) {
          var ac = getElementById(regObj.altContentId);
          if (ac) {
            storedAltContent = ac;
            storedAltContentId = regObj.altContentId;
          }
        }
        else {
          storedAltContent = abstractAltContent(obj);
        }
        if (!(/%$/.test(regObj.width)) && parseInt(regObj.width, 10) < 310) {
          regObj.width = "310";
        }
        if (!(/%$/.test(regObj.height)) && parseInt(regObj.height, 10) < 137) {
          regObj.height = "137";
        }
        doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
        var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
          dt = doc.title,
          fv = "MMredirectURL=" + win.location + "&MMplayerType=" + pt + "&MMdoctitle=" + dt,
          replaceId = regObj.id;
        // For IE when a SWF is loading (AND: not available in cache) wait for the onload event to fire to remove the original object element
        // In IE you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
        if (ua.ie && ua.win && obj.readyState != 4) {
          var newObj = createElement("div");
          replaceId += "SWFObjectNew";
          newObj.setAttribute("id", replaceId);
          obj.parentNode.insertBefore(newObj, obj); // Insert placeholder div that will be replaced by the object element that loads expressinstall.swf
          obj.style.display = "none";
          var fn = function () {
            obj.parentNode.removeChild(obj);
          };
          addListener(win, "onload", fn);
        }
        createSWF({
          data: regObj.expressInstall,
          id: EXPRESS_INSTALL_ID,
          width: regObj.width,
          height: regObj.height
        }, {flashvars: fv}, replaceId);
      }
    }

    /* Functions to abstract and display alternative content
     */
    function displayAltContent(obj) {
      if (ua.ie && ua.win && obj.readyState != 4) {
        // For IE when a SWF is loading (AND: not available in cache) wait for the onload event to fire to remove the original object element
        // In IE you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
        var el = createElement("div");
        obj.parentNode.insertBefore(el, obj); // Insert placeholder div that will be replaced by the alternative content
        el.parentNode.replaceChild(abstractAltContent(obj), el);
        obj.style.display = "none";
        var fn = function () {
          obj.parentNode.removeChild(obj);
        };
        addListener(win, "onload", fn);
      }
      else {
        obj.parentNode.replaceChild(abstractAltContent(obj), obj);
      }
    }

    function abstractAltContent(obj) {
      var ac = createElement("div");
      if (ua.win && ua.ie) {
        ac.innerHTML = obj.innerHTML;
      }
      else {
        var nestedObj = obj.getElementsByTagName(OBJECT)[0];
        if (nestedObj) {
          var c = nestedObj.childNodes;
          if (c) {
            var cl = c.length;
            for (var i = 0; i < cl; i++) {
              if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                ac.appendChild(c[i].cloneNode(true));
              }
            }
          }
        }
      }
      return ac;
    }

    /* Cross-browser dynamic SWF creation
     */
    function createSWF(attObj, parObj, id) {
      var r, el = getElementById(id);
      if (el) {
        if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
          attObj.id = id;
        }
        if (ua.ie && ua.win) { // IE, the object element and W3C DOM methods do not combine: fall back to outerHTML
          var att = "";
          for (var i in attObj) {
            if (attObj[i] != Object.prototype[i]) { // Filter out prototype additions from other potential libraries, like Object.prototype.toJSONString = function() {}
              if (i.toLowerCase() == "data") {
                parObj.movie = attObj[i];
              }
              else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                att += ' class="' + attObj[i] + '"';
              }
              else if (i.toLowerCase() != "classid") {
                att += ' ' + i + '="' + attObj[i] + '"';
              }
            }
          }
          var par = "";
          for (var j in parObj) {
            if (parObj[j] != Object.prototype[j]) { // Filter out prototype additions from other potential libraries
              par += '<param name="' + j + '" value="' + parObj[j] + '" />';
            }
          }
          el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
          objIdArr[objIdArr.length] = attObj.id; // Stored to fix object 'leaks' on unload (dynamic publishing only)
          r = getElementById(attObj.id);
        }
        else if (ua.webkit && ua.webkit < 312) { // Older webkit engines ignore the object element's nested param elements: fall back to the proprietary embed element
          var e = createElement("embed");
          e.setAttribute("type", FLASH_MIME_TYPE);
          for (var k in attObj) {
            if (attObj[k] != Object.prototype[k]) { // Filter out prototype additions from other potential libraries
              if (k.toLowerCase() == "data") {
                e.setAttribute("src", attObj[k]);
              }
              else if (k.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                e.setAttribute("class", attObj[k]);
              }
              else if (k.toLowerCase() != "classid") { // Filter out IE specific attribute
                e.setAttribute(k, attObj[k]);
              }
            }
          }
          for (var l in parObj) {
            if (parObj[l] != Object.prototype[l]) { // Filter out prototype additions from other potential libraries
              if (l.toLowerCase() != "movie") { // Filter out IE specific param element
                e.setAttribute(l, parObj[l]);
              }
            }
          }
          el.parentNode.replaceChild(e, el);
          r = e;
        }
        else { // Well-behaving browsers
          var o = createElement(OBJECT);
          o.setAttribute("type", FLASH_MIME_TYPE);
          for (var m in attObj) {
            if (attObj[m] != Object.prototype[m]) { // Filter out prototype additions from other potential libraries
              if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                o.setAttribute("class", attObj[m]);
              }
              else if (m.toLowerCase() != "classid") { // Filter out IE specific attribute
                o.setAttribute(m, attObj[m]);
              }
            }
          }
          for (var n in parObj) {
            if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // Filter out prototype additions from other potential libraries and IE specific param element
              createObjParam(o, n, parObj[n]);
            }
          }
          el.parentNode.replaceChild(o, el);
          r = o;
        }
      }
      return r;
    }

    function createObjParam(el, pName, pValue) {
      var p = createElement("param");
      p.setAttribute("name", pName);
      p.setAttribute("value", pValue);
      el.appendChild(p);
    }

    /* Cross-browser SWF removal
     - Especially needed to safely and completely remove a SWF in Internet Explorer
     */
    function removeSWF(id) {
      var obj = getElementById(id);
      if (obj && (obj.nodeName == "OBJECT" || obj.nodeName == "EMBED")) {
        if (ua.ie && ua.win) {
          if (obj.readyState == 4) {
            removeObjectInIE(id);
          }
          else {
            win.attachEvent("onload", function () {
              removeObjectInIE(id);
            });
          }
        }
        else {
          obj.parentNode.removeChild(obj);
        }
      }
    }

    function removeObjectInIE(id) {
      var obj = getElementById(id);
      if (obj) {
        for (var i in obj) {
          if (typeof obj[i] == "function") {
            obj[i] = null;
          }
        }
        obj.parentNode.removeChild(obj);
      }
    }

    /* Functions to optimize JavaScript compression
     */
    function getElementById(id) {
      var el = null;
      try {
        el = doc.getElementById(id);
      }
      catch (e) {
      }
      return el;
    }

    function createElement(el) {
      return doc.createElement(el);
    }

    /* Updated attachEvent function for Internet Explorer
     - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
     */
    function addListener(target, eventType, fn) {
      target.attachEvent(eventType, fn);
      listenersArr[listenersArr.length] = [target, eventType, fn];
    }

    /* Flash Player and SWF content version matching
     */
    function hasPlayerVersion(rv) {
      var pv = ua.pv, v = rv.split(".");
      v[0] = parseInt(v[0], 10);
      v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
      v[2] = parseInt(v[2], 10) || 0;
      return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }

    /* Cross-browser dynamic CSS creation
     - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
     */
    function createCSS(sel, decl) {
      if (ua.ie && ua.mac) {
        return;
      }
      var h = doc.getElementsByTagName("head")[0], s = createElement("style");
      s.setAttribute("type", "text/css");
      s.setAttribute("media", "screen");
      if (!(ua.ie && ua.win) && typeof doc.createTextNode != UNDEF) {
        s.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
      }
      h.appendChild(s);
      if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
        var ls = doc.styleSheets[doc.styleSheets.length - 1];
        if (typeof ls.addRule == OBJECT) {
          ls.addRule(sel, decl);
        }
      }
    }

    function setVisibility(id, isVisible) {
      var v = isVisible ? "visible" : "hidden";
      if (isDomLoaded && getElementById(id)) {
        getElementById(id).style.visibility = v;
      }
      else {
        createCSS("#" + id, "visibility:" + v);
      }
    }

    /* Filter to avoid XSS attacks
     */
    function urlEncodeIfNecessary(s) {
      var regex = /[\\\"<>\.;]/;
      var hasBadChars = regex.exec(s) != null;
      return hasBadChars ? encodeURIComponent(s) : s;
    }

    /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
     */
    var cleanup = function () {
      if (ua.ie && ua.win) {
        window.attachEvent("onunload", function () {
          // remove listeners to avoid memory leaks
          var ll = listenersArr.length;
          for (var i = 0; i < ll; i++) {
            listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
          }
          // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
          var il = objIdArr.length;
          for (var j = 0; j < il; j++) {
            removeSWF(objIdArr[j]);
          }
          // cleanup library's main closures to avoid memory leaks
          for (var k in ua) {
            ua[k] = null;
          }
          ua = null;
          for (var l in swfobject) {
            swfobject[l] = null;
          }
          swfobject = null;
        });
      }
    }();


    return {
      /* Public API
       - Reference: http://code.google.com/p/swfobject/wiki/SWFObject_2_0_documentation
       */
      registerObject: function (objectIdStr, swfVersionStr, xiSwfUrlStr) {
        if (!ua.w3cdom || !objectIdStr || !swfVersionStr) {
          return;
        }
        var regObj = {};
        regObj.id = objectIdStr;
        regObj.swfVersion = swfVersionStr;
        regObj.expressInstall = xiSwfUrlStr ? xiSwfUrlStr : false;
        regObjArr[regObjArr.length] = regObj;
        setVisibility(objectIdStr, false);
      },

      getObjectById: function (objectIdStr) {
        var r = null;
        if (ua.w3cdom) {
          var o = getElementById(objectIdStr);
          if (o) {
            var n = o.getElementsByTagName(OBJECT)[0];
            if (!n || (n && typeof o.SetVariable != UNDEF)) {
              r = o;
            }
            else if (typeof n.SetVariable != UNDEF) {
              r = n;
            }
          }
        }
        return r;
      },

      embedSWF: function (swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj) {
        if (!ua.w3cdom || !swfUrlStr || !replaceElemIdStr || !widthStr || !heightStr || !swfVersionStr) {
          return;
        }
        widthStr += ""; // Auto-convert to string
        heightStr += "";
        if (hasPlayerVersion(swfVersionStr)) {
          setVisibility(replaceElemIdStr, false);
          var att = {};
          if (attObj && typeof attObj === OBJECT) {
            for (var i in attObj) {
              if (attObj[i] != Object.prototype[i]) { // Filter out prototype additions from other potential libraries
                att[i] = attObj[i];
              }
            }
          }
          att.data = swfUrlStr;
          att.width = widthStr;
          att.height = heightStr;
          var par = {};
          if (parObj && typeof parObj === OBJECT) {
            for (var j in parObj) {
              if (parObj[j] != Object.prototype[j]) { // Filter out prototype additions from other potential libraries
                par[j] = parObj[j];
              }
            }
          }
          if (flashvarsObj && typeof flashvarsObj === OBJECT) {
            for (var k in flashvarsObj) {
              if (flashvarsObj[k] != Object.prototype[k]) { // Filter out prototype additions from other potential libraries
                if (typeof par.flashvars != UNDEF) {
                  par.flashvars += "&" + k + "=" + flashvarsObj[k];
                }
                else {
                  par.flashvars = k + "=" + flashvarsObj[k];
                }
              }
            }
          }
          addDomLoadEvent(function () {
            createSWF(att, par, replaceElemIdStr);
            if (att.id == replaceElemIdStr) {
              setVisibility(replaceElemIdStr, true);
            }
          });
        }
        else if (xiSwfUrlStr && !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac)) {
          isExpressInstallActive = true; // deferred execution
          setVisibility(replaceElemIdStr, false);
          addDomLoadEvent(function () {
            var regObj = {};
            regObj.id = regObj.altContentId = replaceElemIdStr;
            regObj.width = widthStr;
            regObj.height = heightStr;
            regObj.expressInstall = xiSwfUrlStr;
            showExpressInstall(regObj);
          });
        }
      },

      getFlashPlayerVersion: function () {
        return {major: ua.pv[0], minor: ua.pv[1], release: ua.pv[2]};
      },

      hasFlashPlayerVersion: hasPlayerVersion,

      createSWF: function (attObj, parObj, replaceElemIdStr) {
        if (ua.w3cdom) {
          return createSWF(attObj, parObj, replaceElemIdStr);
        }
        else {
          return undefined;
        }
      },

      removeSWF: function (objElemIdStr) {
        if (ua.w3cdom) {
          removeSWF(objElemIdStr);
        }
      },

      createCSS: function (sel, decl) {
        if (ua.w3cdom) {
          createCSS(sel, decl);
        }
      },

      addDomLoadEvent: addDomLoadEvent,

      addLoadEvent: addLoadEvent,

      getQueryParamValue: function (param) {
        var q = doc.location.search || doc.location.hash;
        if (param == null) {
          return urlEncodeIfNecessary(q);
        }
        if (q) {
          var pairs = q.substring(1).split("&");
          for (var i = 0; i < pairs.length; i++) {
            if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
              return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
            }
          }
        }
        return "";
      },

      // For internal usage only
      expressInstallCallback: function () {
        if (isExpressInstallActive && storedAltContent) {
          var obj = getElementById(EXPRESS_INSTALL_ID);
          if (obj) {
            obj.parentNode.replaceChild(storedAltContent, obj);
            if (storedAltContentId) {
              setVisibility(storedAltContentId, true);
              if (ua.ie && ua.win) {
                storedAltContent.style.display = "block";
              }
            }
            storedAltContent = null;
            storedAltContentId = null;
            isExpressInstallActive = false;
          }
        }
      }
    };
  }();
})(window);
// # Angular-Inview
// - Author: [Nicola Peduzzi](https://github.com/thenikso)
// - Repository: https://github.com/thenikso/angular-inview
// - Install with: `npm install angular-inview`
// - Version: **3.0.0**
(function() {
'use strict';

// An [angular.js](https://angularjs.org) directive to evaluate an expression if
// a DOM element is or not in the current visible browser viewport.
// Use it in your AngularJS app by including the javascript and requireing it:
//
// `angular.module('myApp', ['angular-inview'])`
var moduleName = 'angular-inview';
angular.module(moduleName, [])

// ## in-view directive
//
// ### Usage
// ```html
// <any in-view="{expression}" [in-view-options="{object}"]></any>
// ```
.directive('inView', ['$parse', inViewDirective])

// ## in-view-container directive
.directive('inViewContainer', inViewContainerDirective);

// ## Implementation
function inViewDirective ($parse) {
  return {
    // Evaluate the expression passet to the attribute `in-view` when the DOM
    // element is visible in the viewport.
    restrict: 'A',
    require: '?^^inViewContainer',
    link: function inViewDirectiveLink (scope, element, attrs, container) {
      // in-view-options attribute can be specified with an object expression
      // containing:
      //   - `offset`: An array of values to offset the element position.
      //     Offsets are expressed as arrays of 4 numbers [top, right, bottom, left].
      //     Like CSS, you can also specify only 2 numbers [top/bottom, left/right].
      //     Instead of numbers, some array elements can be a string with a percentage.
      //     Positive numbers are offsets outside the element rectangle and
      //     negative numbers are offsets to the inside.
      //   - `viewportOffset`: Like the element offset but appied to the viewport.
      //   - `generateDirection`: Indicate if the `direction` information should
      //     be included in `$inviewInfo` (default false).
      //   - `generateParts`: Indicate if the `parts` information should
      //     be included in `$inviewInfo` (default false).
      //   - `throttle`: Specify a number of milliseconds by which to limit the
      //     number of incoming events.
      var options = {};
      if (attrs.inViewOptions) {
        options = scope.$eval(attrs.inViewOptions);
      }
      if (options.offset) {
        options.offset = normalizeOffset(options.offset);
      }
      if (options.viewportOffset) {
        options.viewportOffset = normalizeOffset(options.viewportOffset);
      }

      // Build reactive chain from an initial event
      var viewportEventSignal = signalSingle({ type: 'initial' })

      // Merged with the window events
      .merge(signalFromEvent(window, 'checkInView click ready wheel mousewheel DomMouseScroll MozMousePixelScroll resize scroll touchmove mouseup keydown'))

      // Merge with container's events signal
      if (container) {
        viewportEventSignal = viewportEventSignal.merge(container.eventsSignal);
      }

      // Throttle if option specified
      if (options.throttle) {
        viewportEventSignal = viewportEventSignal.throttle(options.throttle);
      }

      // Map to viewport intersection and in-view informations
      var inviewInfoSignal = viewportEventSignal

      // Inview information structure contains:
      //   - `inView`: a boolean value indicating if the element is
      //     visible in the viewport;
      //   - `changed`: a boolean value indicating if the inview status
      //     changed after the last event;
      //   - `event`: the event that initiated the in-view check;
      .map(function(event) {
        var viewportRect;
        if (container) {
          viewportRect = container.getViewportRect();
          // TODO merge with actual window!
        } else {
          viewportRect = getViewportRect();
        }
        viewportRect = offsetRect(viewportRect, options.viewportOffset);
        var elementRect = offsetRect(element[0].getBoundingClientRect(), options.offset);
        var isVisible = !!(element[0].offsetWidth || element[0].offsetHeight || element[0].getClientRects().length);
        var info = {
          inView: isVisible && intersectRect(elementRect, viewportRect),
          event: event,
          element: element,
          elementRect: elementRect,
          viewportRect: viewportRect
        };
        // Add inview parts
        if (options.generateParts && info.inView) {
          info.parts = {};
          info.parts.top = elementRect.top >= viewportRect.top;
          info.parts.left = elementRect.left >= viewportRect.left;
          info.parts.bottom = elementRect.bottom <= viewportRect.bottom;
          info.parts.right = elementRect.right <= viewportRect.right;
        }
        return info;
      })

      // Add the changed information to the inview structure.
      .scan({}, function (lastInfo, newInfo) {
        // Add inview direction info
        if (options.generateDirection && newInfo.inView && lastInfo.elementRect) {
          newInfo.direction = {
            horizontal: newInfo.elementRect.left - lastInfo.elementRect.left,
            vertical: newInfo.elementRect.top - lastInfo.elementRect.top
          };
        }
        // Calculate changed flag
        newInfo.changed =
          newInfo.inView !== lastInfo.inView ||
          !angular.equals(newInfo.parts, lastInfo.parts) ||
          !angular.equals(newInfo.direction, lastInfo.direction);
        return newInfo;
      })

      // Filters only informations that should be forwarded to the callback
      .filter(function (info) {
        // Don't forward if no relevant infomation changed
        if (!info.changed) {
          return false;
        }
        // Don't forward if not initially in-view
        if (info.event.type === 'initial' && !info.inView) {
          return false;
        }
        return true;
      });

      // Execute in-view callback
      var inViewExpression = $parse(attrs.inView);
      var dispose = inviewInfoSignal.subscribe(function (info) {
        scope.$applyAsync(function () {
          inViewExpression(scope, {
            '$inview': info.inView,
            '$inviewInfo': info
          });
        });
      });

      // Dispose of reactive chain
      scope.$on('$destroy', dispose);
    }
  }
}

function inViewContainerDirective () {
  return {
    restrict: 'A',
    controller: ['$element', function ($element) {
      this.element = $element;
      this.eventsSignal = signalFromEvent($element, 'scroll');
      this.getViewportRect = function () {
        return $element[0].getBoundingClientRect();
      };
    }]
  }
}

// ## Utilities

function getViewportRect () {
  var result = {
    top: 0,
    left: 0,
    width: window.innerWidth,
    right: window.innerWidth,
    height: window.innerHeight,
    bottom: window.innerHeight
  };
  if (result.height) {
    return result;
  }
  var mode = document.compatMode;
  if (mode === 'CSS1Compat') {
    result.width = result.right = document.documentElement.clientWidth;
    result.height = result.bottom = document.documentElement.clientHeight;
  } else {
    result.width = result.right = document.body.clientWidth;
    result.height = result.bottom = document.body.clientHeight;
  }
  return result;
}

function intersectRect (r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function normalizeOffset (offset) {
  if (!angular.isArray(offset)) {
    return [offset, offset, offset, offset];
  }
  if (offset.length == 2) {
    return offset.concat(offset);
  }
  else if (offset.length == 3) {
    return offset.concat([offset[1]]);
  }
  return offset;
}

function offsetRect (rect, offset) {
  if (!offset) {
    return rect;
  }
  var offsetObject = {
    top: isPercent(offset[0]) ? (parseFloat(offset[0]) * rect.height / 100) : offset[0],
    right: isPercent(offset[1]) ? (parseFloat(offset[1]) * rect.width / 100) : offset[1],
    bottom: isPercent(offset[2]) ? (parseFloat(offset[2]) * rect.height / 100) : offset[2],
    left: isPercent(offset[3]) ? (parseFloat(offset[3]) * rect.width / 100) : offset[3]
  };
  // Note: ClientRect object does not allow its properties to be written to therefore a new object has to be created.
  return {
    top: rect.top - offsetObject.top,
    left: rect.left - offsetObject.left,
    bottom: rect.bottom + offsetObject.bottom,
    right: rect.right + offsetObject.right,
    height: rect.height + offsetObject.top + offsetObject.bottom,
    width: rect.width + offsetObject.left + offsetObject.right
  };
}

function isPercent (n) {
  return angular.isString(n) && n.indexOf('%') > 0;
}

// ## QuickSignal FRP
// A quick and dirty implementation of Rx to have a streamlined code in the
// directives.

// ### QuickSignal
//
// - `didSubscribeFunc`: a function receiving a `subscriber` as described below
//
// Usage:
//     var mySignal = new QuickSignal(function(subscriber) { ... })
function QuickSignal (didSubscribeFunc) {
  this.didSubscribeFunc = didSubscribeFunc;
}

// Subscribe to a signal and consume the steam of data.
//
// Returns a function that can be called to stop the signal stream of data and
// perform cleanup.
//
// A `subscriber` is a function that will be called when a new value arrives.
// a `subscriber.$dispose` property can be set to a function to be called uppon
// disposal. When setting the `$dispose` function, the previously set function
// should be chained.
QuickSignal.prototype.subscribe = function (subscriber) {
  this.didSubscribeFunc(subscriber);
  var dispose = function () {
    if (subscriber.$dispose) {
      subscriber.$dispose();
      subscriber.$dispose = null;
    }
  }
  return dispose;
}

QuickSignal.prototype.map = function (f) {
  var s = this;
  return new QuickSignal(function (subscriber) {
    subscriber.$dispose = s.subscribe(function (nextValue) {
      subscriber(f(nextValue));
    });
  });
};

QuickSignal.prototype.filter = function (f) {
  var s = this;
  return new QuickSignal(function (subscriber) {
    subscriber.$dispose = s.subscribe(function (nextValue) {
      if (f(nextValue)) {
        subscriber(nextValue);
      }
    });
  });
};

QuickSignal.prototype.scan = function (initial, scanFunc) {
  var s = this;
  return new QuickSignal(function (subscriber) {
    var last = initial;
    subscriber.$dispose = s.subscribe(function (nextValue) {
      last = scanFunc(last, nextValue);
      subscriber(last);
    });
  });
}

QuickSignal.prototype.merge = function (signal) {
  return signalMerge(this, signal);
};

QuickSignal.prototype.throttle = function (threshhold) {
  var s = this, last, deferTimer;
  return new QuickSignal(function (subscriber) {
    var chainDisposable = s.subscribe(function () {
      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          subscriber.apply(null, args);
        }, threshhold);
      } else {
        last = now;
        subscriber.apply(null, args);
      }
    });
    subscriber.$dispose = function () {
      clearTimeout(deferTimer);
      if (chainDisposable) chainDisposable();
    };
  });
};

function signalMerge () {
  var signals = arguments;
  return new QuickSignal(function (subscriber) {
    var disposables = [];
    for (var i = signals.length - 1; i >= 0; i--) {
      disposables.push(signals[i].subscribe(function () {
        subscriber.apply(null, arguments);
      }));
    }
    subscriber.$dispose = function () {
      for (var i = disposables.length - 1; i >= 0; i--) {
        if (disposables[i]) disposables[i]();
      }
    }
  });
}

// Returns a signal from DOM events of a target.
function signalFromEvent (target, event) {
  return new QuickSignal(function (subscriber) {
    var handler = function (e) {
      subscriber(e);
    };
    var el = angular.element(target);
    event.split(' ').map(e => el[0].addEventListener(e, handler, true));
    subscriber.$dispose = function () {
      event.split(' ').map(e => el[0].removeEventListener(e, handler, true));
    };
  });
}

function signalSingle (value) {
  return new QuickSignal(function (subscriber) {
    setTimeout(function() { subscriber(value); });
  });
}

// Module loaders exports
if (typeof define === 'function' && define.amd) {
  define(['angular'], moduleName);
} else if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = moduleName;
}

})();

org.ekstep.pluginframework.pluginManager.registerPlugin({"id":"org.ekstep.assetbrowser","ver":"1.2","shortId":"assetbrowser","author":"Sunil A S","title":"Asset Browser","description":"","publishedDate":"","editor":{"main":"editor/plugin.js","dependencies":[{"type":"js","src":"editor/recorder/wave/wavesurfer.min.js"},{"type":"js","src":"editor/recorder/angular-audio-recorder.js"},{"type":"js","src":"editor/libs/angular-inview.js"},{"type":"template","src":"./assetBrowser.html","bundle":true},{"type":"js","src":"./assetbrowserapp.js","bundle":true}]}},org.ekstep.contenteditor.basePlugin.extend({type:"assetbrowser",initData:void 0,cb:void 0,initialize:function(){var e=this;org.ekstep.contenteditor.api.addEventListener(this.manifest.id+":show",this.initPreview,this);org.ekstep.contenteditor.api.resolvePluginResource(e.manifest.id,e.manifest.ver,"editor/assetBrowser.html"),org.ekstep.contenteditor.api.resolvePluginResource(e.manifest.id,e.manifest.ver,"editor/assetbrowserapp.js");org.ekstep.contenteditor.api.getService("popup").loadNgModules(require("./assetBrowser.html"),require("./assetbrowserapp.js"),!0)},initPreview:function(e,t){var i=this;this.cb=t.callback,this.mediaType=t.type,this.search_filter=t.search_filter,org.ekstep.contenteditor.api.getService("popup").open({template:"partials/assetbrowser.html",controller:"browsercontroller",controllerAs:"$ctrl",resolve:{instance:function(){return i}},showClose:!1,className:"ngdialog-theme-plain"})},getAsset:function(e,t,i,r,s){var o,n;o={request:{filters:{mediaType:t,contentType:"Asset",compatibilityLevel:{min:1,max:2},status:new Array("Live","Review","Draft")},limit:50,offset:r}},!org.ekstep.contenteditor.api._.isUndefined(e)&&(o.request.query=e),org.ekstep.contenteditor.api._.isUndefined(i)?(o.request.filters.license="Creative Commons Attribution (CC BY)",n=org.ekstep.contenteditor.api._.omit(this.search_filter,["mediaType","license","limit"])):(o.request.filters.createdBy=i,n=org.ekstep.contenteditor.api._.omit(this.search_filter,["mediaType","limit","createdBy"])),org.ekstep.contenteditor.api._.merge(o.request.filters,n);org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);ecEditor.getService("search").search(o,function(e,t){e||"OK"!=t.data.responseCode?s(e,null):s(null,t)})},showAssetBrowser:function(e,t){},fileValidation:function(e,t,i){if(window.File&&window.FileList&&window.Blob){var r=org.ekstep.contenteditor.api.jQuery("#"+e)[0].files[0].size,s=org.ekstep.contenteditor.api.jQuery("#"+e)[0].files[0].type;return t<r?(alert("File size is higher than the allowed size!"),!1):!s||(-1!=org.ekstep.contenteditor.api.jQuery.inArray(s,i)||(alert("File type is not allowed!"),!1))}return!0}}))