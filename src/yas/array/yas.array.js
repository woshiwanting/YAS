/**
 * @fileOverview yas处理数组常用方法，兼容ECMAScript 5+版本
 * 参考underscore.js && Tangram.js && kissy.js
 * @author wt
 * @version 1.0
 * @since 2012-11-05
 */
var yas = yas || {};

yas.array = function() {
	//保留基本对象的原型变量
	this.ArrayProto 		= Array.prototype;
	this.ObjProto 			= Object.prototype;
	this.FuncProto 			= Function.prototype;
	/**
	 * 用来判断对象类型
	 */
	this.toString			= this.ObjProto.toString;
	/**
	 * 用来判断属性是否是原有对象
	 */
	this.hasOwnProperty 	= this.ObjProto.hasOwnProperty;
	/**
	 * 终止循环条件
	 */
	this.breaker 			= {};
	
	// 定义ECMAScript 5+ 中的方法
	/**
	 * 遍历的方法
	 */
	this.nativeForEach 		= this.ArrayProto.forEach;
	/**
	 * 数组转换
	 */
	this.nativeMap  		= this.ArrayProto.map;
	
	this.nativeFilter		= this.ArrayProto.filter
	/**
	 * 指定元素索引位置
	 */
	this.nativeIndexOf  	= this.ArrayProto.nativeIndexOf;
	/**
	 * 指定元素索引位置，从后往前查
	 */
	this.nativeLastIndexOf 	= this.ArrayProto.lastIndexOf;
	/**
	 * 是否是数组
	 */
	this.nativeIsArray   	= Array.isArray;
};

