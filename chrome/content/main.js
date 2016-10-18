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

var pnwo = (function (context, util) {
	//	Class
	var PNWColumnHandler = function () {};

	PNWColumnHandler.prototype = {
		getCellText : function (row, col) {
			var key = gDBView.getKeyAt(row);
			var hdr = gDBView.db.GetMsgHdrForKey(key);

			var sender = util.hdrParser.extractHeaderAddressMailboxes(hdr.getStringProperty("sender"));
			var received = hdr.getStringProperty("received");
			return sender; // + " - " + this.parseReceived(received);
		},

		getSortStringForRow : function (hdr) {
			return util.hdrParser.extractHeaderAddressMailboxes(hdr.getStringProperty("sender"));
		},

		isString : function () {
			return true;
		},

		// returns info, warning or alert
		getCellProperties : function (row, col, props) {
			util.log("getCellProperties");
			var key = gDBView.getKeyAt(row);
			var hdr = gDBView.db.GetMsgHdrForKey(key);
			var sender = hdr.getStringProperty("sender");
			var received = hdr.getProperty("received");
			var style = util.getStyle(sender, received);
			util.log("style =" + style);
			if (style) {
				if (props) {
					var aserv = Components.classes["@mozilla.org/atom-service;1"].
						getService(Components.interfaces.nsIAtomService);
					props.AppendElement(aserv.getAtom(style));
				} else {
					return style;
				}
			}
		},

		getRowProperties : function (row, props) {},

		getImageSrc : function (row, col) {
			return null;
		},
		getSortLongForRow : function (hdr) {
			return 0;
		}
	};

	var addCustomColumnHandler = function (colId) {
		var customCol = new PNWColumnHandler();
		gDBView.addColumnHandler(colId, customCol);
	};

	var createDbObserver = {
		observe : function (aMsgFolder, aTopic, aData) {
			addCustomColumnHandler("pnwoCol");
		}
	};

	context.startup = function () {
		ObserverService = util.cclasses["@mozilla.org/observer-service;1"].getService(util.cinterfaces.nsIObserverService);
		ObserverService.addObserver(createDbObserver, "MsgCreateDBView", false);

		util.checkPrefs();
		util.loadPrefs(context);
		util.log("started...");
	};

	context.shutdown = function () {
		util.unloadPrefs(context);
	};

	context.observe = function (subject, topic, data) {
		if (topic == "nsPref:changed")
			util.loadPrefs(context);
	}

	return context;
})(pnwo || {}, util);

//	Launch
window.addEventListener("load", pnwo.startup, false);
window.addEventListener("unload", pnwo.shutdown, false);
