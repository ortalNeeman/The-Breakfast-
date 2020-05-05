(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"OrtalNeeman_atlas_1", frames: [[0,0,1108,819],[0,821,1108,819]]},
		{name:"OrtalNeeman_atlas_2", frames: [[1899,580,12,12],[1949,387,86,76],[1899,594,12,12],[1949,283,83,102],[1012,548,73,117],[1072,727,12,12],[1799,283,148,118],[1072,741,12,12],[1938,689,13,12],[1072,755,12,12],[1072,769,12,12],[1072,783,12,12],[1850,829,12,12],[1850,843,12,12],[1864,829,12,12],[1878,829,12,12],[1864,843,12,12],[1878,843,12,12],[1718,283,12,12],[1718,297,12,12],[1090,0,626,325],[1718,311,12,12],[1732,283,12,12],[1732,297,12,12],[1799,403,135,126],[1918,563,59,46],[1792,592,105,235],[1858,531,58,47],[1012,667,58,47],[1012,716,58,47],[1718,0,306,281],[1966,867,57,47],[663,548,347,263],[1450,592,340,263],[1966,916,57,47],[349,704,57,47],[0,704,347,263],[1072,797,55,48],[1899,817,56,48],[1899,715,55,49],[1129,797,55,48],[1957,817,56,48],[404,805,54,49],[460,805,54,49],[349,753,53,50],[516,809,54,49],[1954,611,54,50],[404,753,53,50],[1899,611,53,51],[1012,765,58,47],[408,704,57,47],[1792,829,56,48],[1996,465,52,51],[1956,715,55,49],[459,753,53,50],[572,809,54,49],[514,753,53,50],[1850,867,56,48],[404,856,54,49],[569,757,53,50],[1799,531,57,48],[1899,766,55,49],[1450,327,347,263],[467,704,57,47],[1936,465,58,47],[1979,563,59,46],[1936,514,58,47],[1908,867,56,48],[526,704,57,47],[1956,766,55,49],[1186,797,55,48],[349,805,53,50],[1954,663,54,50],[1945,433,1,10],[585,704,52,51],[1951,664,1,10],[1951,676,1,10],[1919,708,6,4],[1944,448,2,14],[2040,560,4,40],[1918,531,9,30],[1935,703,7,8],[1913,580,3,6],[639,734,17,16],[1944,703,6,8],[1919,702,14,4],[1899,689,37,11],[1936,433,7,13],[2044,518,4,14],[1936,403,10,14],[1899,702,18,10],[1936,419,10,12],[1936,448,6,13],[1899,664,50,23],[639,704,20,28],[2010,669,25,42],[1090,327,358,468],[2040,602,6,6],[1996,518,46,40],[624,800,6,6],[2010,611,31,56],[1072,667,14,58],[624,757,17,41],[0,548,661,154],[0,0,1088,546]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_1046 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1051 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1040 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1048 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1047 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1035 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1049 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1036 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1028 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1041 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1023 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1024 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1022 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1034 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1042 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1017 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1043 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1039 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1031 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1013 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1050 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1009 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1045 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1008 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1007 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_921 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1005 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_922 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_923 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_924 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1006 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_926 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1002 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_997 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_927 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_928 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1004 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_933 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_931 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_934 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_932 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_929 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_937 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_936 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_941 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_938 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_939 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_942 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_943 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_925 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_888 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_930 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_944 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_935 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_940 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_892 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(55);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_878 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(56);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_881 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(57);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_879 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(58);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_894 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(59);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_882 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(60);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_880 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(61);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_657 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(62);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_883 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(63);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_886 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(64);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_920 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(65);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_634 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(66);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_632 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(67);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_853 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(68);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_630 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(69);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_890 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(70);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_628 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(71);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_855 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(72);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1105 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(73);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_946 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(74);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1104 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(75);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1103 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(76);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1078 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(77);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1077 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(78);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1076 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(79);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1075 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(80);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1074 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(81);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1072 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(82);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1073 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(83);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1071 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(84);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1070 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(85);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1069 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(86);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1068 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(87);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1067 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(88);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1065 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(89);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1066 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(90);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1064 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(91);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1063 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(92);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1062 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(93);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1061 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(94);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1060 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(95);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(96);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1057 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(97);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1054 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(98);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1058 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(99);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1053 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(100);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1059 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(101);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1052 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(102);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(103);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_626 = function() {
	this.initialize(ss["OrtalNeeman_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1102 = function() {
	this.initialize(ss["OrtalNeeman_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["OrtalNeeman_atlas_2"]);
	this.gotoAndStop(104);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.wheal_hand = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_1051();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.wheal_hand, new cjs.Rectangle(0,0,43,38), null);


(lib.Symbol5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_1049();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol5, new cjs.Rectangle(0,0,74,59), null);


(lib.Symbol4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_1048();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol4, new cjs.Rectangle(0,0,41.5,51), null);


(lib.Symbol2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_1047();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol2, new cjs.Rectangle(0,0,36.5,58.5), null);


(lib.star = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_1046();
	this.instance.setTransform(31.15,36.05,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_1045();
	this.instance_1.setTransform(28.95,34.8,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_1045();
	this.instance_2.setTransform(27.35,32.5,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_1043();
	this.instance_3.setTransform(28.35,30.8,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_1042();
	this.instance_4.setTransform(29.45,28.05,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_1041();
	this.instance_5.setTransform(31.1,28.1,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_1040();
	this.instance_6.setTransform(34.45,31.2,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_1039();
	this.instance_7.setTransform(33.3,30.55,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_1039();
	this.instance_8.setTransform(31.35,29.75,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_1041();
	this.instance_9.setTransform(35.8,37.15,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_1036();
	this.instance_10.setTransform(31.1,35.3,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_1035();
	this.instance_11.setTransform(33.05,36.45,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_1034();
	this.instance_12.setTransform(35.55,36,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_1034();
	this.instance_13.setTransform(35.55,36,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_1041();
	this.instance_14.setTransform(34,36.1,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_1031();
	this.instance_15.setTransform(34.2,36.2,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_1031();
	this.instance_16.setTransform(34.4,36.3,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_1036();
	this.instance_17.setTransform(34.8,35.55,0.5,0.5);

	this.instance_18 = new lib.CachedBmp_1028();
	this.instance_18.setTransform(34.05,35.15,0.5,0.5);

	this.instance_19 = new lib.CachedBmp_1041();
	this.instance_19.setTransform(34.05,35.15,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_1041();
	this.instance_20.setTransform(33.9,35.05,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_1034();
	this.instance_21.setTransform(33.5,34.85,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_1024();
	this.instance_22.setTransform(32.6,34.3,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_1023();
	this.instance_23.setTransform(32.45,34.2,0.5,0.5);

	this.instance_24 = new lib.CachedBmp_1022();
	this.instance_24.setTransform(31.9,33.9,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_1034();
	this.instance_25.setTransform(31.15,33.45,0.5,0.5);

	this.instance_26 = new lib.CachedBmp_1034();
	this.instance_26.setTransform(31.15,33.45,0.5,0.5);

	this.instance_27 = new lib.CachedBmp_1045();
	this.instance_27.setTransform(28.9,31.1,0.5,0.5);

	this.instance_28 = new lib.CachedBmp_1042();
	this.instance_28.setTransform(27.25,30.15,0.5,0.5);

	this.instance_29 = new lib.CachedBmp_1017();
	this.instance_29.setTransform(27,32.7,0.5,0.5);

	this.instance_30 = new lib.CachedBmp_1043();
	this.instance_30.setTransform(26.85,32.6,0.5,0.5);

	this.instance_31 = new lib.CachedBmp_1039();
	this.instance_31.setTransform(26.35,31.7,0.5,0.5);

	this.instance_32 = new lib.CachedBmp_1031();
	this.instance_32.setTransform(26.95,32,0.5,0.5);

	this.instance_33 = new lib.CachedBmp_1013();
	this.instance_33.setTransform(27.25,31.85,0.5,0.5);

	this.instance_34 = new lib.CachedBmp_1013();
	this.instance_34.setTransform(27.25,31.85,0.5,0.5);

	this.instance_35 = new lib.CachedBmp_1013();
	this.instance_35.setTransform(27.25,31.85,0.5,0.5);

	this.instance_36 = new lib.CachedBmp_1045();
	this.instance_36.setTransform(26.55,31,0.5,0.5);

	this.instance_37 = new lib.CachedBmp_1009();
	this.instance_37.setTransform(28.9,32.15,0.5,0.5);

	this.instance_38 = new lib.CachedBmp_1008();
	this.instance_38.setTransform(26.6,30.85,0.5,0.5);

	this.instance_39 = new lib.CachedBmp_1007();
	this.instance_39.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.star, new cjs.Rectangle(0,0,67.5,63), null);


(lib.Scene_1_background_ocean = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// background_ocean
	this.instance = new lib.CachedBmp_626();
	this.instance.setTransform(-0.95,-4.8,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_1102();
	this.instance_1.setTransform(-0.95,-4.8,0.5,0.5);
	this.instance_1._off = true;

	this.instance_2 = new lib.CachedBmp_1103();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_1104();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_1105();
	this.instance_4.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(558).to({_off:true},1).wait(80).to({_off:false},0).to({_off:true},1).wait(3));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(559).to({_off:false},0).wait(79).to({_off:true},1).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.playy = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("Play", "bold 37px 'Calibri'", "#000058");
	this.text.lineHeight = 45;
	this.text.lineWidth = 100;
	this.text.alpha = 0.80000000;
	this.text.parent = this;
	this.text.setTransform(40.75,22.35);

	this.instance = new lib.CachedBmp_1006();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.playy, new cjs.Rectangle(0,0,153,140.5), null);


(lib.leave = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_1005();
	this.instance.setTransform(0,0,0.3798,0.3798);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.leave, new cjs.Rectangle(0,0,39.9,89.3), null);


(lib.___Camera___ = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-276,-201,552,402);


(lib.wheal = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// wheal_tail
	this.instance = new lib.Symbol5();
	this.instance.setTransform(7.05,25.4,1,1,0,0,0,37,29.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:29.5,rotation:-2.4999,x:6.35,y:27.15},0).wait(1).to({rotation:-4.9999,x:5.55,y:28.75},0).wait(1).to({rotation:-7.4998,x:4.85,y:30.35},0).wait(1).to({rotation:-8.2498,x:4.45,y:30.85},0).wait(1).to({rotation:-8.9998,x:4.05,y:31.35},0).wait(1).to({rotation:-9.7498,x:3.65,y:31.8},0).wait(1).to({rotation:-10.4998,x:3.35,y:32.3},0).wait(1).to({rotation:-11.2497,x:2.9,y:32.8},0).wait(1).to({rotation:-11.9997,x:2.55,y:33.25},0).wait(1).to({rotation:-12.7497,x:2.15,y:33.75},0).wait(1).to({rotation:-13.4997,x:1.8,y:34.25},0).wait(1).to({rotation:-14.2497,x:1.35,y:34.75},0).wait(1).to({rotation:-14.9997,x:1,y:35.2},0).wait(1).to({rotation:-13.7497,x:1.6,y:34.55},0).wait(1).to({rotation:-12.4997,x:2.2,y:33.95},0).wait(1).to({rotation:-11.2498,x:2.85,y:33.3},0).wait(1).to({rotation:-9.9998,x:3.45,y:32.65},0).wait(1).to({rotation:-8.7498,x:4.1,y:31.95},0).wait(1).to({rotation:-7.4998,x:4.7,y:31.35},0).wait(1).to({rotation:-6.2499,x:5.35,y:30.65},0).wait(1).to({rotation:-4.9999,x:5.9,y:30.1},0).wait(1).to({rotation:-3.7499,x:6.55,y:29.45},0).wait(1).to({rotation:-2.4999,x:7.2,y:28.75},0).wait(1).to({rotation:-1.25,x:7.8,y:28.2},0).wait(1).to({rotation:0,x:8.4,y:27.5},0).wait(1).to({rotation:-1.3635,x:7.8,y:28.3},0).wait(1).to({rotation:-2.7271,x:7.2,y:29},0).wait(1).to({rotation:-4.0906,x:6.6,y:29.75},0).wait(1).to({rotation:-5.4541,x:6,y:30.55},0).wait(1).to({rotation:-6.8177,x:5.35,y:31.3},0).wait(1).to({rotation:-8.1812,x:4.75,y:32.05},0).wait(1).to({rotation:-9.5448,x:4.15,y:32.8},0).wait(1).to({rotation:-10.9083,x:3.55,y:33.55},0).wait(1).to({rotation:-12.2718,x:2.9,y:34.4},0).wait(1).to({rotation:-13.6354,x:2.3,y:35.1},0).wait(1).to({rotation:-14.9989,x:1.7,y:35.85},0).wait(1).to({rotation:-13.3324,x:2.3,y:34.75},0).wait(1).to({rotation:-11.6658,x:2.85,y:33.7},0).wait(1).to({rotation:-9.9993,x:3.45,y:32.65},0).wait(1).to({rotation:-8.3327,x:4.05,y:31.55},0).wait(1).to({rotation:-6.6662,x:4.65,y:30.45},0).wait(1).to({rotation:-4.9996,x:5.2,y:29.4},0).wait(1).to({rotation:-3.3331,x:5.85,y:28.3},0).wait(1).to({rotation:-1.6665,x:6.45,y:27.25},0).wait(1).to({rotation:0,x:7,y:26.15},0).wait(3));

	// wheal_hand
	this.instance_1 = new lib.wheal_hand();
	this.instance_1.setTransform(165.75,151.95,1,1,0,0,0,21.5,18.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({regY:19,y:152.05},0).wait(1).to({rotation:1.6665,x:166.1,y:151.15},0).wait(1).to({rotation:3.3331,x:166.5,y:150.3},0).wait(1).to({rotation:4.9996,x:166.85,y:149.45},0).wait(1).to({rotation:6.6662,x:167.25,y:148.55},0).wait(1).to({rotation:8.3327,x:167.6,y:147.7},0).wait(1).to({rotation:9.9993,x:168,y:146.85},0).wait(1).to({rotation:11.6658,x:168.4,y:146},0).wait(1).to({rotation:13.3324,x:168.75,y:145.15},0).wait(1).to({rotation:14.9989,x:169.15,y:144.25},0).wait(1).to({rotation:13.9276,x:169.2,y:144.55},0).wait(1).to({rotation:12.8562,x:169.15,y:144.85},0).wait(1).to({rotation:11.7849,x:169.2,y:145.15},0).wait(1).to({rotation:10.7135,x:169.25,y:145.45},0).wait(1).to({rotation:9.6422,y:145.75},0).wait(1).to({rotation:8.5708,y:146.05},0).wait(1).to({rotation:7.4995,y:146.35},0).wait(1).to({rotation:6.4281,y:146.65},0).wait(1).to({rotation:5.3568,x:169.35,y:146.9},0).wait(1).to({rotation:4.2854,x:169.4,y:147.2},0).wait(1).to({rotation:3.2141,x:169.35,y:147.45},0).wait(1).to({rotation:2.1427,x:169.4,y:147.8},0).wait(1).to({rotation:1.0714,y:148.1},0).wait(1).to({rotation:0,x:169.45,y:148.4},0).wait(1).to({rotation:2.1427,x:169.05,y:148.05},0).wait(1).to({rotation:4.2854,x:168.65,y:147.75},0).wait(1).to({rotation:6.4281,x:168.2,y:147.4},0).wait(1).to({rotation:8.5708,x:167.8,y:147.1},0).wait(1).to({rotation:10.7135,x:167.4,y:146.75},0).wait(1).to({rotation:12.8562,x:167,y:146.45},0).wait(1).to({rotation:14.9989,x:166.6,y:146.1},0).wait(1).to({rotation:13.3324,x:166.7,y:146.55},0).wait(1).to({rotation:11.6658,x:166.9,y:146.95},0).wait(1).to({rotation:9.9993,x:167.05,y:147.4},0).wait(1).to({rotation:8.3327,x:167.2,y:147.8},0).wait(1).to({rotation:6.6662,x:167.35,y:148.25},0).wait(1).to({rotation:4.9996,x:167.5,y:148.7},0).wait(1).to({rotation:3.3331,x:167.65,y:149.1},0).wait(1).to({rotation:1.6665,x:167.85,y:149.55},0).wait(1).to({rotation:0,x:168,y:150},0).wait(8));

	// wheal_body
	this.instance_2 = new lib.CachedBmp_1050();
	this.instance_2.setTransform(15.85,-8.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(48));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-42.3,-8.6,371.2,179.7);


(lib.Scene_1_weal = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// weal
	this.instance = new lib.wheal();
	this.instance.setTransform(-188,111.15,1,1,4.9642,0,0,148.2,81.3);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(178).to({_off:false},0).wait(1).to({regX:143.2,regY:81.2,rotation:6.2838,x:-157.65,y:111.65},0).wait(1).to({rotation:7.6029,x:-122.3,y:112.8},0).wait(1).to({rotation:8.922,x:-87,y:113.85},0).wait(1).to({rotation:10.2411,x:-51.7,y:114.95},0).wait(1).to({rotation:11.5602,x:-16.35,y:116.05},0).wait(1).to({rotation:12.8793,x:18.95,y:117.1},0).wait(1).to({rotation:14.1984,x:54.35,y:118.15},0).wait(1).to({rotation:15.5175,x:89.65,y:119.3},0).wait(1).to({rotation:16.8366,x:124.9,y:120.4},0).wait(1).to({rotation:18.1557,x:160.25,y:121.5},0).wait(1).to({regX:148.8,regY:80,x:165,y:123.05},0).wait(1).to({regX:143.2,regY:81.2,x:159.25,y:122.4},0).wait(314).to({_off:true},1).wait(49));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_play_idn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// play_idn
	this.playB = new lib.playy();
	this.playB.name = "playB";
	this.playB.setTransform(268.35,217.65,1,1,0,0,0,76.4,70.4);

	this.timeline.addTween(cjs.Tween.get(this.playB).to({_off:true},1).wait(436));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.fish_shoke = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// fish_tail
	this.instance = new lib.Symbol2();
	this.instance.setTransform(191.5,76.15,1,1,0,0,0,18.2,29.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:18.3,regY:29.3,rotation:-1.3335,x:191.35,y:76},0).wait(1).to({rotation:-2.6671,x:191.05,y:75.8},0).wait(1).to({rotation:-4.0006,x:190.75,y:75.6},0).wait(1).to({rotation:-5.3342,x:190.45,y:75.4},0).wait(1).to({rotation:-6.6677,x:190.25,y:75.25},0).wait(1).to({rotation:-8.0013,x:189.95,y:75},0).wait(1).to({rotation:-6.8583,x:189.9,y:75.1},0).wait(1).to({rotation:-5.7152,y:75.25},0).wait(1).to({rotation:-4.5722,x:189.95,y:75.35},0).wait(1).to({rotation:-3.4291,x:189.9,y:75.45},0).wait(1).to({rotation:-2.2861,x:189.95,y:75.6},0).wait(1).to({rotation:-1.143,y:75.75},0).wait(1).to({rotation:0,y:75.85},0).wait(7).to({regX:17.9,regY:28.8,rotation:-8.001,x:189.75,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.15,y:75.45},0).wait(1).to({rotation:-5.7152,y:75.6},0).wait(1).to({rotation:-4.5722,y:75.7},0).wait(1).to({rotation:-3.4291,x:190.1,y:75.85},0).wait(1).to({rotation:-2.2861,y:75.95},0).wait(1).to({rotation:-1.143,x:190.15,y:76.1},0).wait(1).to({rotation:0,x:190.1,y:76.2},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(5).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.85,y:74.85},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.25,y:75.5},0).wait(1).to({rotation:-5.7152,y:75.65},0).wait(1).to({rotation:-4.5722,y:75.75},0).wait(1).to({rotation:-3.4291,x:190.2,y:75.9},0).wait(1).to({rotation:-2.2861,y:76},0).wait(1).to({rotation:-1.143,x:190.25,y:76.15},0).wait(1).to({rotation:0,x:190.2,y:76.25},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:18,regY:28.9,rotation:-8.001,x:189.75,y:74.95},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.401,x:190.1,y:75.45},0).wait(1).to({rotation:-4.8008,y:75.6},0).wait(1).to({rotation:-3.2005,y:75.8},0).wait(1).to({rotation:-1.6003,x:190.05,y:76},0).wait(1).to({rotation:0,y:76.15},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:18,regY:28.9,rotation:-8.001,x:189.75,y:74.95},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.401,x:190.1,y:75.45},0).wait(1).to({rotation:-4.8008,y:75.6},0).wait(1).to({rotation:-3.2005,y:75.8},0).wait(1).to({rotation:-1.6003,x:190.05,y:76},0).wait(1).to({rotation:0,y:76.15},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:18.2,regY:29.2,x:191.5,y:76.15},0).wait(1).to({regX:18.3,regY:29.3,rotation:-1.3335,x:191.35,y:76},0).wait(1).to({rotation:-2.6671,x:191.05,y:75.8},0).wait(1).to({rotation:-4.0006,x:190.75,y:75.6},0).wait(1).to({rotation:-5.3342,x:190.45,y:75.4},0).wait(1).to({rotation:-6.6677,x:190.25,y:75.25},0).wait(1).to({rotation:-8.0013,x:189.95,y:75},0).wait(1).to({rotation:-6.8583,x:189.9,y:75.1},0).wait(1).to({rotation:-5.7152,y:75.25},0).wait(1).to({rotation:-4.5722,x:189.95,y:75.35},0).wait(1).to({rotation:-3.4291,x:189.9,y:75.45},0).wait(1).to({rotation:-2.2861,x:189.95,y:75.6},0).wait(1).to({rotation:-1.143,y:75.75},0).wait(1).to({rotation:0,y:75.85},0).wait(7).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.85,y:74.85},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.25,y:75.5},0).wait(1).to({rotation:-5.7152,y:75.65},0).wait(1).to({rotation:-4.5722,y:75.75},0).wait(1).to({rotation:-3.4291,x:190.2,y:75.9},0).wait(1).to({rotation:-2.2861,y:76},0).wait(1).to({rotation:-1.143,x:190.25,y:76.15},0).wait(1).to({rotation:0,x:190.2,y:76.25},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(5).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.9,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.3,y:75.55},0).wait(1).to({rotation:-5.7152,x:190.25,y:75.7},0).wait(1).to({rotation:-4.5722,x:190.3,y:75.8},0).wait(1).to({rotation:-3.4291,x:190.25,y:75.95},0).wait(1).to({rotation:-2.2861,y:76.05},0).wait(1).to({rotation:-1.143,y:76.2},0).wait(1).to({rotation:0,y:76.3},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:17.9,regY:28.8,rotation:-8.001,x:189.75,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.401,x:190.15,y:75.5},0).wait(1).to({rotation:-4.8008,y:75.65},0).wait(1).to({rotation:-3.2005,y:75.85},0).wait(1).to({rotation:-1.6003,x:190.1,y:76.05},0).wait(1).to({rotation:0,y:76.2},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:17.9,regY:28.8,rotation:-8.001,x:189.75,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.401,x:190.15,y:75.5},0).wait(1).to({rotation:-4.8008,y:75.65},0).wait(1).to({rotation:-3.2005,y:75.85},0).wait(1).to({rotation:-1.6003,x:190.1,y:76.05},0).wait(1).to({rotation:0,y:76.2},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:18.2,regY:29.2,x:191.5,y:76.15},0).wait(1).to({regX:18.3,regY:29.3,rotation:-1.3335,x:191.35,y:76},0).wait(1).to({rotation:-2.6671,x:191.05,y:75.8},0).wait(1).to({rotation:-4.0006,x:190.75,y:75.6},0).wait(1).to({rotation:-5.3342,x:190.45,y:75.4},0).wait(1).to({rotation:-6.6677,x:190.25,y:75.25},0).wait(1).to({rotation:-8.0013,x:189.95,y:75},0).wait(1).to({rotation:-6.8583,x:189.9,y:75.1},0).wait(1).to({rotation:-5.7152,y:75.25},0).wait(1).to({rotation:-4.5722,x:189.95,y:75.35},0).wait(1).to({rotation:-3.4291,x:189.9,y:75.45},0).wait(1).to({rotation:-2.2861,x:189.95,y:75.6},0).wait(1).to({rotation:-1.143,y:75.75},0).wait(1).to({rotation:0,y:75.85},0).wait(7).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.85,y:74.85},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.25,y:75.5},0).wait(1).to({rotation:-5.7152,y:75.65},0).wait(1).to({rotation:-4.5722,y:75.75},0).wait(1).to({rotation:-3.4291,x:190.2,y:75.9},0).wait(1).to({rotation:-2.2861,y:76},0).wait(1).to({rotation:-1.143,x:190.25,y:76.15},0).wait(1).to({rotation:0,x:190.2,y:76.25},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(5).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.9,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.3,y:75.55},0).wait(1).to({rotation:-5.7152,x:190.25,y:75.7},0).wait(1).to({rotation:-4.5722,x:190.3,y:75.8},0).wait(1).to({rotation:-3.4291,x:190.25,y:75.95},0).wait(1).to({rotation:-2.2861,y:76.05},0).wait(1).to({rotation:-1.143,y:76.2},0).wait(1).to({rotation:0,y:76.3},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:17.9,regY:28.8,rotation:-8.001,x:189.75,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.401,x:190.15,y:75.5},0).wait(1).to({rotation:-4.8008,y:75.65},0).wait(1).to({rotation:-3.2005,y:75.85},0).wait(1).to({rotation:-1.6003,x:190.1,y:76.05},0).wait(1).to({rotation:0,y:76.2},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:17.9,regY:28.8,rotation:-8.001,x:189.75,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.401,x:190.15,y:75.5},0).wait(1).to({rotation:-4.8008,y:75.65},0).wait(1).to({rotation:-3.2005,y:75.85},0).wait(1).to({rotation:-1.6003,x:190.1,y:76.05},0).wait(1).to({rotation:0,y:76.2},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:18.2,regY:29.2,x:191.5,y:76.15},0).wait(1).to({regX:18.3,regY:29.3,rotation:-1.3335,x:191.35,y:76},0).wait(1).to({rotation:-2.6671,x:191.05,y:75.8},0).wait(1).to({rotation:-4.0006,x:190.75,y:75.6},0).wait(1).to({rotation:-5.3342,x:190.45,y:75.4},0).wait(1).to({rotation:-6.6677,x:190.25,y:75.25},0).wait(1).to({rotation:-8.0013,x:189.95,y:75},0).wait(1).to({rotation:-6.8583,x:189.9,y:75.1},0).wait(1).to({rotation:-5.7152,y:75.25},0).wait(1).to({rotation:-4.5722,x:189.95,y:75.35},0).wait(1).to({rotation:-3.4291,x:189.9,y:75.45},0).wait(1).to({rotation:-2.2861,x:189.95,y:75.6},0).wait(1).to({rotation:-1.143,y:75.75},0).wait(1).to({rotation:0,y:75.85},0).wait(7).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.9,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.3,y:75.55},0).wait(1).to({rotation:-5.7152,x:190.25,y:75.7},0).wait(1).to({rotation:-4.5722,x:190.3,y:75.8},0).wait(1).to({rotation:-3.4291,x:190.25,y:75.95},0).wait(1).to({rotation:-2.2861,y:76.05},0).wait(1).to({rotation:-1.143,y:76.2},0).wait(1).to({rotation:0,y:76.3},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(5).to({regX:18,regY:28.6,rotation:-8.001,x:189.8,y:74.85},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.8583,x:190.15,y:75.6},0).wait(1).to({rotation:-5.7152,x:190.1,y:75.75},0).wait(1).to({rotation:-4.5722,x:190.15,y:75.85},0).wait(1).to({rotation:-3.4291,x:190.1,y:76},0).wait(1).to({rotation:-2.2861,y:76.1},0).wait(1).to({rotation:-1.143,y:76.25},0).wait(1).to({rotation:0,y:76.35},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(3).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.85,y:74.85},0).wait(1).to({regX:18.3,regY:29.3,rotation:-6.401,x:190.25,y:75.55},0).wait(1).to({rotation:-4.8008,y:75.7},0).wait(1).to({rotation:-3.2005,x:190.2,y:75.95},0).wait(1).to({rotation:-1.6003,y:76.1},0).wait(1).to({rotation:0,y:76.25},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(2).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(8).to({regX:17.9,regY:28.7,rotation:-8.001,x:189.9,y:74.9},0).wait(1).to({regX:18.3,regY:29.3,rotation:-7.5012,x:190.3,y:75.5},0).wait(1).to({rotation:-7.0011,y:75.55},0).wait(1).to({rotation:-6.5011,y:75.6},0).wait(1).to({rotation:-6.001,y:75.7},0).wait(1).to({rotation:-5.5009,x:190.25},0).wait(1).to({rotation:-5.0008,x:190.3,y:75.8},0).wait(1).to({rotation:-4.5007},0).wait(1).to({rotation:-4.0006,y:75.9},0).wait(1).to({rotation:-3.5006,x:190.25,y:75.95},0).wait(1).to({rotation:-3.0005,y:76},0).wait(1).to({rotation:-2.5004,x:190.3},0).wait(1).to({rotation:-2.0003,x:190.25,y:76.1},0).wait(1).to({rotation:-1.5002,y:76.15},0).wait(1).to({rotation:-1.0002,y:76.25},0).wait(1).to({rotation:-0.5001},0).wait(1).to({rotation:0,y:76.3},0).wait(1).to({regX:18.2,regY:29.2,x:189.85,y:75.75},0).wait(1).to({regX:18.3,regY:29.3,x:189.95,y:75.85},0).wait(11));

	// fish_hand
	this.instance_1 = new lib.CachedBmp_946();
	this.instance_1.setTransform(67,118.3,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_894();
	this.instance_2.setTransform(66.75,118.55,0.5,0.5);
	this.instance_2._off = true;

	this.instance_3 = new lib.CachedBmp_940();
	this.instance_3.setTransform(66.55,118.8,0.5,0.5);
	this.instance_3._off = true;

	this.instance_4 = new lib.CachedBmp_892();
	this.instance_4.setTransform(66.3,119,0.5,0.5);
	this.instance_4._off = true;

	this.instance_5 = new lib.CachedBmp_935();
	this.instance_5.setTransform(66.1,119.25,0.5,0.5);
	this.instance_5._off = true;

	this.instance_6 = new lib.CachedBmp_890();
	this.instance_6.setTransform(65.9,119.45,0.5,0.5);
	this.instance_6._off = true;

	this.instance_7 = new lib.CachedBmp_930();
	this.instance_7.setTransform(65.65,119.65,0.5,0.5);
	this.instance_7._off = true;

	this.instance_8 = new lib.CachedBmp_888();
	this.instance_8.setTransform(65.45,119.85,0.5,0.5);
	this.instance_8._off = true;

	this.instance_9 = new lib.CachedBmp_925();
	this.instance_9.setTransform(65.2,120,0.5,0.5);
	this.instance_9._off = true;

	this.instance_10 = new lib.CachedBmp_886();
	this.instance_10.setTransform(65,120.2,0.5,0.5);
	this.instance_10._off = true;

	this.instance_11 = new lib.CachedBmp_920();
	this.instance_11.setTransform(64.75,120.35,0.5,0.5);
	this.instance_11._off = true;

	this.instance_12 = new lib.CachedBmp_878();
	this.instance_12.setTransform(66.5,118.8,0.5,0.5);
	this.instance_12._off = true;

	this.instance_13 = new lib.CachedBmp_879();
	this.instance_13.setTransform(66.25,119.1,0.5,0.5);
	this.instance_13._off = true;

	this.instance_14 = new lib.CachedBmp_880();
	this.instance_14.setTransform(66,119.35,0.5,0.5);
	this.instance_14._off = true;

	this.instance_15 = new lib.CachedBmp_881();
	this.instance_15.setTransform(65.75,119.55,0.5,0.5);
	this.instance_15._off = true;

	this.instance_16 = new lib.CachedBmp_882();
	this.instance_16.setTransform(65.5,119.75,0.5,0.5);
	this.instance_16._off = true;

	this.instance_17 = new lib.CachedBmp_883();
	this.instance_17.setTransform(65.25,120,0.5,0.5);
	this.instance_17._off = true;

	this.instance_18 = new lib.CachedBmp_853();
	this.instance_18.setTransform(65.3,119.95,0.5,0.5);
	this.instance_18._off = true;

	this.instance_19 = new lib.CachedBmp_855();
	this.instance_19.setTransform(66.45,118.9,0.5,0.5);
	this.instance_19._off = true;

	this.instance_20 = new lib.CachedBmp_944();
	this.instance_20.setTransform(66.9,118.4,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_943();
	this.instance_21.setTransform(66.8,118.5,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_942();
	this.instance_22.setTransform(66.75,118.6,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_941();
	this.instance_23.setTransform(66.65,118.7,0.5,0.5);

	this.instance_24 = new lib.CachedBmp_939();
	this.instance_24.setTransform(66.45,118.85,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_938();
	this.instance_25.setTransform(66.35,118.95,0.5,0.5);

	this.instance_26 = new lib.CachedBmp_937();
	this.instance_26.setTransform(66.3,119.05,0.5,0.5);

	this.instance_27 = new lib.CachedBmp_936();
	this.instance_27.setTransform(66.2,119.15,0.5,0.5);

	this.instance_28 = new lib.CachedBmp_934();
	this.instance_28.setTransform(66,119.35,0.5,0.5);

	this.instance_29 = new lib.CachedBmp_933();
	this.instance_29.setTransform(65.9,119.4,0.5,0.5);

	this.instance_30 = new lib.CachedBmp_932();
	this.instance_30.setTransform(65.85,119.5,0.5,0.5);

	this.instance_31 = new lib.CachedBmp_931();
	this.instance_31.setTransform(65.75,119.55,0.5,0.5);

	this.instance_32 = new lib.CachedBmp_929();
	this.instance_32.setTransform(65.55,119.7,0.5,0.5);

	this.instance_33 = new lib.CachedBmp_928();
	this.instance_33.setTransform(65.45,119.8,0.5,0.5);

	this.instance_34 = new lib.CachedBmp_927();
	this.instance_34.setTransform(65.4,119.85,0.5,0.5);

	this.instance_35 = new lib.CachedBmp_926();
	this.instance_35.setTransform(65.3,119.95,0.5,0.5);

	this.instance_36 = new lib.CachedBmp_924();
	this.instance_36.setTransform(65.1,120.1,0.5,0.5);

	this.instance_37 = new lib.CachedBmp_923();
	this.instance_37.setTransform(65,120.15,0.5,0.5);

	this.instance_38 = new lib.CachedBmp_922();
	this.instance_38.setTransform(64.95,120.25,0.5,0.5);

	this.instance_39 = new lib.CachedBmp_921();
	this.instance_39.setTransform(64.85,120.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_20}]},1).to({state:[{t:this.instance_21}]},1).to({state:[{t:this.instance_22}]},1).to({state:[{t:this.instance_23}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_24}]},1).to({state:[{t:this.instance_25}]},1).to({state:[{t:this.instance_26}]},1).to({state:[{t:this.instance_27}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_28}]},1).to({state:[{t:this.instance_29}]},1).to({state:[{t:this.instance_30}]},1).to({state:[{t:this.instance_31}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_32}]},1).to({state:[{t:this.instance_33}]},1).to({state:[{t:this.instance_34}]},1).to({state:[{t:this.instance_35}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_36}]},1).to({state:[{t:this.instance_37}]},1).to({state:[{t:this.instance_38}]},1).to({state:[{t:this.instance_39}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_39}]},1).to({state:[{t:this.instance_38}]},1).to({state:[{t:this.instance_37}]},1).to({state:[{t:this.instance_36}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_35}]},1).to({state:[{t:this.instance_34}]},1).to({state:[{t:this.instance_33}]},1).to({state:[{t:this.instance_32}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_31}]},1).to({state:[{t:this.instance_30}]},1).to({state:[{t:this.instance_29}]},1).to({state:[{t:this.instance_28}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_27}]},1).to({state:[{t:this.instance_26}]},1).to({state:[{t:this.instance_25}]},1).to({state:[{t:this.instance_24}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_23}]},1).to({state:[{t:this.instance_22}]},1).to({state:[{t:this.instance_21}]},1).to({state:[{t:this.instance_20}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(49).to({_off:false},0).wait(2));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(12).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(52));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(2).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(6).to({_off:false},0).to({_off:true},1).wait(39).to({_off:false},0).to({_off:true},1).wait(6));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(3).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(54));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(4).to({_off:false},0).to({_off:true},1).wait(11).to({_off:false},0).to({_off:true},1).wait(20).to({_off:false},0).to({_off:true},1).wait(11).to({_off:false},0).to({_off:true},1).wait(20).to({_off:false},0).to({_off:true},1).wait(11).to({_off:false},0).to({_off:true},1).wait(20).to({_off:false},0).to({_off:true},1).wait(11).to({_off:false},0).to({_off:true},1).wait(20).to({_off:false},0).to({_off:true},1).wait(11).to({_off:false},0).to({_off:true},1).wait(20).to({_off:false},0).to({_off:true},1).wait(11).to({_off:false},0).to({_off:true},1).wait(20).to({_off:false},0).to({_off:true},1).wait(11).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(29).to({_off:false},0).to({_off:true},1).wait(11));
	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(5).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(6).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(6).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(6).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(6).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(6).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(15).to({_off:false},0).to({_off:true},1).wait(6).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(56));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(6).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(24).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(24).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(24).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(24).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(24).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(24).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(20).to({_off:false},0).to({_off:true},1).wait(19).to({_off:false},0).to({_off:true},1).wait(16));
	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(7).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(26).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(26).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(26).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(26).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(26).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(26).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(58));
	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(8).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(28).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(28).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(28).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(28).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(28).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(28).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(27).to({_off:false},0).to({_off:true},1).wait(9).to({_off:false},0).to({_off:true},1).wait(21));
	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(9).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(16).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(60));
	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(10).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(13).to({_off:false},0).to({_off:true},1).wait(18).to({_off:false},0).to({_off:true},1).wait(34).to({_off:false},0).to({_off:true},1).wait(26));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(22).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(68));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(23).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(67));
	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(24).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(66));
	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(25).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(65));
	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(26).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(64));
	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(27).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(63));
	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(30).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(93));
	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(32).to({_off:false},0).to({_off:true},1).wait(91));

	// fish_body
	this.instance_40 = new lib.CachedBmp_1004();
	this.instance_40.setTransform(0,0,0.5,0.5);

	this.instance_41 = new lib.CachedBmp_997();
	this.instance_41.setTransform(3.35,0,0.5,0.5);
	this.instance_41._off = true;

	this.instance_42 = new lib.CachedBmp_1002();
	this.instance_42.setTransform(0,0,0.5,0.5);
	this.instance_42._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_40).to({_off:true},52).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},8).wait(1).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},8).wait(1).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},8).wait(1).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},8).wait(1).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},8).wait(1).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},8).wait(1).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},8).wait(1).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},4).wait(7).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).wait(61));
	this.timeline.addTween(cjs.Tween.get(this.instance_41).wait(52).to({_off:false},0).to({_off:true},1).wait(22).to({_off:false},0).to({_off:true},1).wait(22).to({_off:false},0).to({_off:true},1).wait(22).to({_off:false},0).to({_off:true},1).wait(22).to({_off:false},0).to({_off:true},1).wait(22).to({_off:false},0).to({_off:true},1).wait(22).to({_off:false},0).to({_off:true},1).wait(22).to({_off:false},0).to({_off:true},1).wait(75));
	this.timeline.addTween(cjs.Tween.get(this.instance_42).wait(53).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(8).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(8).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(8).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(8).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(8).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(8).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(8).to({_off:false},0).to({_off:true},1).wait(2).to({_off:false},0).to({_off:true},1).wait(4).to({_off:false},0).to({_off:true},7).wait(1).to({_off:false},0).to({_off:true},1).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,212.5,144);


