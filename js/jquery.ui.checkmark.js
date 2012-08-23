/**
 * Plugin responsável por criar um estilo mais elegante para os input's do tipo radio e checkbox. 
 * 
 * @author Thiago Garbazza
 * @copyright Thiago Garbazza
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 * @version 0.6
 * @see https://github.com/thiagogarbazza/jquery.ui.checkmark/wiki
 */
;(function($, window, undefined){
    
	/*											Attributes
	 * -------------------------------------------------------------------------
	 */
	
    var pluginName = 'checkmark',
        document = window.document,
        lenth = 0,
    	inputStyleClass = 'ui-checkmark-input',
    	labelStyleClass = 'ui-checkmark-label',
    	styleClass = 'ui-checkmark',
        defaults = {
    		styleClass: ''
			//disabled: false;
    	};
    
     
	/*											Constructors
	 * -------------------------------------------------------------------------
	 */
    
    function Plugin(element, options){
    	this.element = element;
        
        this.options = $.extend({}, defaults, options) ;
 
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    };

    $.fn[pluginName] = function(options){
        return this.each(function(){
            if (!$.data(this, 'plugin_' + pluginName)){
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
    
	/*											Methods
	 * -------------------------------------------------------------------------
	 */
    
    Plugin.prototype.init = function(){
    	var input = $(this.element);
    	var type = input.attr('type');
    	if(type == 'radio' || type == 'checkbox'){
	    	var id =  input.attr('id');
	    	if(id == undefined || id == ''){
	    		id = ++lenth;
	    		input.attr('id', 'ui-checkmark-'+id);
	    	}
	    	
	    	var checkmarkId = 'ui-checkmark-' + id;    	
	    	input.addClass(inputStyleClass);
	    	input.wrap('<a id="'+checkmarkId+'" class="ui-widget '+styleClass+' ui-'+type+' '+this.options.styleClass+'" href="javascript:;" />');
	    	
	    	var checkmark = $('a[id="'+checkmarkId+'"]');
	                
	    	checkmark.data('id', input.attr('id'));
	    	checkmark.data('type', type);
	    	checkmark.data('name', input.attr('name'));
	    	checkmark.data('checked', input.attr('checked'));
	    	checkmark.data('disabled', input.attr('disabled'));
	    	checkmark.data('readonly', input.attr('readonly'));
	    	checkmark.attr('inputname', checkmark.data('name'));
	
	        Plugin.mark(checkmark);
	        Plugin.label(checkmark);
	
			if(Plugin.isActive(checkmark))
			{
	    		checkmark.keyup(function(event){
	    			if(event.keyCode == 32){
	    				Plugin.click($(this));
	    			}
	    		});
	    		
	    		checkmark.click(function(){
	    			Plugin.click($(this));
		    	});
	    	}
			else
			{
				Plugin.deactivate(checkmark);	
			}
    	}else{
    		console.error("Somente podem ser selecionados elemendos do tipo input radio e input checkbox");
    	}
    };
    
    /**
	 * Método responsável por controlar o input que está marcado ou não marcado. 
	 * 
	 * @author Thiago Garbazza
	 * @since 0.4
	 * 
	 * @param jQuery checkmark object do checkmark.
	 * 
	 * @return void.
	 */
    Plugin.mark = function(checkmark){
    	var styleClass = 'ui-checkmark-checked';
    	if(Plugin.isChecked(checkmark) == true){
    		checkmark.addClass(styleClass);
		}else{
			checkmark.removeClass(styleClass);
		}	
    };
    
    /**
	 * Método responsável por controlar o click no checkmark. 
	 * 
	 * @author Thiago Garbazza
	 * @since 0.3
	 * 
	 * @param jQuery checkmark object do checkmark.
	 * 
	 * @return void.
	 */
    Plugin.click = function(checkmark){
    	if(checkmark.data('type') == 'radio'){
    		Plugin.clickRadio(checkmark);
    	}else if(checkmark.data('type') == 'checkbox'){
    		Plugin.clickCheckbox(checkmark);
    	}
    };
    
    /**
	 * Método responsável por controlar o click no checkmark de checkbox. 
	 * 
	 * @author Thiago Garbazza
	 * @since 0.3
	 * 
	 * @param jQuery checkmark object do checkmark.
	 * 
	 * @return void.
	 */
    Plugin.clickCheckbox = function(checkmark){
    	var checked = Plugin.isChecked(checkmark);
    	Plugin.setChecked(checkmark, !checked);
    	Plugin.mark(checkmark);
    };
    
    /**
	 * Método responsável por controlar o click no checkmark de radio button. 
	 * 
	 * @author Thiago Garbazza
	 * @since 0.3
	 * 
	 * @param jQuery checkmark object do checkmark.
	 * 
	 * @return void.
	 */
    Plugin.clickRadio = function(checkmark){
    	if(Plugin.isChecked(checkmark) == false){
	    	$('.'+styleClass+'[inputname="'+checkmark.data('name')+'"]' ).each(function(){
	    		var radio = $(this);
	    		Plugin.setChecked(radio, false);
	    		 Plugin.mark(radio);
	    	});
	    	Plugin.setChecked(checkmark, true);
	    	Plugin.mark(checkmark);
		}
    };
    
    /**
	 * Método responsável por controlar o input que está desabilidado ou é somente leitura. 
	 * 
	 * @author Thiago Garbazza
	 * @since 0.4
	 * 
	 * @param jQuery checkmark object do checkmark.
	 * 
	 * @return void.
	 */
    Plugin.deactivate = function(checkmark){
    	var styleClass = 'ui-checkmark-disabled';
    	if(Plugin.isActive(checkmark)){
    		checkmark.removeClass(styleClass);
    	}else{
    		checkmark.addClass(styleClass);
    	}	
    };
    
    /**
	 * Método responsável por informar se o input está marcado ou não marcado.
	 * 
	 * @author Thiago Garbazza
	 * @since 0.4
	 * 
	 * @param jQuery checkmark object do checkmark.
	 * @param Boolean checked informar se o input sera marcado ou não marcado.
	 * 
	 * @return void.
	 */
    Plugin.setChecked = function(checkmark, checked){
    	 checkmark.data('checked', checked);
    	 checkmark.children().get(0).checked = checked;
    };
    
	/**
	 * Método responsável por informar se o input está ativo.
	 * 
	 * @author Thiago Garbazza
	 * @since 0.4
	 * 
	 * @param jQuery checkmark  object do checkmark.
	 * 
	 * @return <b>TRUE</b> o input está ativo,<br> <b>FALSE</b> o input não está ativo.
	 */
    Plugin.isActive = function(checkmark){
    	var disabled = checkmark.data('disabled');
    	var deactive = (disabled != undefined && disabled !== null && (disabled == true || disabled == 'disabled'));
    	if(deactive == false){ // caso não esteja disabled mais esteja como readonly. 
    		var readonly = checkmark.data('readonly');
    		deactive = (readonly != undefined && readonly !== null && (readonly == true || readonly == 'readonly'));
    	}
    	
    	return !deactive;
    };
    
	/**
	 * Método responsável por informar se o input está marcado.
	 * 
	 * @author Thiago Garbazza
	 * @since 0.1
	 * 
	 * @param jQuery checkmark  object do checkmark.
	 * 
	 * @return <b>TRUE</b> o input está marcado,<br> <b>FALSE</b> o input não está marcado.
	 */
    Plugin.isChecked = function(checkmark){
    	var checked = checkmark.data('checked');
    	return (checked != undefined && checked != null && (checked == true || checked == 'checked'));
    };
    
	/**
	 * Método responsável por adicionar evento no label relacionado.
	 * 
	 * @author Thiago Garbazza
	 * @since 0.6
	 * 
	 * @param jQuery checkmark  object do checkmark.
	 * 
	 * @return void.
	 */
    Plugin.label = function(checkmark){
    	var label = $('label[for="' + checkmark.data('id')+'"]');
		if(Plugin.isActive(checkmark)){
			label.click(function(){
				Plugin.click(checkmark);
			});
		}
		label.addClass(labelStyleClass);
		label.attr('oldfor', checkmark.data('id'));
		label.removeAttr('for');
	};
}(jQuery, window));