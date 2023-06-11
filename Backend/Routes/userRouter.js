const express=require('express');
const Router =express.Router();
const userService=require('../Services/userServices');

Router.post('/login',userService.userLogin);
Router.post('/register',userService.userSignup);
Router.get('/userDetails',userService.usersList);
Router.delete('/deleteuser/:id', userService.deleteUser);
Router.put('/updateuser/:id', userService.updateUserAccountStatus);
Router.get('/customerDetails',userService.customerList);
Router.put('/updatecustomerDetails/:id', userService.updatecustomerStatus);
Router.post('/forget-Password', userService.forgetPassword);

module.exports=Router