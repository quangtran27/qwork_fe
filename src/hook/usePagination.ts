import { PaginationParams } from '@/types/api.type'
import { useMemo } from 'react'

const SIBLING_COUNT = 1
const DOTS = -1

const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export const usePagination = ({ page, numPages }: PaginationParams) => {
  const paginationRange = useMemo(() => {
    // Tổng số nút hiển thị trong phân trang bao gồm:
    // trang hiện tại + số trang nằm kề trang hiện tại + trang đầu + trang cuối + 2 dấu 3 chấm
    const totalPageNumbers = SIBLING_COUNT * 2 + 5

    // Trường hợp 1: số trang ít hơn tổng số nút, không hiện dấu 3 chấm
    if (numPages < totalPageNumbers) {
      return range(1, numPages)
    }

    // Tính toán nút bên trái và bên phải trang hiện tại
    const leftSiblingIndex = Math.max(page - SIBLING_COUNT, 1)
    const rightSiblingIndex = Math.min(page + SIBLING_COUNT, numPages)

    // Không hiện dấu 3 chấm nếu chỉ có một nút ở giữa nút rìa và nút kề trang hiện tại
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < numPages - 2

    const firstPageIndex = 1
    const lastPageIndex = numPages

    // Trường hợp 2: Chỉ hiện dấu 3 chấm bên phải
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * SIBLING_COUNT
      const leftRange = range(1, leftItemCount)
      return [...leftRange, DOTS, lastPageIndex]
    }

    // Trường hợp 3: Chỉ hiện dấu 3 chấm bên trái
    if (!shouldShowRightDots && shouldShowLeftDots) {
      const rightItemCount = 3 + 2 * SIBLING_COUNT
      const rightRange = range(numPages - rightItemCount + 1, numPages)
      return [firstPageIndex, DOTS, ...rightRange]
    }

    // Trường hợp 4: Hiện dấu 3 chấm cả bên trái và phải
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }

    return []
  }, [numPages, page])

  return paginationRange
}
