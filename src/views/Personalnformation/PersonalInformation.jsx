import styles from "./PersonalInformation.module.css";
import {Modal} from "react-bootstrap";
import {create} from "zustand";
import LeftPersonal from "./LeftPersonal";
import RightPersonal from "./RightPersonal";
import useLoadMe from "../../api/useLoadMe";
import {useEffect} from "react";

export const usePersonalInfoModal = create((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

const PersonalInformation = () => {
  const {isOpen, setIsOpen} = usePersonalInfoModal();
  const [{ data: personalInfo}, fetch] = useLoadMe();

  useEffect(() => {
    if (!personalInfo) {
      fetch()
    }
  }, [personalInfo]);

  return (
    <Modal
      show={isOpen}
      onHide={() => setIsOpen(false)}
      dialogClassName='modal-90w'
      aria-labelledby='personal-information'
      contentClassName={styles.modalBody}
      centered
      backdropClassName={styles.modal}
      className={styles.modalWrapper}
    >
      <Modal.Body className='d-flex justify-content-between'>
        <div className={styles.basisFlex}>
          <LeftPersonal
            personalInfo={personalInfo}
            onLoadPersonal={fetch}
          />
        </div>
        <div className={styles.basisFlex}>
          <RightPersonal />
        </div>
      </Modal.Body>
    </Modal>
  );
};


export default PersonalInformation;