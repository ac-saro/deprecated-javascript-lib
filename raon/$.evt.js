// - $.evt $.evt(Event event)
// - $.evt $.evt(Event event, $.dom dom)
RAON.evt = RAON.toFnStClass(function(evt, dom, idx)
{
	var e;
	
	switch (RAON.type(evt))
	{
		case '$.evt' :
			return evt;
		case 'string' :
			e = this.get();
			e._TYPE = evt;
			e._TARGET = dom;
		break;
		default :
			// 일반, 익스8이하, 익스8이하[로드류]
			if (evt.target != undefined || evt.srcElement ||  evt.type == 'load')
			{
				e = this.get();
				e._EVT = evt;
				break;
			}
			throw "invalid parameter";
	}
	
	if (typeof idx == 'number') { e._IDX = idx; }
	if (dom) { e._DOM = RAON.dom(dom); }
	return e;
},
{
	_LIST : []
	//_LISTP_TYPE : 0,
	//_LISTP_DOM : 1,
	//_LISTP_FUNC : 2
},
{
	_RAON_TYPEOF : '$.evt',
	_EVT : {},
	_IDX : -1,
	_DOM : null,
	// _TARGET, _FROM
	
	// - #$.dom $.evt.target()
	target : function()
	{
		var rv = RAON.coal([this._EVT.target, this._EVT.srcElement, this._TARGET]);
		return rv ? RAON.dom._EXT(rv) : null;
	},
	
	// - #$.dom $.evt.from()
	from : function()
	{
		return this._DOM != null ? RAON.dom._EXT(this._DOM) : null;
	},
	
	// - Number $.evt.key()
	// - Boolean $.evt.key(Number which)
	key : function(which)
	{
		if (arguments.length == 0)
		{
			return this._EVT.which || this._EVT.keyCode;
		}
		else
		{
			return this.key() == which;
		}
	},
	
	// - String $.evt.keyChar()
	keyChar : function()
	{
		return this.key().toChar();
	},
	
	// - Boolean $.evt.isCtrl()
	isCtrl : function()
	{
		return this._EVT.ctrlKey;
	},
	
	// - Boolean $.evt.isAlt()
	isAlt : function()
	{
		return this._EVT.altKey;
	},
	
	// - Boolean $.evt.isShift()
	isShift : function()
	{
		return this._EVT.shiftKey;
	},
	
	// - Boolean $.evt.enter()
	enter : function()
	{
		return this.key(13);
	},
	
	// - String $.evt.type()
	type : function()
	{
		return RAON.coal([this._EVT.type, this._TYPE, '']);
	},
	
	// - Number[] $.evt.pos()
	pos : function()
	{
		return [this._EVT.pageX, this._EVT.pageY];
	},
	
	// - $.evt $.evt.stop()
	stop : function()
	{
		try
		{
			if (this._EVT.preventDefault) { this._EVT.preventDefault(); } else { this._EVT.returnValue = false; }
		}
		catch (e) {}
		return this;
	},
	
	// - void $.evt.die()
	die : function()
	{
		var dom, info = RAON.evt._LIST[this._IDX];
		if (info)
		{
			info[1].removeEventListener(info[0], info[2], false);
			RAON.evt._LIST.del(this._IDX);
		}
		else if (this._DOM)
		{
			$.dom(this._DOM)[0]['on' + this.type()] = null;
		}
	},
	
	// - Boolean $.evt.isTool()
	isTool : function()
	{
		switch (this.target().tag())
		{
			case 'textarea' : case 'select' : case 'option' : case 'input' :
			return true;
		}
		
		return false;
	}
});
	
	