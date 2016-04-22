"use strict";
/**
 * Created by Emanuil on 19/02/2016.
 */
angular.module('dhxDirectives', []);
//"use strict";
/**
 * Created by Emanuil on 09/02/2016.
 */
angular.module('dhxDirectives')
  .directive('dhxChart', function factory(DhxUtils) {
    return {
      restrict: 'E',
      require: 'dhxChart',
      controller: function () {
      },
      scope: {
        dhxData: '=',
        dhxChartWidth: '@',
        dhxChartHeight: '@',
        dhxView: '@',
        dhxValue: '@',    //area, bar, line, pie, radar
        dhxXValue: '@',   //scatter
        dhxYValue: '@',//, //scatter
        // Optionals //TODO: Might or might not implement later
        dhxLabel: '@',
        //dhxColor: '@',
        //dhxWidth: '=',
        dhxTooltip: '@',//,
        //dhxXAxis: '=',
        //dhxYAxis: '=',
        //dhxSeries: '=',
        //dhxLegend: '='
        dhxHandlers: '=',
        dhxPieInnerText: '@'
      },
      link: function (scope, element) {
        //$('<div></div>').appendTo(element[0]);
        var rootElem = element;//.children().first();
        rootElem.css('width', scope.dhxChartWidth);
        rootElem.css('height', scope.dhxChartHeight);
        rootElem.css('display', "inline-block");

        var descriptor = {
          view: scope.dhxView,
          container: rootElem[0]
        };

        if (scope.dhxView == 'scatter') {
          descriptor.xValue = scope.dhxXValue;
          descriptor.yValue = scope.dhxYValue;
        } else {
          descriptor.value = scope.dhxValue;
        }

        // Optionals

        scope.dhxLabel ? descriptor.label = scope.dhxLabel : '';
        //scope.dhxColor ? descriptor.color = scope.dhxColor : '';
        //scope.dhxWidth ? descriptor.width = scope.dhxWidth : '';
        scope.dhxTooltip ? descriptor.tooltip = scope.dhxTooltip : '';
        scope.dhxPieInnerText ? descriptor.pieInnerText = scope.dhxPieInnerText : '';
        //scope.dhxXAxis ? descriptor.xAxis = scope.dhxXAxis : '';
        //scope.dhxYAxis ? descriptor.yAxis = scope.dhxYAxis : '';
        //scope.dhxSeries ? descriptor.series = scope.dhxSeries : '';
        //scope.dhxLegend ? descriptor.legend = scope.dhxLegend : '';
        //scope.dhxWidth ? descriptor.width = scope.dhxWidth : '';

        //noinspection JSPotentiallyInvalidConstructorUsage
        var chart = new dhtmlXChart(descriptor);


        chart.parse(scope.dhxData, 'json');
        DhxUtils.attachDhxHandlers(chart, scope.dhxHandlers);
        DhxUtils.dhxUnloadOnScopeDestroy(scope, chart);
      }
    };
  });


//"use strict";
/**
 * Created by Emanuil on 24/02/2016.
 *
 * Links:
 *   for validate properties:
 *   http://docs.dhtmlx.com/form__validation.html#validation
 */
