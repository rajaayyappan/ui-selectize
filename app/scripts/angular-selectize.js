/**
 * Enhanced Selectize Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module('ui-selectize', []).value('angularSelConfig', {}).directive('selectize', ['angularSelConfig', '$timeout', function (angularSelConfig, $timeout) {
  var options = {};
  if (angularSelConfig) {
    angular.extend(options, angularSelConfig);
  }
  return {
    require: 'ngModel',
    compile: function (tElm, tAttrs) {
      var watch,
        repeatOption,
        repeatAttr,
        isSelect = tElm.is('select'),
        isMultiple = angular.isDefined(tAttrs.multiple);

      // Enable watching of the options dataset if in use
      if (tElm.is('select')) {
        repeatOption = tElm.find('option[ng-repeat], option[data-ng-repeat]');

        if (repeatOption.length) {
          repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
          watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
        }
      }

      return function (scope, elm, attrs, controller) {
        // instance-specific options
        var opts = angular.extend({}, options, scope.$eval(attrs.selectize));

        /*
        Convert from Selectize view-model to Angular view-model.
        */
        var convertToAngularModel = function(selectize_data) {
          var model;
          if (opts.simple_tags) {
            model = [];
            angular.forEach(selectize_data, function(value, index) {
              model.push(value.id);
            });
          } else {
            model = selectize_data;
          }
          return model;
        };

        /*
        Convert from Angular view-model to Selectize view-model.
        */
        var convertToSelectizeModel = function(angular_data) {
          var model = [];
          if (!angular_data) {
            return model;
          }

          if (opts.simple_tags) {
            model = [];
            angular.forEach(
              angular_data,
              function(value, index) {
                model.push({'id': value, 'text': value});
              });
          } else {
            model = angular_data;
          }
          return model;
        };

        /**if (isSelect) {
          // Use <select multiple> instead
          delete opts.multiple;
          delete opts.initSelection;
        } else if (isMultiple) {
          opts.multiple = true;
        }*/

        if (controller) {
          // Watch the model for programmatic changes
           scope.$watch(tAttrs.ngModel, function(current, old) {
            if (!current) {
              return;
            }
            if (current === old) {
              return;
            }
           controller.$render();
          }, true);
          
         /**controller.$render = function () {
            if (isSelect) {
              elm.selectize('options', controller.$viewValue);
            } else {
              if (opts.multiple) {
                elm.selectize(
                  'options', convertToSelectizeModel(controller.$viewValue));
              } else {
                if (angular.isObject(controller.$viewValue)) {
                  elm.selectize('options', controller.$viewValue);
                } else if (!controller.$viewValue) {
                  elm.selectize('options', null);
                } else {
                  elm.selectize('options', controller.$viewValue);
                }
              }
            }
          };*/

          // Watch the options dataset for changes
          if (watch) {
            scope.$watch(watch, function (newVal, oldVal, scope) {
              if (!newVal) {
                return;
              }
              // Delayed so that the options have time to be rendered
              $timeout(function () {
                elm.selectize('options', controller.$viewValue);
                // Refresh angular to remove the superfluous option
                elm.trigger('change');
              });
            });
          }

          if (!isSelect) {
            // Set the view and model value and update the angular template manually for the ajax/multiple select2.
            /**elm.bind("change", function () {
              if (scope.$$phase) {
                return;
              }
              scope.$apply(function () {
                controller.$setViewValue(
                  convertToAngularModel(elm.selectize('options')));
              });
            });*/

           /*if (opts.initSelection) {
              var initSelection = opts.initSelection;
              opts.initSelection = function (element, callback) {
                initSelection(element, function (value) {
                  controller.$setViewValue(convertToAngularModel(value));
                  callback(value);
                });
              };
            }*/
          }
        }

        elm.bind("$destroy", function() {
          elm.selectize("destroy");
        });

        /**attrs.$observe('disabled', function (value) {
          elm.selectize("enable");
        });*/

        /**if (attrs.ngMultiple) {
          scope.$watch(attrs.ngMultiple, function(newVal) {
            elm.selectize(opts);
          });
        }*/

        // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
        $timeout(function () {
          elm.selectize(opts);

          // Set initial value - I'm not sure about this but it seems to need to be there
          //elm.val(controller.$viewValue);
          // important!
          //controller.$render();

          // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
          //if (!opts.initSelection && !isSelect) {
          if (!isSelect) {
            controller.$setViewValue(convertToAngularModel(elm.selectize('options')) );
          }
        });
      };
    }
  };
}]);
