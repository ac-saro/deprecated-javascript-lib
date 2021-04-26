// - $.ui.form $.ui.form()
// - $.ui.form $.ui.form(String id, Object option)
RAON.ui.form = RAON.toFnStClass(function(id, option)
{
	// 모든폼을 실행시킴
	if (arguments.length == 0)
	{
		var attrName = RAON.ui.form._DAT;
		var el = RAON.findsAttr(RAON.ui.form._DAT);
		
		for (var i = 0 ; i < el.length ; i++)
		{
			var e = el.get(i);
			var eo = e[0];
			var id = e.attr(attrName).trim();
			var obj = RAON.ui.form._LIST[id];
			if (obj)
			{
				obj._BIND();
				eo.onchange = eo.onkeyup = obj._EVENT.bind(obj);
				eo.onkeypress = obj._EVENT_FILTER.bind(obj);
				eo.onclick = obj._EVENT_CLICK.bind(obj);
				eo.oncut = eo.onpaste = obj._EVENT_CUT_PASTE.bind(obj);
			}
			else
			{
				throw 'not defined raon-form-id : '+id;
			}
		}
	}
	// 폼 규칙 입력
	else if (arguments.length == 2)
	{
		var g = this.get();
		g._ID = id;
		g._FLOW = option.flow == true;
		if (option.format) { g.format = option.format; }
		if (option.onClick) { g.onClick = option.onClick; }
		if (option.onValid) { g.onValid = option.onValid; }
		if (option.onEnter) { g.onEnter = option.onEnter; }
		if (option.init) { g.init = option.init; }
		if (option.onSend) { g.onSend = option.onSend; }
		
		
		for (var name in option)
		{
			if (name.sw('$'))
			{
				g[name] = option[name];
			}
		}
		return (RAON.ui.form._LIST[id] = g);
	}
	
},
{
	_DAT : 'raon-form-id',
	_LIST : {}
},
{
	_RAON_TYPEOF : '$.ui.form',
	
	onValid : function(){},
	onClick : function(){},
	onSend : function(){},
	onEnter : function(){},
	format : {},
	
	_ID : null,
	_DOM : null,
	_FLOW : false,
	_BIND : function()
	{
		var form = $('[raon-form-id="' + this._ID + '"]');
		if (this._DOM != form)
		{
			var format = this.format;
			this._DOM = form;
			var el = form.finds('[name]');
			for (var i = 0 ; i < el.length ; i++)
			{
				var e = el[i];
				var name = e.name.trim();
				var attr = format[name];
				if (attr)
				{
					if (attr.hint) { e.placeholder = attr.hint; }
					if (attr.max) { e.maxLength = attr.max; }
					if (attr.filter)
					{
						var filter = attr.filter;
						if (RAON.type(filter, 'regexp'))
						{
							filter = (function(val){ return this.r.test(val); }).bind({ r : filter });
						}
						e.filter = filter;
					}
					if (attr.valid)
					{
						var valid = attr.valid;
						switch (RAON.type(valid))
						{
							case 'regexp' :
								valid = (function(val){ return this.r.test(val); }).bind({ r : valid });
							break;
							case 'string' :
								if ((valid = valid.re(/\s+/, '')).sw('=='))
								{
									var name = valid.sub(2);
									valid = 
										(function(val, form)
										{
											var e = form.find('[name="'+this.name+'"]');
											return e.is() && e.val() == val;
										}).bind({ name : name });
								}
								else
								{
									throw '$.ui.form : not valid "String valid"';
								}
							break;
						}
						
						e.valid = valid;
					}
					if (attr.value) { e.value = attr.value; }
					if (attr.send === true) { e.cb_send = true; }
					if (attr.click === true) { e.cb_click = true; }
					e.msg_empty = attr.msg_empty ? attr.msg_empty : '';
					e.msg_error = attr.msg_error ? attr.msg_error : '';
					e.msg_valid = attr.msg_valid ? attr.msg_valid : '';
					e.watch = attr.watch !== false;
					e.watch_value = attr.watch_value === true;
					e.last_pass = true;
					if (attr.init) { attr.init(el.get(i), form); }
				}
			}
			// 초기화
			if (this.init)
			{
				this.init();
			}
		}
	},
	// 붙여넣기 값변화 감지.
	_EVENT_CUT_PASTE : function(evt)
	{
		var e = evt.target;
		var val = e.value;
		$.timer( (function(idx)
		{
			if (this.val != this.e.value || idx >= this.delay.length)
			{
				this.form._EVENT_FILTER({target : this.e, type : 'cut-paste'});
				this.form._EVENT({target : this.e, type : 'keyup', which : 0}, false);
				return 0;
			}
			else
			{
				return this.delay[idx];
			}
		}).bind({ form : this, e : e, val : val, delay : [20, 20, 40, 80, 100, 200, 400, 800] }), 20);
	},
	// 클릭 인벤트 감지
	_EVENT_CLICK : function(evt)
	{
		var e = evt.target;
		if (e.cb_click === true)
		{
			this.onClick(e.name);
		}
		else if (e.cb_send === true)
		{
			this.onSend();
		}
	},
	// 필터링
	_EVENT_FILTER : function(evt)
	{
		var e = evt.target;
		if (!e.filter) { return; }
		
		var type = evt.type;
		var val = e.value;
		
		if (type == 'keypress')
		{
			if (!evt.ctrlKey)
			{
				var key = evt.which;
				// 8 BS, 9 TAB, 13엔터, 27 ESC, 32 스페이스, 37~40 방향키
				if (!e.filter(key.toChar()))
				{
					$.evt(evt).stop();
				}
			}
		}
		else
		{
			var rv = '';
			var c;
			var cs = false;
			for (var i = 0 ; i < val.length ; i++)
			{
				if (e.filter((c = val.charAt(i))))
				{
					rv += c;
				}
				else
				{
					cs = true;
				}
			}
			if (cs) { e.value = rv; }
		}
	},
	// 각종 변경 이벤트 : keyup, change 
	_EVENT : function(evt, action)
	{
		if (action !== true) { action = false; }
		var e = evt.target
		
		// 필터 추가
		if (e.filter)
		{
			this._EVENT_FILTER({target : e, type : 'keyup'});
		}
		
		// 실시간감시 [watch]
		if (!action)
		{
			// 엔터키에대한 반응
			if (evt.which == 13 && e.tagName.lo() == 'input')
			{
				this.onEnter(e.name);
			}

			// 와칭되지 않는 상태에서 오류 후 다시 글을 쓸 경우 오류상태를 원상복구시킴.
			if (!e.watch)
			{
				if (evt.which != 13 && !e.last_pass)
				{
					e.last_pass = true;
					this.onValid(false, true, e.name, e.msg_valid, e.value);
				}
				return;
			}
		}
		
		// 검증
		if (e.valid)
		{
			var val = e.value;
			// not watch value : 엑션상태에선 무조건 실행함으로 예외
			var nwv = !action && !e.watch_value;
			
			// checkbox, radio의 모호성
			if (RAON.type(e.type, 'string') && (/^checkbox|radio$/i).test(e.type))
			{
				// 첫번째 객체를 가져와 대표로 사용한다.
				e = this._DOM.find('[name="'+e.name+'"]')[0];
				val = this.val(e.name);
			}
			
			if (val.is())
			{
				var pass = e.valid(val, this._DOM);
				
				if (nwv)
				{
					var pass_code = pass ? 'pass' : 'fail';
					if (e.last_st == pass_code) { return pass; }
					e.last_st = pass_code;
				}
				
				e.last_pass = pass;
				this.onValid(action, pass, e.name, (pass ? e.msg_valid : e.msg_error), val);
				return pass;
			}
			else if (e.msg_empty)
			{
				if (nwv)
				{
					if (e.last_st == 'empty') { return false; }
					e.last_st = 'empty';
				}
				this.onValid(action, false, e.name, e.msg_empty, val);
			}
			else
			{
				if (nwv)
				{
					if (e.last_st == 'empty') { return true; }
					e.last_st = 'empty';
				}
				this.onValid(action, true, e.name, '', val);
				e.last_pass = true;
				return true;
			}
			e.last_pass = false;
			return false;
		}
		// 검증이 없으면 통과로 계산.
		// 각종 버튼등..
		else
		{
			return true;
		}
	},
	getForm : function()
	{
		return this._DOM;
	},
	getName : function(name)
	{
		return this._DOM.finds('[name="'+name+'"]');
	},
	find : function(query)
	{
		return this._DOM.find(query);	
	},
	finds : function(query)
	{
		return this._DOM.finds(query);
	},
	val : function(name)
	{
		var el = this.getName(name);
		if (el.length > 1)
		{
			var sel = el.filter(':checked');
			switch (el[0].type)
			{
				case 'radio' :
					return sel.is() ? sel.val() : '';
				case 'checkbox' :
					return sel.vals();
			}
		}
		return el.val();
	},
	valid : function(name)
	{
		var el;
		var evt = this._EVENT.bind(this);
		// 모두검사
		if (arguments.length == 0)
		{
			el = this._DOM.finds('[name]');
		}
		// 선택검사
		else
		{
			el = this.getName(name);
		}
		var pass = true;
		for (var i = 0 ; i < el.length ; i++)
		{
			if (!evt({ target : el[i] }, true))
			{
				pass = false;
				if (!this._FLOW) { break; }
			}
		}
		return pass;
	}
});
	
	