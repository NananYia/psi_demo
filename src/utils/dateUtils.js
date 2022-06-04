/*
包含n个日期时间处理的工具函数模块
*/

/*
  格式化日期
*/
export function formateDate(time) {
  if (!time) return "";
  let date = new Date(time);
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
}

export  function getCurrentTime() {
   var date = new Date(); //当前时间
   var year = date.getFullYear() //返回指定日期的年份
   var month = repair(date.getMonth() + 1); //月
   var day = repair(date.getDate()); //日
   var hour = repair(date.getHours()); //时
   var minute = repair(date.getMinutes()); //分
   var second = repair(date.getSeconds()); //秒

   //当前时间 
   var curTime = year + "-" + month + "-" + day +
     " " + hour + ":" + minute + ":" + second;
   return curTime;
 }

 //补0

 function repair(i) {
   if (i >= 0 && i <= 9) {
     return "0" + i;
   } else {
     return i;
   }
 }
