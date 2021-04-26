FileList.prototype._RAON_TYPEOF = 'filelist';

RAON.ext(File.prototype,
{
	_RAON_TYPEOF : 'file',
	
	// - Boolean File.ckByte(Number max)
	ckByte : function(max)
	{
		return this.size <= max;
	},
	
	// - Boolean File.ckKB(Number max)
	ckKB : function(max)
	{
		return this.size <= (max * 1024);
	},
	
	// - Boolean File.ckMB(Number max)
	ckMB : function(max)
	{
		return this.size <= (max * 1024 * 1024);
	},
	
	// - Boolean File.ckMB(Number max)
	ckGB : function(max)
	{
		return this.size <= (max * 1024 * 1024 * 1024);
	},
	
	// - Boolean File.ckExt(String ext)
	// - Boolean File.ckExt(String[] ext)
	ckExt : function(ext)
	{
		return this.name.lnext('.').lo().has(ext);
	},
	
	// - String File.getExt()
	getExt : function()
	{
		return this.name.lnext('.').lo();
	}
});
