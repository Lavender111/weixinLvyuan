const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
 
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
 
 
const getTime = date => {
 
  const getdate = new Date(date)
  const year = getdate.getFullYear()
  const month = getdate.getMonth() + 1
  const day = getdate.getDate()
  const hour = getdate.getHours()
  const minute = getdate.getMinutes()
  const second = getdate.getSeconds()
 
 
 
  return [year, month, day].map(formatNumber).join('-')
}
 
 
const formatTimePjj = date => {
  let time = new Date(date)
 
 
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth() + 1
  const day = new Date(date).getDate()
  const hour = new Date(date).getHours()
  const minute = new Date(date).getMinutes()
  const second = new Date(date).getSeconds()
 
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
 
const getForm = function (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return ''
  }
 
  if (typeof date === 'string') {
    date = strToDate(date)
  }
 
  if (typeof date === 'number') {
    date = new Date(date)
  }
 
  let o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  let week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
 
const strToDate= dateObj =>{
  dateObj = dateObj.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/')
  if (dateObj.indexOf(".") > 0) dateObj = dateObj.slice(0, dateObj.indexOf("."))
  return new Date(dateObj)
}
 
 
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
 
module.exports = {
  formatTime: formatTime,
  getTime: getTime,
  formatTimePjj: formatTimePjj,
  strToDate: strToDate,
  getForm: getForm
}