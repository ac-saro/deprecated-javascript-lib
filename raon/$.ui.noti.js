// - $.ui.noti $.ui.noti()
// - $.ui.noti $.ui.noti(String id, String msg)
RAON.ui.noti = RAON.toFnStClass(function(id, msg)
{
	if (arguments.length == 0)
	{
		var aId = RAON.ui.noti._DAT_ID;
		var aOpt = RAON.ui.noti._DAT_OPT;
		var aBody = RAON.ui.noti._DAT_BODY;
		var el = RAON.findsAttr(aId);
		el.hide();
		
		for (var i = 0 ; i < el.length ; i++)
		{
			// 선언
			var noti = this.get();
			var e = el.get(i);
			var id = e.attr(aId);
			
			if (RAON.find('#raon-noti-area-'+id).is()) { continue; }
			var panel = ('<div style="position:fixed;overflow:hidden"></div>').html();
			panel.id('raon-noti-area-'+id);
			
			// 불러오기
			var optc = RAON.coal([e.attr(aOpt), '']).lo().ms().trim();
			var opt = optc.toArr(' ');
			var time = optc.matchNN(/[\d]+[\s]*\/[\s]*[\d]+/);
			var html = e.copy();
			
			// 적용
			noti.id = id;
			noti.opt = opt;
			noti.html = html;
			// 적용 - 세로
			if (opt.has('top')) { noti.posY = 'T'; panel.css('top', noti.gap+'px'); }
			else { panel.css('bottom', noti.gap+'px'); } // 기본값이 Bottom이기 때문에 Bottom은 따로 처리하지 않는다.
			// 적용 - 가로
			if (opt.has('left')) { noti.posX = 'L'; panel.css('left', noti.gap+'px'); }
			else if (opt.has('center')) { noti.posX = 'C'; panel.css('left', '0').css('right', '0'); html.css('margin-left', 'auto').css('margin-right', 'auto'); }
			else { panel.css('right', noti.gap+'px'); } // 마찬가지로 기본값이 Right이기 때문에 Right는 따로 처리하지 않는다.
			// 적용 - 이동
			if (opt.has('up')) { noti.move = 'U'; } else if (opt.has('down')) { noti.move = 'D'; }
			// 적용 - html
			if (opt.has('html')) { noti.isHtml = true; } // html 사용
			// 적용 - line
			if (opt.has('line')) { noti.isLineToBr = true; } // html 사용
			// 적용 - 시간
			if (time.length > 0)
			{
				time = time[0].toArrTrim('/');
				noti.initTime = time[0].toNo();
				noti.showTime = time[1].toNo();
			}
			if ((noti.posY == 'B' && noti.move == 'U') || (noti.posY == 'T' && noti.move == 'D')) { noti.isDrawMove = true; }
			else if ((noti.posY == 'B' && noti.move == 'D') || (noti.posY == 'T' && noti.move == 'U')) { noti.isGoneMove = true; }
			
			// 바인드
			noti.panel = panel.hide();
			RAON('body').add(panel);
			RAON.ui.noti.BIND[id] = noti;
		}
	}
	else
	{
		var noti = RAON.ui.noti.BIND[id];
		if (!id) { return; }
		
		if (RAON.type(noti, '$.ui.noti'))
		{
			noti.pushDraw(msg);
		}
	}
},
{
	_DAT_ID : 'raon-noti-id',
	_DAT_OPT : 'raon-noti-opt',
	_DAT_BODY : 'raon-noti-body',
	BIND : {},
	BIND_PM : {} // 바인드 하기 전 메시지저장
},
{
	_RAON_TYPEOF : '$.ui.noti',
	posY : 'B', // [B]ottom, [T]op
	posX : 'R', // [L]eft, [C]enter, [R]ight
	move : 'U', // [U]p [D]own
	isDrawMove : false,
	isGoneMove : false,
	isHtml : false, // html 사용여부
	isLineToBr : false, // line to br
	initTime : 500, // 대기시간
	showTime : 1000, // 표시시간
	gap : 5, // 갭
	msgList : [], // 메시지 리스트
	//html : null, // 객체 
	//panel : null, // 패널
	isWorkDraw : false,
	isWorkGone : false,
	
	// 메시지 push 감지
	pushDraw : function(msg)
	{
		// 준비
		if (RAON.type(msg, '$.dom'))
		{
			msg = msg.toStr();
		}
		else
		{
			if (msg == null || msg.son() == null) { return; }
			if (!this.isHtml)
			{
				msg = msg.enHtml(); 
			}
			if (this.isLineToBr)
			{
				msg = msg.ln('<br/>');
			}
		}
		
		// 대기열
		this.msgList.push(msg);
		// 중복실행방지
		if (this.isWorkDraw) { return; } else { this.isWorkDraw = true; }
		// 패널열기
		this.panel.show();
		// 생성
		this.draw();
	},
	
	draw : function()
	{
		if (this.msgList.length > 0)
		{
			// html 을만들고 body를 선언후 메시지를 넣는다.
			var unit = this.html.copy();
			var body = unit.findsAttr(RAON.ui.noti._DAT_BODY);
			(body.length == 0 ? unit : body).html(this.msgList.popPos(0));
			
			// 각종 도움설정
			var iu = this.move == 'U'; // is up
			var it = this.posY == 'T'; // is top
			var st = unit[0].style; // style
			// 초기설정값 [불투명도 0 상태로 보임]
			st.opacity = '0'; // 불투명도
			
			var mp = it ? 'marginTop' : 'marginBottom'; // margin pos
			st[it ? 'marginBottom' : 'marginTop'] = this.gap+'px'; // 간격
			
			// 적재
			this.panel[iu ? 'add' : 'addFirst'](unit);
			// 높이구하기
			st.display = ''; // 표시
			var oh = unit.offSize()[1]; // offset height
			// 무빙시 초기값
			if (this.isDrawMove) { st[mp] = (-oh) + 'px'; }
			
			
			RAON.rep((function(idx)
			{
				var st = this.st;
				var no = this.noti;
				var i = idx + 1;
				var mp = this.mp;
				var oh = this.oh;
				
				st.opacity = ((i * 0.1)+'');
				
				if (no.isDrawMove)
				{
					st[mp] = (oh * (-10 + i) * 0.1).floor() + 'px';
				}
				
				if (idx == 9)
				{
					// 다음실행 / 소멸적용
					if (no.msgList.length == 0)
					{
						no.isWorkDraw = false;
					}
					else
					{
						no.draw();
					}
					window.setTimeout(no.pushGone.bind(no), no.showTime);
				}
			}).bind({noti : this, unit : unit, mp : mp, st : st, oh : oh}), this.initTime / 10, 10, true);
		}
	},
	
	pushGone : function()
	{
		// 중복실행방지
		if (this.isWorkGone) { return; } else { this.isWorkGone = true; }
		this.gone();
	},
	
	gone : function()
	{
		// 대표추출
		var ch = this.panel.ch();
		
		if (ch.length > 0)
		{
			var unit = ch[this.move == 'U' ? 'first' : 'last']();
			var st = unit[0].style;
			var oh = unit.offSize()[1];
			var mp = this.posY == 'T' ? 'marginTop' : 'marginBottom';
			
			RAON.rep((function(idx)
			{
				var no = this.noti;
				var i = idx + 1;
				var st = this.st;
				var unit = this.unit;
				
				st.opacity = (((10 - i) * 0.1)+'');
				
				if (no.isGoneMove)
				{
					st[this.mp] = ((this.oh * -i * 0.1).floor() - no.gap) + 'px';
				}
				
				if (idx == 9)
				{
					this.unit.del(); // 유닛소멸 
					if (no.panel.ch().length == 0) // 더이상 유닛이 없을경우 동작
					{
						no.isWorkGone = false;
						no.panel.hide();
					}
					else
					{
						window.setTimeout(no.gone.bind(no), no.showTime);
					}
				}
				
			}).bind({noti : this, unit : unit, st : st, oh : oh, mp : mp}), this.initTime / 10, 10, true);
		}
		else
		{
			this.isWorkGone = false;
			this.panel.hide();
		}
	}
});