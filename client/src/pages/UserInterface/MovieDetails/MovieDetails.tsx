import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TbPlayerPlay } from 'react-icons/tb'
import ReactPlayer from 'react-player'
import ReactModal from 'react-modal'

import { useGetMovieQuery } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import './MovieDetails.scss'

ReactModal.setAppElement('#root')

const MovieDetails = () => {
  const { id } = useParams()

  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const { data: movie } = useGetMovieQuery(id)

  return (
    <div className='movie-details-container'>
      <div className='title'>phim hot tại rạp</div>
      <div className='banner'>
        <div className='movie-trailer'>
          <img src={movie?.data?.banner} alt='' />
          {!isOpen && (
            <button onClick={openModal} className='open-trailer'>
              <TbPlayerPlay size='50' color='white' />
            </button>
          )}
        </div>
        <ReactModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={{
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: '800px',
            },
          }}
        >
          <ReactPlayer
            url={movie?.data?.trailer}
            controls
            playing
            width='100%'
          />
        </ReactModal>
      </div>
      <div className='wide-info-area'>
        <div className='wide-top'>
          <div className='thumb'>
            <div>
              <img src={movie?.data?.poster} alt='poster' />
            </div>
            <div style={{ marginTop: '10px' }}>
              <Link to={paths.userPaths.showtimes}>đặt vé</Link>
            </div>
          </div>
          <div className='info-main'>
            <div className='name'>{movie?.data?.name}</div>
            <div className='director'>
              <strong>Đạo diễn: </strong>
              {movie?.data?.director}
            </div>
            <div className='movie-rating'>
              <strong>Xếp hạng độ tuổi: </strong> {movie?.data?.movieRating}
            </div>
            <div className='release-date'>
              <strong>Ngày phát hành: </strong>
              {new Date(movie?.data?.releaseDate).toLocaleDateString('vi-VN')}
            </div>
            <div className='genres'>
              <strong>Thể loại:</strong>
              {movie?.data?.genres?.map((item: any, index: number) => (
                <span key={index}>
                  {item?.name}
                  {index < movie.data.genres.length - 1 ? ' / ' : ''}
                </span>
              ))}
            </div>
            <div className='duration'>
              <strong>Thời lượng: </strong>
              {movie?.data?.duration} phút
            </div>
            <div className='subtitle'>
              <strong>Phụ đề: </strong>
              {movie?.data?.subtitle}
            </div>
            <div className='movie-format'>
              <strong>Định dạng phim: </strong>
              {movie?.data?.movieFormat}
            </div>
          </div>
        </div>
        <div className='description'>
          <div className='description-title'>tóm tắt</div>
          <div className='description-text'>{movie?.data?.description}</div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
