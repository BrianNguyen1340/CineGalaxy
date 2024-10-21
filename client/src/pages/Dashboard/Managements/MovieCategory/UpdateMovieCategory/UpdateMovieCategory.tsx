import { useParams } from 'react-router-dom'

import { useGetMovieCategoryQuery } from '~/services/genre.service'
import './UpdateMovieCategory.scss'

const UpdateMovieCategory = () => {
  const { id } = useParams()

  const { data: movieCategory, refetch } = useGetMovieCategoryQuery(id)

  return <div className='update-movie-category-container'></div>
}

export default UpdateMovieCategory
