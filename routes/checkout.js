var express = require("express");
var router = express.Router();
var Order = require("../models/order");
var OrderCount = require("../models/orderCount");

router.get("/checkout",isLoggedIn,function(req,res){
	res.render("cart/checkout",{user: req.user});
});

router.post("/checkout",isLoggedIn,function(req,res){
	OrderCount.findOne({},function(err,orderCountObject) {
		if(err || !orderCountObject) {
			req.flash("error","Something went wrong!!");
			res.redirect("/products");
		} else {
			orderCountObject.count++;
			var no = orderCountObject.count;
			orderCountObject.save();
			var order = {
				no: no,
				name: req.body.name,
				address: req.body.address,
				contactNo: req.body.contactNo,
				paymentMode: 'COD',
				checkoutCart: req.user.cart,
				user: req.user
			}
			Order.create(order,function(err,order) {
				if(err || !order) {
					req.flash("error","Something went wrong!!");
					res.redirect("/products");
				} else {
					req.user.orders.unshift(order);
					req.user.cart.items.splice(0,req.user.cart.items.length);
					req.user.cart.total=0;
					req.user.save();
					req.flash("success","Order placed successfully!!")
					res.redirect("/order/"+order._id+"/success");
				}
			});
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Login to continue!!");
	res.redirect("/login");
}

module.exports = router;