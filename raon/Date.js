RAON.ext(Date,
{
	TZ_OS : null,
	
	// - String Date.toStr(Date date, String format)
	toStr : function(date, format)
	{
		return format
			.re('yyyy', date.getFullYear()+'')
			.re('yy', date.getFullYear().toStr().sub(2).toNo().toStrZf(2))
			.re('MM', (date.getMonth() + 1).toStrZf(2))
			.re('dd', date.getDate().toStrZf(2))
			.re('HH', date.getHours().toStrZf(2))
			.re('mm', date.getMinutes().toStrZf(2))
			.re('SSS', date.getMilliseconds().toStrZf(3))
			.re('ss', date.getSeconds().toStrZf(2));
	},
	
	// - #Date Date.toDate(String dateText, String format, Boolean isSafe)
	// - #Date Date.toDate(String dateText, String format)
	toDate : function(dateText, format, isSafe)
	{
		if (isSafe == undefined) { isSafe = true; }
		var i, d = dateText, f = format;
		var rv = new Date
		(
			(i = f.iof('yyyy')) != -1 ? (d.sub(i, i+4).toNo()) : 2000
		,	(i = f.iof('MM')) != -1 ? (d.sub(i, i+2).toNo() - 1) : 0
		,	(i = f.iof('dd')) != -1 ? (d.sub(i, i+2).toNo()) : 1
		,	(i = f.iof('HH')) != -1 ? (d.sub(i, i+2).toNo()) : 0
		,	(i = f.iof('mm')) != -1 ? (d.sub(i, i+2).toNo()) : 0
		,	(i = f.iof('ss')) != -1 ? (d.sub(i, i+2).toNo()) : 0
		,	(i = f.iof('SSS')) != -1 ? (d.sub(i, i+3).toNo()) : 0
		);
		
		if (isSafe && rv.toStr(format) != dateText) { return null; }
		
		return rv;
	},
	
	// - #Date Date.toDateTz(String dateText, String format, Boolean isSafe)
	// - #Date Date.toDateTz(String dateText, String format)
	toDateTz : function(dateText, format, isSafe)
	{
		if (isSafe == undefined) { isSafe = true; }
		var d = Date.toDate(dateText, format, isSafe);
		if (d != null) { return d.tz(); } return null;
	},
	
	// - Boolean Date.isDate(String dateText, String format)
	isDate : function(dateText, format)
	{
		return Date.toDate(dateText, format, true) != null;
	},
	
	// - Number Date.tzOffset()
	tzOffset : function()
	{
		if (Date.TZ_OS == null)
		{
			Date.TZ_OS = new Date().getTimezoneOffset();
		}
		return Date.TZ_OS;
	},
	
	// - Number Date.tzStr()
	// - 나중에 타입만들어야함
	tzStr : function(zerofill, minfill)
	{
		var os = (Date.tzOffset() * -1);
		var m = os % 60;
		var h = (os / 60).floor();
		var rv = (zerofill === true ? h.toStrZf(2) : h.toStr());
		if (m > 0 || minfill === true)
		{
			rv += ':' + m.toStrZf(2);
		}
		return (os > 0 ? '+' : '') + rv;
	}
});

RAON.ext(Date.prototype,
{
	_RAON_TYPEOF : 'date',
	_RAON_IS_TZ : false,
	
	// - Date Date.copy()
	copy : function()
	{
		return new Date(this.getTime());
	},
	
	// - Number Date.left()
	left : function()
	{
		return this.getTime() - RAON.time();
	},
	
	// - Date Date.tz()
	tz : function()
	{
		if (!this._RAON_IS_TZ)
		{
			this.addTime(RAON.conf.tzMilDif);
			this._RAON_IS_TZ = true;
		}
		
		return this;
	},
	
	// - Date Date.unTz()
	unTz : function()
	{
		if (this._RAON_IS_TZ)
		{
			this.addTime(RAON.conf.tzMilDif);
			this._RAON_IS_TZ = false;
		}
		
		return this;
	},
	
	// - Date Date.toGmt()
	toGmt : function()
	{
		var d = this.copy().unTz();
		
		d.addTime(Date.tzOffset() * 60000);
		
		return d;
	},
	
	// - String Date.toStr(String format)
	toStr : function(format)
	{
		return Date.toStr(this, format);
	},
	
	// - Date Date.clearHmss()
	clearHmss : function()
	{
		this.setHours(0);
		this.setMinutes(0);
		this.setSeconds(0);
		this.setMilliseconds(0);
		
		return this;
	},
	
	// - Date Date.addTime(Number time)
	addTime : function(time)
	{
		this.setTime(this.getTime() + time);
		return this;
	},
	
	// - Date Date.addMin(Number min)
	addMin : function(min)
	{
		return this.addTime(min * 60000);
	},
	
	// - Date Date.addHuor(Number huor)
	addHuor : function(huor)
	{
		return this.addTime(huor * 3600000);
	},
	
	// - Date Date.addDate(Number day)
	addDate : function(date)
	{
		return this.addTime(date * 86400000);
	},
	
	// - Date Date.addWeek(Number week)
	addWeek : function(week)
	{
		return this.addTime(week * 604800000);
	},
	
	// - Date Date.addMonthAbs(Number month)
	addMonthAbs : function(month)
	{
		var date = this.getDate();
		this.setDate(1);
		
		var setMonth = this.getMonth() + month;
		var addYear = (setMonth / 12).floor();
		
		if (addYear.abs() > 0)
		{
			setMonth = (setMonth % 12);
			this.setFullYear(this.getFullYear() + addYear);
		}
		
		this.setMonth(setMonth);
		
		this.setDate(([date, this.getLastDateOfMonth()]).min());
		
		return this;
	},
	
	// - Date Date.addYearAbs(Number year)
	addYearAbs : function(year)
	{
		return this.addMonthAbs(year * 12);
	},
	
	// - Boolean Date.isLeap()
	isLeap : function()
	{
		var y = this.getFullYear();
		return ((y & 3) == 0) && ( (y % 400 == 0) || (y % 100 != 0) );
	},
	
	// - Number Date.getLastDateOfMonth()
	// - Number Date.getLastDateOfMonth(Number date)
	getLastDateOfMonth : function(date)
	{
		return ([31, (this.isLeap() ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])[arguments.length == 0 ? this.getMonth() : date];
	},
	
	// - Number Date.getLastWeekOfMonth()
	getLastWeekOfMonth : function()
	{
		var d = this.copy();
		d.setDate(d.getLastDateOfMonth());
		return d.getWeekOfMonth();
	},
	
	// - Number Date.getWeekOfMonth()
	getWeekOfMonth : function()
	{
		var d = this.copy();
		d.setDate(1);
		var w = d.getDay();
		return ((this.getDate() + w + 1) / 7).floor();
	},
	
	// - Date Date.setDay(Number dayOfWeek)
	setDay : function(dayOfWeek)
	{
		return this.addDate(dayOfWeek - this.getDay());
	},
	
	// - Date Date.setWeekOfMonth(Number weekOfMonth)
	setWeekOfMonth : function(weekOfMonth)
	{
		return this.addWeek(weekOfMonth - this.getWeekOfMonth());
	},
	
	// - Date Date.setWeekDayOfMonth(Number weekOfMonth, Number dayOfWeek)
	setWeekDayOfMonth : function(weekOfMonth, dayOfWeek)
	{
		this.setWeekOfMonth(weekOfMonth);
		this.setDay(dayOfWeek);
		return this;
	}
});
