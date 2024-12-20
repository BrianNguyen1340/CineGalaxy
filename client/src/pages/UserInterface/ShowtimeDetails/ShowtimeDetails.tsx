import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import { useGetShowtimeQuery } from '~/services/showtime.service'
import { useGetSeatsQuery } from '~/services/seat.service'
import { useGetProductsQuery } from '~/services/product.service'
import { SeatType } from '~/types/seat.type'
import { ProductType } from '~/types/product.type'
import useTitle from '~/hooks/useTitle'

const ShowtimeDetails = () => {
  useTitle('Chọn ghế')
  const { id } = useParams()

  const {
    data: showtime,
    isLoading: isLoadingShowtime,
    isSuccess: isSuccessShowtime,
    refetch: refetchShowtime,
  } = useGetShowtimeQuery(id)

  const {
    data: seats,
    isLoading: isLoadingSeats,
    isSuccess: isSuccessSeats,
    refetch: refetchSeats,
  } = useGetSeatsQuery({})

  const {
    data: products,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessProducts,
    refetch: refetchProducts,
  } = useGetProductsQuery({})

  useEffect(() => {
    refetchShowtime()
    refetchSeats()
    refetchProducts()
  }, [refetchShowtime, refetchSeats, refetchProducts])

  const groupProductsByCategory = (products: ProductType[] | undefined) => {
    if (!products) return {}
    return products.reduce((acc: Record<string, ProductType[]>, product) => {
      const categoryKey = product.category.name
      if (!acc[categoryKey]) {
        acc[categoryKey] = []
      }
      acc[categoryKey].push(product)
      return acc
    }, {})
  }

  const groupedProducts = isSuccessProducts
    ? groupProductsByCategory(products?.data)
    : {}

  const filteredSeats = seats?.data?.filter(
    (seat: SeatType) => seat.room._id === showtime?.data?.room?._id,
  )

  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([])
  const [selectedProducts, setSelectedProducts] = useState<
    { product: ProductType; quantity: number }[]
  >([])

  const handleSeatClick = (seat: SeatType) => {
    const isSelected = selectedSeats.includes(seat)
    if (!isSelected && selectedSeats.length >= 8) {
      Swal.fire('', 'Chỉ được chọn tối đa 8 ghế!', 'warning')
      return
    }
    if (isSelected) {
      setSelectedSeats((prevSelected) =>
        prevSelected.filter((selected) => selected !== seat),
      )
    } else {
      setSelectedSeats((prevSelected) => [...prevSelected, seat])
    }
  }

  const handleProductSelection = (
    product: ProductType,
    action: 'increase' | 'decrease',
  ) => {
    setSelectedProducts((prevProducts) =>
      prevProducts
        .map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                quantity:
                  action === 'increase' ? item.quantity + 1 : item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0)
        .concat(
          prevProducts.some((item) => item.product._id === product._id)
            ? []
            : action === 'increase'
              ? [{ product, quantity: 1 }]
              : [],
        ),
    )
  }

  const seatTotalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0)
  }, [selectedSeats])

  const productTotalPrice = useMemo(() => {
    return selectedProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    )
  }, [selectedProducts])

  const totalPrice = seatTotalPrice + productTotalPrice

  let content
  if (isLoadingShowtime || isLoadingSeats || isLoadingProducts)
    content = <div>Loading...</div>
  if (isSuccessShowtime && isSuccessSeats && isSuccessProducts) {
    content = (
      <div className='relative h-full w-full'>
        <div className='h-fit w-full bg-[#f9f6ec]'>
          <div className='mx-auto w-[1000px]'>
            <div className='py-6 text-center text-2xl font-semibold capitalize'>
              chọn ghế
            </div>
            <div className='pb-6 text-center text-sm text-[#777]'>
              Có thể chọn tối đa 8 người
            </div>
          </div>
        </div>
        <div className='my-4 h-fit w-full bg-white'>
          <div className='mx-auto w-[1000px]'>
            <div className='mb-4 bg-[#f9f8f3] text-center text-xl font-semibold capitalize'>
              màn hình
            </div>
            <div className='h-full w-full bg-[#f9f6ec] py-6'>
              <div className='mx-auto flex w-[350px] items-start justify-between bg-[#f9f6ec]'>
                <ul className='grid grid-cols-10 grid-rows-10 gap-2'>
                  {filteredSeats?.map((item: SeatType, index: number) => {
                    const isSelected = selectedSeats.includes(item)
                    return (
                      <li
                        key={index}
                        className={`${item.type === 'Standard' && 'bg-[#848484] text-white'} ${item.type === 'Vip' && 'bg-[#fca311] text-white'} ${item.type === 'Couple' && 'bg-[#ff8fab] text-white'} ${selectedSeats.includes(item) && 'bg-black text-white'} ${selectedSeats.length > 0 && !isSelected && 'opacity-30'} flex h-[24px] w-[24px] cursor-pointer items-center justify-center border`}
                        onClick={() => handleSeatClick(item)}
                      >
                        {item.number}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='h-fit w-full bg-[#f9f6ec]'>
          <div className='mx-auto w-[1000px] py-6'>
            <div className='mb-6 text-xl font-semibold'>Đặt hàng sản phẩm</div>
            <ul>
              {Object.entries(groupedProducts).map(([categoryName, items]) => (
                <li key={categoryName} className='mb-4'>
                  <h2 className='mb-2 font-bold capitalize'>{categoryName}</h2>
                  <ul>
                    <li className='grid grid-cols-[1fr_100px_100px] border-2 bg-white p-4 font-semibold'>
                      <div className='flex items-center justify-start font-semibold'>
                        Mô tả
                      </div>
                      <div className='flex items-center justify-center'>
                        Số lượng
                      </div>
                      <div className='flex items-center justify-center'>
                        Giá tiền
                      </div>
                    </li>
                    {items.map((item: ProductType) => {
                      const selectedItem = selectedProducts.find(
                        (prod) => prod.product._id === item._id,
                      )
                      const quantity = selectedItem ? selectedItem.quantity : 0
                      return (
                        <li
                          key={item._id}
                          className='grid grid-cols-[1fr_100px_100px] border-2 bg-white p-4 font-semibold'
                        >
                          <div className='flex items-center justify-start text-sm capitalize'>
                            {item.name} ({item.size})
                          </div>
                          <div className='flex items-center justify-center'>
                            {item.price.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </div>
                          <div className='flex items-center justify-center gap-2 py-2'>
                            <button
                              onClick={() =>
                                handleProductSelection(item, 'decrease')
                              }
                              className='flex h-6 w-6 items-center justify-center rounded-full bg-[#efebdb] text-2xl'
                            >
                              -
                            </button>
                            <div className='flex h-4 w-4 items-center justify-center'>
                              {quantity}
                            </div>
                            <button
                              onClick={() =>
                                handleProductSelection(item, 'increase')
                              }
                              className='flex h-6 w-6 items-center justify-center rounded-full bg-[#efebdb] text-2xl'
                            >
                              +
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='h-fit w-full bg-[#33373a]'>
          <div className='mx-auto grid w-[1000px] grid-cols-4'>
            <div className='border-l border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Phim chiếu rạp
              </div>
              <div>
                <div className='mb-4 flex items-center justify-center'>
                  <img
                    src={showtime?.data?.movie?.poster}
                    alt='poster'
                    className='w-[150px]'
                  />
                </div>
                <div className='flex flex-col items-start gap-2'>
                  <div className='font-semibold uppercase text-white'>
                    {showtime?.data?.movie?.name}
                  </div>
                  <div className='uppercase text-white'>
                    {showtime?.data?.movie?.movieFormat}
                  </div>
                  <div className='text-xs uppercase text-white'>
                    {showtime?.data?.movie?.movieRating}
                  </div>
                </div>
              </div>
            </div>
            <div className='border-l border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Thông tin vé đã đặt
              </div>
              <div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Ngày</div>
                  <div className='text-white'>
                    {new Date(showtime?.data?.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Giờ chiếu</div>
                  <div className='text-white'>
                    {new Date(showtime?.data?.timeStart).toLocaleTimeString(
                      'vi-VN',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                    <span className='mx-1'>~</span>
                    {new Date(showtime?.data?.timeEnd).toLocaleTimeString(
                      'vi-VN',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Rạp chiếu</div>
                  <div className='text-white'>
                    {showtime?.data?.cinema?.name}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Phòng chiếu</div>
                  <div className='capitalize text-white'>
                    {showtime?.data?.room?.name}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Ghế ngồi</div>
                  {selectedSeats.length > 0 ? (
                    <ul className='grid grid-cols-4 items-center gap-0.5 text-white'>
                      {selectedSeats.map((seat, index) => (
                        <li
                          key={seat._id || index}
                          className='flex items-center justify-center'
                        >
                          {seat.row}
                          {seat.number}
                          {index < selectedSeats.length - 1 && ', '}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className='text-white'>Chưa chọn ghế</div>
                  )}
                </div>
                <div className='flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Tiền ghế</div>
                  <div className='text-xl text-white'>
                    {selectedSeats
                      .reduce((total, seat) => total + seat.price, 0)
                      .toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                  </div>
                </div>
              </div>
            </div>
            <ul className='border-l border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Thông tin sản phẩm
              </div>
              <ul>
                {selectedProducts.map(({ product, quantity }) => (
                  <li key={product._id} className='mb-4 border-b pb-2'>
                    <div className='flex items-center gap-2 capitalize text-white'>
                      {product.name}
                      <div className='px-0.5 text-sm'>x</div>
                      {quantity}
                    </div>
                    <div className='text-white'>
                      {(product.price * quantity).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </ul>
            <div className='border-l border-r border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Tổng tiền đơn hàng
              </div>
              <div className='text-white'>
                <div className='flex items-start gap-4'>
                  <div className='w-[100px]'>Tiền phim</div>
                  <div>
                    {seatTotalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='w-[100px]'>Mua hàng</div>
                  <div className='flex items-end'>
                    {productTotalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </div>
                </div>
              </div>
              <div className='mt-10 flex items-start gap-4 text-white'>
                <div className='w-[100px]'>Tổng tiền:</div>
                <div className='text-xl'>
                  {totalPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return content
}

export default ShowtimeDetails

// const {
//   data: rooms,
//   isLoading: isLoadingRooms,
//   isSuccess: isSuccessRooms,
//   refetch: refetchRooms,
// } = useGetRoomsQuery({})

{
  /* <div className='flex flex-col items-start gap-2'>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    A
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    B
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    C
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    D
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    E
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    F
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    G
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    H
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    I
                  </div>
                  <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-[#48cae4] text-white'>
                    J
                  </div>
                </div> */
}
