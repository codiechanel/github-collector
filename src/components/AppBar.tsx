import * as React from 'react'
import {
    TopAppBar,
    TopAppBarActionItem,
    TopAppBarFixedAdjust,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from "@rmwc/top-app-bar";
import {navigate} from '@reach/router'

function AppBar(props ) {
    let { showBackButton , title }  =  props
    console.log('show back', showBackButton)


    return <>  <TopAppBar>
            <TopAppBarRow>
                <TopAppBarSection>
                    { showBackButton &&  <TopAppBarActionItem
                        onClick={() => {
                            window.history.back()
                        }}
                        icon="keyboard_arrow_left"
                    /> }
                    <TopAppBarTitle>{ title}</TopAppBarTitle>
                </TopAppBarSection>
          {/*      <TopAppBarSection alignStart>

                </TopAppBarSection>*/}
                {props.children}
            </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust /></>

}

export default  AppBar