// - void $.ui()
RAON.ui = RAON.ext(function()
{
	var ui = RAON.ui;
	var list = ui._load_ui_event_list;
	for (var i = 0 ; i < list.length ; i++)
	{
		ui[list[i]]();
	}
},
{
	//_load_ui_event_list : ['bg', 'noti', 'each', 'msg', 'tip', 'form'],
	_load_ui_event_list : ['noti', 'msg', 'tip', 'form'] //,
	
// deprecated - 2.3.0
//	// this위치 이식 : each에서만 사용함.
//	_fn_text_this : function(inFuncCode)
//	{
//		return ('(function(){' + inFuncCode + '})').re(/\Wthis(?!\w)/g, function(r){ return r+'._RAON_THIS'; });
//	},
//	
//	// - void $.ui.bg()
//	bg : function()
//	{
//		var attr = 'raon-bg';
//		var el = RAON(['['+attr+']']);
//		
//		for (var i = 0 ; i < el.length ; i++)
//		{
//			var e = el.get(i);
//			var bg = e.attr(attr).words();
//			
//			if (bg.length == 1)
//			{
//				e.css('background', '#'+bg[0]);
//			}
//			else if (bg.length == 2)
//			{
//				e.css('background', 'linear-gradient(to bottom, #'+bg[0]+' 0%, #'+bg[1]+' 100%)');
//				// 익스 8, 9
//				if (!e.css('background').has('linear-gradient'))
//				{
//					var sb = bg[0].trim(), eb = bg[1].trim();
//					if (sb.length == 3) { sb = sb.re(/[0-9a-f]{1}/g, function(w){ return w+w; }); }
//					if (eb.length == 3) { eb = eb.re(/[0-9a-f]{1}/g, function(w){ return w+w; }); }
//					e.css('background','');
//					e.css('filter', "progid:DXImageTransform.Microsoft.gradient( startColorstr='#"+sb+"', endColorstr='#"+eb+"',GradientType=0 )");
//				}
//			}
//			e.attr(attr, null);
//		}
//	}
});

