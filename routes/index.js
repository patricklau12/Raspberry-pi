var express = require('express');
const user  = require('../models/user');
var router  = express.Router();

module.exports = function(passport, upload) {
  var uploadImage = upload.single('image');

  function authenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/');
  };

  // GET login page
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    // res.render('login', { title: 'AVAN IoT Smart Lighting Control System', message: req.flash('info')});

    res.render('viewer', { title: 'Smart Toilet Viewer Page' });
  });
 
  // Handle Login POST
  // router.post('/signin', passport.authenticate('login', {
  //   successRedirect: '/home',
  //   failureRedirect: '/',
  //   failureFlash : true 
  // }));

  // // Handle Logout GET
  // router.get('/signout', function (req, res, next) {
  //   req.logout();
  //   res.redirect('/');
  // });

  // router.get('/downloadSensorLog', function(req, res){
  //   const file = './sensor_log.txt';
  //   res.download(file);
  // });

  // router.post('/uploadimage', function (req, res) {
  //   uploadImage(req, res, function(err) {
  //     if (req.fileValidationError) {
  //       return res.end(req.fileValidationError);
  //     } else {
  //       res.send();
  //       res.redirect('/filemanager');
  //     }
  //   });
  // });

  // router.get('/home', authenticated, function (req, res, next) {
  //   //req.user is the Document in mongoose, use 'req.user.type to get user type'
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/home', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.render('./user/home', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/home', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
    
  // });

  // router.get('/sg', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/sg', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.redirect('./admin/home');
  //   }
  // });
  
  // router.get('/account', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/account', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/account', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });
  
  // router.get('/advanced', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/advanced', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.redirect('./admin/home');
  //   }
  // });
  
  // router.get('/mode', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/mode', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');
      
  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/mode', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  // router.get('/report_dura', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/report_dura', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.render('./user/report_dura', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/report_dura', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  // router.get('/report_func', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/report_func', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.render('./user/report_func', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/report_func', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  // router.get('/report_past', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/report_past', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.render('./user/report_past', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/report_past', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  // router.get('/filemanager', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/filemanager', { user: req.user, title: 'AVAN IoT Smart Lighting Control System', message: req.flash('info')});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   }  else if (req.user.type == 'admin') {
  //     res.redirect('./admin/home');
  //   }
  // });

  // router.get('/property', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/property', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.redirect('./admin/home');
  //   }
  // });

  // router.get('/floorplan', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/floorplan', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/floorplan', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  // router.get('/group', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/group', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/group', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  // router.get('/schedule_test', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/schedule_test', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/schedule_test', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  // router.get('/schedule_dim', authenticated, function(req, res, next) {
  //   if (req.user.type == 'super') {
  //     res.render('./superadmin/schedule_dim', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});

  //   } else if (req.user.type == 'user') {
  //     res.redirect('./user/home');

  //   } else if (req.user.type == 'admin') {
  //     res.render('./admin/schedule_dim', { user: req.user , title: 'AVAN IoT Smart Lighting Control System'});
  //   }
  // });

  router.get('/console', function(req, res, next) {
    res.render('console', { title: 'Secret DEBUG' });
  });

  router.get('/sensor', function (req, res, next) {
    res.render('sensor', { title: 'Sensor DEMO' });    
  });

  router.get('/viewer', function (req, res, next) {
    res.render('viewer', { title: 'Smart Toilet Viewer Page' });
  });

  return router;
};