(function () {
  var linkFn = function (scope, element/*, json*/) {
    var obj = {};
    var list = [];

    //if (json === undefined) {
    $(element[0]).children('JSON').each(function () {
      list.push($(this).val());
    });

    for (var property in scope) {
      if (scope.hasOwnProperty(property) && scope[property] !== undefined) {
        var prefix = property.substr(0, 3);
        if (prefix !== "dhx") continue;

        var param = property.substr(3);
        param = param[0].toLowerCase() + param.substr(1);
        obj[param] = scope[property];
      }
    }

    var tagName = element.prop('tagName').substr(6).toLowerCase();
    if (tagName !== 'option') {
      obj.type = tagName.split('-').join('');
    }

    var newElem = $('<JSON>');
    newElem.attr('savedTagName', tagName);
    if (list.length != 0) {
      switch (tagName) {
        case 'combo':
        case 'select':
        case 'multiselect':
          obj.options = list;
          break;
        case 'radio':
        case 'checkbox':
        case 'fieldset':
        case 'block':
        case 'rm':
          obj.list = list;
          break;
      }
    }


    if (tagName != 'rm') {
      newElem.val(obj);
      element.replaceWith(newElem);
    }
    return obj;
  };

  var module = angular.module('dhxDirectives');
  module.directive('dhxForm', function factory(DhxUtils) {
    return {
      restrict: 'E',
      scope: {
        dhxObj: '=',
        dhxHandlers: '='
      },
      link: function (scope, element) {
        var data = linkFn(scope, element).list;
        element.empty();
        var div = $('<div></div>').appendTo(element[0]);
        console.log(JSON.stringify(data));
        var form = new dhtmlXForm(div[0], data);
        form.enableLiveValidation(true);
        form.validate();
        scope.dhxObj ? scope.dhxObj = form : '';
        DhxUtils.attachDhxHandlers(form, scope.dhxHandlers);

      }
    };
  });

  module.directive('dhxFBlock', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxList: '=',
        dhxName: '@',
        dhxWidth: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFButton', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxName: '@',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValue: '@',
        dhxWidth: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFCalendar', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxCalendarPosition: '@',
        dhxDateFormat: '@',
        dhxDisabled: '=',
        dhxEnableTime: '=',
        dhxEnableTodayButton: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxMinutesInterval: '=',
        dhxName: '@',
        dhxRequired: '=',
        dhxServerDateFormat: '@',
        dhxShowWeekNumbers: '=',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValue: '@',
        dhxWeekStart: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFCheckbox', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxChecked: '=',
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxList: '=',
        dhxName: '@',
        dhxReadonly: '=',
        dhxRequired: '=',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFColorpicker', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxCpPosition: '@',
        dhxCustomColors: '@',
        dhxDisabled: '=',
        dhxEnableCustomColors: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxName: '@',
        dhxReadonly: '=',
        dhxRequired: '=',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValidate: '=',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFCombo', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxComboType: '=',
        dhxDisabled: '=',
        dhxFiltering: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxName: '@',
        dhxReadonly: '=',
        dhxRequired: '=',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValidate: '=',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFFieldset', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxLabel: '@',
        dhxList: '=',
        dhxName: '@',
        dhxUserdata: '=',
        dhxWidth: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFImage', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxImageHeight: '=',
        dhxImageWidth: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxName: '@',
        dhxStyle: '@',
        dhxTooltip: '@',
        dhxUrl: '@',
        dhxUserdata: '=',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFInput', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxMaxLength: '=',
        dhxName: '@',
        dhxNumberFormat: '@',
        dhxReadonly: '=',
        dhxRequired: '=',
        dhxRows: '=',
        dhxStyle: '@',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValidate: '=',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFLabel', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxLabel: '@',
        dhxName: '@',
        dhxUserdata: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFMultiSelect', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxName: '@',
        dhxRequired: '=',
        dhxStyle: '@',
        dhxTooltip: '@',
        dhxUserdata: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFNewColumn', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxOffset: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFNote', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxText: '@',
        dhxWidth: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFOption', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxSelected: '=',
        dhxText: '@',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFPassword', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxMaxLength: '=',
        dhxName: '@',
        dhxReadonly: '=',
        dhxRequired: '=',
        dhxStyle: '@',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValidate: '=',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFRadio', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxChecked: '=',
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxName: '@',
        dhxReadonly: '=',
        dhxRequired: '=',
        dhxTooltip: '@',
        dhxUserdata: '=',
        dhxValue: '@'
      },
      link: linkFn
    };
  });
  module.directive('dhxFSelect', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxInfo: '=',
        dhxLabel: '@',
        dhxName: '@',
        dhxRequired: '=',
        dhxStyle: '@',
        dhxTooltip: '@',
        dhxUserdata: '='
      },
      link: linkFn
    };
  });
  module.directive('dhxFSettings', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxBlockOffset: '=',
        dhxInputHeight: '=',
        dhxInputWidth: '=',
        dhxLabelAlign: '@',
        dhxLabelHeight: '=',
        dhxLabelWidth: '=',
        dhxNoteWidth: '=',
        dhxOffsetLeft: '=',
        dhxOffsetTop: '=',
        dhxPosition: '@'

      },
      link: linkFn
    };
  });

  module.directive('dhxFUpload', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxDisabled: '=',
        dhxHidden: '=',
        dhxMode: '@',
        dhxName: '@',
        dhxRequired: '=',
        dhxTitleScreen: '=',
        dhxTitleText: '@',
        dhxUrl: '@',
        dhxUserdata: '='
      },
      link: linkFn
    };
  });
  //TODO: Make it so that it can mix with the other approach
  module.directive('dhxFJson', function factory() {
    return {
      restrict: 'E',
      scope: {
        dhxJson: '='
      },
      link: function (scope, element) {
        linkFn(scope, element, scope.dhxJson);
      }
    };
  });
  //module.directive('dhxFormCmp', function factory() {
  //  return {
  //    restrict: 'E',
  //    scope: {
  //      dhxCalendarPosition: '@',
  //      dhxChecked: '=',
  //      dhxComboType: '=',
  //      dhxCpPosition: '@',
  //      dhxCustomColors: '@',
  //      dhxDateFormat: '@',
  //      dhxDisabled: '=',
  //      dhxEnableCustomColors: '=',
  //      dhxEnableTime: '=',
  //      dhxEnableTodayButton: '=',
  //      dhxFiltering: '=',
  //      dhxHidden: '=',
  //      dhxImageHeight: '=',
  //      dhxImageWidth: '=',
  //      dhxInfo: '=',
  //      dhxLabel: '@',
  //      dhxList: '=',
  //      dhxMaxLength: '=',
  //      dhxMinutesInterval: '=',
  //      dhxMode: '@',
  //      dhxName: '@',
  //      dhxNumberFormat: '@',
  //      dhxReadonly: '=',
  //      dhxRequired: '=',
  //      dhxRows: '=',
  //      dhxSelected: '=',
  //      dhxServerDateFormat: '@',
  //      dhxShowWeekNumbers: '=',
  //      dhxStyle: '@',
  //      dhxText: '@',
  //      dhxTitleScreen: '=',
  //      dhxTitleText: '@',
  //      dhxTooltip: '@',
  //      dhxUrl: '@',
  //      dhxUserdata: '=',
  //      dhxValidate: '=',
  //      dhxValue: '@',
  //      dhxWeekStart: '=',
  //      dhxWidth: '='
  //    },
  //    link: linkFn
  //  };
  //});
  // Use for other form cmps
})();
//"use strict";
/**
 * Created by Emanuil on 01/02/2016.
 *
 * I do not exhaust the complete dhtmlXGrid API here...
 * however configure and dataLoaded callbacks let user
 * add any additional configuration they desire
 */
