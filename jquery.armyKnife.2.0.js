
/**
*
*	ArmyKnife Object and jQuery Plugin 2.0
*
*/
var ArmyKnife	=	(function ($, window, document) {
	"use strict";

	/**

	*
	*	Private properties and methods
	*
	*/
	var self,
		Utils	=	{
			clone	:	function (obj_elem) {	// Relies on jQuery
				return $(obj_elem).clone();
			},
			createElem	:	function (str_elem) {
				return document.createElement(str_elem);
			},
			each	:	function (arr, fn) {
				var i,
					len;
				for (i = 0, len = arr.length; i < len; i += 1) {
					fn.call(self, i, arr[i], arr);
				}
			},
			extend	:	function () {	// Relies on jQuery
				return $.extend.apply($, Utils.slice(arguments));
			},
			find	:	function (parent, selector) {	// Relies on jQuery
				var $results	=	$(selector, parent);
				return this.slice($results);
			},
			propExists	:	function (context, str) {
				var parts	=	str.split("."),
					passed	=	true;
				Utils.each(parts, function (i, v) {
					if (typeof context[v] === "undefined") {
						passed	=	false;
						return false;
					}
					context	=	context[v];
				});
				return passed;
			},
			slice	:	function (arr) {
				return Array.prototype.slice.call(arr);
			}
		},
		Vars	=	{
		},
		Elems	=	{
			button	:	Utils.createElem("button").setAttribute("href", "#")
		},
		Methods	=	{
			prepSections	:	function () {
				console.log("Prepping Sections");

				// Run setSection on all sections
				Utils.each(self.sections, function (i, e) {
					if (i === self.options.startingSection) {
						self.active	=	i;
						AK.setSection.active(e);
					} else {
						AK.setSection.hidden(e);
					}
				});
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
		"reverse"				:	false,
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
		"sectionButtonCodePrev"	:	Utils.clone(Elems.button),
		"sectionOnEnter"		:	false,
		"sectionOnExit"			:	false,
		"sectionBeforeEnter"	:	false,
		"sectionBeforeExit"		:	false,
		"useContinue"			:	false
	};
	AK.setSection	=	{
		active	:	function (section, i, dir) {
			section.setAttribute("class", AK.prefix + "-section-active");
		},
		inactive	:	function (section, i) {
			section.setAttribute("class", AK.prefix + "-section-inactive");
		},
		hidden	:	function (section, i, dir) {
			if (dir && dir > 0) {
				section.setAttribute("class", AK.prefix + "-section-hiddenLeft");
			} else {
				section.setAttribute("class", AK.prefix + "-section-hiddenRight");
			}
		}
	};

	/**
	*
	*	Public Methods
	*
	*/
	AK.prototype	=	{
		autoRotate	:	function () {
			var obj	=	this,
				dir;

			// Using this.options.autoRotate as flag to continue. May change this later
			if (typeof obj.options.autoRotate !== "undefined" && obj.options.autoRotate !== false) {
				dir	=	obj.options.reverse !== true ? "next" : "prev";
				window.clearTimeout(obj.delay);
				obj.delay	=	window.setTimeout(function () {
					obj[dir]();
					obj.autoRotate();
				}, obj.options.autoRotateDelay);
			}
		},
		generateNav	:	function () {
			console.log("Generating Nav");
		},
		"goto"	:	function (num_index) {
			var active		=	this.active,
				sections	=	this.sections,
				dir			=	active < num_index ? 1 : -1;
			AK.setSection.hidden(sections[active], dir);
			AK.setSection.active(sections[num_index], dir);

			// Update active section index
			this.active	=	num_index;

			// Reset auto rotate cycle
			this.options.autoRotate
				&& this.autoRotate();
		},
		init	:	function (uOptions, callback) {
			self	=	this;
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
				&& this.autoRotate();

			// Run callback (if needed)
			typeof callback === "function"
				&& callback.call(this);
		},
		next	:	function () {
			var active		=	this.active,
				nextIndex	=	active + 1 < this.sections.length ? active + 1 : 0;
			this["goto"](nextIndex);
		},
		prev	:	function () {
			var active		=	this.active,
				prevIndex	=	active - 1 >= 0 ? active - 1 : this.sections.length - 1;
			this["goto"](prevIndex);
		}
	};
	return AK;
}(jQuery, window, document));

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
			if (!jQuery.data(this, name)) {
				jQuery.data(this, name, new obj(this, options, callback));
			}
		});
	};
};

// Turn ArmyKnife object into a $ plugin
jQuery.plugin(ArmyKnife.prefix, ArmyKnife);