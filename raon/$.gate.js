// - $.gate $.gate()
// - $.gate $.gate(#Function pass)
// - $.gate $.gate(#Function pass, #Function fail)
// - $.gate $.gate(#Function pass, #Function fail, Number max)
RAON.gate = RAON.toFnClass(function(fnPass, fnFail, max)
{
	var g = this.get();
	switch (arguments.length)
	{
		case 0 :
			return g;
		case 3 :
			g._MAX = max;
		case 2 :
			g._FN_FAIL = fnFail;
		case 1 :
			g._FN_PASS = fnPass;
		return g;
	}
},
{
	_RAON_TYPEOF : '$.gate',
	
	_NOW : 0, // 현재
	_MAX : 1, // 최대
	_FN_PASS : null, // 성공함수
	_FN_FAIL : null, // 실패함수
	
	// - boolean $.gate.open()
	open : function()
	{
		if (this._MAX > this._NOW)
		{
			this._NOW++;
			
			// 성공시 실행함수
			if (this._FN_PASS) { this._FN_PASS(); }
			
			return true;
		}
		// 실패시 실행함수
		else if (this._FN_FAIL) { this._FN_FAIL(); }
		
		return false;
	},
	
	// - void $.gate.close()
	close : function()
	{
		if (this._NOW > 0)
		{
			this._NOW--;
		}
	},
	
	// - void $.gate.clear()
	clear : function()
	{
		this._NOW = 0;
	}
});
	
	