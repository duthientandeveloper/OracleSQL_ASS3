var express = require('express');
var router = express.Router();
var fs = require('fs');
var OracleDB = require('../models/db');
var async = require('async');
var db = new OracleDB();


/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
	console.log(req.user);
	res.render('index', {
		title: 'Trang Chủ'
	});
});
router.get('/truong', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromTruong()
	], function (err, result) {
		var arr = [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				id: element.MATRUONG,
				name: element.TENTRUONG,
				address: element.DIACHITRUONG,
				target: element.MUCTIEU
			}
			arr.push(item)
		}
		res.render('truong', {
			title: 'Danh Sách Trường',
			arr: arr
		})
	})
})
router.get('/truong/new', ensureAuthenticated, function (req, res, next) {
	res.render('newTruong', {
		title: 'Tạo Mới Trường',
		isNew: true
	})
});
router.post('/truong/new', ensureAuthenticated, function (req, res, next) {
	var id = req.body.id;
	var name = req.body.name;
	var address = req.body.address;
	var target = req.body.target;
	req.checkBody('id', 'Mã Trường Bỏ Trống').notEmpty();
	req.checkBody('name', 'Tên Trường Bỏ Trống').notEmpty();
	req.checkBody('address', 'Địa Chỉ Trường Bỏ Trống').notEmpty();
	req.checkBody('target', 'Mục Tiêu Bỏ Trống').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render('newTruong', {
			title: 'Tạo Mới Trường',
			user: req.user,
			errors: errors,
			isNew: true,
			arr: {
				id: id,
				name: name,
				address: address,
				target: target
			}

		});
	} else {
		async.waterfall([
			db.connect('C##admin', 'admin'),
			db.insertToTruong(id, name, address, target)
		], function (err) {
			if (err) console.log(err);
			res.location('/truong');
			res.redirect('/truong');
		})
	}
});
router.get('/truong/delete', ensureAuthenticated, function (req, res, next) {
	var id = req.query.id;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.deleteToTruong(id)
	], function (err) {
		if (err) console.log(err);
		res.location('/truong');
		res.redirect('/truong');
	})
});
router.get('/truong/update', ensureAuthenticated, function (req, res, next) {
	var id = req.query.id;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromTruong(id)
	], function (err, result) {
		var arr = {
			id: result.rows[0].MATRUONG,
			name: result.rows[0].TENTRUONG,
			address: result.rows[0].DIACHITRUONG,
			target: result.rows[0].MUCTIEU
		}
		res.render('newTruong', {
			title: 'Cập Nhật Trường',
			arr: arr
		})
	});
});
router.post('/truong/update', ensureAuthenticated, function (req, res, next) {
	var id = req.query.id;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromTruong(id)
	], function (err, result) {
		var SQL = "",
			bindData = [], isChanged = false;
		if (req.body.id != result.rows[0].MATRUONG) {
			SQL += 'MATRUONG= :id';
			bindData.push(req.body.id);
			isChanged = true;
		}
		if (req.body.name != result.rows[0].TENTRUONG) {
			SQL += 'TENTRUONG= :name';
			bindData.push(req.body.name);
			isChanged = true;
		}
		if (req.body.address != result.rows[0].DIACHITRUONG) {
			SQL += 'DIACHITRUONG= :address';
			bindData.push(req.body.address);
			isChanged = true;
		}
		if (req.body.target != result.rows[0].MUCTIEU) {
			SQL += 'MUCTIEU= :target';
			bindData.push(req.body.target);
			isChanged = true;
		}
		SQL += ' WHERE MATRUONG = \'' + req.query.id + '\'';
		SQL = 'UPDATE TRUONG SET ' + SQL;
		if (isChanged) {
			async.waterfall([
				db.connect('C##admin', 'admin'),
				db.updateToTruong(SQL, bindData)
			], function (err) {
				if (err) console.log(err);
				res.location('/truong');
				res.redirect('/truong');
			})
		} else {
			res.location('/truong');
			res.redirect('/truong');
		}
	});
});
router.get('/nganh', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromNganh()
	], function (err, result) {
		var arr = [];

		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				idSchool: element.MATRUONG,
				id: element.MANGANH,
				name: element.TENNGANH,
				info: element.THONGTINDAURA,
				outline: element.DECUONGDAOTAO
			}
			arr.push(item)
		}
		res.render('nganh', {
			title: 'Danh Sách Trường',
			arr: arr
		})
	})
})
router.get('/nganh/new', ensureAuthenticated, function (req, res, next) {
	res.render('newNganh', {
		title: 'Tạo Mới Ngành',
		isNew: true
	})
});
router.post('/nganh/new', ensureAuthenticated, function (req, res, next) {
	var idSchool = req.body.idSchool;
	var id = req.body.id;
	var name = req.body.name;
	var info = req.body.info;
	var outline = req.body.outline;
	req.checkBody('idSchool', 'Mã Trường Bỏ Trống').notEmpty();
	req.checkBody('id', 'Mã Ngành Bỏ Trống').notEmpty();
	req.checkBody('name', 'Tên Ngành Bỏ Trống').notEmpty();
	req.checkBody('info', 'Thông Tin Ngành Bỏ Trống').notEmpty();
	req.checkBody('outline', 'Đề Cương Đào Tạo Bỏ Trống').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render('newNganh', {
			title: 'Tạo Mới Ngành',
			user: req.user,
			errors: errors,
			isNew: true,
			arr: {
				idSchool: idSchool,
				id: id,
				name: name,
				info: info,
				outline: outline
			}
		});
	} else {
		async.waterfall([
			db.connect('C##admin', 'admin'),
			db.insertToNganh(idSchool, id, name, info, outline)
		], function (err) {
			if (err) console.log(err);
			res.location('/nganh');
			res.redirect('/nganh');

		})
	}
});

