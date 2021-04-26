// - $.ajax $.ajax(String path)
// - $.ajax $.ajax(String path, Boolean useGate)
RAON.ajax = RAON.toFnClass(function(path, useGate)
{
	var a = this.get().reset(path);
	a._GATE = RAON.gate();
	if (typeof useGate == 'boolean' && !useGate) { a._GATE._MAX = 99999999; }
	a._CHAR = RAON.conf('charset');
	return a;
},
RAON.ext({}, RAON.addr._RAON_CLASS.prototype,
{
	_RAON_TYPEOF : '$.ajax',
	
	_SEND_POST : true,
	_READ_TEXT : true,
	_FN_RV : null,
	_FN_ST : null,
	_REQ : null,
	_FDA : [],
	_CHAR : null,
	_GATE : null,
	_REQH : [], // request header
	
	_BIND : function(isText, rvFunc, stFunc, dom)
	{
		this._READ_TEXT = isText;
		this._FN_RV = rvFunc ? rvFunc : null;
		this._FN_ST = stFunc ? stFunc : null;
		if (dom) { this.addFormArea(dom); }
	},

	_AJAX : function()
	{
		// 대문 통과
		if (!this._GATE.open()) { return; }
		
		// 받기 객체
		if (this._REQ == null)
		{
			this._REQ = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHTTP");
		}
		
		// 바인드
		this._REQ.onreadystatechange = this._AJAX_STAT.bind(this);
		
		// form ajax
		if (this._FDA.is())
		{
			this._AJAX_FORM();
			return;
		}
		
		var isPost = this._SEND_POST;
		var reqType = isPost ? 'POST' : 'GET';
		var reqPath = isPost ? this._PATH : (this._PATH + this._PARAM);
		var reqParam = isPost ? this._PARAM.next('?') : null;
		var rh = this._REQH.length;
		
		this._REQ.open(reqType, this.origin(true) + reqPath, true);
		
		this._REQ.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=" + this._CHAR);
		
		for (var i = 0 ; i < rh.length ; i++)
		{
			var rNode = rh[i];
			this._REQ.setRequestHeader(rNode[0], rNode[1]);
		}
		this._REQH = [];
		
		this._REQ.send(reqParam);
	},
	
	_AJAX_FORM : function()
	{
		var fd = new FormData();
		var fda = this._FDA;
		
		for (var i = 0 ; i < fda.length ; i++)
		{
			var n = fda[i];
			fd.append(n.name, n.value);
		}
		
		if (this._FN_ST)
		{
			var proxy_state = (function(e)
			{
				this.fn(e, e.loaded.per(e.total))
			}).bind({ fn : this._FN_ST});
			this._REQ.upload.addEventListener('progress', proxy_state, false);
		}
		
		this._REQ.open('POST', this.origin(true) + this._PATH + this._PARAM, true);
		
		this._REQ.send(fd);
	},
	
	_AJAX_STAT : function()
	{
		if (this._REQ.readyState == 4)
		{
			if (this._FN_ST && (!this._FDA.is()))
			{
				this._FN_ST(this._REQ.readyState);
			}
			
			if (this._REQ.status == 200)
			{
				try
				{
					if (this._FN_RV)
					{
						if (this._READ_TEXT)
						{
							this._FN_RV(this._REQ.responseText);
						}
						else
						{
							this._FN_RV(RAON.dom(this._REQ.responseXML));
						}
					}
				}
				catch (e)
				{
					this._GATE.close();
					throw e;
				}
			}
			else
			{
				this._FN_RV(null, this._REQ.status);
			}
			
			this._GATE.close();
			this._REQ = null;
		}
	},
	
	// - $.ajax $.ajax.addFormArea(String query)
	// - $.ajax $.ajax.addFormArea($.dom dom)
	// - $.ajax $.ajax.addFormArea(DOMObject obj)
	// - $.ajax $.ajax.addFormArea(DOMObject[] obj)
	addFormArea : function(dom)
	{
		var pe = RAON(dom).finds('textarea,select,input');
		
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
						case 'file' : 
							var fe = e[0].files;
							for (var j = 0 ; j < fe.length ; j++)
							{
								this._FDA.push({ name : name, value : fe[j] });
							}
						continue;
						// 활성화 되어잇는것만
						case 'checkbox' : case 'radio' :
							if (!el.checked) { continue; }
							// 조건에 맞지않는경우 아래로 내려가서 추가된다.
					}
				case 'textarea' :
				case 'select' :
					this._FDA.push({ name : name, value : e.val() });
			}
		}
		
		return this;
	},
	
	// - $.ajax $.ajax.addHeader(String name, String text)
	addHeader : function(name, text)
	{
		this._REQH.push([name, text]);
		
		return this;
	},
	
	// - $.ajax $.ajax.addFormFile(String name, FileList fl)
	// - $.ajax $.ajax.addFormFile(String name, File f)
	addFormFile : function(name, file)
	{
		switch (RAON.type(file))
		{
			case 'file' :
				this._FDA.push({ name : name, value : file });
			break;
			case 'filelist' : 
				for (var i = 0 ; i < file.length ; i++)
				{
					this._FDA.push({ name : name, value : file[i] });
				}
		}
		return this;
	},
	
	// - NameFile[] $.ajax.getFormFile()
	// - File[] $.ajax.getFormFile(String name)
	getFormFile : function(name)
	{
		var rv = [];
		if (!name) { name = null; }
		var fda = this._FDA;
		
		for (var i = 0 ; i < fda.length ; i++)
		{
			var n = fda[i];
			if (!RAON.type(n.value, 'file')) { continue; }
			if (name == null)
			{
				rv.push({ name : n.name, value : n.value });
			}
			else if (n.name == name)
			{
				rv.push(n.value);
			}
		}
		
		return rv;
	},
	
	// - NameText[] $.ajax.getFormText()
	// - String[] $.ajax.getFormText(String name)
	getFormText : function(name)
	{
		var rv = [];
		if (!name) { name = null; }
		var fda = this._FDA;
		
		for (var i = 0 ; i < fda.length ; i++)
		{
			var n = fda[i];
			if (!RAON.type(n.value, 'string')) { continue; }
			if (name == null)
			{
				rv.push({ name : n.name, value : n.value });
			}
			else if (n.name == name)
			{
				rv.push(n.value);
			}
		}
		
		return rv;
	},
	
	// - $.ajax $.ajax.clearDom()
	clearForm : function()
	{
		this._FDA = [];
		return this;
	},
	
	// - $.ajax $.ajax.copy() 
	copy : function()
	{
		var rv = RAON.ajax();
		rv._PROT = this._PROT;
		rv._HOST = this._HOST;
		rv._PATH = this._PATH;
		rv._PARAM = this._PARAM;
		rv._HASH = this._HASH;
		return rv;
	},

	// - $.ajax $.ajax.reset(String path)
	reset : function(path)
	{
		this._PROT = window.location.protocol;
		this._HOST = window.location.hostname;
		this._PORT = window.location.port;
		this._PATH = path;
		this._PARAM = '';
		this._HASH = '';
		this._FDA = [];
		return this;
	},
	
	// - $.ajax $.ajax.setPost()
	setPost : function() { this._SEND_POST = true; return this; },
	
	// - $.ajax $.ajax.setGet()
	setGet : function() { this._SEND_POST = false; return this; },
	
	// - $.ajax $.ajax.setCharset(String charset)
	setCharset : function(charset) { this._CHAR = charset; return this; },
	
	// - $.ajax $.ajax.toss()
	toss : function()
	{
		this._BIND(true, null, null, null);
		this._AJAX();
	},
	
	// - $.ajax $.ajax.text(Function rvFunc)
	// - $.ajax $.ajax.text(Function rvFunc, Function stFunc)
	// - $.ajax $.ajax.text(Function rvFunc, Function stFunc, $.dom dom)
	text : function(rvFunc, stFunc, dom)
	{
		this._BIND(true, rvFunc, stFunc, dom);
		this[RAON.type(rvFunc, '$.dom') ? '_AJAX_FROM' : '_AJAX'](rvFunc,  stFunc, true);
	},
	
	// - $.ajax $.ajax.xml(Function rvFunc)
	// - $.ajax $.ajax.xml(Function rvFunc, Function stFunc)
	// - $.ajax $.ajax.xml(Function rvFunc, Function stFunc, $.dom dom)
	xml : function(rvFunc, stFunc, dom)
	{
		this._BIND(false, rvFunc, stFunc, dom);
		this[RAON.type(rvFunc, '$.dom') ? '_AJAX_FROM' : '_AJAX'](rvFunc,  stFunc, false);
	},
	
	// - $.ajax $.ajax.eval(Function rvFunc)
	// - $.ajax $.ajax.eval(Function rvFunc, Function stFunc)
	// - $.ajax $.ajax.eval(Function rvFunc, Function stFunc, $.dom dom)
	eval : function(rvFunc, stFunc, dom)
	{
		var fn = (function(rv, e)
		{
			if (this.fn != null) { this.fn((rv != null ? rv.eval() : null), e); }
		}).bind({ fn : rvFunc });
		this._BIND(true, fn, stFunc, dom);
		this._AJAX();
	},
	
	// - $.ajax $.ajax.trim(Function rvFunc)
	// - $.ajax $.ajax.trim(Function rvFunc, Function stFunc)
	// - $.ajax $.ajax.trim(Function rvFunc, Function stFunc, $.dom dom)
	trim : function(rvFunc, stFunc, dom)
	{
		var fn = (function(rv, e)
		{
			if (this.fn != null) { this.fn((rv != null ? rv.trim() : null), e); }
		}).bind({ fn : rvFunc });
		this._BIND(true, fn, stFunc, dom);
		this._AJAX();
	},
	
	// - $.ajax $.ajax.no(Function rvFunc)
	// - $.ajax $.ajax.no(Function rvFunc, Function stFunc)
	// - $.ajax $.ajax.no(Function rvFunc, Function stFunc, $.dom dom)
	no : function(rvFunc, stFunc, dom)
	{
		var fn = (function(rv, e)
		{
			if (this.fn != null) { this.fn((rv+'').trim().toNo(), e); }
		}).bind({ fn : rvFunc });
		this._BIND(true, fn, stFunc, dom);
		this._AJAX();
	}
}));
	
	