var tableNumber=  null;


AFRAME.registerComponent("markerhandler", {
  init: async function () {

    var dishes = await this.getDishes()
    if(tableNumber == null){
      this.addTableNumber()

    }

    this.el.addEventListener("markerFound", () => {
      if(tableNumber !== null){
        var markerId = this.el.id;
        this.handleMarkerFound(dishes, markerId);
      }

  
    });

    this.el.addEventListener("markerLost", () => {

      this.handleMarkerLost();
    });
  },


  addTableNumber: function(){
    swal({
      icon: "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png",
      title: "WELCOME TO CHEESE HUNGER BURGER !!",
      content: {
        element: "input",
        attributes: {
          placeholder: "Type the Table Number",
          type: "number",
          min: 1
        }
      },
      closeOnClickOutside: false
    }).then((inputvalue)=>{
      tableNumber=inputvalue
    })
  },

  handleMarkerFound: function (dishes, markerId) {

    var today = new Date();
    var currentDay = today.getDay();
    // Sunday - Saturday : 0 - 6

    var dish = dishes.filter(dish => dish.id === markerId)[0];

    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

   

    if (dish.unavailable.includes(days[currentDay])) {
      swal({
        icon: "warning",
        title: dish.dishname,
        text: "This dish is not available....HAVE FUNNN HUNGRRRYYYYY!!!!!!!!!!!!!",
        timer: 2000,
        buttons: false
      });
    }
    else {

      var model = document.querySelector(`#model-${dish.id}`);
      model.setAttribute("position", dish.model_geometry.position);
      model.setAttribute("rotation", dish.model_geometry.rotation);
      model.setAttribute("scale", dish.model_geometry.scale);
      model.setAttribute("visible", true);


      var plane = document.querySelector("id", `plane-${dish.id}`)
      plane.setAttribute("visible", true);

      var priceplane = document.querySelector("id" ,`#price-${dish.id}`);
      priceplane.setAttribute("visible", true)


      
   
    orderButtton.addEventListener("click", () => {
      var tNumber
      tableNumber<=5?(tNumber -`T0&{tableNumber}`):`T${tableNumber}`
      this.orderDish(tNumber, dish);
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order!",
        text: "Your order will be served soon at your table!"
      });
    });
  }


  var buttonDiv = document.getElementById("button-div");
  buttonDiv.style.display = "flex";


  var ratingButton = document.getElementById("rating-button");
  var orderButtton = document.getElementById("order-button");


  ratingButton.addEventListener("click", function () {
    swal({
      icon: "warning",
      title: "Rate Dish",
      text: "Work In Progress"
    });
  });

    },


  handleMarkerLost: function () {

    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },




  getDishes: async function (){
    return await firebase.firestore().collection("Dishes").get()
    .then(snapshot => {
        return snapshot.docs.map(doc=>
            doc.data()
        )
    })

  },


  orderDish:function(tNumber, dish){



    firebase.firestore().collection("tables").doc(tNumber).get()
    .then(doc => {
      var TableDetails = doc.data()
      if(TableDetails["current_order"][dish.id]){
        TableDetails["current_order"][dish.id]["Total_Quantity"]+=1

        var currentQuant = TableDetails["current_order"][dish.id]["Total_Quantity"]
        TableDetails["current_order"][dish.id]["Total_bill"] = currentQuant*dish.price
      }
      else{
        TableDetails["current_order"][dish.id]={
          Item:dish.dishname,
          Price:dish.price,
          Total_Quantity:1,
          Total_bill:dish.price*1

        }

      }


      TableDetails.total_bill+= dish.price
      firebase.firestore().collection("tables").doc(doc.id).update(TableDetails)
    })
  }

});