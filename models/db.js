var oracledb = require('oracledb');

function OracleDB() {
}

OracleDB.prototype.connect = function (username, password) {
    return function (cb) {

        oracledb.getConnection(
            {
                user: username,
                password: password,
                connectString: 'localhost/orcl'
            },
            cb);
    }
}

OracleDB.prototype.getItemDataFromTruong = function (matruong) {
    return function (conn, cb) {
        var SQL = '';
        if (matruong === undefined)
            SQL = "SELECT * FROM TRUONG";
        else
            SQL = "SELECT * FROM TRUONG WHERE MATRUONG='" + matruong + "'";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}

OracleDB.prototype.insertToTruong = function (id, name, address, target) {
    return function (conn, cb) {
        conn.execute(
            "INSERT INTO TRUONG VALUES (:MATRUONG, :TENTRUONG, :DIACHITRUONG, :MUCTIEU)",
            [id, name, address, target],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.updateToTruong = function (SQL, bindData) {
    return function (conn, cb) {
        conn.execute(
            SQL,
            bindData,  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.deleteToTruong = function (id) {
    return function (conn, cb) {
        conn.execute(
            "DELETE FROM TRUONG WHERE MATRUONG= :ID",
            [id],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}


OracleDB.prototype.getItemDataFromNganh = function (matruong, manganh) {
    return function (conn, cb) {
        var SQL = '';
        if (matruong === undefined || manganh === undefined)
            SQL = "SELECT * FROM NGANH";
        else
            SQL = "SELECT * FROM NGANH WHERE MATRUONG='" + matruong + "' AND MANGANH='" + manganh + "'";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}

OracleDB.prototype.insertToNganh = function (idSchool, id, name, info, outline) {
    return function (conn, cb) {
        conn.execute(
            "INSERT INTO NGANH VALUES (:MATRUONG, :MANGANH, :TENNGANH, :THONGTINDAURA, :DECUONGDAOTA0)",
            [idSchool, id, name, info, outline],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.updateToNganh = function (SQL, bindData) {
    return function (conn, cb) {
        conn.execute(
            SQL,
            bindData,  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.deleteToNganh = function (idSchool, id) {
    return function (conn, cb) {
        conn.execute(
            "DELETE FROM NGANH WHERE MATRUONG= :IDSCHOOL AND MANGANH = :ID",
            [idSchool, id],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.getItemDataFromKhoi = function (tenkhoi) {
    return function (conn, cb) {
        var SQL = '';
        if (tenkhoi === undefined)
            SQL = "SELECT * FROM KHOI";
        else
            SQL = "SELECT * FROM KHOI WHERE TENKHOI='" + tenkhoi + "'";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}

OracleDB.prototype.insertToKhoi = function (tenkhoi) {
    return function (conn, cb) {
        conn.execute(
            "INSERT INTO KHOI VALUES (:TENKHOI)",
            [tenkhoi],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.updateToKhoi = function (SQL, bindData) {
    return function (conn, cb) {
        conn.execute(
            SQL,
            bindData,  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.deleteToKhoi = function (tenkhoi) {
    return function (conn, cb) {
        conn.execute(
            "DELETE FROM KHOI WHERE TENKHOI= :TENKHOI",
            [tenkhoi],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.getDetailKhoi = function (tenkhoi) {
    return function (conn, cb) {
        var SQL = "SELECT * FROM MONTHI WHERE TENKHOI='" + tenkhoi + "'";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}

OracleDB.prototype.getItemDataFromThisinh = function () {
    return function (conn, cb) {
        var SQL = "SELECT H.ID, H.CMND, H.HOTEN,NV.DIACHITHISINH, NV.QUEQUAN, NV.DIENTHOAI, NV.MATRUONGTHPT FROM NHANSU H, THISINH NV WHERE  H.ID = NV.ID";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}

OracleDB.prototype.insertToNhansu = function (id, name, cmnd) {
    return function (conn, cb) {
        conn.execute(
            "INSERT INTO NHANSU VALUES (:ID, :CMND, :HOTEN )",
            [id, cmnd, name],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.insertToThisinh = function (id, address, domicile, phone, idTHPT) {
    return function (conn, cb) {
        conn.execute(
            "INSERT INTO THISINH VALUES (:ID, :DIACHITHISINH, :QUEQUAN, :DIENTHOAI, :MATRUONGTHPT )",
            [id, address, domicile, phone, idTHPT],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.getItemDataFromHsthisinh = function () {
    return function (conn, cb) {
        var SQL = "SELECT H.ID, H.MATRUONG, H.MANGANH, H.TENKHOI, H.SBD, H.TONGDIEM, H.MADIADIEM, H.SOPHONG, NV.MATRUONG2, NV.MANGANH2,NV.NV23 FROM HSTHISINHTHI H, THISINHNGUYENVONG NV WHERE  H.ID = NV.ID AND H.MATRUONG = NV.MATRUONG AND H.MANGANH = NV.MANGANH AND H.TENKHOI = NV.TENKHOI AND H.SBD = NV.SBD";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}

OracleDB.prototype.insertToHsThiSinh = function (id, idSchool, idBranch, nameUnit, idNum, total, idAddress, numRoom) {
    return function (conn, cb) {
        conn.execute(
            "INSERT INTO HSTHISINHTHI VALUES (:ID, :MATRUONG, :MANGANH,:TENKHOI, :SBD, :TONGDIEM, :MADIADIEM, :SOPHONG)",
            [id, idSchool, idBranch, nameUnit, idNum, total, idAddress, numRoom],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.insertToThisinhNguyenVong = function (id, idSchool, idBranch, nameUnit, idNum, idSchool2, idBranch2, aspiration) {
    return function (conn, cb) {
        conn.execute(
            "INSERT INTO THISINHNGUYENVONG VALUES (:ID, :MATRUONG, :MANGANH,:TENKHOI, :SBD,:MATRUONG2, :MANGANH2, :NV23 )",
            [id, idSchool, idBranch, nameUnit, idNum, idSchool2, idBranch2, aspiration],  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.getItemDataFromTttuyensinh = function (idSchool, id, nameUnit) {
    return function (conn, cb) {
        if (id == undefined || idSchool == undefined || nameUnit == undefined)
            var SQL = "SELECT * FROM THONGTINTUYENSINH";
        else
            var SQL = "SELECT * FROM THONGTINTUYENSINH WHERE MATRUONG='" + idSchool + "' AND MANGANH='" + id + "' AND TENKHOI='" + nameUnit + "'";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}


OracleDB.prototype.updateToTttuyensinh = function (SQL, bindData) {
    return function (conn, cb) {
        conn.execute(
            SQL,
            bindData,  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}


OracleDB.prototype.getItemDataFromKetquathi = function (id, idSchool, idBranch, nameUnit, idNum, stt) {
    return function (conn, cb) {
        if (id == undefined || idSchool == undefined || nameUnit == undefined || idBranch == undefined || idNum == undefined || stt == undefined)
            var SQL = "SELECT * FROM KETQUATHI";
        else
            var SQL = "SELECT * FROM KETQUATHI WHERE ID='" + id + "' AND MATRUONG='" + idSchool + "' AND MANGANH='" + idBranch + "' AND TENKHOI='" + nameUnit + "' AND SBD='" + idNum + "' AND STT ='" + stt + "'";
        conn.execute(
            SQL,
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            }
        );
    };
}


OracleDB.prototype.updateToKetquathi = function (SQL, bindData) {
    return function (conn, cb) {
        conn.execute(
            SQL,
            bindData,  // Bind values
            { autoCommit: true },  // Override the default non-autocommit behavior
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, conn);
                }
            });
    }
}

OracleDB.prototype.getThiSinhFromNhanSu = function (name) {
    return function (conn, cb) {
        conn.execute(
            "SELECT ID,HOTEN FROM NHANSU WHERE HOTEN='" + name + "'",
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            });
    }
}

OracleDB.prototype.getTongDiemFromHSThiSinh = function (id) {
    return function (conn, cb) {
        conn.execute(
            "SELECT ID,MATRUONG,MANGANH,TENKHOI,SBD,TONGDIEM FROM HSTHISINHTHI WHERE ID='" + id + "'",
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            });
    }
}

OracleDB.prototype.getDiemFromKetquathi = function (id, idSchool, idBranch, nameUnit, idNum) {
    return function (conn, cb) {
        conn.execute(
            "SELECT * FROM KETQUATHI WHERE ID='" + id + "' AND MATRUONG='" + idSchool + "' AND MANGANH='" + idBranch + "' AND TENKHOI='" + nameUnit + "' AND SBD='" + idNum + "'",
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            });
    }
}

OracleDB.prototype.getThisinhdau = function (id) {
    return function (conn, cb) {
        conn.execute(
            "SELECT H.ID,N.HOTEN,H.TONGDIEM,T.DIEMNV1  FROM HSTHISINHTHI H, THONGTINTUYENSINH T, NHANSU N WHERE H.MATRUONG='"+id+"'AND N.ID=H.ID AND H.MATRUONG=T.MATRUONG AND H.MANGANH=T.MANGANH AND H.TENKHOI=T.TENKHOI",
            {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result);
                }
            });
    }
}
module.exports = OracleDB;