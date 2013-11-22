'use strict';

describe('Unit testing', function() {
    var $compile;
    var $rootScope;
 
    // Load the myApp module, which contains the directive
    beforeEach(module('ui-selectize'));
 
    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));
    
    it('Initilaizes the element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var scope = $rootScope;
        scope.cars =  [
                      {id: 'avenger', make: 'dodge', model: 'Avenger'},
                      {id: 'caliber', make: 'dodge', model: 'Caliber'},
                      {id: 'caravan-grand-passenger', make: 'dodge', model: 'Caravan Grand Passenger'},
                      {id: 'challenger', make: 'dodge', model: 'Challenger'},
                      {id: 'ram-1500', make: 'dodge', model: 'Ram 1500'},
                      {id: 'viper', make: 'dodge', model: 'Viper'},
                      {id: 'a3', make: 'audi', model: 'A3'},
                      {id: 'a6', make: 'audi', model: 'A6'},
                      {id: 'r8', make: 'audi', model: 'R8'},
                      {id: 'rs-4', make: 'audi', model: 'RS 4'},
                      {id: 's4', make: 'audi', model: 'S4'},
                      {id: 's8', make: 'audi', model: 'S8'},
                      {id: 'tt', make: 'audi', model: 'TT'},
                      {id: 'avalanche', make: 'chevrolet', model: 'Avalanche'},
                      {id: 'aveo', make: 'chevrolet', model: 'Aveo'},
                      {id: 'cobalt', make: 'chevrolet', model: 'Cobalt'},
                      {id: 'silverado', make: 'chevrolet', model: 'Silverado'},
                      {id: 'suburban', make: 'chevrolet', model: 'Suburban'},
                      {id: 'tahoe', make: 'chevrolet', model: 'Tahoe'},
                      {id: 'trail-blazer', make: 'chevrolet', model: 'TrailBlazer'}
                  ];
        
     var element = $compile("<select class=\"selectize-input\" ng-model=\"myValue\" > <option ng-repeat=\"car in cars\" value=\"{{car.id}}\">{{car.model}}</option> </select>")(scope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        scope.$digest();
        // Check that the compiled element contains the templated content
        var options = element.find('option');

        expect(options.length).toBe(21);
    });
});
