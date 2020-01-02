import * as React from 'react'
import {observer} from 'mobx-react'
import {Radio} from '@rmwc/radio'
import store from "../common/Store";
function Platforms (props) {
    return <div>hello
        <Radio
            value="NPM"
            checked={store.platform === 'NPM'}
            onChange={evt => store.changePlatform(evt.currentTarget.value)}
        >
            NPM
        </Radio>
        <Radio
            value="Pub"
            checked={store.platform === 'Pub'}
            onChange={evt => store.changePlatform(evt.currentTarget.value)}
        >
            Pub
        </Radio></div>

}

export default observer(Platforms)
