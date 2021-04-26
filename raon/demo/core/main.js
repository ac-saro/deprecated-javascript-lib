var pageMenu =
[
	{ name : 'home', view : 'RAON Demo', src : './page/home.html' },
	{ name : 'cp', view : 'Client Page', src : './page/cp.html' },
	{ name : 'ui-form', view : 'UI Form', src : './page/ui-form.html' },
	{ name : 'ui-noti', view : 'UI Notification', src : './page/ui-noti.html' },
	{ name : 'ui-tip', view : 'UI ToolTip', src : './page/ui-tip.html' }
];

var pageController =
{
	// $.time() 는 항상 페이지 리로드 -> 캐시 안함 
	// $.time() is always reload page -> not cache
	version : $.time(),
	
	// 메뉴를 통해 src 를 찾습니다.
	// get src by page
	getPageSrc : (function(page)
	{
		// pageMenu 를 이용해 빠르게 접근하는 메뉴를 만듭니다.
		// make speed menu for pageMenu
		if (this.getPageSrc.menu == null)
		{
			this.getPageSrc.menu = {};
			pageMenu.some((function(val)
			{
				this.menu[val.name] = val;
			}).bind({ menu : this.getPageSrc.menu }));
		}
		var menu = this.getPageSrc.menu;
		var menuObj;
		var menuSrc;
		
		// 페이지 찾기
		// find page
		if (page != null && page.test(/[a-z0-9\-]+/i) && (menuObj = menu[page]) && (menuSrc = menuObj.src))
		{
			return menuSrc;
		}
		
		// 찾을 수 없음
		// page not found
		return null;
		
	}).ext({ menu : null }),
	
	// - page loader
	pageLoad : function()
	{
		$.cp.load(this.version, './page-wrapper/base-mold.html', (function(html)
		{
			$('body').html(html);
			$.ui();
			
			// 해시변경 이벤트 추가
			// hash change event < page hash loader
			$.hash(this.hashLoad);
			
			// 첫 실행
			// first excute
			this.hashLoad();
			
			// 모바일 메뉴
			// mobile menu : document width under 600 px
			$(document).click((function(e)
			{
				var element = this.element;
				
				if (!element.hasClass('hide'))
				{
					element.addClass('hide');
				}
				else if (e.target().id() == 'header-mobile-menu-icon')
				{
					element.delClass('hide');
				}
				
			}).bind({ element :  $('#header-mobile-menu-float')}));
			
		}).bind({ hashLoad : this.hashLoad.bind(this) }));
	},
	
	// - hash change loader
	hashLoad : function()
	{
		// 페이지 해시 파라미터 가져옴.
		// get hash parameter by page
		var page = $.addr().hm('page');
		
		// 페이지 파라미터가 없는경우.
		// not exist page parameter
		if (page == null)
		{
			// 처음으로 이동
			// move to home
			$.addr().hm('page', 'home').load();
			return;
		}
		
		// 페이지를 가져온다.
		// $.cp.load 는 src 가 null이 들어갈경우 callback함수 인자를 null로 준다. 또한 200(정상)이 아닌경우(예:404)도 null이 반환된다.
		// get page
		// $.cp.load input src parameter null callback function parameter null, also response status code not 200 (ex:404) callback null
		$.cp.load(this.version, this.getPageSrc(page), (function(html)
		{
			var page = this.page;
			var menus = $.finds('#header > a').delClass('sel').filter('[page="'+page+'"]').addClass('sel');
			var mainContents = $('#main-contents');
			if (html != null)
			{
				mainContents.html(html);
				switch (page)
				{
					case 'cp' : (cp.load.bind(cp))(); break;
				}
				$.ui();
			}
			// 에러 : 안전성을 위해 클라이언트에서 html을 만들어준다.
			// error : client direct html for safely
			else
			{
				mainContents.html('<div id="page-error"><div>Page Not Found</div></div>');
			}
		}).bind({ page : page }));
	}
};

// - call page load
$.load(pageController.pageLoad.bind(pageController));