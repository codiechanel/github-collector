import {observer} from "mobx-react";
import {Select} from "@rmwc/select";
import store from "../common/Store";
import * as React from "react";


const SortPanel = observer(props => {
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
        {
            label: 'stars',
            value: 'stars'
        },
        {
            label: 'dependents_count',
            value: 'dependents_count'
        },
        {
            label: 'dependent_repos_count',
            value: 'dependent_repos_count'
        },



    ];
    return <div style={{height: 100}}><Select enhanced value={store.selectedSort}
                                              onChange={(e) => store.changeSort(e.currentTarget.value)} label="Standard"
                                              options={options}/></div>
})

export default SortPanel