router.get('/nganh/delete', ensureAuthenticated, function (req, res, next) {
	var idSchool = req.query.idSchool;
	var id = req.query.id;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.deleteToNganh(idSchool, id)
	], function (err) {
		if (err) console.log(err);
		res.location('/nganh');
		res.redirect('/nganh');
	})
});
router.get('/nganh/update', ensureAuthenticated, function (req, res, next) {
	var idSchool = req.query.idSchool;
	var id = req.query.id;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromNganh(idSchool, id)
	], function (err, result) {
		var arr = {
			idSchool: result.rows[0].MATRUONG,
			id: result.rows[0].MANGANH,
			name: result.rows[0].TENNGANH,
			info: result.rows[0].THONGTINDAURA,
			outline: result.rows[0].DECUONGDAOTAO
		}
		res.render('newNganh', {
			title: 'Cập Nhật Ngành',
			arr: arr
		})
	});
});
router.post('/nganh/update', ensureAuthenticated, function (req, res, next) {
	var idSchool = req.query.idSchool;
	var id = req.query.id;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromNganh(idSchool, id)
	], function (err, result) {
		var SQL = "",
			bindData = [], isChanged = false;
		if (req.body.idSchool != result.rows[0].MATRUONG) {
			SQL += 'MATRUONG= :idSchool';
			bindData.push(req.body.idSchool);
			isChanged = true;
		}
		if (req.body.id != result.rows[0].MANGANH) {
			SQL += 'MANGANH= :id';
			bindData.push(req.body.id);
			isChanged = true;
		}
		if (req.body.name != result.rows[0].TENNGANH) {
			SQL += 'TENNGANH= :name';
			bindData.push(req.body.name);
			isChanged = true;
		}
		if (req.body.info != result.rows[0].THONGTINDAURA) {
			SQL += 'THONGTINDAURA= :info';
			bindData.push(req.body.info);
			isChanged = true;
		}
		if (req.body.outline != result.rows[0].DECUONGDAOTAO) {
			SQL += 'DECUONGDAOTAO= :outline';
			bindData.push(req.body.outline);
			isChanged = true;
		}
		SQL += ' WHERE MATRUONG = \'' + req.query.idSchool + '\' AND MANGANH= \'' + req.query.id + '\'';
		SQL = 'UPDATE NGANH SET ' + SQL;
		if (isChanged) {
			async.waterfall([
				db.connect('C##admin', 'admin'),
				db.updateToNganh(SQL, bindData)
			], function (err) {
				if (err) console.log(err);
				res.location('/nganh');
				res.redirect('/nganh');
			})
		} else {
			res.location('/nganh');
			res.redirect('/nganh');
		}
	});
});
router.get('/khoi', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromKhoi()
	], function (err, result) {
		var arr = [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				name: element.TENKHOI,
			}
			arr.push(item)
		}
		res.render('khoi', {
			title: 'Danh Sách Khối',
			arr: arr
		})
	})
})

