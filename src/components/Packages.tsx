import store from '../common/Store'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Button} from '@rmwc/button'
import {CollapsibleList, List, SimpleListItem} from '@rmwc/list'
import styled from 'styled-components'
import {CircularProgress} from '@rmwc/circular-progress'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import {Chip, ChipSet} from '@rmwc/chip'
import {Typography} from '@rmwc/typography'
import '@rmwc/list/collapsible-list.css';
import {Snackbar, SnackbarAction} from '@rmwc/snackbar';
import {Swipeable} from 'react-swipeable';
import {navigate} from '@reach/router'
import SortPanel from './SortPanel'

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


const config = {
    trackTouch: true, // track touch input
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
    // delta: 10,                             // min distance(px) before a swipe starts
    // preventDefaultTouchmoveEvent: false,   // preventDefault on touchmove, *See Details*
    //
    // rotationAngle: 0,                      // set a rotation angle
};

function Packages(props) {
    const [open, setOpen] = useState(false);
    let data = useLoader()
    // let list: any = Array.from(store.packages)
    //   let content = <div>hello</div>
    let content = (
        <CenteredFlex>
            <CircularProgress/>
        </CenteredFlex>
    )
    if (data === 'done') {
        content = (<>
                <Snackbar
                    open={open}
                    onClose={evt => setOpen(false)}
                    message="item deleted"
                    action={
                        <SnackbarAction
                            label="Dismiss"
                            onClick={() => console.log('Click Me')}
                        />
                    }
                />
                <Button onClick={() => navigate('comparison')}>compare</Button>
            <List>
                {store.packagesArray.map(([key, item]) => {
                    let {
                        downloadsLastMonth,
                        downloadsLastYear,
                        aveMonthly,
                        diff,
                        percent,
                        starsCount,
                        created_at
                    } = store.packageInfo(item)

                    return (
                        <Swipeable
                            key={key}
                            onSwipedRight={() => {
                                store.deletePackage(item.name).then(() =>  setOpen(true))
                                // store.deleteSearchTerm(key).then(x => setOpen(true));
                            }}
                            {...config}>
                        <CollapsibleList key={key}
                                         handle={
                                             <SimpleListItem
                                                 text={item.name}
                                                 secondaryText={item.description}
                                                 graphic="favorite"
                                                 metaIcon="chevron_right"
                                             />
                                         }
                                         onOpen={() => console.log('open')}
                                         onClose={() => console.log('close')}
                        >
                            <ChipSet>
                                {starsCount && <Chip label="stars"> <Typography style={{color: "magenta"}}
                                                                                use="headline6">{starsCount}</Typography>
                                </Chip>}
                                {created_at && <Chip label="created_at"> <Typography style={{color: "magenta"}}
                                                                                     use="headline6">{created_at}</Typography></Chip>}
                                {downloadsLastMonth &&
                                <Chip icon={"cloud_download"} label="LastMonth"> <Typography style={{color: "magenta"}}
                                                                                             use="headline6">{downloadsLastMonth}</Typography></Chip>}
                                {downloadsLastYear &&
                                <Chip icon={"cloud_download"} label="LastYear"> <Typography style={{color: "magenta"}}
                                                                                            use="headline6">{downloadsLastYear}</Typography></Chip>}
                                {aveMonthly &&
                                <Chip icon={"cloud_download"} label="aveMonthly"> <Typography style={{color: "magenta"}}
                                                                                            use="headline6">{aveMonthly}</Typography></Chip>}
                                {diff &&
                                <Chip icon={"cloud_download"} label="diff"> <Typography style={{color: (Math.sign(percent) === 1) ? "green": "red"}}
                                                                                              use="headline6">{diff}</Typography></Chip>}
                                {percent &&
                                <Chip icon={"cloud_download"} label="percent"> <Typography style={{color: (Math.sign(percent) === 1) ? "green": "red"}}
                                                                                        use="headline6">{percent}%</Typography></Chip>}

                            </ChipSet>
                            <Button raised onClick={() => {store.refreshPackage(item.name).then()}}>
                                refresh
                            </Button>
                            <Button raised onClick={() => {
                                store.changeRepo(item.resolvedRepoName)
                                navigate('commitStats')}}>
                                commi stats
                            </Button>
                            <Button raised onClick={() => {
                                store.changeRepo(item.resolvedRepoName)
                                navigate('contributors')}} >Contributors</Button>
                        </CollapsibleList>
                        </Swipeable>
                    )
                })}
            </List></>
        )
    }


    return <FullHeight>
        <SortPanel/>

        {content}</FullHeight>
}


export default observer(Packages)
