"use strict";
/**
 * Created by Emanuil on 19/02/2016.
 */
angular.module('dhxDirectives', []);
;"use strict";
/**
 * Created by Emanuil on 09/02/2016.
 */
angular.module('dhxDirectives')
  .directive('dhxChart', function factory() {
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
        dhxPieInnerText: '@'
      },
      link: function (scope, element, attrs) {
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

        var chart = new dhtmlXChart(descriptor);
        chart.parse(scope.dhxData, 'json');
      }
    };
  });


;"use strict";
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
        dhxVersionId: '='
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return function (scope, element, attrs) {
          var loadStructure = function () {
            $(element).empty();
            $('<div></div>').appendTo(element[0]);
            var rootElem = element.children().first();

            var width = scope.dhxMaxWidth ? (scope.dhxMaxWidth + 'px') : '100%';
            var height = scope.dhxMaxHeight ? (scope.dhxMaxHeight + 'px') : '100%';
            //rootElem.css('max-width', width);
            rootElem.css('width', width);
            rootElem.css('height', height);
            //rootElem.css('max-height', height);

            //noinspection JSPotentiallyInvalidConstructorUsage
            var grid = new dhtmlXGridObject(rootElem[0]);
            grid.setImagePath(DhxUtils.getImagePath());

            grid.enableAutoHeight(!!scope.dhxMaxHeight, scope.dhxMaxHeight, true);
            grid.enableAutoWidth(!!scope.dhxMaxWidth, scope.dhxMaxWidth, true);

            scope.dhxHeader ? grid.setHeader(scope.dhxHeader): '';
            scope.dhxColTypes ? grid.setColTypes(scope.dhxColTypes): '';
            scope.dhxColSorting ? grid.setColSorting(scope.dhxColSorting): '';
            scope.dhxColAlign ? grid.setColAlign(scope.dhxColAlign): '';
            scope.dhxInitWidths ? grid.setInitWidths(scope.dhxInitWidths): '';
            scope.dhxInitWidthsP ? grid.setInitWidthsP(scope.dhxInitWidthsP): '';

            DhxUtils.attachDhxHandlers(grid, scope.dhxHandlers);

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
          };
          scope.$watch('dhxVersionId', function (newVal, oldVal) {
            console.log('rebuilding...');
            loadStructure();
          });
        }
      }
    };
  })
;"use strict";
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
  .directive('dhxLayout', function factory() {
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
        dhxUseEms: "=" // Optional... If width and height is in ems. Px is default;
      },
      link: function (scope, element, attrs, layoutCtrl) {
        $(element).empty();
        $('<div></div>').appendTo(element[0]);
        var rootElem = element.children().first();

        var dim = (scope.dhxUseEms ? 'em' : 'px');
        var height = scope.dhxHeight? (scope.dhxHeight + dim) : console.warn('Please set dhx-layout height!');
        //TODO: Come up with a way to do 100% height (Within current container)
        var width = scope.dhxWidth? (scope.dhxWidth + dim) : '100%';

        //rootElem.css('max-width', width);
        rootElem.css('width', width);
        rootElem.css('height', height);
        rootElem.css('padding', '0px');
        rootElem.css('margin', '0px');
        rootElem.css('overflow', 'hidden');
        rootElem.css('display', 'block');

        //noinspection JSPotentiallyInvalidConstructorUsage
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
        layout.setSizes();

        for (var i = 0; i < scope.panes.length; i++) {
          layout.cells(letters[i]).appendObject(scope.panes[i].jqElem[0]);
        }
      }
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
;"use strict";
/**
 * Created by Emanuil on 09/02/2016.
 */
angular.module('dhxDirectives')
  .directive('dhxMessage', function factory() {
    return {
      restrict: 'E',
      require: 'dhxMessage',
      controller: function () {
      },
      scope: {
        // shared props for notifications, confirms and alerts
        dhxInvoker: '=',
        dhxId: '@',
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
        dhxCancel: '@'
      },
      link: function (scope, element, attrs) {
        scope.dhxInvoker = function () {
          var instObj = {};

          // Not bothering with checks. Relying on the user providing just the data that's
          // needed for the message type
          scope.dhxId !== undefined ? instObj.id = scope.dhxId : '';
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
        };
      }
    };
  });


;"use strict";
/**
 * Created by Emanuil on 08/02/2016.
 *
 * TODO: Currently dhxPopup targets parent. Add more ways of doing this.
 */
angular.module('dhxDirectives')
  .directive('dhxPopup', function factory() {
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
        scope.dhxShow ? popup.show() : popup.hide()
        scope.$watch('dhxShow', renderPopup);
        scope.$watch('dhxRefresh', renderPopup);
      }
    };
  });
;"use strict";
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
        dhxDisableScroll: "="
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
;"use strict";
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
        dhxOnDataLoaded: '='
      },
      link: function (scope, element/*, attrs, treeCtrl*/) {
        //noinspection JSPotentiallyInvalidConstructorUsage
        var tree = new dhtmlXTreeObject({
          parent: element[0],
          skin: "dhx_skyblue",
          checkbox: true,
          image_path: DhxUtils.getImagePath()
        });

        scope.dhxTree = tree;

        DhxUtils.attachDhxHandlers(tree, scope.dhxHandlers);

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
      }
    };
  });
;"use strict";
/**
 * Created by Emanuil on 01/02/2016.
 */
angular.module('dhxDirectives')
  .factory('DhxUtils', [function () {
    var _imgPath = "bower_components/dhtmlx/imgs/dhxtree_skyblue/";

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

    return {
      attachDhxHandlers: attachDhxHandlers,
      getImagePath: getImagePath,
      createCounter: createCounter
    };
  }]);