router.get('/khoi/new', ensureAuthenticated, function (req, res, next) {
	res.render('newKhoi', {
		title: 'Tạo Mới Khối',
		isNew: true
	})
});
router.post('/khoi/new', ensureAuthenticated, function (req, res, next) {
	var name = req.body.name;
	req.checkBody('name', 'Tên Khối Bỏ Trống').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render('newKhoi', {
			title: 'Tạo Mới Khối',
			user: req.user,
			errors: errors,
			isNew: true,
			arr: {
				name: name,
			}
		});
	} else {
		async.waterfall([
			db.connect('C##admin', 'admin'),
			db.insertToKhoi(name)
		], function (err) {
			if (err) console.log(err);
			res.location('/khoi');
			res.redirect('/khoi');

		})
	}
});

router.get('/khoi/delete', ensureAuthenticated, function (req, res, next) {
	var name = req.query.name;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.deleteToKhoi(name)
	], function (err) {
		if (err) console.log(err);
		res.location('/khoi');
		res.redirect('/khoi');
	})
});
router.get('/khoi/update', ensureAuthenticated, function (req, res, next) {
	var name = req.query.name;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromKhoi(name)
	], function (err, result) {
		var arr = {
			name: result.rows[0].TENKHOI,
		}
		res.render('newKhoi', {
			title: 'Cập Nhật Khối',
			arr: arr
		})
	});
});
router.post('/khoi/update', ensureAuthenticated, function (req, res, next) {
	var name = req.query.name;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromKhoi(name)
	], function (err, result) {
		var SQL = "",
			bindData = [], isChanged = false;
		if (req.body.name != result.rows[0].TENKHOI) {
			SQL += 'TENKHOI= :name';
			bindData.push(req.body.name);
			isChanged = true;
		}
		SQL += ' WHERE TENKHOI = \'' + req.query.name + '\'';
		SQL = 'UPDATE KHOI SET ' + SQL;
		if (isChanged) {
			async.waterfall([
				db.connect('C##admin', 'admin'),
				db.updateToKhoi(SQL, bindData)
			], function (err) {
				if (err) console.log(err);
				res.location('/khoi');
				res.redirect('/khoi');
			})
		} else {
			res.location('/khoi');
			res.redirect('/khoi');
		}
	});
});

router.get('/khoi/detail', ensureAuthenticated, function (req, res, next) {
	var name = req.query.name;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getDetailKhoi(name)
	], function (err, result) {
		var arr = [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				name: element.TENKHOI,
				no: element.STT,
				subject: element.TENMON,
				duration: element.THOIGIANTHI,
				atStart: element.GIOBATDAU
			}
			arr.push(item)
		}
		res.render('detailKhoi', {
			title: 'Chi Tiết Khối Thi ' + name,
			arr: arr
		})
	})
})

router.get('/thisinh', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromThisinh()
	], function (err, result) {
		var arr = [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				id: element.ID,
				cmnd: element.CMND,
				name: element.HOTEN,
				address: element.DIACHITHISINH,
				domicile: element.QUEQUAN,
				phone: element.DIENTHOAI,
				idTHPT: element.MATRUONGTHPT
			}
			arr.push(item)
		}
		res.render('thisinh', {
			title: 'Danh Sách Thí Sinh',
			arr: arr
		})
	})
})