angular.module('dhxDirectives')
  .directive('dhxGrid', function factory(DhxUtils) {
    return {
      restrict: 'E',
      require: 'dhxGrid',
      controller: function () {
      },
      scope: {
        /**
         * Grid will be accessible in controller via this scope entry
         * after it's initialized.
         * NOTE: For better design and testability you should use instead the
         * configure and dataLoaded callbacks.
         */
        dhxObj: '=',
        /** Mandatory in current implementation! */
        dhxMaxHeight: '=',
        /** Optional. Default is 100%. */
        dhxMaxWidth: '=',
        /**
         * Data is given here as an object. Not a filename! Must conform to the
         * specified or default dataFormat
         */
        dhxData: '=',
        /**
         * View possible formats here: http://docs.dhtmlx.com/grid__data_formats.html
         * Currently supported:
         * ['Basic JSON', 'Native JSON'] // 'Basic JSON' is default value
         */
        dhxDataFormat: '=',
        /** Optional! Recommended! http://docs.dhtmlx.com/api__dhtmlxgrid_setheader.html */
        dhxHeader: '=',
        /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setcoltypes.html */
        dhxColTypes: '=',
        /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setcolsorting.html */
        dhxColSorting: '=',
        /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setcolalign.html */
        dhxColAlign: '=',
        /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setinitwidthsp.html */
        dhxInitWidths: '=',
        /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setinitwidths.html */
        dhxInitWidthsP: '=',
        /**
         * preLoad and postLoad callbacks to controller for additional
         * customization power.
         */
        dhxConfigureFunc: '=',
        dhxOnDataLoaded: '=',
        /**
         * [{type: <handlerType>, handler: <handlerFunc>}]
         * where type is 'onSomeEvent'
         * Events can be seen at: http://docs.dhtmlx.com/api__refs__dhtmlxgrid_events.html
         * Optional
         */
        dhxHandlers: '=',
        dhxVersionId: '=',

        dhxContextMenu: '='
      },
      compile: function compile(/*tElement, tAttrs, transclude*/) {
        return function (scope, element/*, attrs*/) {
          var loadStructure = function () {
            $(element).empty();
            $('<div></div>').appendTo(element[0]);
            var rootElem = element.children().first();

            var width = scope.dhxMaxWidth ? (scope.dhxMaxWidth + 'px') : '100%';
            var height = scope.dhxMaxHeight ? (scope.dhxMaxHeight + 'px') : '100%';

            rootElem.css('width', width);
            rootElem.css('height', height);

            //noinspection JSPotentiallyInvalidConstructorUsage
            var grid = new dhtmlXGridObject(rootElem[0]);
            grid.setImagePath(DhxUtils.getImagePath());

            grid.enableAutoHeight(!!scope.dhxMaxHeight, scope.dhxMaxHeight, true);
            grid.enableAutoWidth(!!scope.dhxMaxWidth, scope.dhxMaxWidth, true);


            scope.dhxContextMenu ? grid.enableContextMenu(scope.dhxContextMenu) : '';
            scope.$watch(
              "dhxContextMenu",
              function handle( newValue, oldValue ) {
                grid.enableContextMenu(newValue);
              }
            );

            scope.dhxHeader ? grid.setHeader(scope.dhxHeader): '';
            scope.dhxColTypes ? grid.setColTypes(scope.dhxColTypes): '';
            scope.dhxColSorting ? grid.setColSorting(scope.dhxColSorting): '';
            scope.dhxColAlign ? grid.setColAlign(scope.dhxColAlign): '';
            scope.dhxInitWidths ? grid.setInitWidths(scope.dhxInitWidths): '';
            scope.dhxInitWidthsP ? grid.setInitWidthsP(scope.dhxInitWidthsP): '';

            // Letting controller add configurations before data is parsed
            if (scope.dhxConfigureFunc) {
              scope.dhxConfigureFunc(grid);
            }

            grid.init();
            // Finally parsing data
            var dhxDataFormat = scope.dhxDataFormat || 'Basic JSON';
            switch (dhxDataFormat) {
              case 'Basic JSON':
                grid.parse(scope.dhxData, 'json');
                break;
              case 'Native JSON':
                grid.load(scope.dhxData, 'js');
                break;
            }

            // Letting controller do data manipulation after data has been loaded
            if (scope.dhxOnDataLoaded) {
              scope.dhxOnDataLoaded(grid);
            }

            DhxUtils.attachDhxHandlers(grid, scope.dhxHandlers);
            DhxUtils.dhxUnloadOnScopeDestroy(scope, grid);
          };
          scope.$watch('dhxVersionId', function (/*newVal, oldVal*/) {
            console.log('rebuilding...');
            loadStructure();
          });
        }
      }
    };
  });
