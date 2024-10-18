import { Check, X } from 'lucide-react';

import './PasswordStrength.scss';

const PasswordCriteria = ({ password }: { password: string }) => {
    const criteria = [
        {
            label: 'Độ dài ký tự từ 8 đến 30 ký tự!',
            met: password?.length >= 8 && password?.length <= 30,
        },
        {
            label: 'Chứa ký tự viết hoa!',
            met: /[A-Z]/.test(password),
        },
        {
            label: 'Chứa ký tự viết thường!',
            met: /[a-z]/.test(password),
        },
        {
            label: 'Chứa số!',
            met: /\d/.test(password),
        },
        {
            label: 'Chứa ký tự đặc biệt!',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    return (
        <div className='password-criteria'>
            {criteria.map((item) => (
                <div className='password-criteria-item' key={item.label}>
                    {item.met ? (
                        <Check
                            style={{
                                width: '1rem',
                                height: '1rem',
                                marginRight: '0.5rem',
                                color: 'green',
                            }}
                        />
                    ) : (
                        <X
                            style={{
                                width: '1rem',
                                height: '1rem',
                                marginRight: '0.5rem',
                                color: 'red',
                            }}
                        />
                    )}
                    <span
                        style={{
                            color: `${item.met ? 'green' : 'red'}`,
                            fontWeight: '600',
                            marginBottom: '1px',
                        }}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const PasswordStrength = ({ password }: { password: string }) => {
    const getStrength = (pass: string) => {
        if (!pass) return 0;

        let strength = 0;
        if (pass?.length >= 8 && pass?.length <= 30) strength++;
        if (pass.match(/[A-Z]/)) strength++;
        if (pass.match(/[a-z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;

        return strength;
    };

    const strength = getStrength(password);

    const getColor = (strength: number) => {
        switch (strength) {
            case 1:
                return '#D32F2F';
            case 2:
                return '#F57C00';
            case 3:
                return '#FFEB3B';
            case 4:
                return '#8BC34A';
            default:
                return '#1976D2';
        }
    };

    const getStrengthText = (strength: number) => {
        switch (strength) {
            case 0:
                return 'Rất Yếu';
            case 1:
                return 'Yếu';
            case 2:
                return 'Khá';
            case 3:
                return 'Tốt';
            case 4:
                return 'Khá Tốt';
            default:
                return 'Mạnh';
        }
    };

    return (
        <div className='password-strength'>
            <div className='password-strength-text'>
                <span className='title' style={{ margin: '0' }}>
                    độ mạnh mật khẩu
                </span>
                <span className='get-strength-text'>
                    {getStrengthText(strength)}
                </span>
            </div>
            <div className='password-strength-length'>
                {[...Array(5)].map((_, index) => (
                    <div
                        className='password-strength-length-item'
                        key={index}
                        style={{
                            backgroundColor:
                                strength > index
                                    ? getColor(strength)
                                    : 'lightgray',
                        }}
                    />
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    );
};

export default PasswordStrength;
