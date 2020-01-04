import store from '../common/Store'
import {List, ListItem} from '@rmwc/list'
import * as React from 'react'
import {useRef} from 'react'
import {observer} from 'mobx-react'
import {Typography} from '@rmwc/typography'
import {navigate} from '@reach/router'
import AppBar from "./AppBar";
import {TopAppBarActionItem, TopAppBarSection} from "@rmwc/top-app-bar";
import {SimpleDialog} from "@rmwc/dialog";
import {TextField} from "@rmwc/textfield";
import {Button} from "@rmwc/button";
import {Icon} from '@rmwc/icon'
import '@rmwc/icon/icon.css';

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

function Tags(props) {
  // let list: any = Array.from(store.tags)
  return (
      <>
        <AppBar title="Tags">
          {/*<Icon icon="favorite" />*/}

          <TopAppBarSection alignEnd>
            <CreateTagButton />
            <TopAppBarActionItem
                onClick={() => {
                  // api.fetchGoogleNews(item.keyword);
                  navigate(`searchPage`, { replace: false })
                }}
                icon="search"
            />
          </TopAppBarSection>
        </AppBar>
    <List>
      {store.tagsArray.map(([key, item]) => (
        <ListItem
          key={key}
          onClick={() => {
            // store.selectedTagId = key
            navigate(`/packages/${key}`, { replace: false })
          }}
        >
          <Typography use="body1"> {item.name}</Typography>
        </ListItem>
      ))}
    </List></>
  )
}

export default observer(Tags)
