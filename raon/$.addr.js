// - $.addr $.addr()
// - $.addr $.addr(String path)
RAON.addr = RAON.toFnClass(function(path)
{
	return arguments.length == 1 ? this.get().reset(path) : this.get().reset();
},
{
	_RAON_TYPEOF : '$.addr',
	
	// - $.addr $.addr.reset()
	// - $.addr $.addr.reset(String path)
	reset : function(path)
	{
		this._PROT = window.location.protocol;
	    this._HOST = window.location.hostname;
	    this._PORT = window.location.port;
	    
		if (arguments.length == 1 && typeof path == 'string')
		{
			this._PATH = path+'';
			this._PARAM = '';
		    this._HASH = '';
		}
		else
		{
			this._PATH = window.location.pathname;
			this._PARAM = window.location.search;
		    this._HASH = window.location.hash;
		}
		
	    return this;
	},
	
	// - String $.addr.src()
	src : function()
	{
		return this._PATH + this._PARAM + this._HASH;
	},
	
	// - String $.addr.srcFull()
	// - String $.addr.srcFull(Boolean omitSameOrigin)
	srcFull : function(omitSameOrigin)
	{
		return this.origin(omitSameOrigin === true) + this._PATH + this._PARAM + this._HASH;
	},
	
	// - String $.addr.origin()
	// - String $.addr.origin(Boolean omitSameOrigin)
	origin : function(omitSameOrigin)
	{
		if
		(
			omitSameOrigin === true && 
			this._PROT == window.location.protocol && 
			this._HOST == window.location.hostname && 
			this._PORT == window.location.port
		)
		{
			return "";
		}
		return this._PROT +  (this._PROT.has(['http:', 'https:']) ? '//' : '') + this._HOST + (this._PORT.is() ? (':' + this._PORT) : '');
	},
	
	// - String $.addr.pm(String name)
	// - String $.addr.pm(String[] name)
	// - $.addr $.addr.pm(String name, String val)
	// - $.addr $.addr.pm(String name, String[] val)
	pm : function(name, val)
	{
		var pm = this._PARAM.next('?');
		var p = pm.trim() != '' ? pm.toArr('&') : [];
		var pl = p.length;
		
		switch (arguments.length)
		{
			case 1 : // 읽기
				var isOne = true;
				var rv = [];
				if (RAON.type(name, 'array')) { isOne = false; name = name[0]; }
				
				for (var i = 0 ; i < pl ; i++)
				{
					var n = p[i];
					if (n.prev('=') == name)
					{
						rv.push(n.next('=').de());
						if (isOne) { return rv[0]; }
					}
				}
				
			return isOne ? null : rv;
			case 2 :
				// 제거
				for (var i = 0 ; i < p.length ;)
				{
					if (p[i].prev('=') == name)
					{
						p.del(i);
						continue;
					}
					i++;
				}
				
				// 삽입
				if (val != null)
				{
					val = RAON.toArr(val);
					for (var i = 0 ; i < val.length ; i++)
					{
						p.push(name + '=' + (val[i]+'').en());
					}
				}
				
				this._PARAM = p.is() ? ('?' + p.join('&')) : '';
			return this;
		}
	},
	
	// - $.addr $.addr.pmForm(String query)
	// - $.addr $.addr.pmForm(String $.dom)
	// - $.addr $.addr.pmForm(DOMObject obj)
	// - $.addr $.addr.pmForm(DOMObject[] obj)
	pmForm : function(dom)
	{
		var pe = RAON(dom).finds('textarea,select,input');
		var ckboxNames = {};
		
		for (var i = 0 ; i < pe.length ; i++)
		{
			var e = pe.get(i);
			var el = e[0];
			var name = el.name;
			
			if (name == null || name == '')
			{
				continue;
			}
			switch (e.tag())
			{
				case 'input' :
					switch (e.attr('type'))
					{
						case 'button' : continue;
						case 'file' : continue;
						
						// 활성화 되어잇는것만
						case 'checkbox' : 
							if (!el.checked) { continue; }
							if (!ckboxNames['raon_name_ck_'+name])
							{
								this.pm(name, null);
								ckboxNames['raon_name_ck_'+name] = true;
							}
							this.pm(name, this.pm([name]).add(e.val()));
							continue;
						break;
							
						case 'radio' :
							if (!el.checked) { continue; }
					}
				case 'textarea' :
				case 'select' :
					this.pm(name, e.val());
			}
		}
		
		return this;
	},
	
	// - String $.addr.hm(String name)
	// - String $.addr.hm(String[] name)
	// - $.addr $.addr.hm(String name, String val)
	// - $.addr $.addr.hm(String name, String[] val)
	hm : function(name, val)
	{
		var mark = RAON.conf('hashMark');
		var hm = this._HASH;
		var hmPrev = hm.prev(mark);
		
		var pm = hm.next(mark);
		var p = pm.trim() != '' ? pm.toArr('&') : [];
		var pl = p.length;
		
		switch (arguments.length)
		{
			case 1 : // 읽기
				var isOne = true;
				var rv = [];
				if (RAON.type(name, 'array')) { isOne = false; name = name[0]; }
				
				for (var i = 0 ; i < pl ; i++)
				{
					var n = p[i];
					if (n.prev('=') == name)
					{
						rv.push(n.next('=').de());
						if (isOne) { return rv[0]; }
					}
				}
				
			return isOne ? null : rv;
			case 2 :
				// 제거
				for (var i = 0 ; i < p.length ;)
				{
					if (p[i].prev('=') == name)
					{
						p.del(i);
						continue;
					}
					i++;
				}
				
				// 삽입
				if (val != null)
				{
					val = RAON.toArr(val);
					for (var i = 0 ; i < val.length ; i++)
					{
						p.push(name + '=' + (val[i]+'').re(RAON.conf.hashEnReg, function(e){ return e.en(); }));
					}
				}
				
				this._HASH = hmPrev + (p.is() ? (mark + p.join('&')) : '');
			return this;
		}
	},
	
	// - $.addr $.addr.copy() 
	copy : function()
	{
		var rv = RAON.addr();
		rv._PROT = this._PROT;
	    rv._HOST = this._HOST;
	    rv._PATH = this._PATH;
		rv._PARAM = this._PARAM;
	    rv._HASH = this._HASH;
		return rv;
	},
	
	// - String $.addr.prot() 
	// - $.addr $.addr.prot(String prot) 
	prot : function(prot)
	{
		if (arguments.length == 0)
		{
			return this._PROT;
		}
		else
		{
			if (prot == null) { prot = ''; }
			if (prot.length == 0) { prot = ':'; }
			if (prot.charAt(prot.length - 1) != ':') { prot += ':'; }
			this._PROT = prot.lo();
			return this;
		}
	},
	
	// - String $.addr.host() 
	// - $.addr $.addr.host(String host) 
	host : function(host)
	{
		if (arguments.length == 0)
		{
			return this._HOST;
		}
		else
		{
			this._HOST = host;
			return this;
		}
	},
	
	// - String $.addr.path() 
	// - $.addr $.addr.path(String path) 
	path : function(path)
	{
		if (arguments.length == 0)
		{
			return this._PATH;
		}
		else
		{
			this._PATH = path;
			return this;
		}
	},
	
	// - String $.addr.param() 
	// - $.addr $.addr.param(String param) 
	param : function(param)
	{
		if (arguments.length == 0)
		{
			return this._PARAM;
		}
		if (param != null && param.length > 0)
		{
			this._PARAM = param.charAt(0) == '?' ? param : '?' + param;
		}
		else
		{
			this._PARAM = '';
		}
		return this;
	},
	
	// - String $.addr.hash() 
	// - $.addr $.addr.hash(String hash) 
	hash : function(hash)
	{
		if (arguments.length == 0)
		{
			return this._HASH;
		}
		else
		{
			if (hash)
			{
				this._HASH = ((hash = hash + '').length > 0) ? (hash.charAt(0) == '#' ? hash : ('#' + hash)) : '';
			}
			else
			{
				this._HASH = '';
			}
			
			return this;
		}
	},
	
	// - $.addr $.addr.load() 
	load : function()
	{
		window.location = this.srcFull();
		
		return this;
	},
	
	// - void $.addr.pop()
	pop : function(opt, target)
	{
		var tw = arguments.length == 2 ? target : '_blank';
		arguments.length == 0 ? window.open(this.src(true), tw) : window.open(this.url(), tw, opt);
	}
});
	