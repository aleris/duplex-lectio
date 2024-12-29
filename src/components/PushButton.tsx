import classes from './PushButton.module.scss'
import { ReactNode } from 'react'

type Props = {
  text: string
  icon: ReactNode
  title: string
  pushed: boolean
  enabled: boolean
  onPush: (pushed: boolean) => void
}

export function PushButton({text, icon, title, pushed, enabled, onPush}: Props) {
  return <label className={`${classes.pushButton} ${enabled ? classes.enabled : classes.disabled}`} title={title}>
    <input className={classes.control} type="checkbox" disabled={!enabled} checked={pushed} onChange={() => onPush(!pushed)}/>
    <span className={classes.content}>
      {icon}
      <span className={classes.text}>{text}</span>
    </span>
  </label>
}
