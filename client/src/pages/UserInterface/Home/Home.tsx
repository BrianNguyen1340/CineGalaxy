import { Link } from 'react-router-dom'
import Slider from 'react-slick'

import { useGetAllMoviesQuery } from '~/services/movie.service'
import './Home.scss'
import { paths } from '~/utils/paths'

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

  return (
    <div className='home-container'>
      <section className='now-showing'>
        <div className='title'>phim đang chiếu</div>
        <Slider {...settings}>
          {movies?.data?.map((item: any, index: number) => (
            <ul key={index} className='now-showing-list'>
              {
                <li>
                  <figure>
                    <img
                      src={item.poster}
                      alt='poster'
                      style={{
                        width: '100%',
                        height: '412px',
                        objectFit: 'cover',
                      }}
                    />
                    <figcaption>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '150px',
                          margin: '0 auto',
                          gap: '20px',
                        }}
                      >
                        <div className='link-to-movie-detail'>
                          <Link to={`/movie/${item?._id}`}>xem chi tiết</Link>
                        </div>
                        <div className='link-to-showtime'>
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
