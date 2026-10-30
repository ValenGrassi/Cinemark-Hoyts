import styles from '../Loader.module.css';

export function Loader() {
  return (
    <div className={styles.card}>
      <div className={styles.loader}>
        <p>Cargando</p>
        <div className={styles.words}>
          <span className={styles.word}>cines</span>
          <span className={styles.word}>ups</span>
          <span className={styles.word}>switches</span>
          <span className={styles.word}>routers</span>
          <span className={styles.word}>patcheras</span>
        </div>
      </div>
    </div>
  );
}