RAON.ext(Array.prototype,
{
	_RAON_TYPEOF : 'array',
	
	// - String Array.toStr(Link)
	toStr : Array.prototype.join,
	
	// - String Array.each(Link)
	each : Array.prototype.some,
	
	// - String Array.iof(Link)
	iof : Array.prototype.indexOf,
	
	// - String Array.lof(Link)
	lof : Array.prototype.lastIndexOf,
	
	// - Array Array.rev()
	rev : Array.prototype.reverse,
	
	// - Array Array.asc()
	// - Array Array.asc(boolean isNumber)
	asc : function(isNo)
	{
		if (isNo === true)
		{
			this.sort(function(a, b){ return a - b; });
		}
		else
		{
			this.sort();
		}
		return this;
	},
	
	// - Boolean Array.is()
	// - Boolean Array.is(Number idx)
	is : function(idx)
	{
		return this.length > (arguments.length == 0 ? 0 : idx);
	},
	
	// - Array Array.cat(Array array)
	cat : function(array)
	{
		for (var i = 0 ; i < array.length ; i++)
		{
			this.push(array[i]);
		}
		return this;
	},
	
	// - Array Array.sub(Number start)
	// - Array Array.sub(Number start, Number end)
	sub : function(sp, ep)
	{
		return arguments.length == 2 ? this.copy().slice(sp, ep) : this.copy().slice(sp);
	},
	
	// - Array Array.copy()
	copy : function()
	{
		return ([]).concat(this);
	},
	
	// - Array Array.clear()
	clear : function()
	{
		this.splice(0, this.length);
		return this;
	},
	
	// - Array Array.reset()
	// - Array Array.reset(Array arr)
	reset : function(array)
	{
		this.splice(0, this.length);
		if (arguments.length == 1)
		{
			this.cat(array);
		}
		return this;
	},
	
	// - Array Array.insArr(Number idx, Array array)
	insArr : function(idx, array)
	{
		var h = this.sub(0, idx);
		var t = this.sub(idx);
		return this.reset(h.cat(array).cat(t));
	},
	
	// - Array Array.addFirstArr(Array array)
	addFirstArr : function(arr)
	{
		return this.insArr(0, arr);
	},
	
	// - Array Array.add(Object obj)
	add : function(obj)
	{
		this.push(obj);
		return this;
	},
	
	// - Array Array.addFirst(Object obj)
	addFirst : function(obj)
	{
		return this.ins(0, obj);
	},
	
	// - Array Array.ins(Number idx, Object obj)
	ins : function(idx, obj)
	{
		this.splice(idx, 0, obj);
		return this;
	},
	
	// - Array Array.del(Number idx)
	del : function(idx)
	{
		this.splice(idx, 1);
		return this;
	},
	
	// - #Object Array.first()
	first : function()
	{
		return this.is() ? this[0] : null;
	},
	
	// - #Object Array.last()
	last : function()
	{
		return this.is() ? this[this.length - 1] : null;
	},
	
	// - #Object Array.min()
	// null이 처리되고있음으로 따로 처리할 필요가 없다.
	min : function()
	{
		return this.copy().asc(true).first();
	},
	
	// - #Object Array.max()
	// null이 처리되고있음으로 따로 처리할 필요가 없다.
	max : function()
	{
		return this.copy().asc(true).last();
	},
	
	// - #Object Array.popPos(Number idx)
	// 인덱스 범위 안전성을 지원하지 않음.
	popPos : function(idx)
	{
		return this.splice(idx, 1)[0];
	},
	
	// - Array Array.desc()
	// - Array Array.desc(Boolean isNo)
	desc : function(isNo)
	{
		return this.asc(isNo === true).rev();
	},
	
	// - Array Array.rand()
	rand : function()
	{
		var tmp = this.copy();
		this.clear();
		
		while (tmp.is())
		{
			this.push(tmp.popPos(tmp.length.rand()));
		}
		
		return this;
	},
	
	// - String Array.codeToStr()
	codeToStr : function()
	{
		var rv = "";
		for (var i = 0 ; i < this.length ; i++)
		{
			rv += this[i].toChar();
		}
		return rv;
	},
	
	// - String Array<String>.strTrim()
	strTrim : function()
	{
		for (var i = 0 ; i < this.length ; i++)
		{
			this[i] = this[i].trim();
		}
		return this;
	},
	
	// - Array Array.re(Object oldObj, Object newObj)
	re : function(oldObj, newObj)
	{
		for (var i = 0 ; i < this.length ; i++)
		{
			if (this[i] == oldObj)
			{
				this[i] = newObj;
				break;
			}
		}
		return this;
	},
	
	// - Array Array.ascProp(String propName)
	ascProp : function(prop)
	{
		var props = [];
		for (var i = 0 ; i < this.length ; i++)
		{
			props.push(this[i][prop] + " - " + i);
		}
		props.sort();
		var tmp = this.copy();
		this.clear();
		for (var i = 0 ; i < props.length ; i++)
		{
			this.push(tmp[props[i].match(/[\d]+$/)[0].toNo()]);
		}
		return this;
	},
	
	// - Array Array.descProp(String propName)
	descProp : function(prop)
	{
		return this.ascProp(prop).rev();
	},
	
	// - Array Array.reAll(Object oldObj, Object newObj)
	reAll : function(oldObj, newObj)
	{
		for (var i = 0 ; i < this.length ; i++)
		{
			if (this[i] == oldObj)
			{
				this[i] = newObj;
			}
		}
		return this;
	},
	
	// - Boolean Array.has(Object obj)
	has : function(obj)
	{
		return this.iof(obj) != -1;
	},
	
	// - Boolean Array.hasOne(Array arr)
	hasOne : function(arr)
	{
		for (var i = 0 ; i < arr.length ; i++)
		{
			if (this.iof(arr[i]) != -1)
			{
				return true;
			}
		}
		return false;
	},
	
	// - Boolean Array.hasAll(Array arr)
	hasAll : function(arr)
	{
		for (var i = 0 ; i < arr.length ; i++)
		{
			if (this.iof(arr[i]) == -1)
			{
				return false;
			}
		}
		return true;
	},
	
	// - Array Array.uni()
	uni : function()
	{
		for (var i = (this.length - 1) ; i >= 1  ; i--)
		{
			if (this.iof(this[i]) != i)
			{
				this.del(i);
			}
		}
		
		return this;
	},
	
	// - Array Array.catUni(Array arr)
	catUni : function(arr)
	{
		for (var i = 0 ; i < arr.length ; i++)
		{
			if (this.iof(arr[i]) == -1) { this.push(arr[i]); }
		}
		
		return this;
	},
	
	// - Array Array.addUni(Object obj)
	addUni : function(obj)
	{
		if (this.iof(obj) == -1)
		{
			return this.push(obj);
		}
		return -1;
	},
	
	// - Array Array.delObjs(Object[] objs)
	delObjs : function(objs)
	{
		for (var i = 0 ; i < this.length ; i++)
		{
			if (objs.iof(this[i]) != -1)
			{
				this.splice(i--, 1);
			}
		}
		return this;
	},
	
	// - Array<String> Array<String>.strFiltEmp()
	strFiltEmp : function()
	{
		var v;
		for (var i = 0 ; i < this.length ; )
		{
			v = this[i];
			if (!v.is())
			{
				this.del(i);
				continue;
			}
			i++;
		}
		return this;
	}
	
	
	
});