router.get('/thisinh/new', ensureAuthenticated, function (req, res, next) {
	res.render('newThisinh', {
		title: 'Tạo Mới Thí Sinh'
	})
})

router.post('/thisinh/new', ensureAuthenticated, function (req, res, next) {
	var id = req.body.id;
	var name = req.body.name;
	var cmnd = req.body.cmnd;
	var address = req.body.address;
	var domicile = req.body.domicile;
	var phone = req.body.phone;
	var idTHPT = req.body.idTHPT;
	req.checkBody('id', 'ID Bỏ Trống').notEmpty();
	req.checkBody('name', 'Tên Thí Sinh Bỏ Trống').notEmpty();
	req.checkBody('cmnd', 'CMND Bỏ Trống').notEmpty();
	req.checkBody('address', 'Địa Chỉ Thí Sinh Bỏ Trống').notEmpty();
	req.checkBody('domicile', 'Nguyên Quán Bỏ Trống').notEmpty();
	req.checkBody('phone', 'Điện Thoại Bỏ Trống').notEmpty();
	req.checkBody('idTHPT', 'Mã THPT Bỏ Trống').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render('newThisinh', {
			title: 'Tạo Mới Thí Sinh',
			user: req.user,
			errors: errors,
			arr: {
				id: id,
				name: name,
				cmnd: cmnd,
				address: address,
				domicile: domicile,
				phone: phone,
				idTHPT: idTHPT
			}
		});
	} else {
		async.waterfall([
			db.connect('C##admin', 'admin'),
			db.insertToNhansu(id, name, cmnd)
		], function (err) {
			if (err) {
				console.log(err);
				res.location('/thisinh');
				res.redirect('/thisinh');
			}
			else {
				async.waterfall([
					db.connect('C##admin', 'admin'),
					db.insertToThisinh(id, address, domicile, phone, idTHPT)
				], function (err) {
					if (err) console.log(err);
					res.location('/thisinh');
					res.redirect('/thisinh');
				})
			}
		})
	}
});

router.get('/hsthisinh', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromHsthisinh()
	], function (err, result) {
		var arr = [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				id: element.ID,
				idSchool: element.MATRUONG,
				idBranch: element.MANGANH,
				nameUnit: element.TENKHOI,
				idNum: element.SBD,
				total: element.TONGDIEM,
				idAddress: element.MADIADIEM,
				numRoom: element.SOPHONG,
				idSchool2: element.MATRUONG2,
				idBranch2: element.MANGANH2,
				aspiration: element.NV23
			}
			arr.push(item)
		}
		res.render('hsthisinh', {
			title: 'Danh Sách Hồ Sơ Thí Sinh',
			arr: arr
		})
	})
})

router.get('/hsthisinh/new', ensureAuthenticated, function (req, res, next) {
	res.render('newHsthisinh', {
		title: 'Tạo Mới Hồ Sơ Thí Sinh'
	})
})

