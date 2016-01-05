/**
 * @fileoverview 横向分页模板
 * @version 1.0 | 2015-11-18 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * */
define(function(){
  return [
      '<div class="horpage-wrapper">',
      '{{if cur == 1}}',
      '<a href="javascript:;" class="pn-icon disabled">&lt;</a>',
      '{{else}}',
      '<a href="javascript:;" class="pn-icon" node="pagenum" num="{{cur-1}}">&lt;</a>',
      '{{/if}}',
      '{{each nums as list i}}',
        '{{if list.index == cur}}', //说明是当前页
        '<a href="javascript:;" class="page cur">{{list.text}}</a>',
        '{{else if list.index == -1}}', //说明是省略号
        '<a href="javascript:;" class="ellipsis">{{list.text}}</a>',
        '{{else}}', //正常可点击
        '<a href="javascript:;" class="page" node="pagenum" num="{{list.index}}">{{list.text}}</a>',
        '{{/if}}',
      '{{/each}}',
      '{{if cur == max}}',
      '<a href="javascript:;" class="pn-icon disabled">&gt;</a>',
      '{{else}}',
      '<a href="javascript:;" class="pn-icon" node="pagenum" num="{{cur+1}}">&gt;</a>',
      '{{/if}}',
      '</div>'
  ].join('');
});
