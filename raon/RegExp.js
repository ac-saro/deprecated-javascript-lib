RAON.ext(RegExp.prototype,
{
	_RAON_TYPEOF : 'regexp',
	
	// - #Array RegExp.match(String text)
	match : function(text)
	{
		return text.match(this);
	}
});