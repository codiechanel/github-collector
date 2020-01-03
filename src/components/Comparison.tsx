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

function Comparison(props) {
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

                    {store.packagesArray.map(([key, item]) => {


                        let pkgInfo = store.packageInfo(item)

                        Object.keys(pkgInfo).forEach(x => console.log(x))

                        return (<DataTableRow key={key}>
                            <DataTableCell><Typography use="headline6">{item.name}</Typography></DataTableCell>
                            {/*<Typography style={{color: (Math.sign(percent) === 1) ? "green": "red"}}*/}
                            {/*            use="headline6">{diff}</Typography>*/}
                            {Object.keys(pkgInfo).map(x => <DataTableCell key={x}><Typography
                                use="subtitle1">{pkgInfo[x]}</Typography></DataTableCell>)}

                        </DataTableRow>)
                    })}


                </DataTableBody>
            </DataTableContent>
        </DataTable>
    </div>
}

export default observer(Comparison)