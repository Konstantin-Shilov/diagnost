import styles from "./BurgerButton.module.css";

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const BurgerButton = ({ isOpen, onClick }: BurgerButtonProps) => {
  return (
    <button
      className={`${styles.burger} ${isOpen ? styles.open : ""}`}
      onClick={onClick}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={isOpen}
      type="button"
    >
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </button>
  );
};
