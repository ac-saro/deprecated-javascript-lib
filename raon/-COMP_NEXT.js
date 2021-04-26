// IE 9 이하 호환성 영역
if (window.ActiveXObject)
{
	// IE 6 ~ 8
	if (!document.addEventListener)
	{
		//RAON.evt = RAON.evt();
		
		// IE 6 ~ 8 BIND ERROR FIX
		RAON._custom_find = function(){ return []; };
		
		RAON.dom._RAON_CLASS.prototype.evt = function(type, func)
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
						el = this[i], idx = list.push([]) - 1, prx = (function(e) { this.func(RAON.evt(e, this.idx)); }).bind({idx : idx, func : func});
						list[idx].cat([type, el, prx]);
						el.attachEvent(ot, prx);
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
								el[j].detachEvent(ot, info[2]);
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
		};
		
		RAON.dom._RAON_CLASS.prototype.toStr = function()
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
						rv += this[i].xml;
					}
			}
			return rv;
		};
		
		RAON.evt._RAON_CLASS.prototype.die = function()
		{
			var dom, info = RAON.evt._LIST[this._IDX];
			if (info)
			{
				info[1].detachEvent("on"+info[0], info[2]);
				RAON.evt._LIST.del(this._IDX);
			}
			else if (this._DOM)
			{
				var ot = 'on' + this.type();
				if (ot == '') { return; }
				(dom = this._DOM)[ot] = null;
				dom.removeAttribute(ot);
			}
		};
		
		RAON.dom._RAON_CLASS.prototype.text = function(val)
		{
			if (arguments.length == 0)
			{
				if (this.is())
				{
					return this[0].innerText;
				}
				return "";
			}
			else if (this.is())
			{
				val = val + '';
				var isHtml = this.isHtml();
				for (var i = 0 ; i < this.length ; i++)
				{
					this[i].innerText= val;
				}
			}
			return this;
		};
		
		RAON.dom._FIND = function (dom, query)
		{
			var isOne = !RAON.type(query, 'array');
			if (!isOne) { query = query[0]; }
			
			var el = [];
			
			el.catUni(RAON._custom_find(dom, query, isOne));
			
			if (isOne && el.length > 1)
			{
				el = [el[0]];
			}
			
			return RAON.dom._EXT(el);
		};
		
		RAON.dom._MATCH = function (dom, query)
		{
			return RAON._custom_match(dom, query);
		};
	}
	
	// IE 6 ~ 9
	if (typeof document.createElement('input').placeholder != 'string')
	{
		RAON.ui.placeholder = (function()
		{
			var attr = 'placeholder';
			var el = RAON.finds('[' + attr + '][raon-comp]:not([raon-compatible-bind-id])');
			
			for (var i = 0 ; i < el.length ; i++)
			{
				var e = el.get(i);
				var id = 'raon-' + RAON.time() + 'IDX' + i;
				RAON.ui.placeholder._bind(attr, id, e);
			}
			
		}).ext(
		{
			_bind : function(attr, id, e)
			{
				var pa = e.up()[0];
				var off = e[0];
				var offH = off.offsetHeight;
				var offW = off.offsetWidth;
				var holder = RAON.dom([document.createElement('div')]);
				var tmp;
				
				holder
					.css('max-width', offW+'px')
					.css('height', offH+'px')
					.css('line-height', offH+'px')
					.css('font-weight', 'bold')
					.css('color', '#999')
					.css('margin', '0')
					.css('padding', '0')
					.css('margin-top', -offH+'px')
					.css('cursor', 'text')
					.css('vertical-align', 'top')
					.css('overflow', 'hidden')
					.addClass('raon-placeholder')
					.attr('raon-compatible-id', id)
					.text(e.attr(attr))
					.attr('onclick', "RAON('[raon-compatible-bind-id="+id+"]')[0].focus();");
				
				e.attr('raon-compatible-bind-id', id).nextIns(holder);
				e[0].onfocus = (function(){ RAON('[raon-compatible-id='+this.id+']').hide(); }).bind({id : id});
				e[0].onblur = (function(){ if ( RAON('[raon-compatible-bind-id='+this.id+']').val() == ''){ RAON('[raon-compatible-id='+this.id+']').css('display', ''); } }).bind({id : id});

			}
		});
		
		RAON.ui._load_ui_event_list.push('placeholder');
	}
}

if (window.ActiveXObject || (!Element.prototype.remove))
{
	// IE 6 ~ 8 BIND ERROR FIX
	if (!window.Element) { window.Element = { prototype : {} }; }
		
	Element.prototype.remove = function()
	{
		this.parentElement.removeChild(this);
	};
}