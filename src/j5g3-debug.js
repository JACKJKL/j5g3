/*
 * Debug Module for j5g3
 */

(function(window, j5g3, undefined)
{
var
	dbg =

	/**
	 * Debug Module for j5g3
	 */
	j5g3.dbg = {

		error: function(msg)
		{
			throw new Error(msg);
		},

		/**
		 * Wrapper for window.console.log().
		 */
		log: function()
		{
			window.console.log.apply(window.console, arguments); return this;
		},

		/**
		 * Wrapper for window.console.info().
		 */
		info: function()
		{
			window.console.info.apply(window.console, arguments); return this;
		},

		/**
		 * Wrapper for window.console.warn().
		 */
		warn: function()
		{
			window.console.warn.apply(window.console, arguments); return this;
		},

		fn: function(Klass, fn_name, pre, post)
		{
		var
			fn = Klass.prototype[fn_name]
		;
			Klass.prototype[fn_name] = function()
			{
			var
				args = arguments,
				result
			;
				if (pre) pre.apply(this, args);
				result = fn.apply(this, args);
				if (post) post.apply(this, args);

				return result;
			};
		}
	},

	loop = function()
	{
	var
		screen = this.stage.screen
	;
		this._oldTime = this._time;
		this._time = (new Date()).getTime();

		screen.save();
		screen.fillStyle = '#009900';
		screen.font = 'bold 18px Arial';
		screen.translate(0, 20);
		screen.fillText(Math.floor(1000/(this._time-this._oldTime)) + " FPS", 0, 0);
		screen.restore();
	}
;
	dbg.fn(j5g3.Engine, '_gameLoop', null, loop);
	dbg.fn(j5g3.Engine, '_rafGameLoop', null, loop);

	j5g3.Class.prototype.toString = function()
	{
		return this.constructor.name;
	};

	dbg.fn(j5g3.DisplayObject, 'remove', function()
	{
		if (this.parent === null)
			dbg.error("Trying to remove object without parent.");
	});

	dbg.fn(j5g3.DisplayObject, 'stretch', function()
	{
		if (!this.width || !this.height)
			dbg.error("Objects without width or height cannot be stretched.");
	});

	dbg.fn(j5g3.Clip, 'add_object', function(display_object)
	{
		if (display_object.parent)
		{
			dbg.warn('Trying to add DisplayObject without removing first.', display_object);
			display_object.remove();
		}
	});

	j5g3.id = function(id) {
		var result = window.document.getElementById(id);
		if (!result)
			dbg.warn('Could not find element with ID: ' + id);

		return result;
	};

	j5g3.DisplayObject.prototype.extend = function(props)
	{
		for (var i in props)
		{
			if ((typeof this[i] === 'function') && i.indexOf('on_')!==0)
				dbg.warn('Overriding function ' + i, this);

			if (i[0]==='_')
				dbg.warn('Overriding private member ' + i, this);

			this[i] = props[i];
		}
	};

	j5g3.Image.prototype._get_source = function(src)
	{
		var source = (typeof(src)==='string') ? j5g3.id(src) : src;

		if (source===null)
			dbg.error("Could not load Image '" + src + "'");

		return source;
	};

})(this, this.j5g3);