router.post('/hsthisinh/new', ensureAuthenticated, function (req, res, next) {
	var id = req.body.id;
	var idSchool = req.body.idSchool;
	var idBranch = req.body.idBranch;
	var nameUnit = req.body.nameUnit;
	var idNum = req.body.idNum;
	var total = req.body.total;
	var idAddress = req.body.idAddress;
	var numRoom = req.body.numRoom;
	var idSchool2 = req.body.idSchool2;
	var idBranch2 = req.body.idBranch2;
	var aspiration = req.body.aspiration;
	req.checkBody('id', 'ID Bỏ Trống').notEmpty();
	req.checkBody('idSchool', 'Mã Trường Bỏ Trống').notEmpty();
	req.checkBody('idBranch', 'Mã Ngành Bỏ Trống').notEmpty();
	req.checkBody('nameUnit', 'Tên Khối Bỏ Trống').notEmpty();
	req.checkBody('idNum', 'Số Báo Danh Bỏ Trống').notEmpty();
	req.checkBody('total', 'Tổng Điểm Bỏ Trống').notEmpty();
	req.checkBody('idAddress', 'Mã Địa Điểm Bỏ Trống').notEmpty();
	req.checkBody('numRoom', 'Số Phòng Bỏ Trống').notEmpty();
	req.checkBody('idSchool2', 'Mã Trường 2 Bỏ Trống').notEmpty();
	req.checkBody('idBranch2', 'Mã Ngành 2 Bỏ Trống').notEmpty();
	req.checkBody('aspiration', 'Nguyện Vọng 2(3) Bỏ Trống').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render('newHsthisinh', {
			title: 'Tạo Mới Hồ Sơ Thí Sinh',
			user: req.user,
			errors: errors,
			arr: {
				id: id,
				idSchool: idSchool,
				idBranch: idBranch,
				nameUnit: nameUnit,
				idNum: idNum,
				total: total,
				idAddress: idAddress,
				numRoom: numRoom,
				idSchool2: idSchool2,
				idBranch2: idBranch2,
				aspiration: aspiration
			}
		});
	} else {
		async.waterfall([
			db.connect('C##admin', 'admin'),
			db.insertToHsThiSinh(id, idSchool, idBranch, nameUnit, idNum, total, idAddress, numRoom)
		], function (err) {
			if (err) {
				console.log(err);
				res.location('/hsthisinh');
				res.redirect('/hsthisinh');
			}
			else {
				async.waterfall([
					db.connect('C##admin', 'admin'),
					db.insertToThisinhNguyenVong(id, idSchool, idBranch, nameUnit, idNum, idSchool2, idBranch2, aspiration)
				], function (err) {
					if (err) console.log(err);
					res.location('/hsthisinh');
					res.redirect('/hsthisinh');
				})
			}
		})
	}
});

router.get('/tttuyensinh', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromTttuyensinh()
	], function (err, result) {
		var arr = [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				idSchool: element.MATRUONG,
				id: element.MANGANH,
				nameUnit: element.TENKHOI,
				ratio: element.TYLECHOI,
				srocelater: element.DIEMCHUANNAMNGOAI,
				target: element.CHITIEU,
				aspiration1: element.DIEMNV1,
				aspiration2: element.DIEMNV2,
				aspiration3: element.DIEMNV3
			}
			arr.push(item)
		}
		res.render('tttuyensinh', {
			title: 'Thông Tin Tuyển Sinh',
			arr: arr
		})
	})
})

router.get('/tttuyensinh/update', ensureAuthenticated, function (req, res, next) {
	var idSchool = req.query.idSchool;
	var id = req.query.id;
	var nameUnit = req.query.nameUnit;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromTttuyensinh(idSchool, id, nameUnit)
	], function (err, result) {
		var arr = {
			idSchool: result.rows[0].MATRUONG,
			id: result.rows[0].MANGANH,
			nameUnit: result.rows[0].TENKHOI,
			ratio: result.rows[0].TYLECHOI,
			srocelater: result.rows[0].DIEMCHUANNAMNGOAI,
			target: result.rows[0].CHITIEU,
			aspiration1: result.rows[0].DIEMNV1,
			aspiration2: result.rows[0].DIEMNV2,
			aspiration3: result.rows[0].DIEMNV3
		}
		res.render('updateTttuyensinh', {
			title: 'Cập Nhật Thông Tin Tuyển Sinh',
			arr: arr
		})
	});
})

