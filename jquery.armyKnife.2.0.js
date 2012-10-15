
/**
*
*	ArmyKnife Object and jQuery Plugin 2.0
*
*/
var ArmyKnife	=	(function ($, win, doc, con) {
	"use strict";

	/**

	*
	*	Private properties and methods
	*
	*/
	var self,
		Utils	=	{
			before	:	function (newElem, ref) {
				ref.parentNode.insertBefore(newElem, ref);
			},
			bind	:	function (str_event, elem, fn) {	// Relies on jQuery
				$(elem).on(str_event, fn);
			},
			clone	:	function (obj_elem) {	// Relies on jQuery
				return $.clone(obj_elem);
			},
			createElem	:	function (str_elem) {
				return doc.createElement(str_elem);
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
			replace	:	function (oldElem, newElem) {	// Relies on jQuery
				$(oldElem).replaceWith(newElem);
			},
			slice	:	function (arr) {
				return Array.prototype.slice.call(arr);
			}
		},
		Vars	=	{
		},
		Elems	=	{
			button	:	Utils.createElem("button"),
			anchor	:	(function () {
				var  b	=	Utils.createElem("a");
				b.setAttribute("href", "#");
				return b;
			}())
		},
		Methods	=	{
			prepSections	:	function () {

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
		self	=	this;
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

		// Sections
		sections	:	"> *",
		startingSection	:	0,

		// Rotation
		autoRotate	:	false,
		autoRotateDelay	:	5000,
		reverse	:	false,

		// Navigation
		generateNav	:	false,
		navType	:	"numeric",	//	[numeric|custom]
		navID	:	false,
		navClass	:	AK.prefix + "-nav",
		navItem	:	function (section, index) {
			var btn	=	Utils.clone(Elems.anchor);
			if (self.options.navType === "numeric") {
				btn.innerHTML	=	index;
			} else {
				btn.innerHTML	=	section.getAttribute("title") || "Section #" + index;
			}
			return btn;
		},
		navTrigger	:	"click",

		"speed"					:	300,
		"easing"				:	"swing",				//	[swing|linear]
		"transition"			:	"none",					//	[none|slide|slideIn|slideOut|fade|fadeIn|fadeOut]
		"autoResize"			:	false,
		"resizeSpeed"			:	200,
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
				win.clearTimeout(obj.delay);
				obj.delay	=	win.setTimeout(function () {
					obj[dir]();
					obj.autoRotate();
				}, obj.options.autoRotateDelay);
			}
		},
		generateNav	:	function () {
			var ce	=	Utils.createElem,
				opt	=	this.options,
				ul	=	ce("ul"),
				placeholder;

			// Go through each section
			Utils.each(this.sections, function (i, elem) {

				// Generate code and bind click
				var li	=	ce("li"),
					code	=	typeof opt.navItem === "function" && opt.navItem.call(this, elem, i);
				Utils.bind(opt.navTrigger, code, function () {
					self["goto"](i);
					return false;
				});
				li.appendChild(code);
				ul.appendChild(li);
			});

			// Add class
			ul.setAttribute("class", opt.navClass);

			// Handle this.options.navID
			if (!!opt.navID) {
				ul.setAttribute("id", opt.navID);

				// If DOM elem exists with the same ID, replace
				placeholder	=	Utils.find(doc, "#" + opt.navID);
				if (!!placeholder.length) {
					Utils.replace(placeholder, ul);
				} else {
					Utils.before(ul, this.elem);
				}
			} else {
				Utils.before(ul, this.elem);
			}
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
}(jQuery, window, document, console));

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