//"use strict";
/**
 * Created by Emanuil on 25/01/2016.
 *
 * Below is a list of configurations for dhxLayoutCode.
 * http://dhtmlx.com/docs/products/dhtmlxLayout/samples/02_conf/01_patterns.html
 *
 * The layout initialization API used below can be seen here:
 * http://docs.dhtmlx.com/layout__init.html
 */
angular.module('dhxDirectives')
  .directive('dhxLayout', function factory(DhxUtils) {
    var letters = "abcdefg";
    return {
      restrict: 'E',
      require: 'dhxLayout',
      controller: function ($scope) {
        $scope.panes = [];
        this.getNextId = (function () {
          var letters = "abcdefg";
          var current = -1;
          return function () {
            current++;
            return current < 7 ? letters[current] : console.error('Too many dhxLayout panes.');
          };
        })();
        this.registerPane = function (pane) {
          $scope.panes.push(pane);
        };
      },
      scope: {
        dhxLayoutCode: "@",
        dhxWidth: "=", // Optional... Default is 100%. If set, use ems or pixels.
        dhxHeight: "=", // Mandatory.
        dhxUseEms: "=", // Optional... If width and height is in ems. Px is   default;
        dhxHandlers: '=',
        dhxObj: '=',
        dhxWhenDone: '='
      },
      link: function (scope, element, attrs, layoutCtrl) {
        $(element).empty();
        $('<div></div>').appendTo(element[0]);
        var rootElem = element.children().first();

        var dim = (scope.dhxUseEms ? 'em' : 'px');
        //TODO: Come up with a way to do 100% height (Within current container)
        var height = scope.dhxHeight? (scope.dhxHeight + dim) : '100%';//console.warn('Please set dhx-layout height!');
        var width = scope.dhxWidth? (scope.dhxWidth + dim) : '100%';

        rootElem.css('width', width);
        rootElem.css('height', height);
        rootElem.css('padding', '0px');
        rootElem.css('margin', '0px');
        rootElem.css('overflow', 'hidden');
        rootElem.css('display', 'block');

        //noinspection JSPotentiallyInvalidConstructorUsage
        rootElem[0]._isParentCell = true;
        var layout = new dhtmlXLayoutObject({
            parent: rootElem[0],
            pattern: scope.dhxLayoutCode,
            //offsets: { //TODO: Add them as optionals
            //  top: 10,
            //  right: 10,
            //  bottom: 10,
            //  left: 10
            //},
            cells: scope
              .panes
              .map(function (paneObj) {
                paneObj.cellConfig.id = layoutCtrl.getNextId();
                return paneObj.cellConfig;
              })
          }
        );
        if (scope.dhxObj)
          scope.dhxObj = layout;
        layout.setSizes();

        for (var i = 0; i < scope.panes.length; i++) {
          var dom =  scope.panes[i].jqElem[0];
          if (dom != null) {
            layout.cells(letters[i]).appendObject(dom);
          }
          
        }
        DhxUtils.attachDhxHandlers(layout, scope.dhxHandlers);
        DhxUtils.dhxUnloadOnScopeDestroy(scope, layout);
		if (scope.dhxWhenDone) {
			scope.dhxWhenDone(layout);
		}      }
    };
  })
  .directive('dhxLayoutPane', function factory() {
    return {
      restrict: 'E',
      require: '^dhxLayout',
      scope: {
        dhxText: '@',
        dhxCollapsedText: '@', // If this is omitted it becomes dhxText
        dhxHeader: '=', // Expression... since it is a boolean value
        dhxWidth: '@',  // These are optional... However when specified they
        dhxHeight: '@', // should not conflict with the layout width and height
        dhxCollapse: '=', // Expression... since it is a boolean value
        dhxFixSize: '='
      },
      link: function (scope, element, attrs, layoutCtrl) {


        layoutCtrl.registerPane({
          jqElem: element.detach(),
          cellConfig: {
            text: scope.dhxText || "",
            collapsed_text: scope.dhxCollapsedText || scope.dhxText || "",
            header: scope.dhxHeader,
            width: scope.dhxWidth,
            height: scope.dhxHeight,
            collapse: scope.dhxCollapse == undefined ? false : scope.dhxCollapse,
            fix_size: scope.dhxFixSize
          }
        });
      }
    };
  });
