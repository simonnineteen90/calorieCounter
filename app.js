// convert app.js file into version using modules



/***********
 Progress: working so far 
 1. need to add the calcVal function to the data controller

 ** currently stuck because the calcVal function is returning NaN for the two user input values
 ** resolved this, was calling the function in the wrong place

 2. work out how to sum the value totals, consider if data stored correctly in myObject
    try to put everything through the app controller as it has access to both other modules   
 3. split the calcVal function so that the DOM change to show total is a seperate function

 22/7/20 All of above done

 4. redesign

 5. add option to add extra inputs -- this might be hard

 6. user can add a target value

 7. once total calculated UI updated to show if you are under or above

*/



//********* Data Module **********
var dataController = (function() {

    var x = 100;

    // everything in this return is available for use outside the module
    return {
        
        // 'for in loop' iterates over the object passed in, checks if object key has a property
        // if it has a property then the it is added to the sum variable 

        calcVal: function(object){
                var sum = 0
                for( var el in object ) {
                    if( object.hasOwnProperty(el) ) {
                        sum += object[el]
                    }
                }
                console.log('User inputed values are equal to: ' + sum)
                return sum 

            //console.log(object)
        },

        // this is a test
        // use dataController.add() to test in console
        add: function() {
            var y, z
            y = 1
            z = x + y
            return z
        }

    }

})();



//********* UI Module **********
var userInterfaceController =(function(){

    // everything in this return is available for use outside the module
    return {
        // get the user inputs and stores them in an object
        getValue: function() {
            var myObject

            myObject = {}

            myObject.input_0 = parseFloat(document.getElementById('userInput_0').value)
            myObject.input_1 = parseFloat(document.getElementById('userInput_1').value)
            

            return myObject
        },

        displayTotal: function(param) {
            document.getElementById('totalCals').textContent = 'Total calories: ' + param
        }



    }

})();





//********* Controller Module **********
var appController = (function(UICtrl, dataCtrl){

    var eventListeners = function() {
        // listen for any changes in the div called wrapper, then execute function
        // this is for the user inputs
        document.getElementById('wrapper').addEventListener('change', UICtrl.getValue);
       
       //when button clicked run the updateTotal function
       document.getElementById('calcBtn').addEventListener('click', updateTotal);
    }

    // assign the getValue function that returns an object to this variable 
    // NOTE that you do not call the function here
    var userInputObject = UICtrl.getValue

    //  assigns the data controller function calcVal to this var 
  /*   var ctrlCalcVal = function() {
        // the function is called here
        dataCtrl.calcVal(userInputObject())
    } */

    var updateTotal = function() {
        // calculate the total, and assign to a variable
        var totalCals = dataController.calcVal(userInputObject())

        // pass the variable into the display total function
        UICtrl.displayTotal(totalCals)
    }



    return {
        init: function() {
            console.log('app is running')
            //tests

            eventListeners()
            

        },

    }


})(userInterfaceController, dataController);

appController.init()