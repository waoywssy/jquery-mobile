//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: packaged loading message functionality
//>>label: loading message
//>>group: Navigation

define( [	"jquery",	"./jquery.mobile.core",	"./jquery.mobile.init" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");

(function( $, window ) {
	// DEPRECATED
	// NOTE global mobile object settings
	$.extend($.mobile, {
		// DEPRECATED Should the text be visble in the loading message?
		loadingMessageTextVisible: undefined,

		// DEPRECATED When the text is visible, what theme does the loading box use?
		loadingMessageTheme: undefined,

		// DEPRECATED default message setting
		loadingMessage: undefined,

		// DEPRECATED
		// Turn on/off page loading message. Theme doubles as an object argument
		// with the following shape: { theme: '', text: '', html: '', textVisible: '' }
		// NOTE that the $.mobile.loading* settings and params past the first are deprecated
		showPageLoadingMsg: function( theme, msgText, textonly ) {
			this.loading( 'show', theme, msgText, textonly );
		},

		// DEPRECATED
		hidePageLoadingMsg: function() {
			this.loading( 'hide' );
		},

		loading: function() {
			this.loaderWidget.loader.apply(this.loaderWidget, arguments);
		}
	});

	// TODO move loader class down into the widget settings
	var loaderClass = "ui-loader", $html = $( "html" ), $window = $( window );

	$.widget( "mobile.loader", {
		// NOTE if the global config settings are defined they will override these
		//      options
		options: {
			// the theme for the loading message
			theme: "a",

			// whether the text in the loading message is shown
			textVisible: false,

			// custom html for the inner content of the loading message
			html: "",

			// the text to be displayed when the popup is shown
			text: "loading"
		},

		defaultHtml: "<div class='" + loaderClass + "'>" +
								 "<span class='ui-icon ui-icon-loading'></span>" +
								 "<h1></h1>" +
								 "</div>",

		// For non-fixed supportin browsers. Position at y center (if scrollTop supported), above the activeBtn (if defined), or just 100px from top
		fakeFixLoader: function(){
			var activeBtn = $( "." + $.mobile.activeBtnClass ).first();

			this.element
				.css({
					top: $.support.scrollTop && $window.scrollTop() + $window.height() / 2 ||
						activeBtn.length && activeBtn.offset().top || 100
				});
		},

		// check position of loader to see if it appears to be "fixed" to center
		// if not, use abs positioning
		checkLoaderPosition: function(){
			var offset = this.element.offset(),
				scrollTop = $window.scrollTop(),
				screenHeight = $.mobile.getScreenHeight();

			if( offset.top < scrollTop || (offset.top - scrollTop) > screenHeight ) {
				this.element.addClass( "ui-loader-fakefix" );
				this.fakeFixLoader();
				$window
					.unbind( "scroll", this.checkLoaderPosition )
					.bind( "scroll", this.fakeFixLoader );
			}
		},

		resetHtml: function() {
			this.element.html( $(this.defaultHtml).html() );
		},

		// Turn on/off page loading message. Theme doubles as an object argument
		// with the following shape: { theme: '', text: '', html: '', textVisible: '' }
		// NOTE that the $.mobile.loading* settings and params past the first are deprecated
		// TODO sweet jesus we need to break some of this out
		show: function( theme, msgText, textonly ) {
			this.resetHtml();

			var loadSettings;

			// support for object literal params
			if( $.type(theme) == "object" ){
				loadSettings = $.extend({}, this.options, theme);

				// prefer object property from the param or the $.mobile.loading object
				// then the old theme setting
				theme = loadSettings.theme || $.mobile.loadingMessageTheme;
			} else {
				loadSettings = this.options;
				theme = theme || $.mobile.loadingMessageTheme || loadSettings.theme;
			}

			$html.addClass( "ui-loading" );

			if ( $.mobile.loadingMessage != false || loadSettings.html ) {
				// text visibility from argument takes priority
				var textVisible = textonly, message, $header;

				// boolean values require a bit more work :P
				// support object properties and old settings
				if( $.mobile.loadingMessageTextVisible != undefined ) {
					textVisible = $.mobile.loadingMessageTextVisible;
				} else {
					textVisible = loadSettings.textVisible;
				}

				this.element.attr( "class", loaderClass + " ui-corner-all ui-body-" + theme + " ui-loader-" + ( textVisible ? "verbose" : "default" ) + ( textonly ? " ui-loader-textonly" : "" ) );

				// TODO verify that jquery.fn.html is ok to use in both cases here
				//      this might be overly defensive in preventing unknowing xss
				// if the html attribute is defined on the loading settings, use that
				// otherwise use the fallbacks from above
				if( loadSettings.html ) {
					this.element.html( loadSettings.html );
				} else {
					// prefer the param, then the settings object then loading message
					message = msgText || $.mobile.loadingMessage || loadSettings.text;
					this.element.find( "h1" )
						.text( message );
				}

				this.element.appendTo( $.mobile.pageContainer );

				this.checkLoaderPosition();
				$window.bind( "scroll", $.proxy(this.checkLoaderPosition, this));
			}
		},

		hide: function() {
			$html.removeClass( "ui-loading" );

			if( $.mobile.loadingMessage ){
				this.element.removeClass( "ui-loader-fakefix" );
			}

			$( window ).unbind( "scroll", $.proxy(this.fakeFixLoader, this) );
			$( window ).unbind( "scroll", $.proxy(this.checkLoaderPosition, this) );
		}
	});

	$.mobile.loaderWidget = $( $.mobile.loader.prototype.defaultHtml ).loader();
})(jQuery, this);

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