//"use strict";
/**
 * Created by Emanuil on 08/02/2016.
 *
 * Useful links
 * @link http://docs.dhtmlx.com/menu__object_constructor.html#specifyingmenuitems
 * @link http://docs.dhtmlx.com/api__link__dhtmlxmenu_loadstruct.html
 * @link http://docs.dhtmlx.com/api__dhtmlxmenu_loadfromhtml.html
 *
 */
angular.module('dhxDirectives')
  .directive('dhxMenu', function factory(DhxUtils) {
    return {
      restrict: 'E',
      require: 'dhxMenu',
      controller: function () {
      },
      scope: {
        dhxMenu: '=',
        dhxHandlers: '=',
        dhxOnClick: '=',
        dhxOnLoadedAndRendered: '=',
        /**
         * if (loadFromHtml)
         *  LoadFromHtml_fromDomChildren(),
         * else if (loadXMLFromDom)
         *  loadStruct(xmlFromChildren)
         * else
         *  loadStruct(XmlJsonData)
         **/
        dhxLoadFromHtml: '=',
        dhxLoadXmlFromDom: '=',
        dhxXmlJsonData: '=',

        dhxContextMenuMode: '=',
        dhxContextZones: '=',
        dhxContextAsParent: '='
      },
      link: function (scope, element/*, attrs, menuCtrl*/) {
        //noinspection JSPotentiallyInvalidConstructorUsage

        var domChild = $(element).children().first().detach();

        var menu = new dhtmlXMenuObject(scope.dhxContextMenuMode ? undefined : element[0]);
        scope.dhxMenu ? scope.dhxMenu = menu : '';

        scope.dhxContextMenuMode ? menu.renderAsContextMenu() : undefined;

        if (scope.dhxContextZones) {
          scope.dhxContextZones.forEach(function (zone) {
            menu.addContextZone(zone);
          });
        }

        if (scope.dhxContextAsParent) {
          menu.addContextZone($(element).parent()[0]);
        }

        if (scope.dhxOnClick) {
          DhxUtils.attachDhxHandlers(menu, [
            {
              type: 'onClick',
              handler: scope.dhxOnClick
            }
          ]);
        }
        if (scope.dhxLoadFromHtml) {
          menu.loadFromHTML(domChild[0], false, scope.dhxOnLoadedAndRendered);
        } else if (scope.dhxLoadXmlFromDom) {
          menu.loadStruct(domChild[0].outerHTML, scope.dhxOnLoadedAndRendered);
        } else if (scope.dhxXmlJsonData) {
          menu.loadStruct(scope.dhxXmlJsonData);
        } else {
          console.error('Please specify one of dhx-load-from-html or dhx-load-from-dom or dhx-xml-json-data');
        }

        DhxUtils.attachDhxHandlers(menu, scope.dhxHandlers);
        DhxUtils.dhxUnloadOnScopeDestroy(scope, menu);
      }
    };
  });
//"use strict";
/**
 * Created by Emanuil on 09/02/2016.
 */
angular.module('dhxDirectives')
  .directive('dhxMessage', function factory($timeout, DhxUtils) {
    var nextMsgId = (function () {
      var _internalCounter = DhxUtils.createCounter();
      return function () {
        return 'msg_' + _internalCounter();
      };
    })();
    return {
      restrict: 'E',
      require: 'dhxMessage',
      controller: function () {
      },
      scope: {
        // shared props for notifications, confirms and alerts
        dhxInvoker: '=',
        dhxText: '@',
        /**
         * alert, alert-warning, alert-error,
         * confirm, confirm-warning, confirm-error,
         * ...anything else
         */
        dhxType: '@',
        // For notifications(a.k.a. plain messages)
        dhxExpire: '=',
        // shared props for confirms and alerts
        dhxCallback: '=',
        dhxHeight: '=',
        dhxWidth: '=',
        dhxPosition: '@',
        dhxTitle: '@',
        dhxOk: '@',
        // Just for Confirm
        dhxCancel: '@',
        dhxInvokeOnCreate: '='
      },
      link: function (scope/*, element, attrs*/) {
        var invoker = function () {
          var instObj = {};

          // Not bothering with checks. Relying on the user providing just the data that's
          // needed for the message type
          instObj.id = nextMsgId();
          scope.dhxText !== undefined ? instObj.text = scope.dhxText : '';
          scope.dhxType !== undefined ? instObj.type = scope.dhxType : '';
          scope.dhxExpire !== undefined ? instObj.expire = scope.dhxExpire : '';
          scope.dhxHeight !== undefined ? instObj.height = scope.dhxHeight : '';
          scope.dhxWidth !== undefined ? instObj.width = scope.dhxWidth : '';
          scope.dhxPosition !== undefined ? instObj.position = scope.dhxPosition : '';
          scope.dhxTitle !== undefined ? instObj.title = scope.dhxTitle : '';
          scope.dhxOk !== undefined ? instObj.ok = scope.dhxOk : '';
          scope.dhxCancel !== undefined ? instObj.cancel = scope.dhxCancel : '';

          if (scope.dhxCallback !== undefined) {
            instObj.callback = function (data) {
              scope.dhxCallback(data);
            };
          }
          dhtmlx.message(instObj);

          scope.$on(
            "$destroy",
            function (/*event*/) {
              dhtmlx.message.hide(instObj.id);
            }
          );
        };
        //scope.dhxInvoker !== undefined ? scope.dhxInvoker = invoker : '';
        scope.dhxInvoker = invoker;
        if(scope.dhxInvokeOnCreate) {
          invoker();
        }
      }
    };
  });


