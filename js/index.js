var url = 'http://sneakpeeq-sites.s3.amazonaws.com/interviews/ce/feeds/store.js';

var options = {
	format: "json"
};

/*function that displays relevant data from the JSON call to html
(e.g., page title, page description, products (i.e., image, name, formatted price))*/
function displayJSONInfo(data){
	var pageTitle = data.pageTitle;
	
	/*display page title in the title tag and at the top of the page*/
	$('title').html(pageTitle);
	$('.title').html(pageTitle);

	/*display the page description*/
	$('.pageDescription').html(data.extraInfo);

	var products = data.products;
	var currentProduct;
	var html;
	var formattedPrice;

	/*loop through the products and display each product: 
	image, name, and formatted price (i.e., $X.XX) */
	for (var i = 0; i < products.length; i++){
		currentProduct = products[i];

		/*converts the products original price (in cents) to $X.XX format as a string
		(e.g., 995 to $9.95) -- .toFixed(2) ensures 2 decimal places (e.g., $30.00)*/
		formattedPrice = "$" + (currentProduct.defaultPriceInCents / 100).toFixed(2).toString(); 

		/*stores id, name, and price of the product in the container div. 
		The name & price info will be used sort/filter the products */
		html = "<div class='productContainer' id='" + currentProduct.id + "' name='" + currentProduct.name;
		html += "' price='" + currentProduct.defaultPriceInCents + "'>";
		/*displays the product image*/
		html += "<div class='productImage'><img src='" + currentProduct.mainImage.ref + "'></div>"
		/*a productInfo div which holds/displays: 
			(1) the product name
			(2) the product's formatted price */
		html += "<div class='productInfo'><div class='productName'>" + currentProduct.name + "</div>";
		html += "<div class='productPrice'>" + formattedPrice+ "</div></div></div>"; /*end productInfo div & productContainer div*/

		/*output the product html in the id=productInfo div*/
		$('#productInfo').append(html);
	}

	/*default display of the products is: sorted - "Name: A-Z" and filter: show all products*/
	sort('name', 'asc');
	showAll();
}

/*jQuery method used to get JSON data using an AJAX HTTP GET request.*/
$.getJSON(url, options, displayJSONInfo);

/*filter function to show all products + 
set the "Show All" li to active (colored background) + radio field to checked*/
function showAll(){
	$('.productContainer').show();

	/*first remove li active class from other filter options, 
	then set showAll li to active + radio field to checked*/
	$('.filter').removeClass('liActive');
	$('#showAll').closest('li').addClass('liActive');
	$('#showAll').prop('checked', true);
}

/*filter by price function that takes a comparison type (less or greater), equalBoolean (if equal to),
and comparison value price; shows only products meeting the comparison criteria*/
function filter(type, equalBoolean, value){
	var operator;
	var expression;

	/*first remove li active class from other filter options*/
	$('.filter').removeClass('liActive');

	/*formulates the comparison operator based on the type and equalBoolean info
	passed to the method*/
	if (type == "less") {
		operator = "<";

		/*set lessThan li to active + radio field to checked*/
		$('#lessThan').closest('li').addClass('liActive');
		$('#lessThan').prop('checked', true);
	}
	else if (type == "greater") {
		operator = ">";

		/*set moreThan li to active + radio field to checked*/
		$('#moreThan').closest('li').addClass('liActive');
		$('#moreThan').prop('checked', true);
	}
	if (equalBoolean) {
		operator += "=";
	}

	var productPrice;

	/*loops through each product (.productContainer div)
	compares the product's price (stored in the price attribute of the div)
	with the value passed to the method, 
	using the comparison operator (<, >, <=, >=) formulated above*/
	$('.productContainer').each(function(){
		productPrice = $(this).attr('price');
		expression = productPrice + operator + value;

		/*shows only the products that meet the comparison criteria*/
		if(eval(expression)){
			$(this).show();
		}
		else {
			$(this).hide();
		}
	});
}

/*sort by function that takes an attribute name (price or name) and direction (asc or dec); 
then sorts products by these criteria */
function sort(attrName, direction){
	

	/*sorts the products based on the attribute name & direction +
	stores the sorted products in the sortedContainerDivs variable*/
	var sortedContainerDivs = $('.productContainer').sort(function(a, b){

		/*get the price/name stored in the .productContainer's attr */
		var attrA = $(a).attr(attrName);
		var attrB = $(b).attr(attrName);

		/*for prices, since the price was stored in the attr as a String, 
		convert to an int to allow comparison*/
		if (attrName == "price"){
			attrA = parseInt(attrA);
			attrB = parseInt(attrB);
		}

		/*for asc sorts*/
		if (direction == "asc"){
			return attrA > attrB ? 1 : -1;
		}
		/*for desc sorts*/
		else {
			return attrA < attrB ? 1 : -1;
		}
		
	});

	/*display the re-ordered products*/
	$('#productInfo').html(sortedContainerDivs);

	/*first remove li active class from other sort options*/
	$('.sort').removeClass('liActive');

	/*constructs the id for the selected sort div 
	(e.g., sortNameAsc or sortPriceDes) */
	var sortedDivId = "#sort" + attrName.substr(0,1).toUpperCase() + attrName.substr(1);
	sortedDivId += direction.substr(0,1).toUpperCase() + direction.substr(1);

	/*set the selected sort li option to active + radio field to checked*/
	$(sortedDivId).prop('checked', true);
	$(sortedDivId).closest('li').addClass('liActive');
}