router.post('/tttuyensinh/update', ensureAuthenticated, function (req, res, next) {
	var idSchool = req.body.idSchool;
	var id = req.body.id;
	var nameUnit = req.body.nameUnit;
	var aspiration1 = req.body.aspiration1;
	var aspiration2 = req.body.aspiration2;
	var aspiration3 = req.body.aspiration3;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromTttuyensinh(idSchool, id, nameUnit)
	], function (err, result) {
		var SQL = "",
			bindData = [], isChanged = false;
		if (req.body.aspiration1 != result.rows[0].DIEMNV1) {
			SQL += 'DIEMNV1= :aspiration1';
			bindData.push(req.body.aspiration1);
			isChanged = true;
		}
		if (req.body.aspiration2 != result.rows[0].DIEMNV2) {
			SQL += 'DIEMNV2= :aspiration2';
			bindData.push(req.body.aspiration2);
			isChanged = true;
		}
		if (req.body.aspiration3 != result.rows[0].DIEMNV3) {
			SQL += 'DIEMNV3= :aspiration3';
			bindData.push(req.body.aspiration3);
			isChanged = true;
		}
		SQL += ' WHERE MATRUONG = \'' + req.body.idSchool + '\' AND MANGANH= \'' + req.body.id + '\' AND TENKHOI=\'' + req.body.nameUnit + '\'';
		SQL = 'UPDATE THONGTINTUYENSINH SET ' + SQL;
		if (isChanged) {
			async.waterfall([
				db.connect('C##admin', 'admin'),
				db.updateToTttuyensinh(SQL, bindData)
			], function (err) {
				if (err) console.log(err);
				res.location('/tttuyensinh');
				res.redirect('/tttuyensinh');
			})
		} else {
			res.location('/tttuyensinh');
			res.redirect('/tttuyensinh');
		}
	});
})

router.get('/ketquathi', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromKetquathi()
	], function (err, result) {
		var arr = [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			var item = {
				id: element.ID,
				idSchool: element.MATRUONG,
				idBranch: element.MANGANH,
				nameUnit: element.TENKHOI,
				idNum: element.SBD,
				stt: element.STT,
				sroce: element.DIEMTHI,
				revisionSroce: element.DIEMPHUCTRA
			}
			arr.push(item)
		}
		res.render('dsketquathi', {
			title: 'Danh Sách Kết Quả Thi',
			arr: arr
		})
	})
})

router.get('/ketquathi/update', ensureAuthenticated, function (req, res, next) {
	var id = req.query.id;
	var idSchool = req.query.idSchool;
	var idBranch = req.query.idBranch;
	var nameUnit = req.query.nameUnit;
	var idNum = req.query.idNum;
	var stt = req.query.stt;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromKetquathi(id, idSchool, idBranch, nameUnit, idNum, stt)
	], function (err, result) {

		var arr = {
			id: result.rows[0].ID,
			idSchool: result.rows[0].MATRUONG,
			idBranch: result.rows[0].MANGANH,
			nameUnit: result.rows[0].TENKHOI,
			idNum: result.rows[0].SBD,
			stt: result.rows[0].STT,
			sroce: result.rows[0].DIEMTHI,
			revisionSroce: result.rows[0].DIEMPHUCTRA
		}
		console.log(arr);
		res.render('updateDsketquathi', {
			title: 'Cập Nhật Danh Sách Kết Quả Thi',
			arr: arr
		})
	});
})

router.post('/ketquathi/update', ensureAuthenticated, function (req, res, next) {
	var id = req.body.id;
	var idSchool = req.body.idSchool;
	var idBranch = req.body.idBranch;
	var nameUnit = req.body.nameUnit;
	var idNum = req.body.idNum;
	var stt = req.body.stt;
	var sroce = req.body.sroce;
	var revisionSroce = req.body.revisionSroce;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromKetquathi(id, idSchool, idBranch, nameUnit, idNum, stt)
	], function (err, result) {
		var SQL = "",
			bindData = [], isChanged = false;
		if (req.body.sroce != result.rows[0].DIEMTHI) {
			SQL += 'DIEMTHI= :sroce';
			bindData.push(req.body.sroce);
			isChanged = true;
		}
		if (req.body.revisionSroce != result.rows[0].DIEMPHUCTRA) {
			SQL += 'DIEMPHUCTRA= :revisionSroce';
			bindData.push(req.body.revisionSroce);
			isChanged = true;
		}
		SQL += ' WHERE ID=\'' + id + '\' AND MATRUONG=\'' + idSchool + '\' AND MANGANH=\'' + idBranch + '\' AND TENKHOI=\'' + nameUnit + '\' AND SBD=\'' + idNum + '\' AND STT =\'' + stt + '\'';
		SQL = 'UPDATE KETQUATHI SET ' + SQL;
		console.log(SQL);
		if (isChanged) {
			async.waterfall([
				db.connect('C##admin', 'admin'),
				db.updateToKetquathi(SQL, bindData)
			], function (err) {
				if (err) console.log(err);
				res.location('/ketquathi');
				res.redirect('/ketquathi');
			})
		} else {
			res.location('/ketquathi');
			res.redirect('/ketquathi');
		}
	});
})

