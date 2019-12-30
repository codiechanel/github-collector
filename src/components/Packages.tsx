import store from '../common/Store'
import * as React from 'react'
import { observer } from 'mobx-react'
import { List, ListItem , CollapsibleList, SimpleListItem} from '@rmwc/list'
import { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { CircularProgress } from '@rmwc/circular-progress'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import {Chip,ChipSet} from '@rmwc/chip'
import { Typography } from '@rmwc/typography'
import '@rmwc/list/collapsible-list.css';
import api from "../common/Api";
dayjs.extend(relativeTime)
function useLoader() {
  const [data, setData] = useState('loading')
  useEffect(() => {
    // Update the document title using the browser API
    // store.fetchNews();
    const fetchData = async () => {
      await store.fetchPackages()
      setData('done')
    }
    fetchData()
  }, [])
  return data
}
export const FullHeight = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`
export const CenteredFlex = styled.div`
  display: flex;
  //background-color: red;
  /* align-items: center;
  justify-content: center; */

  flex: 1;
  /* height: 100%; */
  flex-direction: column;
`
export const Box = styled.div`
  height: 100px;
  max-height: 100px;
  width: 100px;
`
const StyledTypography = styled(Typography)`
  color: steelblue;
`;
function Packages(props) {
  let data = useLoader()
  // let list: any = Array.from(store.packages)
  //   let content = <div>hello</div>
  let content = (
    <CenteredFlex>
      <CircularProgress />
    </CenteredFlex>
  )
  if (data === 'done') {
    content = (
      <List>
        {store.packagesArray.map(([key, item]) => {
          let downloadsLastMonth = null
          if (item.npm) {

             downloadsLastMonth = api.formatNumber(item.npm.downloads[2].count)
          }

          let starsCount = null
          if (item.github) {
            starsCount = api.formatNumber( item.github.starsCount)
          }
          let created_at = null
          if (item.githubExtra) {
            created_at = item.githubExtra.created_at
            created_at = dayjs(created_at)
            // @ts-ignore
            created_at = dayjs().from(created_at, true) + ' ago'
          }
          // @ts-ignore
          // @ts-ignore
          return (
            <CollapsibleList  key={key}
                handle={
                  <SimpleListItem
                      text={item.name}
                      graphic="favorite"
                      metaIcon="chevron_right"
                  />
                }
                onOpen={() => console.log('open')}
                onClose={() => console.log('close')}
            >
              <ChipSet>
              { starsCount && <Chip label="stars" > <Typography style={{color:"magenta"}} use="headline6" >{starsCount}</Typography> </Chip> }
                { created_at && <Chip label="created_at" > <Typography style={{color:"magenta"}} use="headline6" >{created_at}</Typography></Chip> }
                { downloadsLastMonth && <Chip icon={"cloud_download"} label="LastMonth" > <Typography style={{color:"magenta"}} use="headline6" >{downloadsLastMonth}</Typography></Chip> }

              </ChipSet>
            </CollapsibleList>
          // <ListItem key={key}>{item.name}</ListItem>
        ) })}
      </List>
    )
  }

  return <FullHeight> {content}</FullHeight>
}

export default observer(Packages)
