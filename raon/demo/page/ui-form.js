// 이해를 돕기위해 공용 js(main.js) 가 아닌  ui-form.js 를 사용하였음.
// public js(main.js) is used instead of ui-form.js for will be helping you understand
var format =
{
	email :
	{
		max : 64,
		hint : 'e-mail',
		msg_empty : 'require value',
		msg_error : 'e-mail format error',
		watch : true,
		valid : function(val, form) { return val.isMail(64); }
	},
	
	email_no_watch :
	{
		max : 64,
		hint : 'e-mail',
		msg_empty : 'require value',
		msg_error : 'e-mail format error',
		watch : false,
		valid : function(val, form) { return val.isMail(64); }
	},
	
	no :
	{
		max : 10,
		hint : 'langth 10 number',
		msg_empty : 'require value',
		msg_error : 'is langth 10 number',
		filter : /^[\d]+$/,
		valid : /^[\d]{10}$/,
	},
	
	no_empty : 
	{
		max : 10,
		hint : 'langth 10 number',
		msg_error : 'is langth 10 number',
		filter : function(e){ return e.isNo(); }, // function version
		valid : function(e){ return e.test(/^[\d]{10}$/); }, // function version
	},
	
	pwc1 :
	{
		max : 32,
		hint : 'password',
		msg_empty : 'require value',
		msg_error : 'need more complexity',
		watch : true,
		// always callback onvalid
		watch_value : true,
		valid : function(val, form) { return val.pp(8) > 1; },
		// 사용자함수 : 비밀번호 복잡도 점수
		// custom function : password point (password complexity)
		$point : function(val)
		{
			var len = val.length;
			var pp = val.pp(8);
			if (pp == 4 && len < 20) { pp = 3; }
			if (pp == 3 && len < 14) { pp = 2; }
			return pp;
		}
	},
	
	pwc2 :
	{
		max : 32,
		hint : 'password confirm',
		msg_empty : 'require value',
		msg_error : 'password not equal',
		watch : true,
		valid : '==pwc1'
	},
	
	sel :
	{
		msg_empty : 'require select',
		valid : function(val, form) { return val.is(); },
		init : function(element, form)
		{
			var el = element[0];
			el.add(new Option('please select', ''));
			for (var i = 0 ; i < 10 ; i++)
			{
				el.add(new Option('select ' + i, 'value ' + i));
			}
		}
	},
	
	rdo :
	{
		msg_empty : 'require value',
		msg_error : 'not select value 2',
		valid : function(val, form) { return val != '2'; }
	},
	
	chk :
	{
		msg_empty : 'require value',
		msg_error : 'max select 2',
		valid : function(val, form) { return val.length <= 2; }
	},
	
	btn :
	{
		value : 'test button : ajax address',
		click : true
	},
	
	send :
	{
		value : 'valid and send',
		send : true
	}
	
};

var uiForm = $.ui.form('ui-form',
{
	format : format,
	// 처음 폼이 불릴때 콜백 (필수아님)
	// callback init first form (not indispensable)
	init : function()
	{
		
	},
	// 엔터감지 (필수아님)
	// watch enter key (not indispensable)
	enter : function(name)
	{
		if (name == 'email')
		{
			this.getName('email_no_watch').focus();
		}
	},
	// 클릭 콜백 (필수아님)
	// callback click (not indispensable)
	onClick : function(name)
	{
		if (name == 'btn')
		{
			this.onValid(true, false, 'btn', 'ajax value : ' + $.ajax('/test-send-abc').pmForm($('#page-ui-form')).src());
		}
	},
	// 검증 콜백
	// callback valid
	onValid : function(action, pass, name, msg, val)
	{
		var domEl = this.getName(name);
		var domErr = $('#err-'+name);
	
		// 암호체크
		if (name == 'pwc1')
		{
			var pp = this.format.pwc1.$point(val);
			var ppm = ['unable', 'weak', 'normal', 'strong', 'ultimate'];
			$('#pwc-lv').addClass('on').find('div').setClass('lv'+pp).text(ppm[pp]);
		}
		
		if (pass)
		{
			domEl.delClass('err');
			this.$err(domErr, false, '');
		}
		else
		{
			domEl.addClass('err');
			this.$err(domErr, true, msg, action);
			if (action)
			{
				domEl.focus();
			}
		}
	},
	// $로 시작하는 이름은 사용자 함수/변수 ; uiForm.$err(...) 식으로 부를 수 있다.
	// start name $ is custom function/var ; possible call by uiForm.$err(...)
	$err : function(domErr, on, text, blink)
	{
		domErr.text(text)[on ? 'addClass' : 'delClass']('on');
		if (on && blink)
		{
			$.rep((function(i) { this.e.css('color', (i % 2 == 0) ? '#fff' : ''); }).bind({e : domErr}), 400, 4);
		}
	},
	// 보내기
	// send
	send : function()
	{
		if (this.valid())
		{
			window.alert('all valid!!');
		}
	}
});