RAON.ext(Number.prototype,
{
	_RAON_TYPEOF : 'number',
	
	// - Boolean Number.is()
	is : function()
	{
		try
		{
			return !isNaN(this) && this != Infinity;
		} catch (e) {}
		return !isNaN(this);
	},
	
	// - String Number.toStr()
	toStr : Number.prototype.toString,
	
	// - Date Number.toStrPnt(Number pntPos)
	toStrPnt : function(pntPos)
	{
		var str = this.toStr();
		
		if (str.has('.'))
		{
			if (pntPos > 0)
			{
				var h = str.prev('.');
				var t = str.next('.');
				
				if (pntPos != t.length)
				{
					if (pntPos < t.length)
					{
						str = h + '.' + t.sub(0, pntPos);
					}
					else
					{
						var ap = pntPos - t.length;
						for (var i = 0 ; i < ap ; i++)
						{
							str += '0';
						}
					}
				}
			}
			else
			{
				str = str.prev('.');
			}
		}
		else if (pntPos > 0)
		{
			str += '.';
			for (var i = 0 ; i < pntPos ; i++)
			{
				str += '0';
			}
		}
		
		return str;
	},
	
	// - Date Number.toDate()
	toDate : function()
	{
		return new Date(this);
	},
	
	// - String Number.toStrBin()
	toStrBin : function()
	{
		return this.toStr(2);
	},
	
	// - String Number.toStrOct()
	toStrOct : function()
	{
		return this.toStr(8);
	},
	
	// - String Number.toStrHex()
	toStrHex : function()
	{
		return this.toStr(16);
	},
	
	// - String Number.toStrZf(Number lenZeroFill)
	toStrZf : function(lenZeroFill)
	{
		var sign = this < 0;
		var str = (sign ? (this * -1) : this).toStr();
		var diff = lenZeroFill - str.length;
		var zero = '';
		
		for (var i = 0 ; i < diff ; i++) { zero += '0'; }
		
		return (sign ? '-' : '') + zero + str;
	},
	
	// - String Number.toChar()
	toChar : function()
	{
		return String.fromCharCode(this);
	},
	
	// - Number Number.toNo() 
	toNo : function()
	{
		return this;
	},
	
	// - Number Number.toInt()
	toInt : function()
	{
		return this.floor();
	},
	
	// - Boolean Number.isNo()
	// - Boolean Number.isNo(Number min, Number max)
	isNo : function(min, max)
	{
		return this.is() && ((arguments.length == 0) || (this >= min && this <= max));
	},
	
	// - Boolean Number.isInt()
	// - Boolean Number.isInt(Number min, Number max)
	isInt : function(min, max)
	{
		return this.is() && (this == this.floor()) && ((arguments.length == 0) || (this >= min && this <= max));
	},
	
	// - Number Number.ceil()
	ceil : function()
	{
		return Math.ceil(this);
	},
	
	// - Number Number.floor()
	floor : function()
	{
		return Math.floor(this);
	},
	
	// - Number Number.round()
	round : function()
	{
		return Math.round(this);
	},
	
	// - Number Number.pow()
	pow : function(num)
	{
		return Math.pow(this, num);
	},
	
	// - Number Number.rand()
	rand : function()
	{
		return (Math.random() * this).floor();
	},
	
	// - Number Number.per(Number max)
	per : function(max)
	{
		return (this / max) * 100;
	},
	
	// - Number Number.prog(Number per)
	prog : function(per)
	{
		return ((per / 100) * this).round();
	},
	
	// - Number Number.abs()
	abs : function()
	{
		return Math.abs(this);
	},
	
	// - Number Number.dif(Number num)
	dif : function(num)
	{
		return (this - num).abs();
	}
});
