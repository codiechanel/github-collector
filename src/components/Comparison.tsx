import * as React from 'react'
import {observer} from 'mobx-react'
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableRow,
    DataTableHeadCell,
    DataTableBody,
    DataTableCell
} from '@rmwc/data-table'
import '@rmwc/data-table/data-table.css';
import store from "../common/Store";
import {List} from "@rmwc/list";
import SortPanel from "./SortPanel";

function Comparison(props) {
    let labels  = ['Package', 'downloadsLastMonth',
        'downloadsLastYear',
        'aveMonthly',
        'diff',
        'percent',
        'starsCount',
        'created_at']
    return <div>
        <SortPanel/>
        <DataTable>
            <DataTableContent>
                <DataTableHead>
                    <DataTableRow>
                        {labels.map(x =>   <DataTableHeadCell>{x}</DataTableHeadCell>)}
                        {/*<DataTableHeadCell>Item</DataTableHeadCell>*/}
                        {/*<DataTableHeadCell>Stars</DataTableHeadCell>*/}
                        {/*<DataTableHeadCell>created_at</DataTableHeadCell>*/}
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>

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

                        let pkgInfo = store.packageInfo(item)

                        Object.keys(pkgInfo).forEach(x => console.log(x))

                        return (<DataTableRow>
                            <DataTableCell>{item.name}</DataTableCell>
                            {  Object.keys(pkgInfo).map(x =>  <DataTableCell>{pkgInfo[x]}</DataTableCell>) }
                            {/*<DataTableCell>{item.name}</DataTableCell>*/}
                            {/*<DataTableCell>{starsCount}</DataTableCell>*/}
                            {/*<DataTableCell>{created_at}</DataTableCell>*/}
                        </DataTableRow>)
                    })}


                </DataTableBody>
            </DataTableContent>
        </DataTable>
        hllo</div>
}

export default observer(Comparison)