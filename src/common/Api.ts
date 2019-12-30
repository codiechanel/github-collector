import { observable, observe, runInAction } from 'mobx'
import {
  RemoteMongoClient,
  UserPasswordCredential
} from 'mongodb-stitch-browser-sdk'
import { app } from './stitch'
// import api from "../common/api";
// import axios from "axios";
import { action } from 'mobx'
import store from './Store'
class Api {
   formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  async fetchPackagesByTag(id = null) {
    const db = app
      .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      .db('githubdb')

    let filter = null
    if (id) {
      filter = { tags: id }
    }

    let items = await db
      .collection('packages')
      .find(filter)
      // .sort({ name: 1 })
      .toArray()
    runInAction(() => {
      store.packages.clear()
      for (let x of items) {
        // let id = x["_id"].toString();
        console.log("x", x);
        // @ts-ignore
        store.packages.set(x.name, x)
        // @ts-ignore
        store.allPackages.set(x.name, x)
      }
    })
  }
  fetchPackagesByTag2(id = null) {
    const db = app
      .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      .db('githubdb')

    let filter = null
    if (id) {
      filter = { tags: id }
    }

    db.collection('packages')
      .find(filter)
      // .sort({ name: 1 })
      .toArray()
      .then(items => {
        runInAction(() => {
          store.packages.clear()
          for (let x of items) {
            // let id = x["_id"].toString();
            // console.log("x", x.name);
            // @ts-ignore
            store.packages.set(x.name, x)
            // @ts-ignore
            store.allPackages.set(x.name, x)
          }
        })
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  }
}

const api = new Api()
export default api
