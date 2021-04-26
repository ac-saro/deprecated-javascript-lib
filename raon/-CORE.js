RAON.ext(RAON,
{
	// - String $.ver()
	ver : function()
	{
		return '[RAON_VERSION]';
	},
	
	// - CustomClass $.toClass(Function ctor, Json prototype)
	toClass : function(ctor, prototype)
	{
		RAON.ext(ctor.prototype, prototype);
		return ctor;
	},
	
	// - CustomClassFunc $.toFnClass(Function ctorFnProxy, Json prototype)
	toFnClass : function(ctorFnProxy, prototype)
	{
		var cl = RAON.toClass(function(){}, prototype);
		return RAON.ext(ctorFnProxy.bind(
		{
			get : function() { return new this._CC(); },
			_CC : cl
		}), { _RAON_CLASS : cl });
	},
	
	// - CustomClassFunc $.toFnStClass(Function ctorFnProxy, Json staticMember, Json prototype)
	toFnStClass : function(ctorFnProxy, staticMember, prototype)
	{
		var cl = RAON.toClass(function(){}, prototype);
		return RAON.ext(ctorFnProxy.bind(
		{
			get : function() { return new this._CC(); },
			_CC : cl
		}), { _RAON_CLASS : cl }, staticMember);
	},
	
	// - $.dom $.find(String query)
	find : function(query)
	{
		return RAON.dom._FIND([document], query);
	},
	
	// - $.dom $.finds(String query)
	finds : function(query)
	{
		return RAON.dom._FIND([document], [query]);
	},
	
	// - $.dom $.findsAttr(String attrName)
	findsAttr : function(attrName)
	{
		return RAON.dom._FIND([document], ['['+attrName+']']);
	},
	
	// - $.dom $.findFocus()
	findFocus : function()
	{
		return RAON.dom(document.activeElement);
	},
	
	// - boolean $.es(#event event) // event stop
	es : function(evt)
	{
		if (evt && (RAON.type(evt, '$.evt') || RAON.type((evt = $.evt(evt)), '$.evt')))
		{
			try { evt.stop(); } catch(e) {}
			return true;
		}
		return false;
	},
	
	// - void $.batch(Function func, Number time)
	// - void $.batch(Function func, Number time, boolean firstWait)
	batch : function(func, time, firstWait)
	{
		var proxy = function()
		{
			try
			{
				if (this.func(this.idx++) === false)
				{
					return;
				}
			}
			catch (e) { console.log('batch error : ' + e); }
			window.setTimeout(this.p.bind(this), this.time);
		};
		
		proxy = proxy.bind({func : func, p : proxy, time : time, idx : 0});
		
		if (firstWait === true)
		{
			window.setTimeout(proxy, time);
		}
		else
		{
			proxy();
		}
	},
	
	// - void $.err(Error error)
	// - void $.err(Error error, String addMsg)
	// - void $.err(Error error, String addMsg, boolean stop)
	err : function(error, addMsg, stop)
	{
		stop = stop === true;
		//error.message = '\nRAON error thrower : \nstop script : '+stop+'\n' + addMsg + '\n' + error.message;
		error.message += '\nRAON error thrower [stop script : '+stop+']';
		if (addMsg) { error.message += '\n' + addMsg; }
		
		if (stop)
		{
			throw error;
		}
		else
		{
			window.setTimeout((function(){ throw this.error; }).bind({error : error}), 50);
		}
	},
	
	// - void $.rep(Function func, Number time, Number limit)
	// - void $.rep(Function func, Number time, Number limit, boolean firstWait)
	rep : function(func, time, limit, firstWait)
	{
		var proxy = function()
		{
			try
			{
				this.func(this.idx++);
			}
			catch (e) { if (this._fn_error) { this._fn_error(); } else { console.log('batch error : ' + e); } }
			
			if (this.idx < this.lim)
			{
				window.setTimeout(this.p.bind(this), this.time);
			}
		};
		
		proxy = proxy.bind({func : func, p : proxy, time : time, idx : 0, lim : limit});
		
		if (typeof firstWait == 'boolean' && firstWait)
		{
			window.setTimeout(proxy, time);
		}
		else
		{
			proxy();
		}
	},
	
	// - void $.timer(Function func)
	// - void $.timer(Function func, Number firstDelay)
	// - void $.timer(Function func, Number firstDelay, Number startIndex)
	timer : function(func, firstDelay, startIndex)
	{
		var proxy = function()
		{
			if (typeof this.time == 'number' && this.time > 0)
			{
				this.time = this.func(this.i++);
				if (typeof this.time == 'number' && this.time > 0)
				{
					window.setTimeout(this.p.bind(this), this.time);
				}
			}
		};
		
		proxy = proxy.bind({func : func, i : (typeof startIndex == 'number' ? startIndex : 0), p : proxy, time : 1});
		
		if (typeof firstDelay == 'number' && firstDelay > 0)
		{
			window.setTimeout(proxy, firstDelay);
		}
		else
		{
			proxy();
		}
	},
	
	// - #Object $.coal(Object[] objs)
	coal : function(objs)
	{
		for (var i = 0 ; i < objs.length ; i++)
		{
			if (objs[i] != null)
			{
				return objs[i];
			}
		}
		return null;
	},
	
	// - Boolean $.isNull(#Object obj)
	isNull : function(obj)
	{
		return (obj == undefined) || (obj == null);
	},
	
	// - Boolean $.is(#Object obj)
	// - is 값에만 움직임
	is : function(obj)
	{
		if (obj != null && obj['is'] != undefined)
		{
			return obj.is();
		}
		return false;
	},
	
	// - Array $.toArr(Object obj)
	toArr : function(obj)
	{
		return RAON.type(obj, 'array') ? obj : [obj];
	},
	
	// - Date $.date()
	// - Date $.date(Number addTime)
	date : function(addTime)
	{
		return arguments.length != 1 ? new Date() : new Date().addTime(addTime);
	},
	
	// - Number $.time()
	// - Number $.time(Number addTime)
	time : function(addTime)
	{
		return arguments.length != 1 ? new Date().getTime() : new Date().addTime(addTime).getTime();
	},
	
	// - String $.type(Object obj)
	// - Booelan $.type(Object obj, String match)
	// - Booelan $.type(Object obj, String[] match)
	type : function(obj, match)
	{
		if (match)
		{
			return typeof match == 'string' ? (RAON.type(obj) == match) : match.has(RAON.type(obj));
		}
		
		if (obj == null)
		{
			return typeof obj != 'undefined' ? 'null' : 'undefined';
		}
		
		var type;
		if ((type = obj._RAON_TYPEOF) != undefined)
		{
			return type;
		}
		return typeof obj;
	},
	
	// - Boolean isStyle(String styleName)
	isStyle : function(styleName)
	{
		return document.createElement('div').style[styleName.re(/\-[a-z]/g, function(e){return e.sub(1).up();})] != null;
	},
	
	// - void $.load(Function func)
	load : function(func)
	{
		RAON.dom._EXT([window]).evt('load', func);
	},
	
	// - void $.hash(Function func)
	hash : function(func)
	{
		RAON.dom._EXT([window]).evt('hashchange', func);
	},
	
	// - void $.reload()
	reload : function(func)
	{
		window.location.reload();
	},
	
	// - Object $.copy(Object json);
	copy : function(json)
	{
		var s = JSON.stringify(json);
		return JSON.parse(s);
	},
	
	// - void $.pageOut() -- off
	// - void $.pageOut(#String msg) -- 
	// - void $.pageOut(#Function fn) --
	pageOut : function(obj)
	{
		var fn = null;
		switch ($.type(obj))
		{
			case 'function' : fn = obj; break;
			case 'string' : fn = (function(){ return this.msg; }).bind({msg : obj});
		}
		window.onbeforeunload = fn;
	},
	
	// - void $.styleDir(String args)
	// - void $.styleDir($.dom dom)
	// - void $.styleDir(HTML html)
	styleDir : function(args)
	{
		var isDom = false;
		switch (RAON.type(args))
		{
			case 'string' :
				// 객체
				args = ('<style type="text/css">' + args + '</style>').html();
			case '$.dom' : isDom = true; default :
				var h = RAON('head,:not(html)');
				h.add(isDom ? args : RAON.dom(args));
		}
	},
	
	// - void $.style(String href)
	style : function(href)
	{
		var c = document.createElement('link');
		c.href = href;
		c.type = "text/css";
		c.rel = "stylesheet";
		document.getElementsByTagName('head')[0].appendChild(c);
	},
	
	// - void $.script(String src)
	// - void $.script(String src, String charset)
	script : function(src, charset)
	{
		var s = document.createElement('script');
		s.src = src;
		s.type = "text/javascript";
		if (charset) { s.charset = charset; }
		document.getElementsByTagName('head')[0].appendChild(s);
	},
	
	// - #Number[x,y] $.winSize()
	winSize : function()
	{
		// ie 6~8 지원안함
		return ([window.innerWidth, window.innerHeight]);
	},
	
	// - boolean $.isMob()
	isMob : function()
	{
		return (/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i).test(navigator.userAgent);
	},
	
	// - boolean $.isMaxWidth(Number width)
	isMaxWidth : function(width)
	{
		return window.matchMedia('(max-width:'+width+'px)').matches;
	},
	
	// - boolean $.isMinWidth(Number width)
	isMinWidth : function(width)
	{
		return window.matchMedia('(min-width:'+width+'px)').matches;
	},
	
	// - Number $.pageScrollTop(Number px)
	pageScrollTop : function(px)
	{
		if (typeof px == 'number')
		{
			document.body.scrollTop = px;
			document.documentElement.scrollTop = px;
		}
		return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	},
	
	// - Number $.pageScrollLeft(Number px)
	pageScrollLeft : function(px)
	{
		if (typeof px == 'number')
		{
			document.body.scrollLeft = px;
			document.documentElement.scrollLeft = px;
		}
		return Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
	},
	
	// addr은 파라미터가 포함되지 않기를 추천한다. [캐시효율이..]
	// loadc = load for cache
	// - void $.loadc(String cacheVer, String addr, #Function callbackfunc)
	// - void $.loadc(Number cacheVer, String addr, #Function callbackfunc)
	loadc : (function(cver, addr, func)
	{
		// 함수가 없을경우
		if (!func) { func = function(){}; }
		// 주소가 없을경우
		if (addr == null || (!addr.is())) { func(null); return; }
		
		// 캐시를위한 속성이름
		var attr = 'RAON_INLOAD__'+addr;
		// 캐시얻어오기
		var html = cver != null ? RAON.data.get(attr, cver) : null;
		// 캐싱찾음
		if (html != null)
		{
			func(html);
			return;
		}
		
		// 정보준비
		var info =
		{
			text : '{{raon-loadc:'+addr+'}}',
			cver : cver,
			attr : attr,
			func : func,
			match : ''
		};
		// 보내기
		(RAON.loadc._asbl.bind({ info : info }))();
	}).ext(
	{
		// Assemble
		_asbl : function()
		{
			var info = this.info;
			var addr;
			
			// 패턴찾기 {{ raon-loadc : /path }}
			if
			(
				(info.match = info.text.match(/\{\{[\s]*raon\-loadc[\s]*:[\s]*[^\}]+[\s]*}\}/)) != null &&
				(addr = ((info.match = info.match[0])).gap(':', '}}').trim().son()) != null
			)
			{
				$.ajax(addr).text((function(e)
				{
					// 결과가 없을 경우 : 잘못된주소
					if (e == null) { this.info.func(null); }
					// 정보 불러옴
					var info = this.info;
					// 교체조립
					info.text = info.text.re(info.match, e);
					// 다시검색
					(RAON.loadc._asbl.bind({ info : info }))();
					
				}).bind({ info : info }));
				return;
			}
			
			// 더이상 내부적으로 속한것이 없음.
			var text = info.text;
			RAON.data.set(info.attr, text, info.cver);
			info.func(text);
		}
	}),
	
	data :
	{
		// - $.data $.data.set(String name, String val)
		// - $.data $.data.set(String name, String val, String ver)
		// - $.data $.data.set(String name, String val, Number ver)
		set : function(name, val, ver)
		{
			switch (arguments.length)
			{
				case 2 : window.localStorage.setItem(name, val); break;
				case 3 : window.localStorage.setItem(name, ver + ' ' + val); break;
			}
			return RAON.data;
		},
		
		// - String $.data.get(String name)
		// - String $.data.get(String name, String ver)
		// - String $.data.get(String name, Number ver)
		get : function(name, ver)
		{
			switch (arguments.length)
			{
				case 1 : return window.localStorage.getItem(name);
				case 2 :
					var val = window.localStorage.getItem(name);
					if (val)
					{
						if (val.prev(' ') == (ver+''))
						{
							return val.next(' ');
						}
						else
						{
							window.localStorage.removeItem(name);
						}
					}
					return null;
				}
		},
		
		// - $.data $.data.del(String name)
		del : function(name)
		{
			window.localStorage.removeItem(name);
			return RAON.data;
		},
		
		// - $.data $.data.clear()
		clear : function()
		{
			window.localStorage.clear();
			return RAON.data;
		},
		
		// - String[] $.data.getKeys()
		getKeys : function()
		{
			var rv = [];
			for (var i = 0 ; i < window.localStorage.length ; i++)
			{
				rv.push(window.localStorage.key(i));
			}
			return rv;
		},
		
		// - Boolean $.data.is(String name)
		// - Boolean $.data.is(String name, ver)
		is : function(name, ver)
		{
			switch (arguments.length)
			{
				case 1 : return window.localStorage.getItem(name) != null;
				case 2 :
					var val = window.localStorage.getItem(name);
					return (val != null) && val.prev(' ') == (ver + '');
			}
		},
		
		// - void $.data.setTemp(String name, String val)
		setTemp : function(name, val, ver)
		{
			switch (arguments.length)
			{
				case 2 : window.sessionStorage.setItem(name, val); break;
				case 3 : window.sessionStorage.setItem(name, ver + ' ' + val); break;
			}
			return RAON.data;
		},
		
		// - String $.data.getTemp(String name)
		getTemp : function(name, ver)
		{
			switch (arguments.length)
			{
				case 1 : return window.sessionStorage.getItem(name);
				case 2 :
					var val = window.sessionStorage.getItem(name);
					if (val)
					{
						if (val.prev(' ') == (ver+''))
						{
							return val.next(' ');
						}
						else
						{
							window.sessionStorage.removeItem(name);
						}
					}
					return null;
				}
		},
		
		// - void $.data.delTemp(String name)
		delTemp : function(name)
		{
			window.sessionStorage.removeItem(name);
		},
		
		// - void $.data.clearTemp()
		clearTemp : function()
		{
			window.sessionStorage.clear();
		},
		
		// - String[] $.data.getTempKeys()
		getTempKeys : function()
		{
			var rv = [];
			for (var i = 0 ; i < window.sessionStorage.length ; i++)
			{
				rv.push(window.sessionStorage.key(i));
			}
			return rv;
		},
		
		// - Boolean $.data.isTemp(String name)
		isTemp : function(name, ver)
		{
			switch (arguments.length)
			{
				case 1 : return window.sessionStorage.getItem(name) != null;
				case 2 :
					var val = window.sessionStorage.getItem(name);
					return (val != null) && val.prev(' ') == (ver + '');
			}
		},
		
		// - void $.data.setCook(String name, String val)
		// - void $.data.setCook(String name, String val, Date expDate)
		// - void $.data.setCook(String name, String val, Date expDate, String path, String domain, Boolean secure)
		setCook : function(name, val, expDate, path, domain, secure)
		{
			var exc = name + "=" + val.enEsc();
			
			if (expDate)
			{
				exc += ";expires=" + expDate.toGMTString();
			}
			
			exc += (";path=" + (path != null ? path : '/')); 
			
			if (domain)
			{
				exc += ";domain=" + domain;
			}
			
			if (secure)
			{
				exc += ";secure";
			}
			
			document.cookie = exc;
		},
		
		// - String $.data.getCook(String name)
		getCook : function(name)
		{
			var doc = (';' + document.cookie.re(/\s*;\s*/g, ';').re(/\s*\=\s*/g, '=') + ';');
			var key = ';' + name + '=';
			return doc.has(key) ? doc.gap(key, ';').deEsc() : null;
		},
		
		// - Boolean $.data.isCook(String name)
		isCook : function(name)
		{
			return (';' + document.cookie.re(/\s*;\s*/g, ';').re(/\s*\=\s*/g, '=') + ';').has(';' + name + '=');
		},
		
		// - void $.data.delCook(String name)
		delCook : function(name)
		{
			RAON.data.setCook(name, '', RAON.date(-86400000));
		},
		
		// - void $.data.clearCook()
		clearCook : function()
		{
			var names = RAON.data.getCookKeys();
			
			for (var i = 0 ; i < names.length ; i++)
			{
				RAON.data.delCook(names[i]);
			}
		},
		
		// - String[] $.data.getCookKeys()
		getCookKeys : function()
		{
			var rv = document.cookie.toArr(';');
			for (var i = 0 ; i < rv.length ; i++)
			{
				rv[i] = rv[i].prev('=').trim();
			}
			return rv;
		}
	},
	
	// - Object $.Conf(String name)
	// - void $.Conf(String name, Object val)
	conf : RAON.ext(function(name, val)
	{
		var data = RAON.conf;
		var isSet = arguments.length == 2;
		
		// DEF SET
		if (isSet)
		{
			switch (name)
			{
				case 'tzServOffset' :
					data.tzMilDif = (new Date().getTimezoneOffset() * 60000) + (val * 60000);
				return;
				default :
					data[name] = val;
			}
		}
		// DEF GET
		else
		{
			var rv = data[name+''];
			return rv != undefined ? rv : null;
		}
	},{
		charset : 'utf-8',
		hashMark : '#',
		hashEnReg : (/[#\&\="'\?]/g),
		tzMilDif : 0
	})
});