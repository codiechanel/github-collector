import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button } from '@rmwc/button'
import { SimpleDialog } from '@rmwc/dialog'
import { ThemeProvider } from '@rmwc/theme'
import { Typography } from '@rmwc/typography'
import { TextField } from '@rmwc/textfield'
import palette from './Palette'
import { createGlobalStyle } from 'styled-components'
import { useRef } from 'react'
import Tags from './components/Tags'

import store from './Store'
const GlobalStyle = createGlobalStyle`
 		body {
		background-color: ${palette.backGround};
							/* color: hotpink !important; */
						}
						.mdc-tab .mdc-tab__text-label {
							color: white;
						}
						.mdc-tab--active .mdc-tab__text-label {
							color: steelblue;
						}
`
function CreateTagButton(props) {
  const inputEl = useRef(null)
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <SimpleDialog
        title="This is a simple dialog"
        // body="You can pass the body prop or children."
        open={open}
        onClose={evt => {
          console.log(inputEl.current.value)
          if (evt.detail.action === 'accept') {
            store.saveTag(inputEl.current.value)
          }

          console.log(evt.detail.action)
          setOpen(false)
        }}
      >
        <TextField inputRef={inputEl} label="standard..." />
      </SimpleDialog>

      <Button raised onClick={() => setOpen(true)}>
        Open Simple Dialog
      </Button>
    </>
  )
}
function App(props) {
  console.log('oops', process.env.cool)
  store.login()
  return (
    <ThemeProvider
      options={{
        primary: palette.primary,
        secondary: 'blue',
        primaryBg: 'pink',
        secondaryBg: 'pink',
        surface: palette.backGround,
        // background: 'magenta',
        textPrimaryOnBackground: 'white',
        // used by subtitle
        textSecondaryOnBackground: 'slategrey',
        textIconOnBackground: 'slategrey',
        textPrimaryOnLight: 'white',
        textSecondaryOnLight: 'white',
        textHintOnBackground: 'white',
        textHintOnLight: 'white'
      }}
    >
      <GlobalStyle />

      <CreateTagButton />
      <Tags />
    </ThemeProvider>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
  // <Hello compiler="TypeScript" framework="React" />,
  // document.getElementById("root")
)
