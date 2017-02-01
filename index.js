"use strict";

var Command = function() {
	return this;
}

Command.prototype.openCommandPallete = function openCommandPallete() {
	var view = this.GUI.activeView().model;  
 
	var buttons = [
		{id: 1, text: "OK", autofocus: true},
		{id: -1, text: "Cancel"}
	];

	this.dlg({content: '<div id="command-pallete"><input type="text" id="command-pallete-search-text" ><div id="command-pallete-commands"></div></div>', buttons: buttons}, function(){
		if (this.result !== -1){
			 
		}
	});

	var $ = require("jquery");
	var self = this;
	var onkeyup = function(){
		var searchIndex = [];
		for (var i = 0; i < applicationController.packageController.loadedPlugins.length; i++) {
			var plugin = applicationController.packageController.loadedPlugins[i];
			if (plugin.meta.suluPackage.hotkeys || plugin.meta.suluPackage.commands){
				for (var h = 0; h < plugin.meta.suluPackage.hotkeys.length; h++) {
					var hotkey = plugin.meta.suluPackage.hotkeys[h]
					if(hotkey.function && hotkey.key){
						searchIndex.push(hotkey);
					}
				} 
			}
		}
		var searchData = {
			data: searchIndex,
			searchInProps: ["function"]
		};
		var subsearch = window.subsequenceSearch; //or require('subsequence-search') in node
		var searchText = this.value;

		var div = document.getElementById("command-pallete-commands");

	 
		var searchResultElements = subsearch.search({
		  rank: subsearch.transforms.rank("text"),
		  highlight: subsearch.transforms.highlight('highlightClass')
		}, searchData, searchText);
		console.log(searchResultElements);
		div.innerHTML = "<ul>";
		for (var i = 0; i < searchResultElements.data.length; i++) {
			if(hotkey.function !== null && hotkey.key !== null){
				var foundItem = searchResultElements.data[i];
				div.innerHTML += "<li>" + foundItem.function + " <sub>" + foundItem.key + "</sub></li>";
			}
		}
		div.innerHTML += "</ul>";
	}
		
	$( document ).on( "keyup", "#command-pallete-search-text", onkeyup);
 
	return false
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.loadCSS(path.join(__dirname, "command-pallete.css"));
	window.subsequenceSearch = require("subsequence-search/build/subsequence-search.min.js");
};

module.exports = Plugin;