//"use strict";
/**
 * Created by Emanuil on 08/02/2016.
 *
 * TODO: Currently dhxPopup targets parent. Add more ways of doing this.
 */
angular.module('dhxDirectives')
  .directive('dhxPopup', function factory(DhxUtils) {
    return {
      restrict: 'E',
      require: 'dhxPopup',
      controller: function () {
      },
      scope: {
        dhxPopup: '=',
        /**
         * Determines if the popup is active. Note that the popup may hide if clicked upon, or
         * upon user refocus. To reappear it see dhxRefresh.
         */
        dhxShow: '=',
        /**
         * if dhxRefresh is changed the popup is refresh. It reappears if dhxShow is true,
         * else hides.
         */
        dhxHandlers: '=',
        dhxRefresh: '='
      },
      link: function (scope, element/*, attrs, popupCtrl*/) {
        //noinspection JSPotentiallyInvalidConstructorUsage
        var popup = new dhtmlXPopup();


        scope.dhxPopup ? scope.dhxPopup = popup : '';
        var parent = $(element[0]).parent()[0];
        var child = element.detach();

        var renderPopup = function () {
          !!scope.dhxShow ?
            popup.show(
              window.dhx4.absLeft(parent),
              window.dhx4.absTop(parent),
              parent.offsetWidth,
              parent.offsetHeight) :
            popup.hide();
        };
        popup.attachObject(child[0]);
        scope.dhxShow ? popup.show() : popup.hide();
        scope.$watch('dhxShow', renderPopup);
        scope.$watch('dhxRefresh', renderPopup);
        DhxUtils.attachDhxHandlers(popup, scope.dhxHandlers);
        DhxUtils.dhxUnloadOnScopeDestroy(scope, popup);
      }
    };
  });
//"use strict";
/**
 * Created by Emanuil on 18/02/2016.
 */
angular.module('dhxDirectives')
  .directive('dhxTabbar', function factory(DhxUtils) {
    var nextTabbarId = DhxUtils.createCounter();
    return {
      restrict: 'E',
      require: 'dhxTabbar',
      controller: function ($scope) {
        var _tabbarId = nextTabbarId();
        $scope.panes = [];
        var _nextTabbarPaneId = DhxUtils.createCounter();
        this.getTabbarPaneId = function () {
          return 'tabbar_' + _tabbarId + '_' + _nextTabbarPaneId();
        };
        this.registerPane = function (tab) {
          $scope.panes.push(tab);
        };
      },
      scope: {
        dhxObj: "=",
        dhxWidth: "=", // Optional... Default is 100%. If set, use ems or pixels.
        dhxHeight: "=", // Mandatory.
        dhxUseEms: "=", // Optional... If width and height is in ems. Px is default;
        dhxDisableScroll: "=",
        dhxHandlers: '='
      },
      link: function (scope, element) {
        var dim = (scope.dhxUseEms ? 'em' : 'px');

        var height = scope.dhxHeight ? (scope.dhxHeight + dim) : '100%';
        var width = scope.dhxWidth ? (scope.dhxWidth + dim) : '100%';
        element.css('width', width);
        element.css('height', height);
        element.css('display', 'block');

        //noinspection JSPotentiallyInvalidConstructorUsage
        var tabbar = new dhtmlXTabBar(element[0]);

        scope.dhxObj ? scope.dhxObj = tabbar : '';
        scope.panes.forEach(function (tabInfo) {
          tabbar.addTab(
            tabInfo.id,
            tabInfo.text
          );
          tabbar.tabs(tabInfo.id).attachObject(tabInfo.elem[0]);
          tabbar.tabs(tabInfo.id).showInnerScroll();
          tabInfo.selected ? tabbar.tabs(tabInfo.id).setActive() : '';
        });
        DhxUtils.attachDhxHandlers(tabbar, scope.dhxHandlers);
        DhxUtils.dhxUnloadOnScopeDestroy(scope, tabbar);
      }
    };
  })
  .directive('dhxTabbarPane', function factory() {
    return {
      restrict: 'E',
      require: '^dhxTabbar',
      scope: {
        dhxText: '@',
        dhxSelected: '='
      },
      link: function (scope, element, attrs, tabbarCtrl) {
        tabbarCtrl.registerPane({
          elem: element.detach(),
          text: scope.dhxText || "",
          id: tabbarCtrl.getTabbarPaneId(),
          selected: !!scope.dhxSelected
          //NOTE: Feel free to add aditional configuration here
        });
      }
    };
  });
//"use strict";
/**
 * Created by Emanuil on 29/01/2016.
 *
 * It is hard to exhaust the complete dhtmlxTree API here...
 * so feel free to adapt to your own needs.
 *
 * By binding the tree object itself to the controller scope,
 * and adding a configureFunc scope callback before data parse
 * I have tried to provide full access to the dhtmlxTree functionality
 */
