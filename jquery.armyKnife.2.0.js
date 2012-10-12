
/**
*
*	ArmyKnife Object and jQuery Plugin 2.0
*
*/

/**
*
*	Constructor
*
*/
function ArmyKnife(uOptions, callback) {
	"use strict";
	this.init();
}

/**
*
*	Static methods
*
*/
ArmyKnife.Utils	=	{
	extend	:	function () {	// Relies on jQuery
		"use strict";
		return jQuery.extend.apply(this, Array.prototype.slice.call(arguments));
	}
};
ArmyKnife.Defaults	=	{
	"sections"	:	"> *"
};

/**
*
*	Public Methods
*
*/
ArmyKnife.prototype.init	=	function (uOptions, callback) {
	"use strict";
	var U		=	ArmyKnife.Utils,
		options	=	U.extend({}, ArmyKnife.Defaults, uOptions);
	console.log(options);
};

/**
*
*	Plugin creator
*
*/
jQuery.plugin	=	function (name, obj) {
	"use strict";
	jQuery.fn[name]	=	function (options) {
		return this.each(function () {
			if (!$.data(this, name)) {
				$.data(this, name, new obj(options));
			}
		});
	};
};

// Turn ArmyKnife object into a $ plugin
jQuery.plugin("armyKnife", ArmyKnife);