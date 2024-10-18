import { PacmanLoader } from 'react-spinners';

import './Loader.scss';

const Loader = () => {
    return (
        <div className='loader-container'>
            <PacmanLoader color='#06d6a0' />
        </div>
    );
};

export default Loader;
