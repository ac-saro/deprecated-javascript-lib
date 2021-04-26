//// - void $.ui.each()
//// - void $.ui.each($.dom dom)
//// 주의 : each의 범위를 지정할때 해당 each의 부모로부터 지정해야 정확히 작동한다.
//RAON.ui.each = RAON.ext(function(dom)
//{
//	// 선언
//	var each = RAON.ui.each;
//	
//	// 명령준비
//	if (arguments.length == 0) // 전체 초기화
//	{
//		// 최초 모든 each를 감춤
//		(dom = RAON.dom([document])).findsAttr(each._DAT).hide();
//		
//		// 인스턴스 클리어
//		dom.findsAttr(each._DAT_INST).del();
//		
//		// 선택
//		each.scan(dom.findsAttr(each._DAT), each);
//	}
//	// each 원형을 직접 선택시
//	else if (dom.attr(each._DAT) != null)
//	{
//		// 인스턴스 클리어
//		var prev = dom.prev();
//		while (prev.length > 0 && prev.attr(each._DAT_INST) != null)
//		{
//			var tmp = prev;
//			prev = prev.prev();
//			tmp.del();
//		}
//		
//		// 선택
//		each.scan(dom, each);
//	}
////	// each 인스턴트를 직접 선택시
////	else if (dom.attr(each._DAT_INST) != null)
////	{
////		// 인스턴스 클리어
////		dom.findsAttr(each._DAT_INST).del();
////		
////		
////	}
//	// 일반적인 영역선택시
//	else
//	{
//		// 인스턴스 클리어
//		dom.findsAttr(each._DAT_INST).del();
//		
//		// 선택
//		each.scan(dom.findsAttr(each._DAT), each);
//	}
//},
//{
//	_DAT : 'raon-each',
//	_DAT_INST : 'raon-each-inst',
//	_DAT_ID : 'raon-each-id',
//	
//	// 스켄 : 그릴 대상을 찾는다.
//	scan : function(el, each)
//	{
//		for (var i = 0 ; i < el.length ; i++)
//		{
//			var e = el.get(i);
//			if (e.up('[' + each._DAT + ']').length == 0)
//			{
//				each.draw(e, each);
//			}
//		}
//	},
//	
//	// 경로리스트를 만든다.
//	path : function(el, each, baseAttrArr)
//	{
//		// ids, paths 세팅
//		var ids = [baseAttrArr[0]];
//		var paths = [baseAttrArr[1]];
//		// up element list :
//		var upel = el.up(['[' + each._DAT_ID + ']']);
//		for (var i = 0 ; i < upel.length ; i++)
//		{
//			var upe = upel.get(i);
//			ids.push(upe.attr(each._DAT_ID));
//			paths.push(upe.attr(each._DAT_INST));
//		}
//		// 치환
//		for (var i = (ids.length - 1) ; i >= 1 ; i--)
//		{
//			var pid = ids[i];
//			var path = paths[i - 1];
//			
//			if (path.iof(pid + '[') == 0 || path.iof(pid + '.') == 0)
//			{
//				paths[i - 1] = path.re(pid, paths[i]);
//			}
//		}
//		
//		return [ids, paths];
//	},
//	
//	bind : function(cmd, paths, idx)
//	{
//		var names = paths[0];
//		var binds = paths[1];
//		var val = cmd;
//		
//		for (var i = 0 ; i < names.length ; i++)
//		{
//			var name = names[i];
//			var bind = binds[i];
//			if (i == 0) { bind += '[' + idx + ']'; }
//			
//			val = val.re(new RegExp('\\W'+name+'\\W', 'g'), (function(e)
//			{
//				return e.re(this.name, this.bind);
//			}).bind({name : name, bind : bind}));
//		}
//		
//		try
//		{
//			if (RAON.type((val = val.eval()), 'function'))
//			{
//				val = val();
//			}
//			if (val != undefined)
//			{
//				return RAON.type(val, '$.dom') ? val.toStr() : (val + '').enHtml().ln('<br/>');
//			}
//		}
//		catch (e) { RAON.err(e, '$.ui.each : ' + cmd.trim()); }
//		
//		return null;
//	},
//	
//	// 그리기
//	draw : function(el, each)
//	{
//		// 속성
//		var attr = el.attr(each._DAT);
//		// 속성 : 분해
//		var attrArr = attr.toArrTrim(':');
//		// 이름
//		var name = attrArr[0];
//		// 경로
//		var paths = each.path(el, each, attrArr);
//		//console.log(paths);
//		var pathc = paths[1][0];
//		var xpath;
//		// 존재하지 않는 경로내에서 다시 경로를 참조할 경우.
//		try
//		{
//			xpath = pathc.eval();
//		}
//		catch (ex)
//		{
//			RAON.err(ex, pathc);
//			return;
//		}
//		
//		// 존재하지 않음. [페이지가 로딩되면서 켜지나.. 아직 변수를 안쓴경우를 대비하여.]
//		if (xpath == undefined) { return; }
//		// 무한반복 예외처리 : 오류 from이 배열형태가 아님.
//		if (!RAON.type(xpath.length, 'number')) { return; }
//		var mold = el.copy().attr('id', null).attr(each._DAT, null).attr(each._DAT_ID, name).show();
//		
//		for (var i = 0 ; i < xpath.length ; i++)
//		{
//			// 현재
//			var pathIdx = pathc +'[' + i + ']';
//			var se = mold.attr(each._DAT_INST, pathIdx).toStr(); // seed element
//			
//			var e = se.re(/\{\{[^\}]+\}\}/gi, (function(cmdc)
//			{
//				// 정규식을 편하기 쓰기위해 일부로 양옆에 공백을 두었다.
//				var word = each.bind(' '+cmdc.gap('{{', '}}').reAll('$index', this.idx+'').deHtml()+' ', this.paths, this.idx);
//				return word != null ? word : cmdc;
//			}).bind({idx : i, paths : paths})).html();
//			
//			el.prevIns(e);
//			
//			// next elements
//			each.scan(e.findsAttr(each._DAT), each);
//		}
//	}
//});