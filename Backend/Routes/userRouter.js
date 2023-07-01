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
Router.get('/templates', userService.fetchTemp);
Router.post('/templates', userService.newTemp);
Router.put('/templates/:id', userService.updateTemp);
Router.delete('/templates/:id', userService.DeleteTemp);
Router.get('/customers',userService.customers);
Router.get('/audit',userService.audit);
Router.get('/adminpowersaudit',userService.adminpowersaudit);
module.exports=Router