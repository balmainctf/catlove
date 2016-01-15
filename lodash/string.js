/**
 * lodash string
 * Created by soraping on 15/11/9.
 */

var _ = require('lodash');


/****** _.camelCase([string='']) 字符串驼峰格式化 *******/

//console.log(_.camelCase('Foo Bar'));     // fooBar
//
//console.log(_.camelCase('--foo-bar'));   // fooBar
//
//console.log(_.camelCase('__foo_bar__')); // fooBar


/****** _.escapeRegExp([string='']) 以横线分割字符 *******/
//
//console.log(_.kebabCase('Foo Bar'));        // foo-bar
//
//console.log(_.kebabCase('fooBar'));         // foo-bar
//
//console.log(_.kebabCase('__foo_bar__'));    // foo-bar


/****** _.snakeCase([string='']) 以下划线分割字符串 *******/

//console.log(_.snakeCase('Foo Bar'));        // foo_bar
//
//console.log(_.snakeCase('fooBar'));         // foo_bar
//
//console.log(_.snakeCase('__foo_bar__'));    // foo_bar



/****** _.startCase([string='']) *******/

//console.log(_.startCase('--foo-bar'));        // Foo Bar
//
//console.log(_.startCase('fooBar'));         // Foo Bar
//
//console.log(_.startCase('__foo_bar__'));    // Foo Bar




/****** _.camelCase([string='']) 首字母大写 *******/
//console.log(_.capitalize('fred'));      // Fred
//
//console.log(_.capitalize('foobar'));      // Foobar




/****** _.startsWith([string=''], [target], [position=0]) *******/

//console.log(_.startsWith('abcd', 'a'));      // true
//
//console.log(_.startsWith('abc', 'b'));       // false
//
//console.log(_.startsWith('abc', 'b', 1));    // true



/****** _.endsWith([string=''], [target], [position=string.length])  判断字符串最后一个字符是否是  *******/

//console.log(_.endsWith('abcd', 'd'));      // true
//
//console.log(_.endsWith('abc', 'b'));       // false
//
//console.log(_.endsWith('abc', 'b', 2));    // true


/****** _.escapeRegExp([string='']) 转义字符方法 *******/
//console.log(_.escapeRegExp('http://www.baidu.com'));     // http:\/\/www\.baidu\.com



/****** _.parseInt(string, [radix]) 整型字符串格式化 *******/

//console.log(_.parseInt('08'));     // 8
//
//var newArr = _.map(['6', '08', '10'], _.parseInt);
//console.log(newArr);    //[ 6, 8, 10 ]




/****** _.trim([string=''], [chars=whitespace])  去除字符串前后空格
 * 第二个参数分割符 *******/

//console.log(_.trim('  abc  '));
//
//console.log(_.trim('-_-abc-_-', '-_-'));
//
//var newArr = _.map(['  foo  ', '  bar  '], _.trim);
//
//console.log(newArr);


/****** _.trimLeft([string=''], [chars=whitespace]) *******/




/****** _.trimRight([string=''], [chars=whitespace]) *******/




/****** _.trunc([string=''], [options], [options.length=30], [options.omission='…'], [options.separator])
 * 切割字符串*******/

//默认30长度
//console.log(_.trunc('hi-diddly-ho there, neighborino'));    //hi-diddly-ho there, neighbo...
//
//console.log(_.trunc('hi-diddly-ho there, neighborino', 24));//hi-diddly-ho there, n...














