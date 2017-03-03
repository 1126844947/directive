/**
 * Created by admin on 2017/2/20.
 */


angular.module('multipleSelection', []).directive("mySelect",function(){
    return {
        restrict:'AE',
        scope:{
            conf:'='
        },
        replace:true,
        template:'<div ng-class="class" >'


                    +'<div class="multiSelect_div" ng-click="inputFocus($event)">'
                        +'<span class="multiSelect_span" ng-repeat="x in conf.result track by $index">'
                            +'{{x}}<button style="margin-left: 10px" type="button" class="close multiSelect_close" aria-label="Close" ng-click="delete(x,$event)">'
                                    +'<span aria-hidden="true">&times;</span>'
                            +'</button>'
                        +'</span>'
                        +' <input ng-if="conf.input==undefined ||conf.input" class="multiSelect_input" type="text" ng-focus="inputFocus($event)" ng-model="input_value" ng-keypress="keyPress($event,input_value)">'
                    +'</div>'


                    +'<ul ng-if="show" class="dropdown-menu multiSelect_ul" aria-labelledby="dropdownMenu1">'
                        +'<li ng-click="addItem(x,$event)" ng-repeat="x in conf.list track by $index">' +
                            '<a ng-if="conf.showAttr!=undefined ">{{x[conf.showAttr]}}</a>' +
                            '<a ng-if="conf.showAttr==undefined ">{{x}}</a>' +
                        '</li>'
                    +'</ul>'
                +'</div>',
        link:function(scope,element,attrs){

            //设置样式
            scope.class = scope.conf.className ? scope.conf.className+" dropdown" : "dropdown multiSelect";


            //默认不显示list
            scope.show=false;

            //点击html让list隐藏
            angular.element(document.getElementsByTagName("html")[0]).on("click",function(){
                if(scope.show){
                    scope.show = !scope.show;
                    scope.$apply();//或者scope.$digest();用于给Angularjs检测到model的修改
                }
            });

            //像结果数组中添加内容
            scope.addItem=function(item,e){
                e.stopPropagation();
                if(scope.conf.showAttr==undefined){//判断item是对象还是字符串
                    scope.addTag(item);
                    scope.show = false;
                    return;
                }

                //去重
                var bool_item = false;

                for( var i=0;i<scope.conf.result.length;i++){
                    if(item.name == scope.conf.result[i]){
                        bool_item = true;
                        break;
                    }
                }
                if(!bool_item){
                    scope.conf.result.push(item.name);
                    scope.show = false;
                }

            };

            //input获取焦点事件
            scope.inputFocus = function(e){
                scope.show = true;

                //设置list的层级关系
                var ul = document.getElementsByClassName("multiSelect_ul");
                angular.element(ul[ul.length-1]).css("z-index",ul.length);

                e.stopPropagation();

            };

            //键盘按下事件
            scope.keyPress=function(e,tagName){

                var keycode = window.event?e.keyCode:e.which;
                if(keycode == 13 && tagName!="" && tagName!=undefined && tagName !=null)
                {//判断是否按下enter键

                    //清空input框中的内容
                    var input = document.getElementsByClassName("multiSelect_input");
                    angular.element(input[input.length-1]).val("");

                    scope.addTag(tagName);
                    scope.show = false;

                }
            };

            //向结果数组中添加字符串
            scope.addTag = function(tagName){
                var bool_tag = false;

                for(var i=0;i<scope.conf.result.length;i++){
                    if(tagName == scope.conf.result[i]){
                        bool_tag = true;
                        break;
                    }
                }
                if(!bool_tag){
                    scope.conf.result.push(tagName);
                    scope.input_value = "";
                }

            };

            //删除结果数组中的某个内容
            scope.delete = function(tagName,e){

                scope.conf.result.splice(scope.conf.result.indexOf(tagName),1);

                e.stopPropagation();


            }

        }
    }
});