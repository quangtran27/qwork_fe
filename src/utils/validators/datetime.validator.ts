const datetimeValidator = {
  isDateExpired: (day: number, month: number, year: number) => {
    if (day < 1 || month < 1 || year < 1) return true

    const now = Date.now().valueOf()
    const expiredDate = new Date(`${year}-${month}-${day}`).valueOf()
    return now >= expiredDate
  },
}

export default datetimeValidator
