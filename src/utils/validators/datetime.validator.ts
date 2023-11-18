const datetimeValidator = {
  isDateExpired: (day: number, month: number, year: number) => {
    if (day < 1 || month < 1 || year < 1) return true

    const currentDate = new Date()
    const expiredDate = new Date(year, month, day + 1)

    return expiredDate < currentDate
  },
}

export default datetimeValidator
