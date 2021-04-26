// IE 9 이하 호환성 영역
if (window.ActiveXObject)
{
	// IE 6 ~ 8
	if (!document.addEventListener)
	{
		
		Function.prototype.bind = function(obj)
		{
			var func = this;
			var rv  = function()
			{
				return func.apply(obj, arguments);
			};
			return rv;
		};
		
		String.prototype.xml = function()
		{
			var c = new ActiveXObject("Microsoft.XMLDOM");
			c.async="false";
			c.loadXML(this);
			return RAON.dom(c);
		};
		
		Array.prototype.indexOf = function(obj)
		{
			for (var i = 0 ; i < this.length ; i++)
			{
				if (this[i] == obj) { return i; }
			}
			return -1;
		};
		
		Array.prototype.lastIndexOf = function(obj)
		{
			for (var i = (this.length - 1) ; i >= 0  ; i--)
			{
				if (this[i] == obj) { return i; }
			}
			return -1;
		};
		
		String.prototype.deHtml = function()
		{
			var e = document.createElement('div');
			e.innerHTML = this;
			return e.innerText;
		};
		
		String.prototype.enHtml = function()
		{
			var e = document.createElement('div');
			e.innerText = this;
			return e.innerHTML;
		};
		
		Array.prototype.some = function(fn)
		{
			for (var i = 0 ; i < this.length ; i++)
			{
				if (fn(this[i], i, this) === true)
				{
					return true;
				}
			}
			return false;
		};
	}
	
	// IE 9 not support, but not out error message
	if (!window.FileList)
	{
		window.FileList = { prototype : {} };
	}
	if (!window.File)
	{
		window.File = { prototype : {} };
	}
}

// startsWith / endsWith
if (!String.prototype.startsWith)
{
	String.prototype.startsWith = function (s)
	{
		return this.slice(0, s.length) == s;
	};
	String.prototype.endsWith = function (s)
	{
		return this.slice(-(s.length)) == s;
	};
}