router.get('/timkiem', ensureAuthenticated, function (req, res, next) {
	res.render('timkiemthisinh', {
		title: 'Tìm Kiếm Thí Sinh'
	})
})

router.post('/timkiem', ensureAuthenticated, function (req, res, next) {
	var name = req.body.name;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getThiSinhFromNhanSu(name)
	], function (err, result) {
		var ts = {
			id: result.rows[0].ID,
			name: result.rows[0].HOTEN
		}
		async.waterfall([
			db.connect('C##admin', 'admin'),
			db.getTongDiemFromHSThiSinh(ts.id)
		], function (err, result) {
			var element = result.rows[0];
			var item = {
				id: element.ID,
				idSchool: element.MATRUONG,
				idBranch: element.MANGANH,
				nameUnit: element.TENKHOI,
				idNum: element.SBD,
				total: element.TONGDIEM
			}
			async.waterfall([
				db.connect('C##admin', 'admin'),
				db.getDiemFromKetquathi(item.id, item.idSchool, item.idBranch, item.nameUnit, item.idNum)
			], function (err, results) {
				var arr = [];
				for (var i = 0; i < results.rows.length; i++) {
					var e = results.rows[i];
					arr.push({
						id: e.ID,
						idSchool: e.MATRUONG,
						idBranch: e.MANGANH,
						nameUnit: e.TENKHOI,
						idNum: e.SBD,
						total: item.total,
						stt: e.STT,
						sroce: e.DIEMTHI,
						revisionSroce: e.DIEMPHUCTRA
					})
				}
				res.location('/ketquathi');
				res.render('timkiemthisinh', {
					title: 'Tìm Kiếm Thí Sinh',
					name: name,
					user:req.user,
					arr: arr
				})
			})
		})
	})
})

router.get('/dsthido', ensureAuthenticated, function (req, res, next) {
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getItemDataFromTruong()
	], function (err, result) {
		var schools = []
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			schools.push({
				id: element.MATRUONG,
				name: element.TENTRUONG
			})
		}
		res.location('/dsthido');
		res.render('danhsachdau', {
			title: 'Danh Sách Thí Sinh Đậu Đại Học',
			schools:schools
		})
	})
})

router.post('/dsthido', ensureAuthenticated, function (req, res, next) {
	var id = req.body.id;
	async.waterfall([
		db.connect('C##admin', 'admin'),
		db.getThisinhdau(id)
	],function (err,result) {
		var arr= [];
		for (var index = 0; index < result.rows.length; index++) {
			var element = result.rows[index];
			if(element.TONGDIEM>=element.DIEMNV1)
				arr.push({
					id:element.ID,
					name:element.HOTEN,
					total:element.TONGDIEM,
					sroce:element.DIEMNV1
				})
		}
		arr.sort(compare);
		res.location('/dsthido');
		res.render('danhsachdau', {
			title: 'Danh Sách Thí Sinh Đậu Đại Học',
			user:req.user,
			arr:arr
		})
	})
})

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	};
	res.redirect('/users/login');
}

function compare(a,b) {
  if (a.total < b.total)
    return -1;
  else if (a.total > b.total)
    return 1;
  else 
    return 0;
}
module.exports = router;