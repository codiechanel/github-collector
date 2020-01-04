import * as React from 'react'
import {observer} from 'mobx-react'
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableContent,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow
} from '@rmwc/data-table'
import '@rmwc/data-table/data-table.css';
import store from "../common/Store";
import SortPanel from "./SortPanel";
import {Typography} from "@rmwc/typography";
import AppBar from "./AppBar";

function Comparison(props) {
    console.log('render')
    let items = store.packagesArray
    let labels = ['Package', 'downloadsLastMonth',
        'downloadsLastYear',
        'aveMonthly',
        'diff',
        'percent',
        'starsCount',
        'created_at',
        'dependents_count',
        'dependent_repos_count']
    return <div>
        <AppBar title="Comparison" showBackButton></AppBar>
        <SortPanel/>
        <DataTable>
            <DataTableContent>
                <DataTableHead>
                    <DataTableRow>
                        {labels.map(x => <DataTableHeadCell key={x}><Typography use="headline6">{x}</Typography>
                        </DataTableHeadCell>)}

                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>

                    {items.map((entry, i) => {
                        let [key, item] = entry;
                        console.log(key)


                        let pkgInfo = store.packageInfo(item)

                        // Object.keys(pkgInfo).forEach(x => console.log(x))

                        return (<DataTableRow key={key+i}>
                            <DataTableCell><Typography use="headline6">{item.name}</Typography></DataTableCell>
                            {/*<Typography style={{color: (Math.sign(percent) === 1) ? "green": "red"}}*/}
                            {/*            use="headline6">{diff}</Typography>*/}
                            {Object.keys(pkgInfo).map((x, i) => <DataTableCell key={x+i}><Typography
                                use="subtitle1">{pkgInfo[x]}</Typography></DataTableCell>)}

                        </DataTableRow>)
                    })}


                </DataTableBody>
            </DataTableContent>
        </DataTable>
    </div>
}

export default observer(Comparison)