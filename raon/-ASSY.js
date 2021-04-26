// - $.dom $(String query)
// - $.dom $(String[] query)
// - $.evt $(Event windowEvent)
// - $.evt $(Event windowEvent, $.dom)
(window.$ = (window.RAON = function(a, b)
{
	var t;
	switch (RAON.type(a))
	{
		case 'string' :
			// 쿼리 - 단일검색
			return RAON.dom._FIND([document], a);
			
		case 'array' :
			// 쿼리 - 다수검색
			if (typeof (t = a[0]) == 'string')
			{
				return RAON.dom._FIND([document], a);
			}
			// 돔
			else if (typeof t.nodeType == 'number')
			{
				return RAON.dom._EXT(a);
			}
			throw "invalid parameter";
			
		case '$.evt' : case '$.dom' :
			// 그대로
			return a;
		
		default :
			if (typeof a.nodeType == 'number')
			{
				return RAON.dom._EXT([a]);
			}
			// 이벤트
			else if ((a.target || a.srcElement) && (typeof a.which == 'number' || typeof a.keyCode == 'number'))
			{
				return b != undefined ? RAON.evt(a, b) : RAON.evt(a);
			}
			throw "invalid parameter";
	}
}))

// - Object $.ext(Object main, Json... exts)
.ext = function()
{
	var rv, src, len = arguments.length;
	
	if (len > 0)
	{
		rv = arguments[0];
		for (var i = 1 ; i < len ; i++)
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
	}
};
