import { Link } from 'react-router-dom';

import { paths } from '~/utils/paths';
import './MainNavigation.scss';

const MainNavigation = () => {
    return (
        <nav className='main-navigation'>
            <ul>
                <li style={{ paddingLeft: '0' }}>
                    <Link to={paths.userPaths.giftShop}>shop quà tặng</Link>
                </li>
                <li>
                    <Link to={paths.userPaths.showtimes}>mua vé</Link>
                </li>
                <li>
                    <Link to={paths.userPaths.movieLists}>phim</Link>
                </li>
                <li>
                    <Link to={paths.userPaths.cinemas}>rạp chiếu phim</Link>
                </li>
                <li>
                    <Link to={paths.userPaths.promotions}>khuyến mãi</Link>
                </li>
                <li style={{ paddingRight: '0' }}>
                    <Link to={paths.userPaths.contact}>liên hệ</Link>
                </li>
            </ul>
        </nav>
    );
};

export default MainNavigation;
