RAON.ext(String,
{
	_BASE_ELEMENT : null,
	
	_GET_BASE_ELEMENT : function()
	{
		var rv = String._BASE_ELEMENT;
		if (rv == null)
		{
			rv = String._BASE_ELEMENT = document.createElement('div');
		}
		return rv;
	},
	
	_EN_HTML : function(s)
	{
		switch (s)
		{
			case '&' : return '&amp;';
			case '<' : return '&lt;';
			case '>' : return '&gt;';
		}
		return s;
	}
});
RAON.ext(String.prototype,
{
	_RAON_TYPEOF : 'string',
	
	// - String[] String.toArr(Link)
	toArr : String.prototype.split,
	
	// - String[] String.toArrTrim(String token)
	toArrTrim : function(token)
	{
		return this.toArr(token).strTrim();
	},
	
	// - $.dom String.xml()
	xml : function()
	{
		return RAON.dom(new DOMParser().parseFromString(this, "text/xml"));
	},
	
	// - $.dom String.html()
	html : function()
	{
		var html = this;
		var level = 0;
		var tag = html.match(/<[a-z]+/i);
		var el = String._GET_BASE_ELEMENT();
		
		if (tag != null)
		{
			switch (tag[0].sub(1).lo())
			{
				// 테이블 보정
				case 'td' : case 'th' : html = ('<tr>' + html + '</tr>'); level++;
				case 'tr' : html = ('<tbody>' + html + '</tbody>'); level++;
				case 'tbody' : html = ('<table>' + html + '</table>'); level++;
				break;
			}
		}
		
		el.innerHTML = html;
		for (var i = 0 ; i < level ; i++)
		{
			el = el.childNodes[0];
		}
		return RAON.dom(el.childNodes);
	},
	
	// - Boolean String.is()
	// - Boolean String.is(Number minLen, Number maxLen)
	is : function(minLen, maxLen)
	{
		return (!this.test(/^[\s]*$/)) && (arguments.length != 2 || (this.length >= minLen && this.length <= maxLen));
	},
	
	// - #String String.son()
	son : function()
	{
		return this.test(/^[\s]*$/) ? null : (this+'');
	},
	
	// - Object String.eval()
	eval : function()
	{
		return eval('(' + this + ')');
	},
	
	// - Object String.evalText()
	evalText : function()
	{
		var e = eval('(' + this + ')');
		switch (RAON.type(e))
		{
			case 'string' : return e;
			case 'function' : return e();
			default : return e+'';
		}
	},
	
	// - Function String.fn()
	fn : function()
	{
		return eval('(function(){ ' + this + ' })');
	},
	
	// - void String.exec()
	exec : function()
	{
		var s = document.createElement('script');
		s.type = "text/javascript";
		s.innerHTML = this;
		document.getElementsByTagName('head')[0].appendChild(s);
	},
	
	// - Number String.toNo()
	toNo : function()
	{
		return Number(this);
	},
	
	// - Number String.toInt()
	toInt : function()
	{
		return Number(this).floor();
	},
	
	// - Boolean String.isNo()
	// - Boolean String.isNo(Number min, Number max)
	isNo : function(min, max)
	{
		return arguments.length != 2 ? this.toNo().isNo() : this.toNo().isNo(min, max);
	},
	
	// - Boolean String.isInt()
	// - Boolean String.isInt(Number min, Number max)
	isInt : function(min, max)
	{
		return arguments.length != 2 ? this.toNo().isInt() : this.toNo().isInt(min, max) ;
	},
	
	// - String String.sub(Link)
	sub : String.prototype.substring,
	
	// - String String.re(Link)
	re : String.prototype.replace,
	
	// - String String.reAll(String oldStr, String newStr)
	reAll : function(oldStr, newStr)
	{
		return this.split(oldStr).join(newStr);
	},
	
	// - String String.up(Link)
	up : String.prototype.toUpperCase,
	
	// - String String.lo(Link)
	lo : String.prototype.toLowerCase,
	
	// - Number String.iof(Link)
	iof : String.prototype.indexOf,
	
	// - Number String.lof(Link)
	lof : String.prototype.lastIndexOf,
	
	// - String String.sw(Link)
	sw : String.prototype.startsWith,
	
	// - String String.ew(Link) 
	ew : String.prototype.endsWith,
	
	// - String String.trim()
	trim : function()
	{
		return this.re(/^\s*|\s*$/g, '');
	},
	
	// - String String.ltrim()
	ltrim : function()
	{
		return this.re(/^\s*/, '');
	},
	
	// - String String.rtrim()
	rtrim : function()
	{
		return this.re(/\s*$/, '');
	},
	
	// - String String.filtCtrl()
	filtCtrl : function()
	{
		return this.re(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F]+/g , '');
	},
	
	// - String String.ms()
	// merge space 다중 공백을 하나의 공백으로 만든다.
	ms : function()
	{
		return this.re(/\s+/g, ' ');
	},
	
	// - Boolean String.has(String word)
	// - Boolean String.has(String[] words)
	has : function(words)
	{
		if (typeof words == 'string')
		{
			return this.iof(words) != -1;
		}
		for (var i = 0 ; i < words.length ; i++)
		{
			if (this.iof(words[i]) != -1)
			{
				return true;
			}
		}
		return false;
	},
	
	// - Boolean String.hasAll(String[] words)
	hasAll : function(words)
	{
		for (var i = 0 ; i < words.length ; i++)
		{
			if (this.iof(words[i]) == -1)
			{
				return false;
			}
		}
		return true;
	},
	
	// - String String.ln()
	// - String String.ln(String lineWord)
	// - String String.ln(String lineWord, Boolean forceBr)
	ln : function(lineWord, forceBr)
	{
		return this.re(forceBr ? (/(\r\n|\r|\n|<br[\s]*\/>)/g) : (/(\r\n|\r|\n)/g), lineWord ? lineWord : '\n');
	},
	
	// - String[] String.matchNN(RegExp regexp)
	// - String[] String.matchNN(String token)
	// NN : not null 무조건 Array 반환
	matchNN : function(regexp)
	{
		var t = this.match(regexp);
		return t != null ? t : [];
	},
	
	// - String[] String.words()
	words : function()
	{
		var rv = this.ms().trim();
		return rv.length > 0 ? rv.toArr(' ') : [];
	},
	
	// - String String.en()
	en : function()
	{
		return encodeURIComponent(this);
	},
	
	// - String String.de() 
	de : function()
	{
		return decodeURIComponent(this);
	},
	
	// - String String.enUri()
	enUri : function()
	{
		return encodeURI(this);
	},
	
	// - String String.deUri()
	deUri : function()
	{
		return decodeURI(this);
	},
	
	// - String String.enEsc()
	enEsc : function()
	{
		return escape(this);
	},
	
	// - String String.deEsc()
	deEsc : function()
	{
		return unescape(this);
	},
	
	// - String String.enHtml()
	enHtml : function()
	{
//		// old
//		var e = String._GET_BASE_ELEMENT();
//		e.textContent = this;
//		return e.innerHTML;
		return this.re(/&|<|>/g, String._EN_HTML);
	},
	
	// - String String.deHtml()
	deHtml : function()
	{
		var e = String._GET_BASE_ELEMENT();
		e.innerHTML = this;
		return e.textContent;
	},
	
	// - Number String.cnt(String token)
	// - Number String.cnt(RegExp match)
	cnt : function(token)
	{
		if (RAON.type(token, 'string'))
		{
			tmp = this.split(token).length - 1;
		}
		else
		{
			tmp = this.match(token); 
			tmp = tmp != null ? tmp.length : 0;
		}
		return  tmp;
	},
	
	// - String String.next(String token)
	next : function(token)
	{
		return this.iof(token) != -1 ? this.sub(this.iof(token) + token.length) : '';
	},
	
	// - String String.prev(String token)
	prev : function(token)
	{
		return this.iof(token) != -1 ? this.sub(0, this.iof(token)) : '';
	},
	
	// - String String.gap(String lToken, String rToken)
	gap : function(lToken, rToken)
	{
		return this.next(lToken).prev(rToken);
	},
	
	// - String String.lnext(String token)
	lnext : function(token)
	{
		return this.lof(token) != -1 ? this.sub(this.lof(token) + token.length) : '';
	},
	
	// - String String.lprev(String token)
	lprev : function(token)
	{
		return this.lof(token) != -1 ? this.sub(0, this.lof(token)) : '';
	},
	
	// - String String.lgap(String lToken, String rToken)
	lgap : function(lToken, rToken)
	{
		return this.lnext(lToken).prev(rToken);
	},
	
	// - #Number[] String.pos(String token)
	pos : function(token)
	{
		var t = this.iof(token);
		return t != -1 ? [t, t + token.length] : null;
	},
	
	// - Number[] String.toCodes()
	toCodes : function()
	{
		var rv = [];
		
		for (var i = 0 ; i < this.length ; i++)
		{
			rv.push(this.charCodeAt(i));
		}
		
		return rv;
	},
	
	// - String[] String.toHexCodes()
	toHexCodes : function()
	{
		var rv = new Array(0);
		
		for (var i = 0; i < this.length; i++)
		{
			rv.push(this.charCodeAt(i).toStrHex());
		}
		
		return rv;
	},
	
	// - Number String.toCodeAt(Link)
	toCodeAt : String.prototype.charCodeAt,
	
	// - String String.toHexCodeAt(Number idx)
	toHexCodeAt : function(idx)
	{
		return this.charCodeAt(idx).toStrHex();
	},
	
	// - String String.genRand(Number len)
	// - String String.genRand(Number minLen, Number maxLen)
	genRand : function(minLen, maxLen)
	{
		var len = arguments.length != 2 ? minLen : (minLen + (maxLen - minLen + 1).rand());
		var strLen = this.length;
		
		var rv = "";
		
		for (var i = 0 ; i < len ; i++)
		{
			rv += this.charAt(strLen.rand());
		}
		
		return rv;
	},
	
	// - Number String.pp(Number minLen) : password point
	pp : function(minLen)
	{
		if (typeof minLen == 'number' && this.length < minLen)
		{
			return 0;
		}
		var pp = 0;
		
		pp += this.test(/[a-z]+/) ? 1 : 0; // 대문자
		pp += this.test(/[A-Z]+/) ? 1 : 0; // 소문자
		pp += this.test(/[0-9]+/) ? 1 : 0; // 숫자
		pp += this.re(/[0-9a-z]+/ig, '').length > 0 ? 1 : 0; // 특수문자
		
		return pp;
	},
	
	// - Boolean String.test(RegExp regexp)
	test : function(regexp)
	{
		return regexp.test(this);
	},
	
	// - Boolean String.isMail()
	// - Boolean String.isMail(Number maxLen)
	isMail : function(maxLen)
	{
		return (arguments.length != 1 || this.length <= maxLen) && this.test(/^[\._a-z0-9\-]+@[\._a-z0-9\-]+\.[a-z]{2,}$/);
	},
	
	// - Boolean String.isDate(String format)
	isDate : function(format)
	{
		return Date.isDate(this, format);
	},
	
	// - #Date String.toDate(String format)
	// - #Date String.toDate(String format, Boolean isSafe)
	toDate : function(format, isSafe)
	{
		if (isSafe == undefined) { isSafe = true; }
		return Date.toDate(this, format, isSafe);
	},
	
	// - #Date String.toDateTz(String format)
	// - #Date String.toDateTz(String format, Boolean isSafe)
	toDateTz : function(format, isSafe)
	{
		if (isSafe == undefined) { isSafe = true; }
		return Date.toDateTz(this, format, isSafe);
	}
});