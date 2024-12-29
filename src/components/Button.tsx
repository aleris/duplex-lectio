import classes from './Button.module.scss'
import { ReactNode } from 'react'

type Props = {
  text: string
  icon: ReactNode
  title: string
  onClick: () => void
}

export function Button({text, icon, title, onClick}: Props) {
  return <button className={classes.button} title={title} onClick={onClick}>
    {icon}
    <span className={classes.text}>{text}</span>
  </button>
}