(lib.fish = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// fish_tail
	this.instance = new lib.Symbol2();
	this.instance.setTransform(191.5,76.15,1,1,0,0,0,18.2,29.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:18.3,regY:29.3,rotation:-1.3335,x:191.35,y:76},0).wait(1).to({rotation:-2.6671,x:191.05,y:75.8},0).wait(1).to({rotation:-4.0006,x:190.75,y:75.6},0).wait(1).to({rotation:-5.3342,x:190.45,y:75.4},0).wait(1).to({rotation:-6.6677,x:190.25,y:75.25},0).wait(1).to({rotation:-8.0013,x:189.95,y:75},0).wait(1).to({rotation:-6.6677,y:75.15},0).wait(1).to({rotation:-5.3342,x:189.9,y:75.25},0).wait(1).to({rotation:-4.0006,x:189.95,y:75.4},0).wait(1).to({rotation:-2.6671,y:75.55},0).wait(1).to({rotation:-1.3335,y:75.65},0).wait(1).to({rotation:0,y:75.85},0).wait(4).to({regX:18.2,regY:29.2,x:191.5,y:76.15},0).wait(1).to({regX:18.3,regY:29.3,rotation:-1.3335,x:191.35,y:76},0).wait(1).to({rotation:-2.6671,x:191.05,y:75.8},0).wait(1).to({rotation:-4.0006,x:190.75,y:75.6},0).wait(1).to({rotation:-5.3342,x:190.45,y:75.4},0).wait(1).to({rotation:-6.6677,x:190.25,y:75.25},0).wait(1).to({rotation:-8.0013,x:189.95,y:75},0).wait(1).to({rotation:-6.001,y:75.25},0).wait(1).to({rotation:-4.0006,y:75.4},0).wait(1).to({rotation:-2.0003,x:189.9,y:75.65},0).wait(1).to({rotation:0,x:189.95,y:75.85},0).wait(4));

	// fish_hand
	this.instance_1 = new lib.CachedBmp_946();
	this.instance_1.setTransform(67,118.3,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_628();
	this.instance_2.setTransform(66.7,118.6,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_855();
	this.instance_3.setTransform(66.45,118.9,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_630();
	this.instance_4.setTransform(66.15,119.15,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_890();
	this.instance_5.setTransform(65.9,119.45,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_632();
	this.instance_6.setTransform(65.6,119.7,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_853();
	this.instance_7.setTransform(65.3,119.95,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_634();
	this.instance_8.setTransform(65.05,120.15,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_920();
	this.instance_9.setTransform(64.75,120.35,0.5,0.5);
	this.instance_9._off = true;

	this.instance_10 = new lib.CachedBmp_886();
	this.instance_10.setTransform(65,120.2,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_883();
	this.instance_11.setTransform(65.25,120,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_882();
	this.instance_12.setTransform(65.5,119.75,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_881();
	this.instance_13.setTransform(65.75,119.55,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_880();
	this.instance_14.setTransform(66,119.35,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_879();
	this.instance_15.setTransform(66.25,119.1,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_878();
	this.instance_16.setTransform(66.5,118.8,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_894();
	this.instance_17.setTransform(66.75,118.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_9}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(8).to({_off:false},0).to({_off:true},1).wait(17).to({_off:false},0).wait(4));

	// fish_body
	this.instance_18 = new lib.CachedBmp_657();
	this.instance_18.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(30));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,212.1,143.9);


(lib.bubble = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Symbol4();
	this.instance.setTransform(59.85,9.6,1,1,0,0,0,20.8,25.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:25.5,x:55,y:7.05},0).wait(1).to({x:49.7,y:4.8},0).wait(1).to({x:44.05,y:2.75},0).wait(1).to({x:38.2,y:0.8},0).wait(1).to({x:32.3,y:-1.1},0).wait(1).to({x:26.4,y:-3},0).wait(1).to({x:20.75,y:-5},0).wait(1).to({x:15.35,y:-7.1},0).wait(1).to({x:10.35,y:-9.4},0).wait(1).to({x:5.9,y:-11.9},0).wait(1).to({x:2.05,y:-14.75},0).wait(1).to({x:-0.95,y:-17.95},0).wait(1).to({x:-3,y:-21.6},0).wait(1).to({x:-3.95,y:-25.8},0).wait(1).to({x:-3.55,y:-30.65},0).wait(1).to({x:3,y:-34.35},0).wait(1).to({x:7.95,y:-38.5},0).wait(1).to({x:11.9,y:-42.9},0).wait(1).to({x:15.05,y:-47.5},0).wait(1).to({x:17.55,y:-52.3},0).wait(1).to({x:19.45,y:-57.3},0).wait(1).to({x:20.8,y:-62.4},0).wait(1).to({x:18.95,y:-63.55},0).wait(1).to({x:17.15,y:-64.85},0).wait(1).to({x:15.45,y:-66.2},0).wait(1).to({x:13.8,y:-67.65},0).wait(1).to({x:12.2,y:-69.2},0).wait(1).to({x:10.65,y:-70.85},0).wait(1).to({x:9.2,y:-72.55},0).wait(1).to({x:7.85,y:-74.4},0).wait(1).to({x:6.55,y:-76.35},0).wait(1).to({x:5.35,y:-78.45},0).wait(1).to({x:4.3,y:-80.65},0).wait(1).to({x:3.35,y:-83.1},0).wait(1).to({x:2.6,y:-85.7},0).wait(1).to({x:2,y:-88.65},0).wait(1).to({x:1.75,y:-91.9},0).wait(1).to({x:1.85,y:-95.7},0).wait(1).to({x:2.5,y:-100.3},0).wait(1).to({x:7.15,y:-110.45},0).wait(1).to({x:11.55,y:-120.3},0).wait(1).to({x:15.8,y:-129.9},0).wait(1).to({x:19.85,y:-139.2},0).wait(1).to({x:23.65,y:-148.25},0).wait(1).to({x:27.3,y:-157},0).wait(1).to({x:30.7,y:-165.45},0).wait(1).to({x:33.85,y:-173.5},0).wait(1).to({x:36.75,y:-181.15},0).wait(1).to({x:39.25,y:-188.3},0).wait(1).to({x:41.3,y:-194.75},0).wait(1).to({x:42.8,y:-200.45},0).wait(1).to({x:38.1,y:-208.45},0).wait(1).to({x:34,y:-216.15},0).wait(1).to({x:30.4,y:-223.65},0).wait(1).to({x:27.3,y:-230.9},0).wait(1).to({x:24.7,y:-237.9},0).wait(1).to({x:22.6,y:-244.65},0).wait(1).to({x:21.1,y:-251.1},0).wait(1).to({x:20.3,y:-257.25},0).wait(1).to({x:20.15,y:-263.05},0).wait(1).to({x:20.8,y:-268.45},0).wait(1).to({x:31.7,y:-278.9},0).wait(1).to({x:38.25,y:-286.95},0).wait(1).to({x:42.8,y:-294},0).wait(1).to({x:46.05,y:-300.3},0).wait(1).to({x:48.3,y:-306.05},0).wait(1).to({x:49.8,y:-311.45},0).wait(1).to({x:34.95,y:-322.2},0).wait(1).to({x:32.9,y:-331.05},0).wait(1).to({x:33.8,y:-339.45},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.7,-364.9,105.3,399.9);


(lib.Scene_1_lovely_ocean = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// lovely_ocean
	this.instance = new lib.bubble();
	this.instance.setTransform(251.35,480.15,1,1,0,0,0,57.2,-152.2);

	this.instance_1 = new lib.bubble();
	this.instance_1.setTransform(133.35,288.2,1,1,0,0,0,57.2,-152.2);

	this.instance_2 = new lib.leave();
	this.instance_2.setTransform(188.2,338.7,1.213,1.3165,0,-8.2231,171.777,-43.3,53);

	this.instance_3 = new lib.star();
	this.instance_3.setTransform(315.05,367.65,1,1,0,0,0,33.6,31.4);

	this.instance_4 = new lib.bubble();
	this.instance_4.setTransform(29.6,484,1,1,0,0,0,21.4,-74.7);

	this.instance_5 = new lib.bubble();
	this.instance_5.setTransform(284.5,133,1,1,0,0,0,21.4,-74.7);

	this.instance_6 = new lib.bubble();
	this.instance_6.setTransform(355.8,381.8,1,1,0,0,0,21.4,-74.7);

	this.instance_7 = new lib.bubble();
	this.instance_7.setTransform(460.2,260.25,1,1,0,0,0,21.4,-74.7);

	this.instance_8 = new lib.CachedBmp_1();
	this.instance_8.setTransform(1.85,128.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},76).wait(71));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_fish = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// fish
	this.instance = new lib.fish();
	this.instance.setTransform(499.1,334.65,0.427,0.427,0,0,0,104.7,71.9);
	this.instance._off = true;

	this.instance_1 = new lib.fish_shoke();
	this.instance_1.setTransform(482.65,323.85,0.4093,0.4093,0,0,0,104.8,72);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[]},1).to({state:[{t:this.instance}]},75).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_1}]},1).to({state:[]},337).wait(133));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).wait(1).to({regX:106,regY:72,rotation:0.4411,x:493.35,y:325.05},0).wait(1).to({rotation:0.8823,x:486.95,y:316.3},0).wait(1).to({rotation:1.3234,x:480.3,y:308.35},0).wait(1).to({rotation:1.7646,x:473.4,y:301.1},0).wait(1).to({rotation:2.2057,x:466.25,y:294.35},0).wait(1).to({rotation:2.6469,x:458.75,y:288.2},0).wait(1).to({rotation:3.088,x:450.95,y:282.6},0).wait(1).to({rotation:3.5292,x:442.7,y:277.5},0).wait(1).to({rotation:3.9703,x:434.05,y:272.85},0).wait(1).to({rotation:4.4114,x:424.95,y:268.8},0).wait(1).to({rotation:4.8526,x:415.15,y:265.25},0).wait(1).to({rotation:5.2937,x:404.65,y:262.2},0).wait(1).to({rotation:5.7349,x:393.35,y:259.85},0).wait(1).to({rotation:6.176,x:380.9,y:258.25},0).wait(1).to({rotation:6.6172,x:369,y:260.2},0).wait(1).to({rotation:7.0583,x:358.4,y:262.95},0).wait(1).to({rotation:7.4995,x:348,y:266.4},0).wait(1).to({rotation:7.9406,x:337.35,y:270.7},0).wait(1).to({rotation:8.3817,x:325.9,y:276.35},0).wait(1).to({rotation:8.8229,x:311.85,y:285.6},0).wait(1).to({rotation:9.264,x:298.6,y:296.85},0).wait(1).to({rotation:9.7052,x:293.35,y:302.55},0).wait(1).to({rotation:10.1463,x:290.6,y:305.9},0).wait(1).to({rotation:10.5875,x:288.15,y:309.4},0).wait(1).to({rotation:11.0286,x:286.95,y:310.7},0).wait(1).to({rotation:11.4697,x:284.2,y:313.85},0).wait(1).to({rotation:11.9109,x:275.3,y:319.35},0).wait(1).to({rotation:12.352,x:271.95,y:320.2},0).wait(1).to({rotation:12.7932,x:266.05,y:321.35},0).wait(1).to({rotation:13.2343,x:258.2,y:322.75},0).wait(1).to({rotation:13.6755,x:249.75,y:324.05},0).wait(1).to({rotation:14.1166,x:241.65,y:325.05},0).wait(1).to({rotation:14.5578,x:235.15,y:325.5},0).wait(1).to({rotation:14.9989,x:231.05,y:325.15},0).wait(1).to({rotation:18.7478,x:208,y:319.9},0).wait(1).to({rotation:22.4968,x:184.15,y:306.7},0).wait(1).to({rotation:26.2457,x:165.05,y:273.85},0).wait(1).to({rotation:29.9946,x:158.65,y:237.8},0).wait(1).to({rotation:37.4945,x:156.5,y:238.35},0).wait(1).to({rotation:44.9943,x:152.1,y:239.65},0).wait(1).to({rotation:59.9953,x:146.4,y:241.5},0).wait(1).to({rotation:74.9962,x:140.2,y:243.7},0).wait(1).to({rotation:89.9956,x:138.15,y:244.55},0).wait(1).to({rotation:104.995,x:134.5,y:246.15},0).wait(1).to({rotation:108.9725,x:129.95,y:248.25},0).wait(1).to({rotation:112.95,x:124.85,y:250.75},0).wait(1).to({rotation:127.948,x:119.7,y:253.25},0).wait(1).to({rotation:135.448,x:115.3,y:255.7},0).wait(1).to({rotation:142.948,x:113.45,y:256.85},0).wait(1).to({rotation:154.9175,x:110.4,y:259},0).wait(1).to({rotation:166.887,x:106.65,y:261.9},0).wait(1).to({rotation:6.2445,x:103.5,y:265.5},0).wait(1).to({rotation:-154.398,x:98.05,y:269.2},0).wait(1).to({rotation:-131.8985,x:93.8,y:273.35},0).wait(1).to({rotation:-109.399,x:89.95,y:277.65},0).wait(1).to({rotation:-86.899,x:86.85,y:281.9},0).wait(1).to({rotation:-64.399,x:84.65,y:286},0).wait(1).to({rotation:-56.8996,x:83.55,y:289.55},0).wait(1).to({rotation:-49.4002,x:88.5,y:291.25},0).wait(1).to({rotation:-34.4003,x:92.75,y:293.45},0).wait(1).to({rotation:-31.7223,x:89.55,y:294.7},0).wait(1).to({rotation:-29.0444,x:86.45,y:292.55},0).wait(1).to({rotation:-26.3664,x:81.25,y:291.2},0).wait(1).to({rotation:-23.6885,x:75.4,y:292.3},0).wait(1).to({rotation:-21.0105,x:68.1,y:295.65},0).wait(1).to({rotation:-18.3326,x:64.6,y:297.1},0).wait(1).to({rotation:-15.6546,x:57.75,y:299.75},0).wait(1).to({rotation:-12.9767,x:52.1,y:303.35},0).wait(1).to({rotation:-10.2987,x:47.8,y:307.55},0).wait(1).to({rotation:-7.6208,x:44.55,y:311.95},0).wait(1).to({rotation:-4.9428,x:42.3,y:316.3},0).wait(1).to({rotation:-2.2649,x:40.9,y:320},0).wait(1).to({rotation:0.4131,x:40.3,y:322.95},0).wait(1).to({rotation:3.091,y:324.55},0).to({_off:true},1).wait(75).to({_off:false,regX:99.4,regY:68.2,rotation:3.0891,x:466.75,y:258.55},0).wait(1).to({regX:106,regY:72,rotation:3.091,x:456.5,y:260.25},0).wait(1).to({x:443.55},0).wait(1).to({x:430.6},0).wait(1).to({x:417.7},0).wait(1).to({x:404.75},0).wait(1).to({x:391.8},0).wait(1).to({x:378.85},0).wait(1).to({x:365.95},0).wait(1).to({x:353},0).wait(1).to({x:340.05},0).wait(1).to({x:327.1},0).wait(1).to({x:314.2},0).wait(1).to({x:301.25},0).wait(1).to({x:288.3},0).wait(1).to({x:275.35},0).wait(1).to({x:262.45},0).to({_off:true},1).wait(470));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_background_eating = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// background_eating
	this.instance = new lib.leave();
	this.instance.setTransform(19.9,353,1,1,0,0,0,19.9,44.6);

	this.instance_1 = new lib.CachedBmp_1078();
	this.instance_1.setTransform(236.3,356.5,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_1077();
	this.instance_2.setTransform(242.4,360.9,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_1076();
	this.instance_3.setTransform(241.4,364.9,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_1075();
	this.instance_4.setTransform(238.6,355.45,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_1074();
	this.instance_5.setTransform(256.45,358.2,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_1073();
	this.instance_6.setTransform(259.25,362.4,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_1072();
	this.instance_7.setTransform(250.75,355.7,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_1071();
	this.instance_8.setTransform(257.05,357.4,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_1070();
	this.instance_9.setTransform(261.6,387.55,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_1069();
	this.instance_10.setTransform(251.4,387.25,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_1068();
	this.instance_11.setTransform(236.6,382.05,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_1067();
	this.instance_12.setTransform(240.8,381,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_1066();
	this.instance_13.setTransform(246.9,385.1,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_1065();
	this.instance_14.setTransform(245.8,380.85,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_1064();
	this.instance_15.setTransform(245.5,381.2,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_1063();
	this.instance_16.setTransform(243.25,380.5,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_1062();
	this.instance_17.setTransform(248.35,377.5,0.5,0.5);

	this.instance_18 = new lib.CachedBmp_1061();
	this.instance_18.setTransform(226.45,362.75,0.5,0.5);

	this.instance_19 = new lib.CachedBmp_1060();
	this.instance_19.setTransform(226.85,362.75,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_1059();
	this.instance_20.setTransform(236.3,355.65,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_1058();
	this.instance_21.setTransform(263.6,365,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_1057();
	this.instance_22.setTransform(260.25,368.05,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_1058();
	this.instance_23.setTransform(259.5,368.7,0.5,0.5);

	this.instance_24 = new lib.CachedBmp_1057();
	this.instance_24.setTransform(258.55,369.2,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_1054();
	this.instance_25.setTransform(248.35,363.25,0.5,0.5);

	this.instance_26 = new lib.CachedBmp_1053();
	this.instance_26.setTransform(243.95,355.3,0.5,0.5);

	this.instance_27 = new lib.CachedBmp_1052();
	this.instance_27.setTransform(245.1,357.15,0.5,0.5);

	this.instance_28 = new lib.leave();
	this.instance_28.setTransform(533.85,355.5,1,1,0,0,0,19.9,44.6);

	this.instance_29 = new lib.star();
	this.instance_29.setTransform(193.8,390.45,0.407,0.407,-14.9991,0,0,18.7,27.5);

	this.instance_30 = new lib.star();
	this.instance_30.setTransform(158.2,378.65,0.6451,0.6451,-14.9981,0,0,33.9,31.7);

	this.instance_31 = new lib.CachedBmp_2();
	this.instance_31.setTransform(224.85,323.05,0.5,0.5);

	this.instance_32 = new lib.wheal();
	this.instance_32.setTransform(113.65,176.45,0.7605,0.755,20.6534,0,0,150.3,81.7);

	this.instance_33 = new lib.fish();
	this.instance_33.setTransform(508.6,181.1,0.4192,0.4192,-29.9966,0,0,223.5,96.5);

	this.instance_34 = new lib.CachedBmp_3();
	this.instance_34.setTransform(242.05,170.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},1).to({state:[{t:this.instance_34},{t:this.instance_33},{t:this.instance_32}]},524).wait(87));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.playAgian = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("Play\nAgian?", "bold 37px 'Calibri'", "#00EDFF");
	this.text.lineHeight = 45;
	this.text.lineWidth = 112;
	this.text.alpha = 0.80000000;
	this.text.parent = this;
	this.text.setTransform(2,2);

	this.instance = new lib.fish();
	this.instance.setTransform(53.7,144.25,0.3885,0.3885,0,0,0,104.8,72);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.playAgian, new cjs.Rectangle(0,0,116,172.2), null);


(lib.Scene_1_actions = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// actions
	this.instance = new lib.bubble();
	this.instance.setTransform(376.35,227.55,1,1,0,0,0,57.2,-152.2);

	this.playAgian = new lib.playAgian();
	this.playAgian.name = "playAgian";
	this.playAgian.setTransform(285.35,220.9,1,1,0,0,0,58,86.1);

	this.instance_1 = new lib.bubble();
	this.instance_1.setTransform(76.35,458.2,1,1,0,0,0,57.2,-152.2);

	this.instance_2 = new lib.bubble();
	this.instance_2.setTransform(554.35,469.2,1,1,0,0,0,57.2,-152.2);

	this.instance_3 = new lib.bubble();
	this.instance_3.setTransform(20.85,432.25,1,1,0,0,0,59.9,9.6);

	this.instance_4 = new lib.bubble();
	this.instance_4.setTransform(436.45,466.25,1,1,0,0,0,59.9,9.6);

	this.instance_5 = new lib.bubble();
	this.instance_5.setTransform(94.05,328.05,1,1,0,0,0,59.9,9.6);

	this.instance_6 = new lib.bubble();
	this.instance_6.setTransform(529.25,349.1,1,1,0,0,0,59.9,9.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.playAgian},{t:this.instance}]},612).wait(31));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.OrtalNeeman = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{end:612});

	this.actionFrames = [0,1,66,131,168,223,319,424,505,612,642];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		this.playB = this.play_idn.playB;
		var self=this;
		self.stop();
		self.playB.addEventListener("click", startPlay); 
		
		function startPlay() {
			
			self.gotoAndPlay(1);
		}
	}
	this.frame_1 = function() {
		this.playB = undefined;
		playSound("glanbubbles");
	}
	this.frame_66 = function() {
		playSound("glanbubbles");
	}
	this.frame_131 = function() {
		playSound("glanbubbles");
	}
	this.frame_168 = function() {
		playSound("Howw");
	}
	this.frame_223 = function() {
		playSound("breakfast");
	}
	this.frame_319 = function() {
		playSound("please");
	}
	this.frame_424 = function() {
		playSound("eatt");
	}
	this.frame_505 = function() {
		playSound("end");
	}
	this.frame_612 = function() {
		this.playAgian = this.actions.playAgian;
		var self = this;
		self.stop();
		
		
		
		self.playAgian.addEventListener("click",replay);
		
		function replay () {
			
		self.gotoAndPlay(1);
		createjs.Sound.stop();
			
		}
	}
	this.frame_642 = function() {
		this.___loopingOver___ = true;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(65).call(this.frame_66).wait(65).call(this.frame_131).wait(37).call(this.frame_168).wait(55).call(this.frame_223).wait(96).call(this.frame_319).wait(105).call(this.frame_424).wait(81).call(this.frame_505).wait(107).call(this.frame_612).wait(30).call(this.frame_642).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(275,200);
	this.___camera___instance.depth = 0;
	this.___camera___instance._off = true;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(204).to({_off:false},0).wait(1).to({scaleX:0.9884,scaleY:0.9884,x:272.3214,y:198.1161},0).wait(1).to({scaleX:0.9769,scaleY:0.9769,x:269.6429,y:196.2321},0).wait(1).to({scaleX:0.9653,scaleY:0.9653,x:266.9643,y:194.3482},0).wait(1).to({scaleX:0.9537,scaleY:0.9537,x:264.2857,y:192.4643},0).wait(1).to({scaleX:0.9421,scaleY:0.9421,x:261.6071,y:190.5804},0).wait(1).to({scaleX:0.9306,scaleY:0.9306,x:258.9286,y:188.6964},0).wait(1).to({scaleX:0.919,scaleY:0.919,x:256.25,y:186.8125},0).wait(1).to({scaleX:0.9074,scaleY:0.9074,x:253.5714,y:184.9286},0).wait(1).to({scaleX:0.8959,scaleY:0.8959,x:250.8929,y:183.0446},0).wait(1).to({scaleX:0.8843,scaleY:0.8843,x:248.2143,y:181.1607},0).wait(1).to({scaleX:0.8727,scaleY:0.8727,x:245.5357,y:179.2768},0).wait(1).to({scaleX:0.8611,scaleY:0.8611,x:242.8571,y:177.3929},0).wait(1).to({scaleX:0.8496,scaleY:0.8496,x:240.1786,y:175.5089},0).wait(1).to({scaleX:0.838,scaleY:0.838,x:237.5,y:173.625},0).wait(1).to({scaleX:0.8264,scaleY:0.8264,x:234.8214,y:171.7411},0).wait(1).to({scaleX:0.8149,scaleY:0.8149,x:232.1429,y:169.8571},0).wait(1).to({scaleX:0.8033,scaleY:0.8033,x:229.4643,y:167.9732},0).wait(1).to({scaleX:0.7917,scaleY:0.7917,x:226.7857,y:166.0893},0).wait(1).to({scaleX:0.7801,scaleY:0.7801,x:224.1071,y:164.2054},0).wait(1).to({scaleX:0.7686,scaleY:0.7686,x:221.4286,y:162.3214},0).wait(1).to({scaleX:0.757,scaleY:0.757,x:218.75,y:160.4375},0).wait(1).to({scaleX:0.7454,scaleY:0.7454,x:216.0714,y:158.5536},0).wait(1).to({scaleX:0.7339,scaleY:0.7339,x:213.3929,y:156.6696},0).wait(1).to({scaleX:0.7223,scaleY:0.7223,x:210.7143,y:154.7857},0).wait(1).to({scaleX:0.7107,scaleY:0.7107,x:208.0357,y:152.9018},0).wait(1).to({scaleX:0.6992,scaleY:0.6992,x:205.3571,y:151.0179},0).wait(1).to({scaleX:0.6876,scaleY:0.6876,x:202.6786,y:149.1339},0).wait(1).to({scaleX:0.676,scaleY:0.676,x:200,y:147.25},0).wait(73).to({scaleX:0.6546,scaleY:0.6546,x:217.7179,y:159.8214},0).wait(1).to({scaleX:0.6332,scaleY:0.6332,x:235.4357,y:172.3929},0).wait(1).to({scaleX:0.6119,scaleY:0.6119,x:253.1536,y:184.9643},0).wait(1).to({scaleX:0.5905,scaleY:0.5905,x:270.8714,y:197.5357},0).wait(1).to({scaleX:0.5691,scaleY:0.5691,x:288.5893,y:210.1071},0).wait(1).to({scaleX:0.5477,scaleY:0.5477,x:306.3071,y:222.6786},0).wait(1).to({scaleX:0.5263,scaleY:0.5263,x:324.025,y:235.25},0).wait(1).to({scaleX:0.505,scaleY:0.505,x:341.7429,y:247.8214},0).wait(1).to({scaleX:0.4836,scaleY:0.4836,x:359.4607,y:260.3929},0).wait(1).to({scaleX:0.4622,scaleY:0.4622,x:377.1786,y:272.9643},0).wait(1).to({scaleX:0.4408,scaleY:0.4408,x:394.8964,y:285.5357},0).wait(1).to({scaleX:0.4194,scaleY:0.4194,x:412.6143,y:298.1071},0).wait(1).to({scaleX:0.3981,scaleY:0.3981,x:430.3321,y:310.6786},0).wait(1).to({scaleX:0.3767,scaleY:0.3767,x:448.05,y:323.25},0).wait(101).to({scaleX:0.5322,scaleY:0.5322,x:405.375,y:292.15},0).wait(1).to({scaleX:0.6877,scaleY:0.6877,x:362.7,y:261.05},0).wait(1).to({scaleX:0.8432,scaleY:0.8432,x:320.025,y:229.95},0).wait(1).to({scaleX:0.9987,scaleY:0.9987,x:277.35,y:198.85},0).to({_off:true},1).wait(220));

	// lovely_ocean_obj_
	this.lovely_ocean = new lib.Scene_1_lovely_ocean();
	this.lovely_ocean.name = "lovely_ocean";
	this.lovely_ocean.depth = 0;
	this.lovely_ocean.isAttachedToCamera = 0
	this.lovely_ocean.isAttachedToMask = 0
	this.lovely_ocean.layerDepth = 0
	this.lovely_ocean.layerIndex = 0
	this.lovely_ocean.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.lovely_ocean).wait(76).to({_off:true},71).wait(496));

	// weal_obj_
	this.weal = new lib.Scene_1_weal();
	this.weal.name = "weal";
	this.weal.depth = 0;
	this.weal.isAttachedToCamera = 0
	this.weal.isAttachedToMask = 0
	this.weal.layerDepth = 0
	this.weal.layerIndex = 1
	this.weal.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.weal).wait(179).to({regX:-10.5,regY:122,x:-10.5,y:122},0).wait(10).to({regX:0,regY:0,x:0,y:0},0).wait(1).to({regX:-10.5,regY:122,x:-10.5,y:122},0).wait(315).to({regX:0,regY:0,x:0,y:0},0).to({_off:true},49).wait(89));

	// play_idn_obj_
	this.play_idn = new lib.Scene_1_play_idn();
	this.play_idn.name = "play_idn";
	this.play_idn.setTransform(268.4,217.5,1,1,0,0,0,268.4,217.5);
	this.play_idn.depth = 0;
	this.play_idn.isAttachedToCamera = 0
	this.play_idn.isAttachedToMask = 0
	this.play_idn.layerDepth = 0
	this.play_idn.layerIndex = 2
	this.play_idn.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.play_idn).wait(1).to({_off:true},436).wait(206));

	// fish_obj_
	this.fish = new lib.Scene_1_fish();
	this.fish.name = "fish";
	this.fish.depth = 0;
	this.fish.isAttachedToCamera = 0
	this.fish.isAttachedToMask = 0
	this.fish.layerDepth = 0
	this.fish.layerIndex = 3
	this.fish.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.fish).wait(2).to({regX:269.2,regY:276.2,x:269.2,y:276.2},0).wait(74).to({regX:0,regY:0,x:0,y:0},0).wait(76).to({regX:269.2,regY:276.2,x:269.2,y:276.2},0).wait(16).to({regX:0,regY:0,x:0,y:0},0).wait(337).to({_off:true},133).wait(5));

	// background_eating_obj_
	this.background_eating = new lib.Scene_1_background_eating();
	this.background_eating.name = "background_eating";
	this.background_eating.depth = 0;
	this.background_eating.isAttachedToCamera = 0
	this.background_eating.isAttachedToMask = 0
	this.background_eating.layerDepth = 0
	this.background_eating.layerIndex = 4
	this.background_eating.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.background_eating).wait(525).to({_off:true},87).wait(31));

	// actions_obj_
	this.actions = new lib.Scene_1_actions();
	this.actions.name = "actions";
	this.actions.depth = 0;
	this.actions.isAttachedToCamera = 0
	this.actions.isAttachedToMask = 0
	this.actions.layerDepth = 0
	this.actions.layerIndex = 5
	this.actions.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.actions).wait(643));

	// background_ocean_obj_
	this.background_ocean = new lib.Scene_1_background_ocean();
	this.background_ocean.name = "background_ocean";
	this.background_ocean.setTransform(276.1,200,1,1,0,0,0,276.1,200);
	this.background_ocean.depth = 0;
	this.background_ocean.isAttachedToCamera = 0
	this.background_ocean.isAttachedToMask = 0
	this.background_ocean.layerDepth = 0
	this.background_ocean.layerIndex = 6
	this.background_ocean.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.background_ocean).wait(205).to({regX:273.4,regY:198.2,scaleX:1.0117,scaleY:1.0117,x:276.05},0).wait(1).to({regX:270.7,regY:196.2,scaleX:1.0237,scaleY:1.0237,y:199.95},0).wait(1).to({regX:268,regY:194.3,scaleX:1.0359,scaleY:1.0359,y:200},0).wait(1).to({regX:265.3,regY:192.5,scaleX:1.0485,scaleY:1.0485,x:276.1},0).wait(1).to({regX:262.6,regY:190.6,scaleX:1.0614,scaleY:1.0614,x:275.95},0).wait(1).to({regX:259.9,regY:188.7,scaleX:1.0746,scaleY:1.0746,x:276.05,y:200.05},0).wait(1).to({regX:257.3,regY:186.8,scaleX:1.0881,scaleY:1.0881,x:276.15,y:199.9},0).wait(1).to({regX:254.6,regY:185,scaleX:1.102,scaleY:1.102,x:276.05,y:200},0).wait(1).to({regX:251.8,regY:183,scaleX:1.1162,scaleY:1.1162,x:276,y:199.9},0).wait(1).to({regX:249.2,regY:181.2,scaleX:1.1309,scaleY:1.1309,x:276.05,y:200},0).wait(1).to({regX:246.5,regY:179.3,scaleX:1.1458,scaleY:1.1458,y:199.95},0).wait(1).to({regX:243.8,regY:177.3,scaleX:1.1612,scaleY:1.1612,y:199.9},0).wait(1).to({regX:241.1,regY:175.5,scaleX:1.1771,scaleY:1.1771},0).wait(1).to({regX:238.4,regY:173.7,scaleX:1.1933,scaleY:1.1933,y:200.05},0).wait(1).to({regX:235.7,regY:171.8,scaleX:1.21,scaleY:1.21},0).wait(1).to({regX:233,regY:169.8,scaleX:1.2272,scaleY:1.2272,y:199.9},0).wait(1).to({regX:230.3,regY:168,scaleX:1.2449,scaleY:1.2449,x:276,y:200.05},0).wait(1).to({regX:227.6,regY:166.1,scaleX:1.2631,scaleY:1.2631,y:199.95},0).wait(1).to({regX:225,regY:164.2,scaleX:1.2818,scaleY:1.2818,x:276.05,y:199.9},0).wait(1).to({regX:222.3,regY:162.3,scaleX:1.3011,scaleY:1.3011,x:276.15},0).wait(1).to({regX:219.6,regY:160.4,scaleX:1.321,scaleY:1.321,x:276.1,y:199.95},0).wait(1).to({regX:216.9,regY:158.6,scaleX:1.3415,scaleY:1.3415,x:276},0).wait(1).to({regX:214.2,regY:156.7,scaleX:1.3627,scaleY:1.3627,x:276.1,y:200},0).wait(1).to({regX:211.5,regY:154.8,scaleX:1.3845,scaleY:1.3845,x:276},0).wait(1).to({regX:208.8,regY:153,scaleX:1.407,scaleY:1.407,x:276.05,y:200.05},0).wait(1).to({regX:206.2,regY:151,scaleX:1.4303,scaleY:1.4303,x:276.15,y:199.9},0).wait(1).to({regX:203.5,regY:149.1,scaleX:1.4544,scaleY:1.4544,x:276.1,y:199.95},0).wait(1).to({regX:200.8,regY:147.3,scaleX:1.4793,scaleY:1.4793,x:276.15,y:200.05},0).wait(73).to({regX:218.5,regY:159.8,scaleX:1.5276,scaleY:1.5276,y:199.9},0).wait(1).to({regX:236.2,regY:172.4,scaleX:1.5792,scaleY:1.5792,y:199.95},0).wait(1).to({regX:253.8,regY:185,scaleX:1.6344,scaleY:1.6344,x:276,y:200},0).wait(1).to({regX:271.6,regY:197.6,scaleX:1.6935,scaleY:1.6935,x:276.15,y:200.05},0).wait(1).to({regX:289.2,regY:210.1,scaleX:1.7572,scaleY:1.7572,y:200},0).wait(1).to({regX:306.9,regY:222.7,scaleX:1.8258,scaleY:1.8258,x:276.1,y:200.05},0).wait(1).to({regX:324.6,regY:235.2,scaleX:1.8999,scaleY:1.8999,x:276.05,y:199.9},0).wait(1).to({regX:342.3,regY:247.8,scaleX:1.9803,scaleY:1.9803,x:276.15,y:199.95},0).wait(1).to({regX:360,regY:260.4,scaleX:2.0679,scaleY:2.0679,x:276.1,y:200.1},0).wait(1).to({regX:377.7,regY:272.9,scaleX:2.1636,scaleY:2.1636,x:276.2,y:199.85},0).wait(1).to({regX:395.3,regY:285.4,scaleX:2.2685,scaleY:2.2685,x:276,y:199.8},0).wait(1).to({regX:413.1,regY:298.1,scaleX:2.3842,scaleY:2.3842,x:276.1,y:199.9},0).wait(1).to({regX:430.7,regY:310.6,scaleX:2.5122,scaleY:2.5122,x:276},0).wait(1).to({regX:448.5,regY:323.3,scaleX:2.6549,scaleY:2.6549,x:276.1,y:200.05},0).wait(101).to({regX:405.9,regY:292.2,scaleX:1.8791,scaleY:1.8791,x:275.95},0).wait(1).to({regX:363.4,regY:261.1,scaleX:1.4541,scaleY:1.4541,x:276.05},0).wait(1).to({regX:320.9,regY:230,scaleX:1.1859,scaleY:1.1859,y:200},0).wait(1).to({regX:278.4,regY:198.8,scaleX:1.0013,scaleY:1.0013,x:276,y:199.9},0).wait(1).to({regX:276.1,regY:200,scaleX:1,scaleY:1,x:276.1,y:200},0).wait(220));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-88.1,186.7,665.8000000000001,480.7);
// library properties:
lib.properties = {
	id: '475231174B59944098A051BC049D0B2E',
	width: 550,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/OrtalNeeman_atlas_1.png?1588685685433", id:"OrtalNeeman_atlas_1"},
		{src:"images/OrtalNeeman_atlas_2.png?1588685685434", id:"OrtalNeeman_atlas_2"},
		{src:"sounds/breakfast.mp3?1588685685694", id:"breakfast"},
		{src:"sounds/eatt.mp3?1588685685694", id:"eatt"},
		{src:"sounds/end.mp3?1588685685694", id:"end"},
		{src:"sounds/glanbubbles.mp3?1588685685694", id:"glanbubbles"},
		{src:"sounds/please.mp3?1588685685694", id:"please"},
		{src:"sounds/Howw.mp3?1588685685694", id:"Howw"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['475231174B59944098A051BC049D0B2E'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;