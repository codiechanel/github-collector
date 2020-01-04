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

function AppBar({ showBackButton , title, children }  ) {


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
                {children}
            </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust /></>

}

export default  AppBar