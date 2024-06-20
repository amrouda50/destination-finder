import { useEffect, useState } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { removeToken } from '../../helpers';
import { message } from 'antd';
import { ReactComponent as UserIcon } from '../../images/user.svg';
import { usePersonalInfoModal } from "../Personalnformation/PersonalInformation";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import useLoadMe from '../../api/useLoadMe';
import { toImageUrl } from '../../tasks/toImageUrl';
import styles from "../Personalnformation/PersonalInformation.module.css";
const logStates = {
    NOT_SIGNED_IN: "Sign in",
    SIGNED_IN: "Personal information"
}

const LoginButton = () => {
    const { user, setUser } = useAuthContext();
    const navigate = useNavigate();
    const [logName, setLogName] = useState(logStates.NOT_SIGNED_IN);
    const [{ data: personalInfo }, fetch] = useLoadMe();
    const { setIsOpen: setIsInfoModalOpen, isOpen: isInfoModalOpen } = usePersonalInfoModal();
    const breakpoints = useBreakpoint(true)

    useEffect(() => {
        if (!isInfoModalOpen) {
            fetch()
        }
    }, [isInfoModalOpen]);

    const handleLogout = () => {
        navigate("/", { replace: true })
        setUser(undefined);
        removeToken();
        message.success(`Logged out successfully!`);
    }

    const handleCTAButton = () => {
        if (!user) {
            navigate("/signin", { replace: true });
        } else {
            setIsInfoModalOpen(true);
        }
    };


    useEffect(() => {
        if (user) {
            setLogName(logStates.SIGNED_IN);
        } else {
            setLogName(logStates.NOT_SIGNED_IN);
        }
    }, [user]);

    const orderElements = breakpoints.xl
        ? 'flex-row align-items-center py-3'
        : 'flex-column-reverse align-items-start pb-3';

    const showProfilePhoto = personalInfo?.profilePhoto && logName === logStates.SIGNED_IN;

    return (
        <div
            className={`w-100 d-flex justify-content-between ${orderElements} gap-2`}
        >
            <Button className={'d-flex align-items-center gap-3'} handleButton={handleCTAButton}>
                <div className='rounded-circle' style={{ backgroundColor: showProfilePhoto ? "transparent": '#D9D9D9', width: '1.5rem' }}>
                    {
                       showProfilePhoto ?
                        <img
                            src={toImageUrl(personalInfo.profilePhoto)}
                            style={{ borderRadius: "50%", width: '1.85rem', height: '1.85rem'}}
                            className={styles.avatarImg}
                            alt="avatar"></img>
                        :
                        <UserIcon />}
                </div>
                <span className={'fw-bold'} style={{ userSelect: "none", fontSize: '12px' }}>{logName}</span>
            </Button>
            {user && (
                <button
                    style={{ fontSize: '12px', color: 'white', whiteSpace: 'nowrap' }}
                    className='me-3 btn'
                    onClick={handleLogout}
                >
                    Log out
                </button>
            )}
        </div>
    );
}


export default LoginButton;