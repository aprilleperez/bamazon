// require the installed dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");


// set up mysql local connection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_db"
});

// connect to local host
connection.connect(function (err) {
  if (err) throw err;

  // declare starting function
  login();
});


function login() {
  // inquire to start or to exit
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "\n\rWelcome to Bamazon Customer. What would you like to do?",
      choices: [
        "Search Products",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Search Products":
          searchProducts();
          break;

        case "Exit":
          connection.end();
      }
    });
}

function searchProducts() {
  // queries the database to show item_id, product_name, and price
  var query = connection.query('SELECT item_id, product_name, price FROM bamazon_db.products', function (error, res) {
    if (error) throw error;
    console.table(res);

    // gets 1. what item and 2. how much of that the user wants
    inquirer
      .prompt([{
        name: "pickItem",
        type: "input",
        message: "\n\rPlease enter the item_id of the product you'd like! (valid whole integers only)",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "itemQuantity",
        type: "input",
        message: "\n\rHow much of the item would you like? (valid whole integers only)",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
      ])
      .then(function (answer) {
        // queries products table (returns all matched) where it matches the pickedItem (from the user)
        connection.query("SELECT * FROM products WHERE ?",
          { item_id: answer.pickItem }, function (err, res) {
            // sets results (selected item's stock quantity from DB) to variable
            var selectedItemQuantity = res[0].stock_quantity;

            // if user's quantity request is less than stock currently in DB
            if (answer.itemQuantity <= selectedItemQuantity) {
              // store sum of current stock quantity - user's requested quantity into the updated quantity. Then pass to update function
              var updatedQuantity = selectedItemQuantity - answer.itemQuantity;
              updateDB(updatedQuantity, res[0].item_id);
            } else {
              console.log("\n\rWe don't have enough in stock! Please check back later.");
              login();
            }
          });
      });
  });
}

// takes in the updated quantity and which item to update
function updateDB(updatedQuantity, itemid) {
  // query DB to update products table to set stock quantity to updated quantity, where it matches itemID
  connection.query("UPDATE products SET ? WHERE ?",
    [{ stock_quantity: updatedQuantity }, { item_id: itemid }],
    function (err, res) {
      if (err) {
        throw err;
        connection.end();
      } else {
        console.log("\n\rYour order was successful!");
        login();
      }
    })
};


// UPDATE products SET stock_quantity=5 WHERE item_id=2;
