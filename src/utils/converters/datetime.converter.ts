export const dateTimeConverter = {
  dateStringToDate: (dateString: string) => {
    try {
      const dateParts = dateString.split('-')
      const day = parseInt(dateParts[2], 10)
      const month = parseInt(dateParts[1], 10) - 1 // Months are zero-based (0 = January, 1 = February, ..., 11 = December)
      const year = parseInt(dateParts[0], 10)

      return [day, month + 1, year]
    } catch {}

    return [-1, -1, -1]
  },
}
