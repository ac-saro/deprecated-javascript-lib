// - $.dom $.dom($.dom dom)
// - $.dom $.dom(Array<legacy-dom> dom)
// - $.dom $.dom(String query)
RAON.dom = RAON.toFnStClass(function(obj)
{
	var el = [], t;
	
	if (obj.nodeType)
	{
		el.push(obj);
	}
	else if (typeof (t = obj.length) == 'number' && t > 0 && obj[0].nodeType)
	{
		el.cat(obj);
	}
	
	return RAON.dom._EXT(el);
},
{
	TYPE_NONE : 0,
	TYPE_HTML : 1,
	TYPE_XML : 2,
	
	_FIND : function(dom, query)
	{
		var el = [];
		
		if (RAON.type(query, 'array'))
		{
			query = query[0];
			
			dom.some((function(d)
			{
				this.el.catUni(d.querySelectorAll(query));
			}).bind({el : el}));
		}
		else
		{
			dom.some((function(d)
			{
				var e = d.querySelector(query);
				if (e != null) { this.el.push(e); return true; }
			}).bind({el : el}));
		}
		
		return RAON.dom._EXT(el);
	},
	
	_EXT : function(dom) // EX) RAON.dom._EXT(dom);
	{
		if (dom)
		{
			return RAON.ext(dom.length != undefined && (!dom.tagName) ? dom : [dom], RAON.dom._RAON_CLASS.prototype);
		}
		return RAON.ext([], new RAON.dom._RAON_CLASS());
	},
	_MATCH_FUNC_SEL : null,
	_MATCH_FUNCS : ['matchesSelector', 'webkitMatchesSelector', 'msMatchesSelector', 'mozMatchesSelector', 'oMatchesSelector'],
	_MATCH_FUNC : function(obj)
	{
		// 추후 matchesSelector가 모든 브라우저에 적용되면 filterQuery를 쓰는 모든 부분을 바꿔야함
		if (RAON.dom._MATCH_FUNC_SEL) { return RAON.dom._MATCH_FUNC_SEL; }
		
		var f = RAON.dom._MATCH_FUNCS;
		for (var i = 0 ; i < f.length ; i++)
		{
			if (obj[f[i]])
			{
				return (RAON.dom._MATCH_FUNC_SEL = f[i]);
			}
		}
	},
	_MATCH : function(e, filt)
	{
		return e[RAON.dom._MATCH_FUNC(e)](filt);
	}
},
{
	_RAON_TYPEOF : '$.dom',
	
	// - $.dom $.dom.find(String query)
	find : function(query)
	{
		return RAON.dom._FIND(this, query);
	},
	
	// - $.dom $.dom.finds(String query)
	finds : function(query)
	{
		return RAON.dom._FIND(this, [query]);
	},
	
	// - $.dom $.dom.findsAttr(String attr)
	findsAttr : function(query)
	{
		return RAON.dom._FIND(this, ['['+query+']']);
	},
	
	// - Number $.dom.type()
	// - boolean $.dom.type(Number TYPE)
	type : function(TYPE)
	{
		if (arguments.length == 1)
		{
			return this.type() == TYPE;
		}
		if (this.is())
		{
			return this[0].innerHTML != undefined ? RAON.dom.TYPE_HTML : RAON.dom.TYPE_XML;
		}
		return RAON.dom.TYPE_NONE;
	},
	
	// - boolean $.dom.isDoc()
	isDoc : function()
	{
		return this.is() && this[0].nodeType == document.DOCUMENT_NODE;
	},

	// - boolean $.dom.isHtml()
	isHtml : function()
	{
		return this.type(RAON.dom.TYPE_HTML);
	},
	
	// - boolean $.dom.isXml()
	isXml : function()
	{
		return this.type(RAON.dom.TYPE_XML);
	},
	
	// - boolean $.dom.isXsl()
	isXsl : function()
	{
		return this.type(RAON.dom.TYPE_XML) && this.root()[0].tagName == "xsl:stylesheet";
	},
	
	// - boolean $.dom.dis()
	// - void $.dom.dis(Boolean isDisable)
	dis : function(isDisable)
	{
		if (this.is())
		{
			if (arguments.length == 1)
			{
				this.some((function(e)
				{
					e.disabled = this.dis;
				}).bind({ dis : isDisable }));
				return this;
			}
			else
			{
				return this[0].disabled;
			}
		}
		return false;
	},
	
	// - String $.dom.hint()
	// - void $.dom.hint(String hint)
	hint : function(hint)
	{
		if (this.is())
		{
			if (arguments.length == 1)
			{
				for (var i = 0 ; i < this.length ; i++) { this[i].placeholder = hint; }
				return this;
			}
			else
			{
				return this[0].placeholder;
			}
		}
		return '';
	},
	
	// - void $.dom.max(Number length)
	max : function(length)
	{
		for (var i = 0 ; i < this.length ; i++) { this[i].maxLength = length; }
		return this;
	},
	
	// - $.dom $.dom.get()
	get : function(idx)
	{
		el = this[idx];
		el = el ? [el] : [];
		return RAON.dom._EXT(el);
	},
	
	// - $.dom $.dom.first()
	first : function()
	{
		return this.get(0);
	},
	
	// - $.dom $.dom.last()
	last : function()
	{
		return this.get(this.length - 1);
	},
	
	// - $.dom $.dom.cat(DOMObject[] obj)
	// - $.dom $.dom.cat(DOMObject obj)
	cat : function(dom)
	{
		if (dom)
		{
			this[dom.length ? 'catUni' : 'addUni'](dom);
		}
		return this;
	},
	
	// - $.dom $.dom.prev()
	prev : function()
	{
		var t;
		if (this.is() && (t = this[0].previousElementSibling))
		{
			return RAON.dom._EXT([t]);
		}
		return RAON.dom._EXT([]);
	},
	
	// - $.dom $.dom.next()
	next : function()
	{
		var t;
		if (this.is() && (t = this[0].nextElementSibling))
		{
			return RAON.dom._EXT([t]);
		}
		return RAON.dom._EXT([]);
	},
	
	// - $.dom $.dom.copy()
	copy : function()
	{
		var el = [], t = this;
		
		if (this.is())
		{
			// 일반 html
			if (this.type() == RAON.dom.TYPE_HTML)
			{
				if (t.isDoc())
				{
					t = t.ch();
				}
				
				for (var i = 0 ; i < t.length ; i++)
				{
					el.push(t[i].cloneNode(true));
				}
			}
			// xml 문서
			else
			{
				return this.first().toStr().xml();
			}
		}
		
		return RAON.dom._EXT(el);
	},
	
	// - attributes[] $.dom.attrs()
	// for 문돌려서 name / value
	attrs : function()
	{
		var rv = [];
		if (this.is())
		{
			rv.cat(this[0].attributes);
		}
		return rv;
	},
	
	// - attributes[] $.dom.scanAttrs()
	// for 문돌려서 name / value
	scanAttrs : function()
	{
		var rv = [];
		if (this.is())
		{
			var e = this.get(0);
			rv.cat(e[0].attributes);
			var el = e.find(['*']);
			el.some((function(ei)
			{
				this.rv.cat(ei.attributes)
			}).bind({ rv : rv }));
		}
		return rv;
	},
	
	// - TEXTNODE[] $.dom.texts()
	// nodeValue
	texts : function()
	{
		var rv = [];
		var TEXT_NODE = document.TEXT_NODE;
		if (this.is())
		{
			var e = this[0].childNodes;
			for (var i = 0 ; i < e.length ; i++)
			{
				if (e[i].nodeType == TEXT_NODE)
				{
					rv.push(e[i]);
				}
			}
		}
		return rv;
	},
	
	// - TEXTNODE[] $.dom.scanTexts()
	// nodeValue
	scanTexts : function()
	{
		var rv = [];
		if (this.is())
		{
			this.get(0).find([':not(:empty)']).some((function(ei)
			{
				var e = ei.childNodes;
				for (var j = 0 ; j < e.length ; j++)
				{
					if (e[j].nodeType == document.TEXT_NODE)
					{
						this.rv.push(e[j]);
					}
				}
			}).bind({ rv : rv}))
		}
		return rv;
	},
	
	// - String $.dom.attr(String name)
	// - $.dom $.dom.attr(String name, String val)
	attr : function(name, val)
	{
		if (arguments.length == 1)
		{
			return this.is() ? this[0].getAttribute(name) : null;
		}
		else if (arguments.length == 2)
		{
			if (val != null)
			{
				this.some((function(e)
				{
					e.setAttribute(this.name, this.val);
				}).bind({ name : name, val : (val + '') }));
			}
			else
			{
				this.some((function(e)
				{
					e.removeAttribute(this.name);
				}).bind({ name : name }));
			}
		}
		
		return this;
	},
	
	// - String $.dom.popAttr(String name)
	popAttr : function(name)
	{
		var rv = this.attr(name);
		if (rv != null)
		{
			this.attr(name, null);
		}
		return rv;
	},
	
	// - String $.dom.val()
	// - $.dom $.dom.val(String val)
	val : function(val)
	{
		if (arguments.length == 0)
		{
			return this.is() ? this[0].value.ln() : '';
		}
		else
		{
			this.some((function(e)
			{
				switch (e.tagName.lo())
				{
					case 'select' :
						if ($.dom(e).find('option[value="'+this.val.reAll('"', '\\"')+'"]').is())
						{
							e.value = this.val;
						}
					break;
					default :
						e.value = this.val;
				}
			}).bind({ val : (val + '').ln() }));
		}
		return this;
	},
	
	// - String[] $.dom.vals()
	vals : function(val)
	{
		var rv = [];
		for (var i = 0 ; i < this.length ; i++)
		{
			rv.push(this[i].value.ln());
		}
		return rv;
	},
	
	// - $.dom $.dom.show()
	show : function()
	{
		return this.css('visibility', '').css('display', '');
	},
	
	// - $.dom $.dom.invis()
	invis : function()
	{
		return this.css('visibility', 'hidden').css('display', '');
	},
	
	// - $.dom $.dom.hide()
	hide : function()
	{
		return this.css('display', 'none');
	},
	
	// - #Number[x,y] $.dom.offPos()
	offPos : function()
	{
		if (this.is())
		{
			return [this[0].offsetLeft, this[0].offsetTop];
		}
		return null;
	},
	
	// - #Number[x,y] $.dom.offSize()
	offSize : function()
	{
		if (this.is())
		{
			var e = this[0];
			var rv = [e.offsetWidth, e.offsetHeight];
			return rv;
		}
		return null;
	},
	
	// - #Number[x,y] $.dom.offSizeForce()
	// 경고 안쓰일수도있다.
	offSizeForce : function()
	{
		if (this.is())
		{
			var e = this[0];
			var tmp = e.style.position;
			e.style.position = 'relative';
			var rv = [e.offsetWidth, e.offsetHeight];
			e.style.position = tmp;
			return rv;
		}
		return null;
	},
	
	// - $.dom $.dom.filter(String filterQuery)
	// - $.dom $.dom.filter(String[] filterQuery)
	filter : function(filterQuery)
	{
		var el = [];
		
		this.some((function(e)
		{
			if (e.nodeType != document.TEXT_NODE && this.match(e, this.fq))
			{
				this.el.push(e);
			}
		}).bind({ el : el, match : RAON.dom._MATCH, fq : filterQuery }));

		return RAON.dom._EXT(el);
	},
	
	// - $.dom $.dom.add($.dom dom)
	// - $.dom $.dom.add(DOMObject obj)
	// - $.dom $.dom.add(DOMObject[] obj)
	add : function(dom)
	{
		if (!dom.length) { dom = [dom]; }
		
		if (this.is())
		{
			dom.some((function(d)
			{
				this.el.appendChild(d);
			}).bind({ el : this[0] }));
		}
		
		return this;
	},
	
	// - $.dom $.dom.addFirst($.dom dom)
	// - $.dom $.dom.addFirst(DOMObject obj)
	// - $.dom $.dom.addFirst(DOMObject[] obj)
	addFirst : function(dom)
	{
		if (!dom.length) { dom = [dom]; }
		
		if (this.is())
		{
			var el = this[0];
			var und = el.children;
			
			if (und.length > 0)
			{
				und = und[0];
				for (var i = 0 ; i < dom.length ; i++)
				{
					el.insertBefore(dom[i], und);
				}
			}
			else
			{
				return this.add(dom);
			}
		}
		
		return this;
	},
	
	// - $.dom $.dom.nextIns($.dom dom)
	nextIns : function(dom)
	{
		if (!dom.length) { dom = [dom]; }
		
		if (this.is())
		{
			var p = this.up()[0];
			var e = this[0];
			dom.some((function(d)
			{
				this.p.insertBefore(d, this.e.nextSibling);
			}).bind({ p : p, e : e }));
		}
		
		return this;
	},
	
	// - $.dom $.dom.prevIns($.dom dom)
	prevIns : function(dom)
	{
		if (!dom.length) { dom = [dom]; }
		
		if (this.is())
		{
			var p = this.up()[0];
			var e = this[0];
			dom.some((function(d)
			{
				this.p.insertBefore(d, this.e);
			}).bind({ p : p, e : e }));
		}
		
		return this;
	},
	
	// - String $.dom.css(String name)
	// - $.dom $.dom.css(String name, String val)
	css : function(name, val)
	{
		if (this.is())
		{
			name = name.re(/^\-/, '').re(/\-[a-z]/g, function(e){ return e.sub(1).up(); });
			
			if (arguments.length == 2)
			{
				this.some((function(e)
				{
					e.style[this.name] = this.val;
				}).bind({ name : name, val : val }));

				return this;
			}
			else
			{
				var rv = this[0].style[name];
				return rv ? rv : '';
			}
		}
					
		return arguments.length == 2 ? this : '';
	},
	
	// - $.dom $.dom.root()
	root : function()
	{
		if (this.is())
		{
			var e = this.get(0);
			
			if (e[0].nodeType == document.DOCUMENT_NODE)
			{
				return e.find(':root');
			}
			else if (e.filter(':root').is())
			{
				return this;
			}
			else
			{
				return e.up(':root');
			}
		}
		return RAON.dom._EXT(el);
	},
	
	// - boolean $.dom.isArea(String filterQuery)
	isArea : function(filterQuery)
	{
		return this.filter(filterQuery).is() || this.up(filterQuery).is();
	},
	
	// - $.dom $.dom.up()
	// - $.dom $.dom.up(String filterQuery)
	// - $.dom $.dom.up(String filterQuery, Boolean withSelf)
	up : function(filterQuery, withSelf)
	{
		var isOne, t, el = [];
		
		if (this.is())
		{
			if (filterQuery)
			{
				isOne = !RAON.type(filterQuery, 'array');
				filterQuery = isOne ? filterQuery : filterQuery[0];
				
				var match = RAON.dom._MATCH;
				withSelf = withSelf === true;
				
				for (var i = 0 ; i < this.length ; i++)
				{
					t = this[i];
					
					if (withSelf)
					{
						if (match(t,filterQuery))
						{
							el.addUni(t);
							if (isOne) { return RAON.dom._EXT(el); }
						}
					}
					
					while ((t = t.parentNode) && t != document)
					{
						if (match(t,filterQuery))
						{
							el.addUni(t);
							if (isOne) { return RAON.dom._EXT(el); }
						}
					}
				}
			}
			else
			{
				if ((t = this[0].parentNode) && t != document)
				{
					el.push(t);
				}
			}
		}
		
		return RAON.dom._EXT(el);
	},
	
	// - $.dom $.dom.upfind(String upQuery, String findQuery)
	upfind : function(upQuery, findQuery)
	{
		return this.up(upQuery).find(findQuery);
	},
	
	// - $.dom $.dom.upfinds(String upQuery, String findQuery)
	upfinds : function(upQuery, findQuery)
	{
		return this.up(upQuery).finds(findQuery);
	},
	
	// - $.dom $.dom.peer(String filter)
	// - $.dom $.dom.peer(String filter, Boolean excludeSelf)
	peer : function(filter, excludeSelf)
	{
		var rv = [];
		
		if (this.is())
		{
			if (!filter) { filter = null; }
			if (excludeSelf != true) { excludeSelf = false; }
			var self = this.get(0);
			rv.cat(self.up().ch(filter));
			if (excludeSelf)
			{
				var idx = rv.iof(self[0]);
				if (idx != -1) { rv.del(idx); }
			}
		}
		
		return RAON.dom._EXT(rv);
	},
	
	// - $.dom $.dom.ch()
	// - $.dom $.dom.ch(String filterQuery)
	ch : function(filterQuery)
	{
		var isFilt = false;
		if (filterQuery)
		{
			isFilt = true;
		}
		var el = [];
		if (this.is())
		{
			var match = isFilt ? RAON.dom._MATCH : null;
			for (var i = 0 ; i < this.length ; i++)
			{
				var und = this[i].children;
				
				// 익스 예외처리 this[i].children; 익스에서 이거 안먹음..
				if (!und)
				{
					var EL_NODE = document.ELEMENT_NODE;
					und = ([]).cat(this[i].childNodes);
					for (var j = 0 ; j < und.length ; j++)
					{
						if (!(und[j] && und[j].nodeType == EL_NODE))
						{
							und.del(j--);
						}
					}
				}
				
				if (isFilt)
				{
					for (var j = 0 ; j < und.length ; j++)
					{
						if (match(und[j], filterQuery))
						{
							el[i == 0 ? 'push' : 'addUni'](und[j]);
						}
					}
				}
				else
				{
					el[i == 0 ? 'cat' : 'catUni'](und);
				}
			}
		}
		return RAON.dom._EXT(el);
	},
	
	// - String $.dom.toStr()
	toStr : function()
	{
		var rv = "";
		switch (this.type())
		{
			case RAON.dom.TYPE_HTML :
				for (var i = 0 ; i < this.length ; i++)
				{
					rv += this[i].outerHTML;
				}
			break;
			case RAON.dom.TYPE_XML :
				for (var i = 0 ; i < this.length ; i++)
				{
					rv += (new XMLSerializer()).serializeToString(this[i]);
				}
		}
		return rv;
	},
	
	// - String $.dom.id()
	// - $.dom $.dom.id(String id)
	id : function(id)
	{
		if (arguments.length == 0)
		{
			return this.is() ? this[0].id : null;
		}
		else if (this.is())
		{
			this[0].id = id;
		}
		return this;
	},
	
	// - String $.dom.tag()
	tag : function()
	{
		return this.is() ? this[0].tagName.lo() : '';
	},
	
	// - String $.dom.text()
	// - $.dom $.dom.text(String val)
	text : function(val)
	{
		if (arguments.length == 0)
		{
			if (this.is())
			{
				return this[0].textContent;
			}
			return "";
		}
		else if (this.is())
		{
			this.some((function(e)
			{
				e.textContent= this.val;
			}).bind({ val : (val+'') }));
		}
		return this;
	},
	
	// - String $.dom.html()
	// - $.dom $.dom.html(String val)
	html : function(val)
	{
		if (arguments.length == 0)
		{
			return this.is() ? this[0].innerHTML : '';
		}
		else
		{
			this.some((function(e)
			{
				e.innerHTML= this.val;
			}).bind({ val : (val+'') }));
		}
		return this;
	},
	
	// - $.dom $.dom.del()
	// - $.dom $.dom.del(Number idx)
	// - $.dom $.dom.del(String filter)
	del : function(arg)
	{
		if (arguments.length == 1)
		{
			switch (RAON.type(arg))
			{
				case 'number' :
					if (this.is(arg))
					{
						this.get(arg).del();
						this.splice(arg, 1);
					}
				break;
				case 'string' :
					var match = RAON.dom._MATCH;
					for (var i = 0 ; i < this.length ; i++)
					{
						if (match(this[i], arg))
						{
							this.get(i).del();
							this.splice(i, 1);
							i--;
						}
					}
			}
			
		}
		else
		{
			this.some(function(e){ e.remove(); });
		}
		return this;
	},
	
	// - String $.dom.getClass()
	getClass : function()
	{
		return this.is() ? this[0].className.ms().trim() : '';
	},
	
	// - $.dom $.dom.setClass(String names)
	setClass : function(names)
	{
		for (var i = 0 ; i < this.length ; i++)
		{
			this[i].className = names;
		}
		return this;
	},
	
	// - $.dom $.dom.addClass(String names)
	addClass : function(names)
	{
		var ac = names.ms().trim().toArr(' ');
		if (ac.is())
		{
			for (var i = 0 ; i < this.length ; i++)
			{
				this[i].className = this[i].className.ms().trim().toArr(' ').catUni(ac).toStr(' ');
			}
		}
		
		return this;
	},
	
	// - $.dom $.dom.delClass(String names)
	delClass : function(names)
	{
		var ac = names.ms().trim().toArr(' ');
		if (ac.is())
		{
			for (var i = 0 ; i < this.length ; i++)
			{
				this[i].className = this[i].className.ms().trim().toArr(' ').delObjs(ac).toStr(' ');
			}
		}
		
		return this;
	},
	
	// - Boolean $.dom.hasClass(String name)
	hasClass : function(name)
	{
		if (this.is())
		{
			return this.getClass().split(' ').has(name);
		}
		else
		{
			return false;
		}
	},
	
	// - void $.dom.swClass(String name)
	// - void $.dom.swClass(String name1, String name2)
	swClass : function(name1, name2)
	{
		if (arguments.length == 1)
		{
			this[this.hasClass(name1) ? 'delClass' : 'addClass'](name1);
		}
		else if (arguments.length == 2)
		{
			if (this.hasClass(name1))
			{
				this.delClass(name1);
				this.addClass(name2);
			}
			else
			{
				this.delClass(name2);
				this.addClass(name1);
			}
		}
		return this;
	},
	
	// - $.dom $.dom.xslt($.dom dom)
	xslt : function(dom)
	{
		var xsl, xml;
		
		if (dom.length) { dom = dom[0]; }
		if (this.isXSL()) { xsl = this.get(0).copy()[0], xml = dom; }
		else { xsl = dom, xml = this.get(0).copy()[0]; }
		
		if (window.XSLTProcessor)
		{
			var xslt = new XSLTProcessor();
			xslt.importStylesheet(xsl);
			return RAON.ext([xslt.transformToFragment(xml, document)], new RAON._PRIV.Dom());
		}
		else
		{
			var xmldoc = new ActiveXObject("Msxml2.DOMDocument");
			xmldoc.loadXML(RAON(xml).toStr());
			
			var xsldoc = new ActiveXObject("Msxml2.DOMDocument");
			xsldoc.loadXML(RAON(xsl).toStr());
			
			var html = RAON.ext([document.createElement('div')], new RAON._PRIV.Dom());
			html.html(xmldoc.transformNode(xsldoc));
			return html.ch();
		}
		
		return RAON.dom._EXT(el);
	},
	
	// 좀봐야함.
	// - String[] $.dom.cur()
	// - $.dom $.dom.cur(String[] curInfo)
	cur : function(curInfo)
	{
		if ((['input', 'textarea']).has(this.tag()))
		{
			var el = this[0];
			if (RAON.type(curInfo, 'array'))
			{
				var srtSel = curInfo[0].length;
				var endSel = srtSel + curInfo[1].length;
				el.value = curInfo.toStr('');
				el.setSelectionRange(srtSel, endSel);
				return this;
			}
			else
			{
				var val = this.val();
				var srtSel = el.selectionStart;
				var endSel = el.selectionEnd;
				return [val.sub(0, srtSel), val.sub(srtSel, endSel), val.sub(endSel)];
			}
		}
	},
	
	// - Number[] $.dom.curPos()
	// - $.dom $.dom.curPos(Number[] posInfo)
	curPos : function(posInfo)
	{
		if ((['input', 'textarea']).has(this.tag()))
		{
			var el = this[0];
			if (RAON.type(posInfo, 'array'))
			{
				el.setSelectionRange(posInfo[0], posInfo[1]);
				return this;
			}
			else
			{
				return [el.selectionStart, el.selectionEnd];
			}
		}
	},

	// - $.dom $.dom.blur()
	// - $.dom $.dom.blur(Function func)
	blur : function(func)
	{
		if (arguments.length > 0)
		{
			this.evt('blur', func);
		}
		else
		{
			this.evt('blur');
			if (this.is()) { this[0].blur(); }
		}
		return this;
	},
	
	// - $.dom $.dom.change()
	// - $.dom $.dom.change(Function func)
	change : function(func)
	{
		arguments.length > 0 ? this.evt('change', func) : this.evt('change');
		return this;
	},
	
	// - $.dom $.dom.click()
	// - $.dom $.dom.click(Function func)
	click : function(func)
	{
		arguments.length > 0 ? this.evt('click', func) : this.evt('click');
		return this;
	},
	
	// - $.dom $.dom.dblclick()
	// - $.dom $.dom.dblclick(Function func)
	dblclick : function(func)
	{
		arguments.length > 0 ? this.evt('dblclick', func) : this.evt('dblclick');
		return this;
	},
	
	// - $.dom $.dom.focus()
	// - $.dom $.dom.focus(Function func)
	focus : function(func)
	{
		if (arguments.length > 0)
		{
			this.evt('focus', func);
		}
		else
		{
			this.evt('focus');
			if (this.is()) { this[0].focus(); }
		}
		return this;
	},
	
	// - $.dom $.dom.wheel()
	// - $.dom $.dom.wheel(Function func)
	wheel : function(func)
	{
		if (!RAON.type(document.onmousewheel, 'undefined'))
		{
			this.evt('mousewheel', func);
		}
		else
		{
			this.evt('MozMousePixelScroll', func);
		}
	},
	
	// - $.dom $.dom.mousemove()
	// - $.dom $.dom.mousemove(Function func)
	mousemove : function(func)
	{
		arguments.length > 0 ? this.evt('mousemove', func) : this.evt('mousemove');
		return this;
	},
	
	// - $.dom $.dom.mouseout()
	// - $.dom $.dom.mouseout(Function func)
	mouseout : function(func)
	{
		arguments.length > 0 ? this.evt('mouseout', func) : this.evt('mouseout');
		return this;
	},
	
	// - $.dom $.dom.mouseover()
	// - $.dom $.dom.mouseover(Function func)
	mouseover : function(func)
	{
		arguments.length > 0 ? this.evt('mouseover', func) : this.evt('mouseover');
		return this;
	},
	
	// - $.dom $.dom.mouseup()
	// - $.dom $.dom.mouseup(Function func)
	mouseup : function(func)
	{
		arguments.length > 0 ? this.evt('mouseup', func) : this.evt('mouseup');
		return this;
	},
	
	// - $.dom $.dom.mousedown()
	// - $.dom $.dom.mousedown(Function func)
	mousedown : function(func)
	{
		arguments.length > 0 ? this.evt('mousedown', func) : this.evt('mousedown');
		return this;
	},
	
	// - $.dom $.dom.scroll()
	// - $.dom $.dom.scroll(Function func)
	scroll : function(func)
	{
		arguments.length > 0 ? this.evt('scroll', func) : this.evt('scroll');
		return this;
	},
	
	// - $.dom $.dom.select()
	// - $.dom $.dom.select(Function func)
	select : function(func)
	{
		arguments.length > 0 ? this.evt('select', func) : this.evt('select');
		return this;
	},
	
	// - $.dom $.dom.keyup()
	// - $.dom $.dom.keyup(Function func)
	keyup : function(func)
	{
		arguments.length > 0 ? this.evt('keyup', func) : this.evt('keyup');
		return this;
	},
	
	// - $.dom $.dom.keydown()
	// - $.dom $.dom.keydown(Function func)
	keydown : function(func)
	{
		arguments.length > 0 ? this.evt('keydown', func) : this.evt('keydown');
		return this;
	},
	
	// - $.dom $.dom.keypress()
	// - $.dom $.dom.keypress(Function func)
	keypress : function(func)
	{
		arguments.length > 0 ? this.evt('keypress', func) : this.evt('keypress');
		return this;
	},
	
	// - $.dom $.dom.dragFile(Function fnState, Function fnGetFile)
	// - $.dom $.dom.dragFile(Function fnState, Function fnGetFile, Boolean isCallZeroFile)
	dragFile : function(fnState, fnGetFile, isCallZeroFile)
	{
		var proxy = (function(e)
		{
			e.stop();
			var type = e.type();
			// over가 무한정 불려서 자원을 소비하는것을 막기위함.
			if (type != 'drop' && this.lst == type) { return; }
			this.lst = type;
			var st = this.fnState;
			var gf = this.fnGetFile;
			var dom = e.from();
			switch (type)
			{
				case 'dragover' : st(true, 'over', dom, e); break;
				case 'dragleave' : st(false, 'out', dom, e); break;
				case 'drop' : 
					st(false, 'end', dom, e);
					var ev = e._EVT;
					var files = ev.target.files || ev.dataTransfer.files;
					if (this.czf || (files != null && files.length > 0))
					{
						gf(files, dom, e);
					}
			}
		}).bind(
		{
			lst : null, // last state
			fnState : fnState, // fnState
			fnGetFile : fnGetFile, // fnGetFile
			czf : isCallZeroFile === true // isCallZeroFile
		});
		
		for (var i = 0 ; i < this.length ; i++)
		{
			fnState(false, 'out', this.get(i), null);
		}
		this.evt("dragover", proxy);
		this.evt("dragleave", proxy);
		this.evt("drop", proxy);
		
		return this;
	},
	
	// - $.dom $.dom.evt(String type)
	// - $.dom $.dom.evt(String type, Function func)
	evt : function(type, func)
	{
		var list = RAON.evt._LIST;
		var ot = 'on' + type;
		
		if (arguments.length == 2)
		{
			// 신규
			if (func != null)
			{
				var el, prx, idx;
				
				for (var i = 0 ; i <this.length ; i++)
				{
					el = this[i], idx = list.push([]) - 1;
					prx = (function(e) { this.func(RAON.evt(e, [this.dom], this.idx)); }).bind({idx : idx, func : func, dom : el});
					list[idx].cat([type, el, prx]);
					el.addEventListener(type, prx, false);
				}
			}
			// 제거
			else
			{
				var el = ([]).cat(this);
				// 라온에 의한
				for (var i = 0 ; i < list.length ; i++)
				{
					var info = list[i];
					
					for (var j = 0 ; j < el.length ; j++)
					{
						if (info[0] == type && info[1] == el[j])
						{
							el[j].removeEventListener(type, info[2], false);
							el.del(j--);
							list.del(i--);
						}
					}
				}
				
				// html 테그성 이벤트 삭제
				for (var i = 0 ; i < this.length ; i++)
				{
					var n = el[i];
					n[ot] = null;
					n.removeAttribute(ot);
				}
			}
		}
		else
		{
			var func;
			
			// html 테그성 이벤트
			for (var i = 0 ; i < this.length ; i++)
			{
				if ((func = (this[i][ot])))
				{
					var n = this[i];
					var e = RAON.evt(n, null); // 타입넣어줘야함..!!
					func.apply(n, e);
				}
			}
		}
		
		return this;
	}
	
	
	
});
	
	