angular.module('dhxDirectives')
  .directive('dhxTree', function factory(DhxUtils) {
    return {
      restrict: 'E',
      require: 'dhxTree',
      controller: function () {
      },
      scope: {
        /**
         * Tree will be accessible in controller via this scope entry
         * after it's initialized
         */
        dhxTree: '=',
        /**
         * Please refer to the following link for format:
         * http://docs.dhtmlx.com/tree__syntax_templates.html#jsonformattemplate
         */
        dhxJsonData: '=',
        /**
         * [{type: <handlerType>, handler: <handlerFunc>}]
         * where type is 'onSomeEvent'
         * Events can be seen at: http://docs.dhtmlx.com/api__refs__dhtmlxtree_events.html
         * Optional
         */
        dhxHandlers: '=',
        /**
         * Not an exhaustive list of enablers... feel free to add more.
         * Optionals!
         */
        dhxEnableCheckBoxes: '=',
        dhxEnableDragAndDrop: '=',
        dhxEnableHighlighting: '=',
        dhxEnableThreeStateCheckboxes: '=',
        dhxEnableTreeLines: '=',
        dhxEnableTreeImages: '=',
        /**
         * preLoad and postLoad callbacks to controller for additional
         * customization power.
         */
        dhxConfigureFunc: '=',
        dhxOnDataLoaded: '=',

        dhxContextMenu: '='
      },
      link: function (scope, element/*, attrs, treeCtrl*/) {
        //noinspection JSPotentiallyInvalidConstructorUsage
        var tree = new dhtmlXTreeObject({
          parent: element[0],
          skin: "dhx_skyblue",
          checkbox: true,
          image_path: DhxUtils.getImagePath() + 'dhxtree_skyblue/'
        });

        scope.dhxTree ? scope.dhxTree = tree : '';

        scope.dhxContextMenu ? tree.enableContextMenu(scope.dhxContextMenu) : '';
        scope.$watch(
          "dhxContextMenu",
          function handle( newValue) {
            tree.enableContextMenu(newValue);
          }
        );

        // Additional optional configuration
        tree.enableCheckBoxes(scope.dhxEnableCheckBoxes);

        tree.enableDragAndDrop(scope.dhxEnableDragAndDrop);
        tree.enableHighlighting(scope.dhxEnableHighlighting);
        tree.enableThreeStateCheckboxes(scope.dhxEnableThreeStateCheckboxes);
        tree.enableTreeImages(scope.dhxEnableTreeImages);
        tree.enableTreeLines(scope.dhxEnableTreeLines);
        // Letting controller add configurations before data is parsed

        if (scope.dhxConfigureFunc) {
          scope.dhxConfigureFunc(tree);
        }
        // Finally parsing data
        tree.parse(scope.dhxJsonData, "json");

        // Letting controller do data manipulation after data has been loaded

        if (scope.dhxOnDataLoaded) {
          scope.dhxOnDataLoaded(tree);
        }
        DhxUtils.attachDhxHandlers(tree, scope.dhxHandlers);
        DhxUtils.dhxUnloadOnScopeDestroy(scope, tree);
      }
    };
  });
//"use strict";
/**
 * Created by Emanuil on 18/02/2016.
 */
