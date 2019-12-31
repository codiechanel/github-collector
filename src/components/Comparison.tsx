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

function Comparison(props) {
    return <div>
        <DataTable>
            <DataTableContent>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableHeadCell>Item</DataTableHeadCell>
                        <DataTableHeadCell>Stars</DataTableHeadCell>
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

                        return (<DataTableRow>
                            <DataTableCell>{item.name}</DataTableCell>
                            <DataTableCell>{starsCount}</DataTableCell>
                        </DataTableRow>)
                    })}


                </DataTableBody>
            </DataTableContent>
        </DataTable>
        hllo</div>
}

export default observer(Comparison)