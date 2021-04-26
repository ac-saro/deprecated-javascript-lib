// - $.ui.tip $.ui.tip()
RAON.ui.tip = RAON.toFnStClass(function()
{
	var id = RAON.ui.tip._DAT_ID;
	var body = RAON.ui.tip._DAT_BODY;
	var attr = RAON.ui.tip._DAT;
	var htmlUnsafe = RAON.ui.tip._DAT_HTML_UNSAFE;
	var lineToBr = RAON.ui.tip._DAT_HTML_LINE_TO_BR;
	
	
	// [id] 바인드
	var el = RAON.findsAttr(id);
	for (var i = 0 ; i < el.length ; i++)
	{
		var e = el.get(i);
		var g = this.get();
		var b = e.findsAttr(body);
		// 돔 / 바디 설정
		g.dom = e;
		g.htmlSafe = e.attr(htmlUnsafe) == null;
		g.lineToBr = e.attr(lineToBr) != null;
		g.body = b;
		if (b.length == 0) { g.body = e; }
		// 옵션 : 필터함수
		var o = RAON.coal([b.attr(body), '']).trim();
		if (o.length > 0)
		{
			g.filter = o.eval();
		}
		// 기본설정
		e.hide();
		e.css('position', 'absolute');
		// 적재
		RAON.ui.tip.BIND[e.attr(id)] = g;
	}
	
	el = RAON.findsAttr(attr);
	for (var i = 0 ; i < el.length ; i++)
	{
		var e = el.get(i);
		var cmd = e.popAttr(attr);
		var tid = cmd.prev(':').trim();
		var msg = cmd.next(':');
		var execute;
		// 직접실행여부 ::감지
		if (msg.charAt(0) == ':') { msg = msg.sub(1).ln('\\n'); execute = ', true'; } else { execute = ', false'; }
		msg = '\'' + (msg).reAll("'", "\\'") + '\'';
		// 옵션
		msg = msg.trim();
		var bind = 'RAON.ui.tip.BIND.'+tid+'.';
		e.attr('onmouseover', bind+"over(RAON.evt(event), "+msg+execute+");");
		e.attr('onmousemove', bind+'move(RAON.evt(event));');
		e.attr('onmouseout', bind+'out();');
	}
},
{
	_DAT : 'raon-tip',
	_DAT_ID : 'raon-tip-id',
	_DAT_BODY : 'raon-tip-body',
	_DAT_HTML_UNSAFE : 'raon-tip-html-unsafe',
	_DAT_HTML_LINE_TO_BR : 'raon-tip-line-to-br',
	BIND : {}
},
{
	_RAON_TYPEOF : '$.ui.tip',
	dom : null,
	htmlSafe : true,
	lineToBr : false,
	body : null,
	filter : null,
	isNull : true,
	x : -1,
	y : -1,
	
	// 위치를 바꾸고싶다면 이부분을 오버라이드해서 사용한다.
	// 창을 벗어나는 경우를 대비하여 추가적으로 작업해야한다!
	getPos : function(pos, dom)
	{
		// 선언
		var win = RAON.winSize();
		dom.style.left = '-3000px';
		dom.style.top = '-3000px';
		// 오프셋 중간크기 / 스크롤위치에 따름 보정치 + 20
		var offWidh = dom.offsetWidth / 2;
		var obj = [offWidh + 22, dom.offsetHeight];
		
		// 가로 넘김
		if (win[0] < (pos[0] + obj[0]))
		{
			pos[0] -= pos[0] + obj[0] - win[0];
		}
		// 가로 보정
		pos[0] -= offWidh;
		// 가로 짤림
		if (pos[0] < 0) { pos[0] = 0; }
		
		// 보정
		pos[1] -= (obj[1] + 8);
		// 세로짤림
		if (pos[1] < 0)
		{
			pos[1] += (obj[1] + 8 + 16);
		}
		
		return pos;
	},
	
	over : function(evt, msg, execute)
	{
		// execute
		if (execute) { msg = msg.eval(); }
		// filter
		if (this.filter != null) { msg = this.filter(msg); }
		// null
		if (msg != null && msg.son() == null) { msg = null; }
		if (msg == null) { this.isNull = true; return; } else { this.isNull = false; }
		// safe option
		if (this.htmlSafe) { msg = msg.enHtml(); }
		// lineToBr
		if (this.lineToBr) { msg = msg.ln('<br/>'); }
		
		this.body.html(msg);
		this.dom.css('top', '-1000px').css('left', '0').show();
		this.move(evt);
	},
	
	move : function(evt)
	{
		if (this.isNull) { return; }
		var xy = evt.pos();
		if (xy[0] == this.x && xy[1] == this.y) { return; } else { this.x = xy[0]; this.y = xy[1]; }
		var d = this.dom;
		if (d)
		{
			var pos = this.getPos(xy, d[0]);
			d.css('left', pos[0] + 'px').css('top', pos[1] + 'px');
		}
	},
	
	out : function()
	{
		this.dom.hide();
	}
});