import { Link } from 'react-router-dom'
import './NotFound.scss'
import { paths } from '~/utils/paths'
import { useAppSelector } from '~/hooks/redux'

const NotFound = () => {
    const user = useAppSelector((state) => state.user.user)

    return (
        <div className='not-found-container'>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            {user?.role === 0 || user?.role === 1 || user?.role === 2 ? (
                <Link to={paths.dashboardPaths.dashboard}>Back to home!</Link>
            ) : (
                <Link to={paths.userPaths.home}>Back to home!</Link>
            )}
        </div>
    )
}

export default NotFound
