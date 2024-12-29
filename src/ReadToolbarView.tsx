import classes from './ReadToolbarView.module.scss'
import { faEyeSlash, faGripLines, faListUl, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { ReadViewOptions } from './ReadView.tsx'
import { PushButton } from './components/PushButton.tsx'
import { Button } from './components/Button.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  options: ReadViewOptions
  onExit: () => void
  onClickShowToC: () => void
  onOptionsChange: (options: ReadViewOptions) => void
}

export function ReadToolbarView({ onExit, onClickShowToC, options, onOptionsChange }: Props) {
  return <footer className={classes.toolbar} role={'toolbar'}>
    <div className={classes.buttons}>
      <div className={classes.start}>
        <Button
          text="Books"
          icon={<FontAwesomeIcon icon={faRightFromBracket} flip={'horizontal'}/>}
          title="Exit from read book view and go to book list."
          onClick={onExit} />
        <Button
          text="ToC"
          icon={<FontAwesomeIcon icon={faListUl} flip={'horizontal'}/>}
          title="Show Book Table of Contents"
          onClick={onClickShowToC} />
      </div>
      <div className={classes.end}>
        <PushButton
          text="Translate"
          icon={<FontAwesomeIcon icon={faGripLines}/>}
          title="Translate the text using double lines layout"
          pushed={options.translate}
          enabled={true}
          onPush={pushed => onOptionsChange({ ...options, translate: pushed, mask: false })}
        />
        <PushButton
          text="Mask"
          icon={<FontAwesomeIcon icon={faEyeSlash}/>}
          title="Mask the translation while keeping the layout"
          pushed={options.mask}
          enabled={options.translate}
          onPush={pushed => onOptionsChange({ ...options, mask: pushed })}
        />
      </div>
    </div>
  </footer>
}
