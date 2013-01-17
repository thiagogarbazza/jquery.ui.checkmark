###
Plugin responsável por criar um estilo mais elegante para os input's do tipo radio e checkbox.

@author Thiago Garbazza
@copyright Thiago Garbazza
@license Dual licensed under the MIT or GPL Version 2 licenses.
@version 0.7
@see https://github.com/thiagogarbazza/jquery.ui.checkmark/wiki
###
(($, window, document, undefined_) ->
  
  #                     Attributes
  #  * -------------------------------------------------------------------------
  #  
  
  #                     Constructors
  #  * -------------------------------------------------------------------------
  #  
  Plugin = (element, options) ->
    @element = element
    @options = $.extend({}, defaults, options)
    @_defaults = defaults
    @_name = pluginName
    @init()
  pluginName = "checkmark"
  lenth = 0
  inputStyleClass = "ui-checkmark-input"
  labelStyleClass = "ui-checkmark-label"
  styleClass = "ui-checkmark"
  defaults = styleClass: ""
  Plugin:: = init: ->
    input = $(@element)
    type = input.attr("type")
    if type is "radio" or type is "checkbox"
      id = input.attr("id")
      if id is `undefined` or id is ""
        id = ++lenth
        input.attr "id", "ui-checkmark-" + id
      checkmarkId = "ui-checkmark-" + id
      input.addClass inputStyleClass
      input.wrap "<a id=\"" + checkmarkId + "\" class=\"ui-widget " + styleClass + " ui-" + type + " " + @options.styleClass + "\" href=\"javascript:;\" />"
      checkmark = $("a[id=\"" + checkmarkId + "\"]")
      checkmark.data "id", input.attr("id")
      checkmark.data "type", type
      checkmark.data "name", input.attr("name")
      checkmark.data "checked", input.attr("checked")
      checkmark.data "disabled", input.attr("disabled")
      checkmark.data "readonly", input.attr("readonly")
      checkmark.attr "inputname", checkmark.data("name")
      Plugin.mark checkmark
      Plugin.label checkmark
      if Plugin.isActive(checkmark) is true
        Plugin.deactivate checkmark
      else
        checkmark.keyup (event) ->
          Plugin.click $(this)  if event.keyCode is 32

        checkmark.click ->
          Plugin.click $(this)

    else
      console.error "Somente podem ser selecionados elemendos do tipo input radio e input checkbox"

  $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_" + pluginName, new Plugin(this, options)  unless $.data(this, "plugin_" + pluginName)


  
  #                     Other Methods
  #  * -------------------------------------------------------------------------
  #  
  
  ###
  Método responsável por controlar o input que está marcado ou não marcado.
  
  @author Thiago Garbazza
  @since 0.4
  
  @param jQuery checkmark object do checkmark.
  
  @return void.
  ###
  Plugin.mark = (checkmark) ->
    styleClass = "ui-checkmark-checked"
    if Plugin.isChecked(checkmark) is true
      checkmark.addClass styleClass
    else
      checkmark.removeClass styleClass

  
  ###
  Método responsável por controlar o click no checkmark.
  
  @author Thiago Garbazza
  @since 0.3
  
  @param jQuery checkmark object do checkmark.
  
  @return void.
  ###
  Plugin.click = (checkmark) ->
    if checkmark.data("type") is "radio"
      Plugin.clickRadio checkmark
    else Plugin.clickCheckbox checkmark  if checkmark.data("type") is "checkbox"

  
  ###
  Método responsável por controlar o click no checkmark de checkbox.
  
  @author Thiago Garbazza
  @since 0.3
  
  @param jQuery checkmark object do checkmark.
  
  @return void.
  ###
  Plugin.clickCheckbox = (checkmark) ->
    checked = Plugin.isChecked(checkmark)
    Plugin.setChecked checkmark, not checked
    Plugin.mark checkmark

  
  ###
  Método responsável por controlar o click no checkmark de radio button.
  
  @author Thiago Garbazza
  @since 0.3
  
  @param jQuery checkmark object do checkmark.
  
  @return void.
  ###
  Plugin.clickRadio = (checkmark) ->
    if Plugin.isChecked(checkmark) is false
      $("." + styleClass + "[inputname=\"" + checkmark.data("name") + "\"]").each ->
        radio = $(this)
        Plugin.setChecked radio, false
        Plugin.mark radio

      Plugin.setChecked checkmark, true
      Plugin.mark checkmark

  
  ###
  Método responsável por controlar o input que está desabilidado ou é somente leitura.
  
  @author Thiago Garbazza
  @since 0.4
  
  @param jQuery checkmark object do checkmark.
  
  @return void.
  ###
  Plugin.deactivate = (checkmark) ->
    styleClass = "ui-checkmark-disabled"
    if Plugin.isActive(checkmark)
      checkmark.addClass styleClass
    else
      checkmark.removeClass styleClass

  
  ###
  Método responsável por informar se o input está marcado ou não marcado.
  
  @author Thiago Garbazza
  @since 0.4
  
  @param jQuery checkmark object do checkmark.
  @param Boolean checked informar se o input sera marcado ou não marcado.
  
  @return void.
  ###
  Plugin.setChecked = (checkmark, checked) ->
    checkmark.data "checked", checked
    checkmark.children().get(0).checked = checked

  
  ###
  Método responsável por informar se o input está ativo.
  
  @author Thiago Garbazza
  @since 0.4
  
  @param jQuery checkmark  object do checkmark.
  
  @return <b>TRUE</b> o input está ativo,<br> <b>FALSE</b> o input não está ativo.
  ###
  Plugin.isActive = (checkmark) ->
    disabled = checkmark.data("disabled")
    active = (disabled isnt `undefined` and disabled isnt null and (disabled is true or disabled is "disabled"))
    if active is false # caso não esteja disabled mais esteja como readonly.
      readonly = checkmark.data("readonly")
      active = (readonly isnt `undefined` and readonly isnt null and (readonly is true or readonly is "readonly"))
    active

  
  ###
  Método responsável por informar se o input está marcado.
  
  @author Thiago Garbazza
  @since 0.1
  
  @param jQuery checkmark  object do checkmark.
  
  @return <b>TRUE</b> o input está marcado,<br> <b>FALSE</b> o input não está marcado.
  ###
  Plugin.isChecked = (checkmark) ->
    checked = checkmark.data("checked")
    checked isnt `undefined` and checked? and (checked is true or checked is "checked")

  
  ###
  Método responsável por adicionar evento no label relacionado.
  
  @author Thiago Garbazza
  @since 0.6
  
  @param jQuery checkmark  object do checkmark.
  
  @return void.
  ###
  Plugin.label = (checkmark) ->
    label = $("label[for=\"" + checkmark.data("id") + "\"]")
    if Plugin.isActive(checkmark) is false
      label.click ->
        Plugin.click checkmark

    label.addClass labelStyleClass
    label.attr "oldfor", checkmark.data("id")
    label.removeAttr "for"
) jQuery, window, document