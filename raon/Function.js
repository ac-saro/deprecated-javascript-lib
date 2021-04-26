RAON.ext(Function.prototype,
{
	_RAON_TYPEOF : 'function',
	
	// - FunctionObject Function.ext(Json... obj)
	ext : function(obj)
	{
		var rv = this, src, len = arguments.length;
		
		for (var i = 0 ; i < len ; i++)
		{
			src = arguments[i];
			for (var attr in src)
			{
				if (src.hasOwnProperty(attr))
				{
					rv[attr] = src[attr];
				}
			}
		}
		
		return rv;
	},
	
	// - Object Function.arg(Json... obj)
	arg : function(array)
	{
		return this.apply({}, array);
	}
});