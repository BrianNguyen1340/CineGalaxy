import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { paths } from '~/utils/paths';
import { GoogleAuth, PasswordStrength } from '~/components';
import './Register.scss';

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const password = watch('password');

    const [showForm, setShowForm] = useState(false);

    const [showHidePassword, setShowHidePassword] = useState(false);

    const handleShowHidePassword = () => {
        setShowHidePassword((prevState) => !prevState);
    };

    const handleContinueWithEmail = () => {
        setShowForm(true);
    };

    const handleBackToAuthContent = () => {
        setShowForm(false);
        reset();
    };

    const handleRegister = async () => {
        alert('Yêu em Quỳnh ơi!');
    };

    return (
        <div className='register-container'>
            <div className='bg'>
                <video src='videos/register-video2.mp4' autoPlay loop muted />
            </div>
            <div className='content'>
                {showForm && (
                    <button
                        className='btn-change-tab'
                        onClick={handleBackToAuthContent}
                    >
                        <ChevronLeft size='20' />
                    </button>
                )}
                <div className={`auth-content ${showForm ? 'hidden' : 'show'}`}>
                    <div className='title'>Đăng ký tài khoản CineGalaxy</div>
                    <GoogleAuth />
                    <hr className='divider' />
                    <button
                        className='continue-with-email'
                        onClick={handleContinueWithEmail}
                    >
                        Tiếp tục với email
                    </button>
                    <p>
                        Đã có tài khoản?
                        <Link to={paths.login}>Đăng nhập</Link>
                    </p>
                </div>
                <form
                    className={`${showForm ? 'show' : 'hidden'}`}
                    onSubmit={handleSubmit(handleRegister)}
                >
                    <div className='form-item'>
                        <label htmlFor='email'>Email</label>
                        <div className='form-input'>
                            <input
                                type='text'
                                placeholder='Vui lòng nhập email!'
                                {...register('email', {
                                    required: 'Vui lòng nhập email!',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message:
                                            'Vui lòng nhập đúng định dạng email!',
                                    },
                                })}
                                id='email'
                                name='email'
                                autoComplete='off'
                                style={{
                                    backgroundColor: `${
                                        errors?.email?.message
                                            ? '#ffe5ec'
                                            : 'white'
                                    }`,
                                }}
                            />
                        </div>
                    </div>
                    <div className='form-item'>
                        <label htmlFor='name'>Họ tên</label>
                        <div className='form-input'>
                            <input
                                type='text'
                                placeholder='Vui lòng nhập họ tên!'
                                {...register('name', {
                                    required: 'Vui lòng nhập họ tên!',
                                    minLength: {
                                        value: 6,
                                        message: 'Họ tên có tối thiểu 6 ký tự!',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Họ tên có tối đa 50 ký tự!',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9\s]*$/,
                                        message:
                                            'Họ tên không được chứa ký tự đặc biệt!',
                                    },
                                })}
                                id='name'
                                name='name'
                                autoComplete='off'
                                style={{
                                    backgroundColor: `${
                                        errors?.name?.message
                                            ? '#ffe5ec'
                                            : 'white'
                                    }`,
                                }}
                            />
                        </div>
                    </div>
                    <div className='form-item'>
                        <label htmlFor='phone'>Số điện thoại</label>
                        <div className='form-input'>
                            <input
                                type='text'
                                placeholder='Vui lòng nhập số điện thoại!'
                                {...register('phone', {
                                    required: 'Vui lòng nhập số điện thoại!',
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message:
                                            'Vui lòng nhập đúng định dạng số điện thoại!',
                                    },
                                })}
                                id='phone'
                                name='phone'
                                autoComplete='off'
                                style={{
                                    backgroundColor: `${
                                        errors?.phone?.message
                                            ? '#ffe5ec'
                                            : 'white'
                                    }`,
                                }}
                            />
                        </div>
                    </div>
                    <div className='form-item' style={{ position: 'relative' }}>
                        <label htmlFor='password'>Mật khẩu</label>
                        <div className='form-input'>
                            <input
                                type={showHidePassword ? 'text' : 'password'}
                                placeholder='Vui lòng nhập mật khẩu!'
                                {...register('password', {
                                    required: 'Vui lòng nhập mật khẩu!',
                                })}
                                id='password'
                                name='password'
                                autoComplete='off'
                                style={{
                                    backgroundColor: `${
                                        errors?.password?.message
                                            ? '#ffe5ec'
                                            : 'white'
                                    }`,
                                }}
                            />
                        </div>
                        <button
                            type='button'
                            className='btn-show-hide-password'
                            onClick={handleShowHidePassword}
                        >
                            {showHidePassword ? (
                                <FaEye size='20' />
                            ) : (
                                <FaEyeSlash size='20' />
                            )}
                        </button>
                    </div>
                    <PasswordStrength password={password} />
                    <button type='submit' className='btn-submit-register'>
                        đăng ký
                    </button>
                    <p>
                        đã có tài khoản?
                        <Link to={paths.login}>đăng nhập</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