yas.array.prototype = {
	/**
	 * 遍历数组或对象中的所有元素
	 * @param {Array || Object} source 需要遍历的数组或对象
	 * @param {Function} iterator 遍历执行方法
	 * @param {Object} context 上下文环境
	 */
	each : function(source, iterator, context) {
		if(this.isEmpty(source) || (typeof iterator !== 'function')) return;
		if(this.nativeForEach && this.nativeForEach === source.forEach) {
			source.forEach(iterator, context);		
		} else if(source.length === +source.length) {
			/**
			 * tip: 使用逆序输出方式，ie7，8和ie9+显示的结果不一致，
			 * ie9没有逆序输出(按照forEach方式),ECMAScript+
			 * 建议不要采用逆序方式，以防止结果不一致！！
			 * for(var l = source.length; l--;) {
			 * 	  
			 * }
			 */
			for(var i = 0, l = source.length; i < l; i++) {
				if(iterator.call(context, source[i], i, source) === this.breaker) return;
			}
		} else {
			//针对对象
			for(var key in source) {
				//只处理原始的属性,不处理prototype的属性
				if(this.hasOwnProperty.call(source, key)) {
					if(iterator.call(context, source[key], key, source) === this.breaker) return;
				}
			}
		}
	},
	/**
	 * 遍历数组或对象中的所有元素
	 * @param {Array || Object} source 需要遍历的数组或对象
	 * @param {Function} iterator 转换方法
	 * @param {Object} context 上下文环境
	 * @return {Array} 转化后的新数组
	 */
	map : function(source, iterator, context) {
		var results = [];
		if(this.isEmpty(source) || (typeof iterator !== 'function')) return false;
		if(this.nativeMap && this.nativeMap === source.map) {
			return source.map(iterator, context);		
		} else {
			this.each(source, function(value, index, list) {
				results[results.length] = iterator.call(context, value, index, list);
			});
		}
		return results;
	},
	/**
	 * 返回数组或对象中的最大值
	 * @param {Array || Object} source 基础对象
	 * @param {Function} iterator 执行方法
	 * @param {Object} context	上下文环境
	 */
	max : function(source, iterator, context) {
		if(!iterator && this.isArray(source)) return Math.max.apply(Math, source);
		if(!iterator && this.isEmpty(source)) return -Infinity;
		var result = { computed : -Infinity };
		this.each(source, function(value, index, list) {
			var computed = iterator ? iterator(contex, value, index, list) : value;
			computed >= result.computed && (result = { value : value, computed : computed });
		});
		return result.value;
	},
	/**
	 * 返回数组或对象中的最小值
	 * @param {Array || Object} source 基础对象
	 * @param {Function} iterator 执行方法
	 * @param {Object} context	上下文环境
	 */
	min : function(source, iterator, context) {
		if(!iterator && this.isArray(source)) return Math.min.apply(Math, source);
		if(!iterator && this.isEmpty(source)) return Infinity;
		var result = { computed : Infinity };
		this.each(source, function(value, index, list) {
			var computed = iterator ? iterator(contex, value, index, list) : value;
			computed < result.computed && (result = { value : value, computed : computed });
		});
		return result.value;
	},
	/**
	 * 差位补0,保留符号
	 * @param {Number} num 待补0数字
	 * @param {Number} n 长度
	 * @return {String} 补0的字符串
	 */
	pad : function(num, n) {
		var len = num.toString().length, pre=[], negative = (num < 0 ? '-' : '');
		if(len >= n) return num.toString();
		return negative + Array(n - len + 1).join(0) + Math.abs(num);
	},
	/**
	 * 清空数组
	 * @param {Array} source 原数组
	 * @return {Array} 空数组
	 */
	empty : function(source) {
		source.length = 0;
		return source;
	},
	/**
	 * 返回指定元素的索引位置，找不到则返回-1
	 * @param {Array} source 目标数组
	 * @param {Objec} item 指定元素
	 * @return {Number} 索引位置
	 */
	indexOf : function(source, item) {
		if(this.nativeIndexOf && this.nativeIndexOf == source.indexOf) {
			return source.indexOf(item);
		} else {
			for(var i = 0, l = source.length; i < l; i++) {
				if(source[i] == item) {
					return i;
				}
			}
		}
		return -1;
	},
	/**
	 * 从后往前查找指定元素的索引位置,找不到则返回-1
	 * @param {Array} source 目标数组
	 * @param {Objec} item 指定元素
	 * @return {Number} 索引位置
	 */
	lastIndexOf : function(source, item) {
		if(this.nativeLastIndexOf && this.nativeLastIndexOf == source.lastIndexOf) {
			return source.lastIndexOf(item);
		} else {
			for(var l = source.length; l--;) {
				if(source[l] == item) {
					return l;
				}
			}
		}
		return -1;
	},
	/**
	 * 移除匹配数据项（可移除多个）
	 * @param {Array} source 原始数组对象
	 * @param {Object} item 要移除的数据匹配项
	 * @return {Array} 操作后的数组
	 */
	remove : function(source, item) {
		var n = source.length;
		while(n--) {
			var index = this.indexOf(source, item);
			if(index != -1) {
				source.splice(index, 1);
			}
		}
		return source;
	},
	/**
	 * 删除指定索引的元素
	 * @param {Array} source 原始数组对象
	 * @param {Number} index 指定的索引
	 * @return {Array} 操作后的数组
	 */
	removeByIndex : function(source, index) {
		source.splice(index, 1);
		return source;
	},
	/**
	 * 过滤数组
	 * @param {Array} source 待过滤的数组
	 * @param {Function} iterator 过滤的方式
	 * @param {Object} context 上下文环境
	 * @return {Array} 过滤后的数组
	 */
	filter : function(source, iterator, context) {
		var results = [];
		if(this.isEmpty(source) || (typeof iterator !== 'function')) return false;
		if(this.nativeFilter && this.nativeFilter === source.filter) {
			return source.filter(iterator, context);		
		} else {
			this.each(source, function(value, index, list) {
				if(iterator.call(context, value, index, list)) {
					results[results.length] = value;
				}
			});
		}
		return results;
	},
	/**
	 * 获取复合条件的第一个元素，没有符合条件的则返回undefined
	 * @param {Array} source 目标元素
	 * @param {Function} iterator 条件
	 * @param {Object} context 上下文环境
	 * @return {Object} 复合条件的元素
	 */
	find : function(source, iterator, context) {
		return this.filter(source, iterator, context)[0];
	},
	/**
	 * 判断指定的元素是否在目标数组中
	 * @param {Array} source 目标数组
	 * @param {Object} item 指定元素
	 * @return {Boolean} 是否在目标数组中
	 */
	contains : function(source, item) {
		return (this.indexOf(source, item) != -1);
	},
	/**
	 * 去掉数组中的重复项
	 * @param {Array} source 原始数组
	 * @param {Function} compareFn 比较数组函数
	 * @return {Array} 操作后的数组
	 */
	unique : function(source, compareFn) {
		var len = source.length,
			result = source.slice(0);
			
		if(typeof compareFn != 'function') {
			compareFn = function(item1, item2) {
				return item1 === item2;
			};
		}
		//采用这种方式比len--少一次遍历
		while(--len > 0) {
			var data = result[len],
				i = len;
			//不能采用--i > 0方式，否则会造成拿不到第一个元素
			while(i--) {
				//从数组的倒数第二位开始比较
				if(compareFn(result[i], data)) {
					result.splice(len, 1);
					break;
				}
			}
		}
		return result;
	},
	/**
	 * 返回指定区间的数组，不指定index则默认除去第一个元素
	 * @param {Array} source 目标数组
	 * @param {Number} index 开始的下标
	 * @return {Array} 新数组
	 */
	rest : function(source, index) {
		index = index ? index : 1;
		return source.slice(index);
	},
	/**
	 * 判断数组中所有的元素是否都满足给定条件
	 * @param {Array} source 目标数组
	 * @param {Function} iterator 条件函数
	 * @return {Boolean} 是否满足
	 */
	every : function(source, iterator) {
		if(this.isEmpty(source) || (typeof iterator !== 'function')) return false;
		for(var l = source.length; l--;) {
			if(!iterator.call(source, source[l], l, source)) return false;
		}
		return true;
	},
	/**
	 * 判断数组中是否有元素满足给定条件
	 * @param {Array} source 目标数组
	 * @param {Function} iterator 条件函数
	 * @return {Boolean} 是否满足
	 */
	some : function(source, iterator) {
		if(this.isEmpty(source) || (typeof iterator !== 'function')) return false;
		for(var l = source.length; l--;) {
			//iterator调用的参数中是从call的第二个参数开始的，call的第一个参数用于context
			if(iterator.call(source, source[l], l, source)) return true;
		}
		//return !== return false;一个是undefined,一个是 false
		return false;
	},
	/**
	 * 按照指定的方法合并数组
	 * @param {Array} source 目标数组
	 * @param {Function} iterator 条件函数
	 * @param {Object} memo 初始值
	 * @return {Ojbect} 合并后的对象
	 */
	reduce : function(source, iterator, memo) {
		if(this.isEmpty(source)  || (typeof iterator !== 'function')) return false;
		var i = 0, memo = memo || (i = 1, source[0]);
		for(l = source.length; i < l; i++) {
			memo = iterator.call(source, memo, source[i], i, source);
		}
		return memo;
	},
	/**
	 * 判断对象是否是数组
	 * @param {Object} source 待判断对象
	 * @return {Boolean} 是否是数组
	 */
	isArray : this.nativeIsArray || function(source) {
		return this.toString.call(source) === '[object Array]';
	},
	/**
	 * 判断对象是否是字符串
	 * @param {Object} source 待判断对象
	 * @return {Boolean} 是否是字符串
	 */
	isString : function(source) {
		return this.toString().call(source) === '[object String]';
	},
	/**
	 * 判断对象是否为空
	 * @param {Object} source 待判断对象
	 * @return {Boolean} 是否为空
	 */
	isEmpty : function(source) {
		if(this.isArray(source) || this.isString(source)) {
			return source.length == 0;
		}
		for(var key in obj) {
			if(this.hasOwnProperty.call(obj, key)) {
				return false;
			}
		}
		return true;
	}
};