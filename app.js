// working toward being able to add multiple values - now using github for this


/***********

Following Jonas course now
continue from video 83 add to UI


*/



//********* Data Module **********
var dataController = (function() {

    var Calorie = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    }
   
    var data = {
        allCalories: [],
        totalCals: 0
    }

    


    // everything in this return is available for use outside the module
    return {
        addItem: function(des, val) {
            var newItem, ID;
            
            // create the new ID
            if (data.allCalories.length > 0 ){
                ID = data.allCalories[data.allCalories.length - 1].id + 1;
                
            } else {
                ID = 0;
            }
            

            // create a new calorie ID
            newItem = new Calorie(ID, des, val);

            // push item to the data structure 
            data.allCalories.push(newItem);

            return newItem;

        },

        deleteItem: function(id) {
            var index, ids;
            ids = data.allCalories.map(function(current){
                return current.id
            })

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allCalories.splice(index,1)
            }


        },

        calculateBudget: function() {
            var sum
            sum = 0

            data.allCalories.forEach(function(cur){
                sum += cur.value 
            })
            data.totalCals = sum;

        },

        getBudget: function() {
            return {
                total: data.totalCals
            }
        },

        testing: function() {
            console.log(data);
        }
        
    }

})();



//********* UI Module **********
var userInterfaceController =(function(){

    // everything in this return is available for use outside the module
    return {
        // get the user input and store them in an object
        getValue: function() {
            
            return {
                des: document.querySelector('.add__des').value,
                value: parseFloat(document.querySelector('.add__value').value)
            }
        },

        addListItem: function(obj) {
            var html, newHtml
            // set the html to be inserted
            html = '<div class="calContainer" id="cal-%id%"><p>%des%</p><p>%value%</p><i class="fas fa-backspace"></i></div>'
            // create the new html string with data inserted
            
            newHtml = html.replace('%des%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            newHtml = newHtml.replace('%id%', obj.id);
            //insert the html after teh last child element
            document.querySelector('.calorieGridCont').insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID) {
            var element 
            // get the element by ID
            element = document.getElementById(selectorID)
            // select the elements parent node then remove the element
            element.parentNode.removeChild(element)
        },

        clearInputs: function() {
            var fields;
            // get the dom elements
            fields = document.querySelectorAll('.add__des' + ', ' + '.add__value');
            // convert list into a array
            fieldsArr = Array.prototype.slice.call(fields)
            // loop over each item of list and set value back to 0
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
                // focus back on the description element for quick inputs
                document.querySelector('.add__des').focus();
            })

        },

        displayTotal: function(obj){
            document.querySelector('.totalCals').textContent = obj.total;
        }





    }

})();





//********* Controller Module **********
var appController = (function(UICtrl, dataCtrl){

    var eventListeners = function() {
        // when add button clicked, fire the function
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
       
       //when enter key pressed, call function
       document.addEventListener('keypress', function(event){
           if (event.keycode === 13 || event.which === 13 ) {
               ctrlAddItem();
           }

           document.querySelector('.topContainer').addEventListener('click', ctrlDeleteItem);
       })

       


    }

    var updateCals = function() {

        // 1. calc the budget
        dataCtrl.calculateBudget();

        // 2. return budget
        var totalCalories = dataCtrl.getBudget();

       // 3. display the budget
        UICtrl.displayTotal(totalCalories);
    }



    var ctrlAddItem = function(){
        var input, newItem

        // 1. get the input values
        input = UICtrl.getValue();
        
        // only run if parameters met
        if (input.des !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. add item to the data 
            newItem = dataCtrl.addItem(input.des, input.value);

            // 3. add item to the UI
            newUIelement =  UICtrl.addListItem(newItem);

            // 4. clear the fields
            UICtrl.clearInputs();

            //5. update the total calories
            updateCals();

        }

        
    }

    var ctrlDeleteItem = function(event){
      var itemID

        itemID = event.target.parentNode.id;
       
        if(itemID) {
            // convert itemID from a string
            splitID = itemID.split('-');
            ID = parseFloat(splitID[1]); 

            // 1. delete from data structure
            dataCtrl.deleteItem(ID);


            // 2. delete from UI
            UICtrl.deleteListItem(itemID)

            // 3 update budget
            updateCals();

        }
        
        

    }




    return {
        init: function() {
            console.log('app is running')
            //tests

            eventListeners()
            
            // added this in to reset calories to 0 before starting
            updateCals()
            

        },

    }


})(userInterfaceController, dataController);

appController.init()