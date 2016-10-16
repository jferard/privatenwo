/*
 *	"Private Network Origin"
 *	Adds a column to display sender address and if the sender is in your private network.
 *	Copyright (C) 2016 Julien Férard <www.github.com/jferard>
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 **/

var util = (function (context) {
	context.cclasses = Components.classes;
	context.cinterfaces = Components.interfaces;
	context.hdrParser = context.cclasses["@mozilla.org/messenger/headerparser;1"].getService(context.cinterfaces.nsIMsgHeaderParser);
	context.consoleService = context.cclasses["@mozilla.org/consoleservice;1"].getService(context.cinterfaces.nsIConsoleService);
	context.prefService = context.cclasses["@mozilla.org/preferences-service;1"].getService(context.cinterfaces.nsIPrefService);
	context.prefs = context.prefService.getBranch("extensions.privatenwo.");

	context.log = function (aMessage) {
		this.consoleService.logStringMessage("pnwo: " + aMessage);
	};

	// adds received to the database if not present
	context.checkPrefs = function () {
		this.log("checkPrefs");
		var prefs = this.prefService.getBranch("mailnews.");
		var dbhs = prefs.getCharPref("customDBHeaders").split(" ");
		if (dbhs.indexOf("received")) {
			dbhs.push("received")
			prefService.savePrefFile(null);
		}
	};

	context.loadPrefs = function (pnwo) {
		this.log("loadPrefs");
		this.prefs.addObserver("", pnwo, false);
		context.selfMailDomainRegex = this.prefToRegexp("selfMailDomain");
		context.externalMailServerRegex = this.prefToRegexp("externalMailServer");
		this.log(this.prefs.getCharPref("selfMailDomain")+","+this.prefs.getCharPref("externalMailServer"));
	};
	
	context.prefToRegexp = function(key) {
		var value = this.prefs.getCharPref(key);
		if (!value)
			return null;
		
		try {
			return new RegExp(value);
		} catch (e) {
			this.log("Invalid regexp "+value);
		}
		return null;
	}
	
	context.unloadPrefs = function (pnwo) {
		this.prefs.removeObserver("", pnwo);
	}

	context.getStyle = function (sender, received) {
		if (!sender || !received)
			return "alert";
		
		var style = null;
		var externalMailRoute = context.externalMailServerRegex != null && context.externalMailServerRegex.exec(received) != null;
		this.log(context.externalMailServerRegex+" vs "+received+" => "+externalMailRoute);
		var yourDomainAllegedSender = context.selfMailDomainRegex != null && context.selfMailDomainRegex.exec(sender) != null;
		this.log(context.selfMailDomainRegex+" vs "+sender+" => "+yourDomainAllegedSender);
		if (externalMailRoute) {
			if (yourDomainAllegedSender) // could be a fake
				style = "warning";
			else // standard external mail
				style = "info";
		} else { // internal mail route
			if (yourDomainAllegedSender) // standard internal mail 
				style = null;
			else // weird case
				style = "warning";
		}
		this.log(style);
		return style;
	};
	
	return context;
})(util || {});
