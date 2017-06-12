
// test code
exports.example = function(options, callback) {
	__oracleDB.execute("SELECT * FROM BRANCH", [], function(err, result) {  
	    if (err) {  
	       console.error(err.message);  
	       // doRelease(connection);  
	       return;  
	    }  
	    callback(result.rows);
	    // doRelease(connection);  
	});
}
