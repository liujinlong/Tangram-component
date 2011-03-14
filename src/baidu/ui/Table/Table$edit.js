/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * @path:ui/Table/Table$edit.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-11-05
 */
///import baidu.ui.Table;
///import baidu.array.each;
///import baidu.ui.Input;
///import baidu.dom.hide;
///import baidu.dom.show;
///import baidu.ui.get;
///import baidu.dom.g;
///import baidu.event.getTarget;
///import baidu.dom.getAncestorByTag;
///import baidu.fn.bind;
///import baidu.lang.Class.addEventListeners;
/**
 * 使单元格支持编辑
 */
baidu.ui.Table.register(function(me){
    //me._editArray = [];    //存入用户设置的需要编辑的行对象
    //me._textField;        //编辑的通用input
    if(!me.columns){return;}
    me.addEventListeners('load, update', function(){
        var i = 0,
            rowCount = me.getRowCount(),
            editArray = me._editArray = [],
            field;
        baidu.array.each(me.columns, function(item){
            if(item.hasOwnProperty('enableEdit')){
                editArray.push(item);
            }
        });
        if(!me._textField){//初始化textField
            field = me._textField = new baidu.ui.Input({
                element: me.getMain(),
                autoRender: true
            });
            field.getBody().onblur = baidu.fn.bind('_cellBlur', me);
        }
        baidu.dom.hide(field.getBody());
        for(; i < rowCount; i++){
            me.attachEdit(me.getRow(i));
        }
    });
});
//
baidu.object.extend(baidu.ui.Table.prototype, {
    /**
     * 绑定一行中的某列拥有双击事件
     * @param {baidu.ui.table.Row} row 行对象
     * @memberOf {TypeName} 
     */
    attachEdit : function(row){
        var me = this;
        baidu.array.each(me._editArray, function(item){
            var cell = row.getBody().cells[item.index];
                cell.ondblclick = item.enableEdit ? baidu.fn.bind('_cellFocus', me, cell)
                    : null;
        });
    },
    
    /**
     * 当双击单元格时取得焦点实现编辑
     * @param {HTMLElement} cell 一个td对象
     * @param {Event} evt 浏览器的事件对象
     */
    _cellFocus : function(cell, evt){
        var me = this,
            input = me._textField.getBody(),
            cellWidth = cell.clientWidth;//当是自适应模式时，这里需要先把clientWidth保存
        if(baidu.event.getTarget(evt || window.event).id == input.id){return;}
        input.value = cell.innerHTML;
        cell.innerHTML = '';
        //input.style.width = '0px';//当是自适应模式是时，需要先设为0
        cell.appendChild(input);
        baidu.dom.show(input);
        input.style.width = cellWidth
            - input.offsetWidth
            + input.clientWidth + 'px';
        input.focus();
        input.select();
    },
    
    /**
     * 失去单元格焦点时当编辑数据写回单元格
     * @param {Object} evt
     */
    _cellBlur : function(evt){
        var me = this,
            target = baidu.event.getTarget(evt || window.event),
            cell = baidu.dom.getAncestorByTag(target, "td");
        baidu.dom.hide(target);
        me.getTarget().appendChild(target);
        cell.innerHTML = target.value;
    }
});