angular.module('dhxDirectives')
  .directive('dhxWindows', function factory(DhxUtils) {
    var nextWindowsId = DhxUtils.createCounter();
    return {
      restrict: 'E',
      require: 'dhxWindows',
      controller: function (/*$scope*/) {
        var _windowInfos = [];
        var _container = document.documentElement;

        var _winsId = nextWindowsId();
        var _idPerWin = DhxUtils.createCounter();

        this.getNextWindowId = function () {
          return "wins_" + _winsId + "_" + _idPerWin();
        };

        this.registerWindow = function (windowInfo) {
          _windowInfos.push(windowInfo);
        };

        this.setContainer = function (container) {
          _container = container;
        };

        this.getContainer = function () {
          return _container;
        };

        this.getWindowInfos = function () {
          return _windowInfos;
        }
      },
      scope: {
        dhxHandlers: '='
      },
      link: function (scope, element, attrs, windowsCtrl) {
        //noinspection JSPotentiallyInvalidConstructorUsage
        var windows = new dhtmlXWindows();
        windows.attachViewportTo(windowsCtrl.getContainer());
        windowsCtrl
          .getWindowInfos()
          .forEach(function (windowInfo) {
            var conf = windowInfo.config;
            DhxUtils.removeUndefinedProps(conf);
            var win = windows.createWindow(
              windowsCtrl.getNextWindowId(),
              conf.left,
              conf.top,
              conf.width,
              conf.height
            );

            conf.header != undefined ? (!conf.header ? win.hideHeader() : '') : '';
            conf.center !== undefined ? (conf.center ? win.center() : '') : '';
            conf.keep_in_viewport !== undefined ? win.keepInViewport(!!conf.keep_in_viewport) : '';
            conf.showInnerScroll !== undefined ?  (conf.showInnerScroll ? win.showInnerScroll() : '') : '';
            conf.move !== undefined ? win[(conf.move ? 'allow' : 'deny') + 'Move']() : '';
            conf.park !== undefined ? win[(conf.park ? 'allow' : 'deny') + 'Park']() : '';
            conf.resize !== undefined ? win[(conf.resize ? 'allow' : 'deny') + 'Resize']() : '';
            conf.text !== undefined ? win.setText(conf.text) : '';

            conf.btnClose !== undefined ? win.button('close')[conf.btnClose ? 'show' : 'hide']() : '';
            conf.btnMinmax !== undefined ? win.button('minmax')[conf.btnMinmax ? 'show' : 'hide']() : '';
            conf.btnPark !== undefined ? win.button('park')[conf.btnPark ? 'show' : 'hide']() : '';
            conf.btnStick !== undefined ? win.button('stick')[conf.btnStick ? 'show' : 'hide']() : '';
            conf.btnHelp !== undefined ? win.button('help')[conf.btnHelp ? 'show' : 'hide']() : '';

            var domElem = windowInfo.elem[0];
            win.attachObject(domElem);
          });

        DhxUtils.attachDhxHandlers(windows, scope.dhxHandlers);
        DhxUtils.dhxUnloadOnScopeDestroy(scope, windows);
      }
    };
  })
  .directive('dhxWindow', function factory() {
    return {
      restrict: 'E',
      require: '^dhxWindows',
      scope: {
        dhxCenter: '=',
        dhxHeight: '=',
        dhxHeader: '=',
        dhxKeepInViewport: '=',
        dhxShowInnerScroll: '=',
        dhxLeft: '=',
        dhxMove: '=',
        dhxPark: '=',
        dhxResize: '=',
        dhxText: '@',
        dhxTop: '=',
        dhxWidth: '=',
        dhxBtnClose: '=',
        dhxBtnMinmax: '=',
        dhxBtnPark: '=',
        dhxBtnStick: '=',
        dhxBtnHelp: '='
      },
      link: function (scope, element, attrs, windowsCtrl) {
        windowsCtrl.registerWindow({
          elem: element.detach(),
          config: {
            center: scope.dhxCenter,
            height: scope.dhxHeight,
            header: scope.dhxHeader,
            keep_in_viewport: scope.dhxKeepInViewport,
            showInnerScroll: scope.dhxShowInnerScroll,
            left: scope.dhxLeft,
            move: scope.dhxMove,
            park: scope.dhxPark,
            resize: scope.dhxResize,
            text: scope.dhxText,
            top: scope.dhxTop,
            width: scope.dhxWidth,
            btnClose : scope.dhxBtnClose,
            btnMinmax: scope.dhxBtnMinmax,
            btnPark: scope.dhxBtnPark,
            btnStick: scope.dhxBtnStick,
            btnHelp: scope.dhxBtnHelp
          }
        });
      }
    };
  })
  .directive('dhxWindowContainer', function factory() {
    return {
      restrict: 'E',
      require: '^dhxWindows',
      scope: {},
      link: function (scope, element, attrs, windowsCtrl) {
        windowsCtrl.setContainer(element[0]);
      }
    };
  });
//"use strict";
/**
 * Created by Emanuil on 01/02/2016.
 */
angular.module('dhxDirectives')
  .factory('DhxUtils', [function () {
    var _imgPath = "bower_components/dhtmlx/imgs/";

    /**
     * @param dhxObject
     * @param dhxHandlers
     */
    var attachDhxHandlers = function (dhxObject, dhxHandlers) {
      (dhxHandlers || [])
        .forEach(function (info) {
          dhxObject.attachEvent(info.type, info.handler);
        });
    };

    var getImagePath = function () {
      return _imgPath;
    };

    var setImagePath = function (imgPath) {
      _imgPath = imgPath;
    };

    /**
     * I hope to never resort to using that
     */
    var createCounter = function () {
      var current = -1;
      return function () {
        current++;
        return current;
      };
    };

    var removeUndefinedProps = function(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] === undefined) {
          delete obj[prop];
        }
      }
    };

    var dhxUnloadOnScopeDestroy = function (scope, dhxObj) {
      var destructorName =
        'destructor' in dhxObj
          ? 'destructor'
          :
          ('unload' in dhxObj
            ? 'unload'
            : null);
      if (destructorName === null) {
        console.error('Dhtmlx object does not have a destructor or unload method! Failed to register with scope destructor!');
        return;
      }

      scope.$on(
        "$destroy",
        function (/*event*/) {
          dhxObj[destructorName]();
        }
      );
    };

    return {
      attachDhxHandlers: attachDhxHandlers,
      getImagePath: getImagePath,
      setImagePath: setImagePath,
      createCounter: createCounter,
      removeUndefinedProps: removeUndefinedProps,
      dhxUnloadOnScopeDestroy: dhxUnloadOnScopeDestroy
    };
  }]);
