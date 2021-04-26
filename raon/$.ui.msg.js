// - $.ui.msg $.ui.msg(Function func)
// - $.ui.msg $.ui.msg(Function func, $.dom dom)
RAON.ui.msg = RAON.toFnStClass(function(func, dom)
{
	var attr = RAON.ui.msg._DAT;
	var body = RAON.ui.msg._DAT_BODY;
	
	if (arguments.length == 0)
	{
		var el = RAON.findsAttr(attr);
		
		for (var i = 0 ; i < el.length ; i++)
		{
			var e = el.get(i);
			
			var obj = e.attr(attr).trim().eval();
			obj.dom = e;
			obj.body = e.findsAttr(body);
			if (obj.body.length == 0) { obj.body = e; }
			e.hide();
		}
	}
	else
	{
		var g = this.get();
		g.func = func.bind(g);
		if (arguments.length == 2)
		{
			g.dom = dom;
			g.body = dom.findsAttr(body);
			if (g.body.length == 0) { g.body = dom; }
			dom.hide();
		}
		return g;
	}
},
{
	_DAT : 'raon-msg',
	_DAT_BODY : 'raon-msg-body'
},
{
	_RAON_TYPEOF : '$.ui.msg',
	dom : null, // dom
	body : null, // body
	func : function(code) {},
	call : function(code)
	{
		if (this.dom != null)
		{
			this.func(code);
		}
	},
	text : function(text)
	{
		if (this.show())
		{
			this.body.text(text);
		}
	},
	html : function(html)
	{
		if (this.show())
		{
			this.body.html(html);
		}
	},
	show : function()
	{
		if (this.dom != null)
		{
			this.dom.show();
			return true;
		}
		return false;
	},
	hide : function()
	{
		if (this.dom != null)
		{
			this.dom.hide();
			return true;
		}
		return false;
	}
});
	
	