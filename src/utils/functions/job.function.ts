import datetimeValidator from '../validators/datetime.validator'

export function countExpired(expired: string) {
  let dateDisplay = `Hết hạn vào ngày ${expired}`
  let dateClass = ''

  const [day, month, year] = expired.split('/').map(Number)
  if (datetimeValidator.isDateExpired(day, month, year)) {
    dateDisplay = 'Tin tuyển dụng đã hết hạn'
    dateClass = 'text-red-600'
  } else {
    const currentDate = new Date()
    if (year === currentDate.getFullYear() && month === currentDate.getMonth() && day - currentDate.getDate() <= 10) {
      dateDisplay = `Hết hạn trong ${day - currentDate.getDate()} ngày`
    } else {
      dateDisplay = `Hết hạn vào ${day}/${month}/${year}`
    }
  }

  return [dateDisplay, dateClass]
}
