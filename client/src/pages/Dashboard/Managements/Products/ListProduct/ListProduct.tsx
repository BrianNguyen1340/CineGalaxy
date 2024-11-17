import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetProductsQuery } from '~/services/product.service'
import { ProductType } from '~/types/product.type'
import useTitle from '~/hooks/useTitle'

const ListProduct = () => {
  useTitle('Manager | Danh sách sản phẩm')

  const {
    data: products,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessProducts,
    refetch: refetchProducts,
  } = useGetProductsQuery({})

  useEffect(() => {
    refetchProducts()
  }, [refetchProducts])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = products
    ? products?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content
  if (isLoadingProducts) content = <div>Loading...</div>
  if (isSuccessProducts) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách sản phẩm
        </div>

        {products ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>tên sản phẩm</th>
                  <th>danh mục sản phẩm</th>
                  <th>giá sản phẩm</th>
                  <th>kích cỡ sản phẩm</th>
                  <th>hình ảnh sản phẩm</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: ProductType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='capitalize'>{item.name}</td>
                    <td className='capitalize'>{item.category.name}</td>
                    <td className='capitalize'>
                      {item.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </td>
                    <td className='capitalize'>{item.size}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <img src={item.image} alt='image' width='200' />
                      </div>
                    </td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-product/${item._id}`}
                          className='rounded p-1 transition duration-300 hover:bg-[#67349D] hover:text-white hover:shadow-custom'
                        >
                          <SquarePen />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(products?.data?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách sản phẩm trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListProduct
