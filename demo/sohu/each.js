/**
 * 实现一个遍历数组或对象里所有成员的迭代器。
 * @param {} obj
 * @param {} fn
 */
var each = function(obj, fn){
        //+++++++++++答题区域+++++++++++
		if(obj.length === +obj.length) {
			for(var i = 0, l = obj.length; i < l; i++) {
				if(fn.call(obj[i], i+1) === false) return;
			}
		} else {
			for(var k in obj) {
				if(obj.hasOwnProperty(k)) {
					if(fn.call(obj[k], obj[k], k)) continue;
				}
			}
		}
        //+++++++++++答题结束+++++++++++
};

try{
        
        var data1 = [4,5,6,7,8,9,10,11,12];
        var data2 = {
                "a": 4,
                "b": 5,
                "c": 6
        };
        
        console.group(data1);
        
        each(data1, function(o){
                if( 6 == this )
                        return true;
                else if( 8 == this )
                        return false;
                console.log(o + ": \"" + this + "\"");
        });
        
        console.groupEnd();

        /*------[执行结果]------

        1: "4"
        2: "5"
        4: "7"

        ------------------*/
        
        console.group(data2);
        
        each(data2, function(v, n){
                if( 5 == this )
                        return true;
                console.log(n + ": \"" + v + "\"");
        });
        
        console.groupEnd();

        /*------[执行结果]------

        a: "4"
        c: "6"

        ------------------*/
        
}catch(e){
        console.error("执行出错，错误信息: " + e);
}