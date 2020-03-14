var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Order = require("../models/order");

router.get("/order/:id/success",function(req,res){
   	res.render("cart/confirmation",{id: req.params.id});
});

router.get("/orders",isLoggedIn,function(req,res){
	User.findById(req.user._id).populate({
    	path : 'orders',
    	populate : {
      		path : 'checkoutCart.items.product'
    	}
    }).exec(function(err,user){
		if(err || !user) {
			req.flash("error","Something went wrong!!");
			res.redirect("/products");
		} else {
			res.render("orders/index",{orders: user.orders});
		}
	});
});

router.get("/orders/:id",isLoggedIn,function(req,res){
	Order.findById(req.params.id).populate('checkoutCart.items.product').exec(function(err,order){
		if(err || !order) {
			req.flash("error","Order not found!!");
			res.redirect("/products");
		} else {
			res.render("orders/show",{order: order});
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