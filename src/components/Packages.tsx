import store from '../common/Store'
import * as React from 'react'
import {observer} from 'mobx-react'
import {Button} from '@rmwc/button'
import {List, ListItem, CollapsibleList, SimpleListItem} from '@rmwc/list'
import {useEffect, useState} from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import {CircularProgress} from '@rmwc/circular-progress'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import {Chip, ChipSet} from '@rmwc/chip'
import {Typography} from '@rmwc/typography'
import '@rmwc/list/collapsible-list.css';
import api from "../common/Api";
import {Select} from '@rmwc/select'
import { Snackbar, SnackbarAction } from '@rmwc/snackbar';
import { Swipeable } from 'react-swipeable';
import { navigate } from '@reach/router'

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

function computePercentInc(downloadsMonth, downloadsYear) {
    let aveMonth = downloadsYear / 12
    let diff = downloadsMonth - aveMonth
    let percent = (diff / aveMonth) * 100
    return percent
}

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
            <List>
                {store.packagesArray.map(([key, item]) => {
                    let downloadsLastMonth = null
                    let downloadsLastYear = null
                    let aveMonthly = null
                    let diff = null
                    let percent = null
                    if (item.npm) {
                        let downloadsLastYearNum = item.npm.downloads[5].count
                        let downloadsLastMonthNum = item.npm.downloads[2].count
                        let aveMonthlyNum = downloadsLastYearNum / 12
                        downloadsLastYear = api.formatNumber(downloadsLastYearNum)

                        downloadsLastMonth = api.formatNumber(downloadsLastMonthNum)
                        aveMonthly = api.formatNumber(aveMonthlyNum.toFixed(0))

                        let diffNum = downloadsLastMonthNum - aveMonthlyNum
                        diff = api.formatNumber(diffNum.toFixed(0))

                        // percent = ((diffNum / aveMonth) * 100).toFixed(0);
                        percent = computePercentInc(downloadsLastMonthNum, downloadsLastYearNum)
                        percent = percent.toFixed(0)
                    }

                    let starsCount = null
                    if (item.github) {
                        starsCount = api.formatNumber(item.github.starsCount)
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
                                console.log(item.resolvedRepoName)
                                store.changeRepo(item.resolvedRepoName)
                                navigate('commitStats')}}>
                                commi stats
                            </Button>
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

const SortPanel = observer(props => {
    console.log('render')
    const options = [
        {
            label: 'noSort',
            value: 'noSort'
        },
        {
            label: 'sortByYear',
            value: 'sortByYear',

        },
        {
            label: 'monthlyDownloads',
            value: 'monthlyDownloads'
        },
        ,
        {
            label: 'percent',
            value: 'percent'
        },
        ,
        {
            label: 'yearlyDownloads',
            value: 'yearlyDownloads'
        },

    ];
    return <div style={{height: 100}}><Select enhanced value={store.selectedSort}
                                              onChange={(e) => store.changeSort(e.currentTarget.value)} label="Standard"
                                              options={options}/></div>
})
export default observer(Packages)
