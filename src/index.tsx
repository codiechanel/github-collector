import {navigate, Router} from '@reach/router'
import {Button} from '@rmwc/button'
import '@rmwc/circular-progress/circular-progress.css'
import {SimpleDialog} from '@rmwc/dialog'
import {TextField} from '@rmwc/textfield'
import {ThemeProvider} from '@rmwc/theme'
import {
    TopAppBar,
    TopAppBarActionItem,
    TopAppBarFixedAdjust,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from '@rmwc/top-app-bar'
import * as React from 'react'
import {useRef} from 'react'
import * as ReactDOM from 'react-dom'
import styled, {createGlobalStyle} from 'styled-components'
import palette from './common/Palette'
import store from './common/Store'
import Packages from './components/Packages'
import Tags from './components/Tags'
import SearchPage from "./components/SearchPage";
import CommitStats from "./components/CommitStats";
import Comparison from "./components/Comparison";
import Contributors from "./components/Contributors";
import api from "./common/Api";

const GlobalStyle = createGlobalStyle`

.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {

color: white;
}

.mdc-select:not(.mdc-select--disabled) .mdc-floating-label {
color: white;
}

.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {
color: white;
}

.line-path {
  fill: none;
  stroke: maroon;
  stroke-width: 5;
  stroke-linejoin: round;
}
.tick line {
  stroke: #C0C0BB;
  stroke-width: .25;
}
.axisLeft text{
  fill: white;
}  

.axisBottom  text{
  fill: white;
}  
html {
font-family:"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",  "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

/*
  display: flex;
	flex: 1;
	width: 100vw;
  height: 100vh;
  flex-direction: row;*/
}
#root {
 /* display: flex;
	flex: 1;
	flex-direction: column;*/
  //background-color: pink;
}

:root {
    --mdc-theme-primary-on-background: white;
  --mdc-theme-secondary-on-background: white;
}
 		body {
     /* margin: 0px;
	padding: 0px;
	width: 100%;
	height: 100%;
	display: flex;
	flex: 1;*/

  
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
                    if (evt.detail.action === 'accept') {
                        store.saveTag(inputEl.current.value)
                    }

                    setOpen(false)
                }}
            >
                <TextField inputRef={inputEl} label="standard..."/>
            </SimpleDialog>

            <Button raised onClick={() => setOpen(true)}>
                Create Tag
            </Button>
        </>
    )
}

type PanelProp = {
    flexDirection: string
    flex?: number
}
export const Panel = styled.div<PanelProp>`
  display: flex;
  //background-color: steelblue;
  /* flex-direction: column; */

  /* justify-content: flex-start;  */
  /* align items in Main Axis */
  /* align-items: stretch;  */
  /* align items in Cross Axis */
  /* align-content: stretch; */
  flex-direction: ${props => props.flexDirection};
  flex: 1;
  /* flex: ${({flex = 1}) => flex}; */
  /* height: 100%; */
  /* align-items: stretch; */
`
export const Panel2 = styled.div<PanelProp>`
  display: flex;
  background-color: steelblue;
  flex-direction: ${props => props.flexDirection};
  flex: ${({flex = 1}) => flex};
  height: 100%;
  align-items: stretch;
`

function App(props) {
    api.fetchDemo()
    console.log('kl', process.env.cool)
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
            <GlobalStyle/>
            <Panel flexDirection="column">
                 <TopAppBar>
          <TopAppBarRow>
            <TopAppBarSection>
              <TopAppBarTitle>NewsApp</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection alignEnd>
              <TopAppBarActionItem
                onClick={() => {
                  // api.fetchGoogleNews(item.keyword);
                  navigate(`searchPage`, { replace: false })
                }}
                icon="search"
              />
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust />

                 <CreateTagButton />
                <Router>
                    <Tags path="/"/>
                    <Packages path="packages"/>
                    <SearchPage path="searchPage"/>
                    <CommitStats path="commitStats"/>
                    <Comparison path="comparison"/>
                    <Contributors path="contributors"/>
                </Router>
            </Panel>
        </ThemeProvider>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
    // <Hello compiler="TypeScript" framework="React" />,
    // document.getElementById("root")
)
