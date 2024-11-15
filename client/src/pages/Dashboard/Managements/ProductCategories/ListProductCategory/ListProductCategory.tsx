import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetProductCategoriesQuery } from '~/services/productCategory.service'
import { ProductCategoryType } from '~/types/productCategory.type'
import useTitle from '~/hooks/useTitle'

const ListProductCategory = () => {
  useTitle('Manager | Danh sách danh mục sản phẩm')

  const {
    data: productCategories,
    isLoading: isLoadingProductCategory,
    isSuccess: isSuccessProductCategory,
    refetch: refetchProductCategory,
  } = useGetProductCategoriesQuery({})

  useEffect(() => {
    refetchProductCategory()
  }, [refetchProductCategory])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = productCategories
    ? productCategories?.data
        .slice()
        .reverse()
        .slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content
  if (isLoadingProductCategory) content = <div>Loading...</div>
  if (isSuccessProductCategory) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách danh mục sản phẩm
        </div>
        
        {productCategories ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>tên thể loại</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(
                  (item: ProductCategoryType, index: number) => (
                    <tr key={index}>
                      <td>{index + offset}</td>
                      <td className='capitalize'>{item.name}</td>
                      <td>
                        <div className='flex items-center justify-center'>
                          <Link
                            to={`/update-product-category/${item._id}`}
                            className='rounded p-1 transition duration-300 hover:bg-[#67349D] hover:text-white hover:shadow-custom'
                          >
                            <SquarePen />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(
                productCategories?.data?.length / itemsPerPage,
              )}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách danh mục phim trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListProductCategory
