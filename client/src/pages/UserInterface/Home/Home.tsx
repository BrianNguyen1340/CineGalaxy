import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation } from 'swiper/modules'
import { BeatLoader } from 'react-spinners'
import Slider from 'react-slick'

import { useGetMoviesQuery } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { useAppSelector } from '~/hooks/redux'
import { MovieType } from '~/types/movie.type'
import useTitle from '~/hooks/useTitle'

const Home = () => {
  useTitle('Trang chủ')
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)
  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const {
    data: movies,
    isLoading: isLoadingMovies,
    isSuccess: isSuccessMovies,
    refetch: refetchMovies,
  } = useGetMoviesQuery({})

  useEffect(() => {
    refetchMovies()
  }, [refetchMovies])

  const moviesToDisplay = (movies?.data?.slice(0, 7) || []).filter(
    (movie: MovieType) => movie.hidden === false,
  )

  const currentDate = new Date()

  const releasedMovies = movies?.data?.filter((movie: MovieType) => {
    const releaseDate = new Date(movie.releaseDate)
    return releaseDate <= currentDate && movie.hidden === false
  })

  let content

  if (isLoadingMovies)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessMovies) {
    content = (
      <div className='h-fit w-full'>
        <section className='mt-6 flex h-[650px] items-start gap-6 overflow-hidden'>
          <div
            style={{ width: 'calc(100% - 430px)' }}
            className='flex items-center justify-center'
          >
            <Swiper
              slidesPerView={1}
              effect='fade'
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={true}
              modules={[Autoplay, EffectFade, Navigation]}
            >
              {movies?.data?.map((item: MovieType, index: number) => (
                <SwiperSlide key={index}>
                  <img src={item.banner} alt='banner' className='w-full' />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className='h-fit min-w-[400px]'>
            <div
              style={{ fontFamily: 'Dancing Script' }}
              className='bg-[#2a2e33] py-6 text-center text-3xl font-semibold text-[#dad2b4]'
            >
              CineGalaxy
            </div>
            <div className='border py-3'>
              {moviesToDisplay.length > 0 ? (
                <>
                  {moviesToDisplay?.map((item: MovieType, index: number) => (
                    <ol key={index}>
                      <li className='flex items-center gap-1 border-[4px] border-white hover:border-[4px] hover:border-[#dad2b4]'>
                        <Link
                          to={paths.userPaths.showtimes}
                          className='flex items-center gap-1 p-3'
                        >
                          <div className='text-xl font-semibold italic'>
                            {index + 1}.
                          </div>
                          {item.movieRating === 'P - Phổ biến' && (
                            <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#088210] p-2 text-white'>
                              P
                            </div>
                          )}
                          {item.movieRating === 'K - Dành cho trẻ em' && (
                            <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                              K
                            </div>
                          )}
                          {item.movieRating ===
                            'C13 - Cấm khán giả dưới 13 tuổi' && (
                            <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                              13
                            </div>
                          )}
                          {item.movieRating ===
                            'C16 - Cấm khán giả dưới 16 tuổi' && (
                            <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                              16
                            </div>
                          )}
                          {item.movieRating ===
                            'C18 - Cấm khán giả dưới 18 tuổi' && (
                            <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#e80808] p-2 text-white'>
                              18
                            </div>
                          )}
                          <div className='w-[150px] overflow-hidden text-ellipsis text-nowrap text-sm font-bold uppercase'>
                            {item.name}
                          </div>
                        </Link>
                        <div className='flex w-full items-center justify-end'>
                          <div className='text-sm'>{item.duration} phút</div>
                          <div className='px-1'>|</div>
                          <div className='text-sm'>
                            {new Date(item.releaseDate).toLocaleDateString(
                              'vi-VN',
                            )}
                          </div>
                        </div>
                      </li>
                    </ol>
                  ))}
                </>
              ) : (
                <div>Không có suất chiếu nào</div>
              )}
            </div>
            <Link
              to={paths.userPaths.showtimes}
              className='block bg-[#ee1c25] py-4 text-center font-semibold text-white'
            >
              Mua vé ngay
            </Link>
          </div>
        </section>
        <section className='mx-auto w-[1300px] pb-10'>
          <div className='mb-10 text-center text-[24px] font-semibold capitalize'>
            phim đang chiếu
          </div>
          <Slider {...settings}>
            {releasedMovies.map((item: MovieType, index: number) => (
              <div key={index} className='border border-[#ddd]'>
                {
                  <figure className='group relative h-full w-full overflow-hidden'>
                    <img
                      src={item.poster}
                      alt='poster'
                      className='h-[412px] w-full object-cover'
                    />
                    <figcaption className='absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-10 transition duration-500 before:absolute before:z-[-1] before:bg-gray-700 before:opacity-0 group-hover:bg-[rgba(0,0,0,0.7)]'>
                      <div className='border border-[#ffd60a] opacity-0 transition duration-500 group-hover:opacity-100'>
                        <Link
                          to={`/movie/${item._id}`}
                          className='mx-auto block min-w-[150px] cursor-pointer p-5 text-center font-semibold capitalize text-white transition duration-500 hover:bg-white hover:text-black'
                        >
                          xem chi tiết
                        </Link>
                      </div>
                      <div className='border border-[#ffd60a] opacity-0 transition duration-500 group-hover:opacity-100'>
                        <Link
                          to={paths.userPaths.showtimes}
                          className='mx-auto block min-w-[150px] cursor-pointer p-5 text-center font-semibold capitalize text-white transition duration-500 hover:bg-white hover:text-black'
                        >
                          đặt vé
                        </Link>
                      </div>
                    </figcaption>
                  </figure>
                }
              </div>
            ))}
          </Slider>
        </section>
      </div>
    )
  }

  return content
}

export default Home
