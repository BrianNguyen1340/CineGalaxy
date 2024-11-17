import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import { BeatLoader } from 'react-spinners'
import ReactPaginate from 'react-paginate'

import { useGetCombosQuery } from '~/services/combo.service'
import { ComboType } from '~/types/combo.type'
import { ProductType } from '~/types/product.type'
import useTitle from '~/hooks/useTitle'

const ListCombo = () => {
  useTitle('Admin | Danh sách rạp')

  const {
    data: combos,
    isLoading: isLoadingCombos,
    isSuccess: isSuccessCombos,
    refetch: refetchCombos,
  } = useGetCombosQuery({})

  useEffect(() => {
    refetchCombos()
  }, [refetchCombos])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = combos
    ? combos?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content

  if (isLoadingCombos)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessCombos) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách rạp
        </div>

        {combos ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>tên combo</th>
                  <th>thời gian hết hạn combo</th>
                  <th>hình ảnh sản phẩm</th>
                  <th>sản phẩm</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: ComboType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='capitalize'>{item.name}</td>
                    <td className='capitalize'>{item.expiry}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <img src={item.image} alt='image' width='200' />
                      </div>
                    </td>
                    <td className='capitalize'>
                      {item.products.map(
                        (product: ProductType, index: number) => (
                          <div key={index}>{product.name}</div>
                        ),
                      )}
                    </td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-combo/${item._id}`}
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
              pageCount={Math.ceil(combos?.data?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách combo trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListCombo
