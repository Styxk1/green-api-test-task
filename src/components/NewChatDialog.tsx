import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type SubmitEvent,
  type SyntheticEvent,
} from 'react';
import { isValidPhone, normalizePhone } from '../utils/phone';
import styles from './NewChatDialog.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (phone: string) => void;
}

export function NewChatDialog({ open, onClose, onSubmit }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    setPhone('');
    onClose();
  };

  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    handleClose();
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidPhone(phone)) return;
    onSubmit(normalizePhone(phone));
    setPhone('');
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby="new-chat-title"
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 id="new-chat-title" className={styles.title}>
          Новый чат
        </h2>
        <input
          className={styles.input}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 999 123-45-67"
          aria-label="Номер телефона"
          autoComplete="off"
        />
        <p className={styles.hint}>Номер в международном формате: 11–12 цифр</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={handleClose}>
            Отмена
          </button>
          <button type="submit" className={styles.submit} disabled={!isValidPhone(phone)}>
            Создать
          </button>
        </div>
      </form>
    </dialog>
  );
}
