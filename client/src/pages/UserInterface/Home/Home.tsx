import { Link } from 'react-router-dom'
import Slider from 'react-slick'

import { useGetAllMoviesQuery } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { Loader } from '~/components'

const Home = () => {
  var settings = {
    dots: true,
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
          dots: true,
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

  const { data: movies, isLoading: isLoadingMovies } = useGetAllMoviesQuery({})

  if (isLoadingMovies) {
    return <Loader />
  }

  return (
    <div className='h-fit w-full'>
      <section className='mx-auto w-[1300px] py-10'>
        <div className='mb-10 text-center text-[24px] font-semibold capitalize'>
          phim đang chiếu
        </div>
        <Slider {...settings}>
          {movies?.data?.map((item: any, index: number) => (
            <ul key={index} className='border border-[#ddd]'>
              {
                <li>
                  <figure className='group relative m-0 h-full w-full overflow-hidden'>
                    <img
                      src={item.poster}
                      alt='poster'
                      className='h-[412px] w-full object-cover'
                    />
                    <figcaption className='absolute bottom-0 left-0 right-0 top-0 z-10 before:absolute before:z-[-1] before:bg-gray-700 before:opacity-0'>
                      <div className='relative top-[50%] mx-auto flex w-[150px] translate-x-[-50%] flex-col gap-5'>
                        <div className='border border-[#ffd60a] opacity-0 hover:bg-white hover:text-base'>
                          <Link to={`/movie/${item?._id}`} className=''>
                            xem chi tiết
                          </Link>
                        </div>
                        <div className='border border-[#ffd60a] opacity-0 hover:bg-white hover:text-base'>
                          <Link to={paths.userPaths.showtimes}>đặt vé</Link>
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </li>
              }
            </ul>
          ))}
        </Slider>
      </section>
    </div>
  )
}

export default Home
