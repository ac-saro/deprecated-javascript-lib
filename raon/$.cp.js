// test
//var _time = 0;
//var $time = function(a)
//{
//	if (a === 0) { _time = $.time(); return; }
//	var t = _time;
//	_time = $.time();
//	console.log(a + ' : ' + (_time - t));
//};

//- void $.cp()
//- void $.cp(String id, Boolean? threadExecute)
//- void $.cp($.dom area, Boolean? threadExecute)
RAON.cp = RAON.ext(function(obj, tex)
{
	// 모든 id를 찾아 초기화 합니다.
	if (arguments.length == 0) { obj = RAON.finds('[raon-part-id]'); }
	// 단독실행 [쓰래드를 사용하지 않음]
	else if (RAON.type(obj, 'string'))
	{
		var part = RAON.cp._partList[obj], dom = document.querySelector('[raon-part-id="'+obj+'"]');
		if (part && dom) { dom.innerHTML= RAON.cp.load._make_html(part.body, false); return; }
		throw "not found raon-part-id : " + obj;
	}
	// 다중실행
	else if (RAON.type(obj, '$.dom')) { if (!obj.filter('[raon-part-id]').is()) { obj = obj.finds('[raon-part-id]'); } }
	else { throw "$.cp(invalid parameter)" + obj; }
	
	// 쓰래드 사용
	if (tex === true)
	{
		for (var i = 0 ; i < obj.length ; i++)
		{
			window.setTimeout((function()
			{
				var id = this.e.attr('raon-part-id');
				var ide = RAON.cp._partList[id];
				if (!ide)
				{
					RAON.cp.load._make_html(e[0].outerHTML, true);
					ide = RAON.cp._partList[id];
				}
				
				this.e[0].innerHTML = RAON.cp.load._make_html(ide.body, false);
			}).bind({ e : obj.get(i) }), 0);
		}
	}
	// 쓰래드 사용안함
	else
	{
		for (var i = 0 ; i < obj.length ; i++)
		{
			var e = obj.get(i);
			
			var id = e.attr('raon-part-id');
			var ide = RAON.cp._partList[id];
			if (!ide)
			{
				RAON.cp.load._make_html(e[0].outerHTML, true);
				ide = RAON.cp._partList[id];
			}
			e[0].innerHTML = RAON.cp.load._make_html(ide.body, false);
		}
	}
},
{
	// 파트를 쌓아두는 리스트 [raon-part-id]
	_partList : {},
	// conf 에 통합해야함. : 다중공백을 단일공백으로 제거함.
	_spacePack : true,
	
	//- $.cp.html $.cp(String html)
	// html을 인코딩하지 않고 넣음. 인코딩하지 않은 경우 안전성이 취약해짐.
	html : function(txt)
	{
		var rv = [txt];
		rv._RAON_TYPEOF = '$.cp.html';
		return rv;
	},
	
	// - String $.cp.load(Number cacheVer, String addr, Function callbackfunc)
	// - String $.cp.load(String cacheVer, String addr, Function callbackfunc)
	load : (function(cver, addr, func)
	{
		// null 처리
		if (addr == null) { func(null); return; }
		// 캐시를위한 속성이름
		var cid = 'RAON_CP_INLOAD__'+addr;
		// 캐시얻어오기
		var html = cver != null ? RAON.data.get(cid, cver) : null;
		// 캐싱찾음
		if (html != null)
		{
			func(RAON.cp.load._make_html(html, true));
			return;
		}
		// 보내기
		(RAON.cp.load._inload.bind({ info : 
		{
			text : '<raon-include page="'+addr.enHtml()+'"/>',
			cver : cver,
			cid : cid,
			func : func
		} }))();
	}).ext(
	{
		// isPage ? 페이지 : 파트
		_make_html : function(text, isPage)
		{
			//$time(0); // 시간기록 ================
			text =text.re(/<[\s]*(\/?)[\s]*(raon-[a-z]+)[\s]*([a-z]+[\s]*\=[\s]*\"[\s]*([^\"]+)[\s]*\")?[\s]*>/g, function(n1, tagClose, tagName, n2, tagAttr)
			{
				if (tagClose === '/')
				{
					return '</'+tagName+'>';
				}
				else
				{
					switch (tagName.sub(5))
					{
						case 'part' : break; // 임시 패스
						case 'each' : 
							if ((!n2) && !(n2.sw('data=') || n2.test(/data[\s]*\=/))) { throw '<'+tagName+'> only use attr data'; }
						break;
						case 'then' : case 'if' :
							if ((!n2) && !(n2.sw('test=') || n2.test(/test[\s]*\=/))) { throw '<'+tagName+'> only use attr test'; }
							return '<'+tagName+(tagAttr ? 'RAONIFBEG{{' + tagAttr + '}}RAONIFEOF' : '') + '>';
						break;
						case 'case' : case 'else' :
							if (n2) { throw '<'+tagName+'> use not attr'; }
						break;
						default : throw 'tag <'+tagName+'> is not raon tag';
					}
					return '<'+tagName+(tagAttr ? '{{' + tagAttr + '}}' : '') + '>';
				}
			});
			//$time('교체'); // 시간기록 ================
			//$time(0); // 시간기록 ================
			// 각 페이지를 기억한다.
			if (isPage)
			{
				var spos, epos, lpos = 0;
				
				while ((spos = text.iof('raon-part-id="', lpos)) != -1)
				{
					//var autoStart = false;
					var autoStart = text.sub(text.lof('<', spos), text.iof('>', spos)).iof('raon-part-auto-start') != -1;
					// 아이디 검출 : 14는 raon-part-id=" 의 길이
					spos += 14;
					var id = text.sub(spos, text.iof('"', spos));
					
					// 여기서 나오는 11 / 12 의 상수는 <raon-part></raon-part> 의 길이를 나타냄.
					// 반복 시작구간을 찾는다.
					var partSrtPos = text.iof('<raon-part>', spos);
					var partSrtPosT = partSrtPos + 11;
					// 반복 종료구간을 찾는다. 11 은 <raon-part> 의 길이
					var partEndPos = (partSrtPos != -1) ? text.iof('</raon-part>', partSrtPosT) : -1;
					var partEndPosT = partEndPos + 12;
					if (partEndPos == -1)
					{
						throw "not found tag <raon-part>~</raon-part> in raon-part-id : " + id;
					}
					// 재결합
					var body = text.sub(partSrtPosT, partEndPos);
					// 등록
					RAON.cp._partList[id] = { body : body.trim() };
					
					// 자동시작여부
					if (autoStart)
					{
						text = text.sub(0, partSrtPos) + (body = text.sub(partSrtPosT, partEndPos)) + text.sub(partEndPosT);
						// 다음 포인터 : 11은 삭제된 부분만큼
						lpos = partEndPos - 11;
					}
					else
					{
						text = text.sub(0, partSrtPos) + text.sub(partEndPosT);
						// 자동시작하지 않음. 
						lpos = partEndPos - (partEndPosT - partSrtPos);
					}
				}
			}
			//$time('raon-part-id'); // 시간기록 ================
			
			// 반복구간을 확장한다.
			text = (RAON.cp.load._make_html_each.bind({ data : null }))(text);
			// 뷰결합
			return RAON.cp.load._make_html_bind(text);
		},
		
		// 라온처음과 끝을 찾는다.
		// 이미 첫머리를 찾았다는 상태로 찾기 시작한다.
		_make_html_tag_find : function(text, tagName, openPos, isCmd)
		{
			var
				isTagLevel = false,
				tagLevel = 1,
				openTagName = '<'+tagName,
				closeTagName = '</'+tagName+'>',
				lastPos = openPos + openTagName.length,
				inOpenPos,
				inClosePos,
				cmd,
				openPosT,
				closePos,
				closePosT;
			
			//  cmd 를 찾는다.
			if (isCmd)
			{
				openPosT = text.iof('}}>', lastPos);
				cmd = text.sub(lastPos+2, openPosT);
				lastPos = (openPosT += 3); // 3 : }}>
			}
			else
			{
				lastPos = openPosT = text.iof('>', openPos) + 1; // 1 : >
				cmd = null;
			}
			
			while (true)
			{
				inOpenPos = text.iof(openTagName, lastPos);
				inClosePos = text.iof(closeTagName, lastPos);
				
				// null 을 리턴함으로써 계산 오류를 내서 catch를 호출한다.
				if (inClosePos == -1) { return null; }
				// 여는 태그
				if (inOpenPos != -1 && inOpenPos < inClosePos)
				{
					tagLevel++;
					isTagLevel = true;
					lastPos = inOpenPos + 1;
					continue;
				}
				// 닫는 태그
				else
				{
					if (tagLevel-- < 2)
					{
						closePosT = (closePos = inClosePos) + closeTagName.length;
						break;
					}
					lastPos = inClosePos + 1;
				}
			}
			
			return [cmd, isTagLevel, openPosT, closePos, closePosT];
		},
		
		// 모든 each를 펼친다.
		_make_html_each : function(text)
		{
			//$time(0); // 시간기록 ================
			
			try
			{
				var openPos, openPosT, closePos, closePosT, cmd, cmdName, cmdList, cmdListLen, info, lastPos = 0;
				while ((openPos = lastPos = text.iof('<raon-each{{', lastPos)) != -1)
				{
					info = RAON.cp.load._make_html_tag_find(text, 'raon-each', openPos, true);
					
					// - cmd
					cmd = info[0].toArr(':');
					cmdName = cmd[0].trim();
					cmdListLen = eval( cmdList = cmd[1].trim() ).length;
					
					// - pos
					openPosT = info[2];
					closePos = info[3];
					closePosT = info[4];
					
					// 빈 리스트의 경우 - 패스
					if (cmdListLen == 0)
					{
						text = text.sub(0, openPos) + text.sub(closePosT);
						continue;
					}
					
					var html = '';
					
					// 빠른치환을위해 미리 이름을 바꾼다.
					var reName = '%RAONTMP%'+cmdName+'%';
					var body = text.sub(openPosT, closePos).re(/\{\{[\s]*[^\}]+[\s]*\}\}/g, (function(inCmd)
					{
						var name = this.name;
						var inCmdArr = inCmd.toArr(name);
						if (inCmdArr.length == 1) { return inCmd; }
						for (var i = 1 ; i < inCmdArr.length ; i++)
						{
							var pi = i -1;
							var ps = inCmdArr[pi];
							
							if (this.ckNotVar.test(ps.slice(-1) + inCmdArr[i].slice(0, 1)) && (!this.ckPoint.test(ps)))
							{
								inCmdArr[pi] += this.reName;
							}
							else
							{
								
								inCmdArr[pi] += name;
							}
						}
						return inCmdArr.toStr('');
					}).bind({ name : cmdName, reName : reName, ckNotVar : (/^[^/$^a-z^\d]+$/i), ckPoint : (/\.[\s]*$/) }));
					
					
					var $first = 'true';
					var $last = 'false';
					var cmdListLast = cmdListLen - 1;
					
					for (var i = 0 ; i < cmdListLen ; i++)
					{
						if (i == cmdListLast) { $last = "true"; }
						
						var vNmae = cmdList+'['+i+']';
						html += body
							.reAll(reName+'.#index', i+'')
							.reAll(reName+'.#first', $first)
							.reAll(reName+'.#last', $last)
							.reAll(reName, vNmae);
						
						if (i == 0) { $first = "false"; }
					}
					
					// 적용
					text = text.sub(0, openPos) + html + text.sub(closePosT);
					
					// 다음커서로 이동 info[1] 는 내부에 또다른 each가 있는지 여부.
					lastPos = info[1] ? openPos : (openPos + html.length);
					
				}
			}
			catch (ex) { RAON.err(ex, '<raon-each> tag error', true); }
			
			//$time('raon-each'); // 시간기록 ================
			return text;
		},
		
		// 연산
		_make_html_bind : function(text)
		{
			//$time(0); // 시간기록 ================
			// - if/case-then bulk
			var 
				bulkArr = [],
				textSplit = text.toArr(/RAONIFBEG\{\{|\}\}RAONIFEOF/),
				bulkRes;
			// 추출
			textSplit.some((function(t, i) { if (i & 1 == 1) { this.bulkArr.push(t); } }).bind({ bulkArr : bulkArr }));
			// 벌크연산
			try { bulkRes = eval('[' + bulkArr.join() + ']'); }
			catch (ex) { console.log('[' + bulkArr.join() + ']'); RAON.err(ex, 'test error in <raon-if> OR <raon-then>', true); }
			// 입력
			textSplit.some((function(t, i, arr)
			{
				if (i & 1 == 1) { arr[i] = this.bulkRes.shift() ? '{{1}}' : '{{0}}'; }
			}).bind({ bulkRes : bulkRes }));
			text = textSplit.join('');
			//$time('raon-if/case-then'); // 시간기록 ================
			
			//$time(0); // 시간기록 ================
			// if
			try
			{
				var openPos, openPosT, closePos, closePosT, cmd, info, lastPos = 0;
				while ((openPos = lastPos = text.iof('<raon-if{{', lastPos)) != -1)
				{
					info = RAON.cp.load._make_html_tag_find(text, 'raon-if', openPos, true);
					
					// - 조건 확인
					if (info[0] === '1')
					{
						// - pos
						openPosT = info[2];
						closePos = info[3];
						closePosT = info[4];
						text = text.sub(0, openPos) + text.sub(openPosT, closePos) + text.sub(closePosT);
						
						// 다음커서로 이동 info[1] 는 내부에 또다른 if가 있는지 여부.
						if (!info[1])
						{
							lastPos += (closePos - openPosT);
						}
					}
					else
					{
						text = text.sub(0, openPos) + text.sub(info[4]);
					}
				}
			}
			catch (ex) { RAON.err(ex, '<raon-if> tag error', true); }
			
			//$time('raon-if'); // 시간기록 ================
			//$time(0); // 시간기록 ================
			// case
			try
			{
				var openPos, openPosT, closePos, closePosT, cmd, info, lastPos = 0;
				while ((openPos = lastPos = text.iof('<raon-case', lastPos)) != -1)
				{
					info = RAON.cp.load._make_html_tag_find(text, 'raon-case', openPos, false);
					openPosT = info[2];
					closePos = info[3];
					closePosT = info[4];
					
					var subText = text.sub(openPosT, closePos);
					var subLastPos = 0;
					var rv = '';
					// then을 찾아보자
					while ((subLastPos = subText.iof('<raon-then{{', subLastPos)) != -1)
					{
						var subInfo = RAON.cp.load._make_html_tag_find(subText, 'raon-then', subLastPos, true);
						if (subInfo[0] === '1')
						{
							rv = subText.sub(subInfo[2], subInfo[3]);
							break;
						}
						else
						{
							subText = subText.sub(0, subLastPos) + subText.sub(subInfo[4]);
						}
					}
					// 일치하는 then이 없음 : else
					if (rv == '' && (subLastPos = subText.iof('<raon-else')) != -1)
					{
						var subInfo = RAON.cp.load._make_html_tag_find(subText, 'raon-else', subLastPos, false);
						rv = subText.sub(subInfo[2], subInfo[3]);
					}
					
					text = text.sub(0, openPos) + rv + text.sub(closePosT);
					// 다음커서로 이동 info[1] 는 내부에 또다른 if가 있는지 여부.
					if (!info[1])
					{
						lastPos += rv.length;
					}
				}
			}
			catch (ex) { RAON.err(ex, '<raon-case> tag error', true); }
			
			
			
			//$time('raon-case'); // 시간기록 ================
			//$time(0); // 시간기록 ================
			
			// - eval
			textSplit = text.toArr(/\{\{|\}\}/g);
			bulkArr = [];
			textSplit.some((function(t, i)
			{
				if (i & 1 == 1)
				{
					this.bulkArr.push(t);
				}
			}).bind({ bulkArr : bulkArr }));
			try
			{
				bulkArr = eval('[' + bulkArr.join() + ']');
			}
			catch (e) { console.log(bulkArr); RAON.err(e, 'invalid {{ }} in value '); }
			
			textSplit.some((function(t, i, arr)
			{
				if (i & 1 == 1)
				{
					try
					{
						var v = this.bulkArr.shift();
						switch (RAON.type(v))
						{
							case '$.cp.html' : arr[i]= v[0]; return;
							case 'string' : break;
							default :
								v = v + '';
						}
						arr[i] = v.enHtml();
						return;
					} catch (e) { RAON.err(e, 'invalid ' + x); }
				}
			}).bind({ bulkArr : bulkArr }));
			text = textSplit.join('');
			//$time('raon-eval'); // 시간기록 ================
			return text;
		},
		
		
		// in loader
		_inload : function()
		{
			var spos, epos, text = this.info.text;
			
			// 일치하는 결과를 찾아 종료.
			if ((spos = text.iof('<raon-include')) == -1)
			{
				// 공간절약 / 연산 10~15% 항샹
				if (RAON.cp._spacePack) { text = text.re(/[\t\r ]+/, ' '); }
				// 주석삭제
				var rc = text.split(/<\!\-\-|\-\->/);
				if (rc.length > 1 && rc.length & 1 == 1)
				{
					text = rc[0];
					for (var i = 2 ; i < rc.length ; i+= 2)
					{
						text += rc[i];
					}
				}
				// 저장
				RAON.data.set(this.info.cid, text, this.info.cver);
				// 로드
				this.info.func(RAON.cp.load._make_html(text, true));
				return;
			}
			
			// 끝지점
			epos = text.iof('/>', spos + 14) + 2;
			var url = text.sub(text.iof('page="', spos + 14) + 6, text.lof('"', epos - 2)).deHtml();
			
			RAON.ajax(url).text((function(html)
			{
				if (html == null) { this.info.func(null); throw "not found url " + this.url; return; }
				var text = this.info.text;
				this.info.text = text.sub(0, this.spos) + html + text.sub(this.epos);
				(RAON.cp.load._inload.bind({ info : this.info }))();
			}).bind({ info : this.info, spos : spos, epos : epos, url : url }));
		}
	})
});
