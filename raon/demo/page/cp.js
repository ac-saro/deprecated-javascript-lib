// 이해를 돕기위해 공용 js(main.js) 가 아닌  cp.js 를 사용하였음.
// public js(main.js) is used instead of cp.js for will be helping you understand
var cp =
{
	data : [],
	dataType : 1,
	
	loadData : function(n)
	{
		this.dataType = n;
		$.ajax('./data/test-data'+n+'.txt').eval(function(data)
		{
			// set data
			cp.data = data;
			// apply
			$.cp($('#main-contents'));
		});
	},
	
	// main.js 에서 호출.
	// call by main.js
	load : function()
	{
		this.loadData(1);
	}
};