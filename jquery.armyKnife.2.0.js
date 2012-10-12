
/**
*
*	ArmyKnife Object and jQuery Plugin 2.0
*
*/
var ArmyKnife	=	(function ($) {
	"use strict";

	/**
	*
	*	Private properties and methods
	*
	*/
	var Utils	=	{
			clone	:	function (obj_elem) {	// Relies on jQuery
				return $(obj_elem).clone();
			},
			createElem	:	function (str_elem) {
				return document.createElement(str_elem);
			},
			extend	:	function () {	// Relies on jQuery
				return $.extend.apply(this, Utils.slice.call(arguments));
			},
			find	:	function (parent, selector) {	// Relies on jQuery
				var $results	=	$(selector, parent);
				return this.slice.call($results);
			},
			slice	:	Array.prototype.slice
		},
		Vars	=	{
		},
		Elems	=	{
			button	:	Utils.createElem("button").setAttribute("href", "#")
		},
		Methods	=	{
			initAutoRotate	:	function () {
				console.log("Initializing Auto Rotate");
			},
			prepSections	:	function () {
				console.log("Prepping Sections");
			}
		};

	/**
	*
	*	Constructor
	*
	*/
	function AK(elem, uOptions, callback) {
		this.elem	=	elem;
		this.init(uOptions, callback);
	}

	/**
	*
	*	Static properties and methods
	*
	*/
	AK.prefix	=	"armyKnife";
	AK.defaults	=	{
		"speed"					:	300,
		"sections"				:	"> *",
		"startingSection"		:	0,
		"easing"				:	"swing",				//	[swing|linear]
		"transition"			:	"none",					//	[none|slide|slideIn|slideOut|fade|fadeIn|fadeOut]
		"autoResize"			:	false,
		"resizeSpeed"			:	200,
		"autoRotate"			:	false,
		"autoRotateDelay"		:	5000,
		"generateNav"			:	false,
		"navType"				:	"empty",				//	[empty|numeric|text|custom]
		"navItemSource"			:	function (s) {			//	REQUIRED WHEN navType = 'text' OR 'custom'; RESPECTIVE SECTION IS PASSED FOR EASY REFERENCE
			return " ";
		},
		"navItemCode"			:	function (s) {			//	REQUIRED WHEN navType = 'custom'; SECTION SOURCE IS PASSED FOR EASY REFERENCE
			var btn	=	Utils.clone(Elems.button);
			btn.innerHTML	=	s;
			return btn;
		},
		"navID"					:	false,
		"navClass"				:	AK.prefix + "-Nav",
		"navTrigger"			:	"click",
		"itemsPerNav"			:	0,
		"activeNavItemClass"	:	"active",
		"showSectionButtons"	:	false,
		"sectionButtonClass"	:	AK.prefix + "-Btn",
		"sectionButtonCodeNext"	:	Utils.clone(Elems.button),
		//"sectionButtonCodePrev"	:	this.Elems.b.clone(),
		"sectionOnEnter"		:	false,
		"sectionOnExit"			:	false,
		"sectionBeforeEnter"	:	false,
		"sectionBeforeExit"		:	false,
		"useContinue"			:	false
	};

	/**
	*
	*	Public Methods
	*
	*/
	AK.prototype	=	{
		generateNav	:	function () {
			console.log("Generating Nav");
		},
		init	:	function (uOptions, callback) {
			var options	=	Utils.extend({}, AK.defaults, uOptions);

			// Attach options and sections
			this.options	=	options;
			this.sections	=	Utils.find(this.elem, options.sections);

			// Generate nav (if needed)
			options.generateNav
				&& this.generateNav();

			// Prep sections
			Methods.prepSections();

			// Init auto rotate (if needed)
			options.autoRotate
				&& Methods.initAutoRotate();

			// Run callback (if needed)
			typeof callback === "function"
				&& callback.call(this);
		}
	};
	return AK;
}(jQuery));

/**
*
*	Plugin creator
*
*/
jQuery.plugin	=	function (name, obj) {
	"use strict";
	jQuery.fn[name]	=	function (options, callback) {
		return this.each(function () {

			// If data does not exist, create it
			if (!$.data(this, name)) {
				$.data(this, name, new obj(this, options, callback));
			}
		});
	};
};

// Turn ArmyKnife object into a $ plugin
jQuery.plugin(ArmyKnife.prefix, ArmyKnife);