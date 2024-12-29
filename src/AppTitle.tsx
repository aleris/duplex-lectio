import classes from './AppTitle.module.scss'

export function AppTitle() {
  return <h1 className={classes.appTitle}>
    <div className={classes.overlay}></div>
    <div className={classes.text}>
      <div className={classes.wrapper}>
        <div className={classes.shadow}>D</div>
        <div className={classes.letter}>D</div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.shadow}>U</div>
        <div className={classes.letter}>U</div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.shadow}>P</div>
        <div className={classes.letter}>P</div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.shadow}>L</div>
        <div className={classes.letter}>L</div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.shadow}>E</div>
        <div className={classes.letter}>E</div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.shadow}>X</div>
        <div className={classes.letter}>X</div>
      </div>
    </div>
  </h1>
}
