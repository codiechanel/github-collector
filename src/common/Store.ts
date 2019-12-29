import { observable, observe, runInAction } from 'mobx'
import {
  RemoteMongoClient,
  UserPasswordCredential
} from 'mongodb-stitch-browser-sdk'
import { app } from './stitch'
// import api from "../common/api";
// import axios from "axios";
import { action } from 'mobx'
import api from './Api'

class Store {
  @observable
  selectedTagId = null
  packages = observable.map(new Map(), { deep: false })
  allPackages = observable.map(new Map(), { deep: false })
  // categories = observable.map(new Map(), { deep: false });
  tags = observable.map(new Map(), { deep: false })

  async fetchPackages() {
    await api.fetchPackagesByTag(this.selectedTagId)
  }
  async saveTag(name) {
    const db = app
      .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      .db('githubdb')
    const newItem = {
      name,
      owner_id: app.auth.user.id
    }

    let result = await db
      .collection('tags')

      .updateOne(
        { name: name },
        {
          $set: newItem
        },
        { upsert: true }
      )
    if (result.upsertedId) {
      store.tags.set(result.upsertedId.toString(), { name: name })

      return true
    } else {
      return false
    }
  }

  login() {
    if (app.auth.isLoggedIn) {
      console.log(`user already logged in`)
      // store.fetchSuggestions("react").then();
      // store.fetchPackagesByTag();
      store.fetchTags()
      // store.fetchDailyTrends("PH").then();
      // store.fetchHourlyTrends().then();
    } else {
      const credential = new UserPasswordCredential(
        'wsguy10a@gmail.com',
        'temp123'
      )
      app.auth
        .loginWithCredential(credential)
        // Returns a promise that resolves to the authenticated user
        .then(authedUser => {
          // db.collection('blogentries').updateOne({ owner_id: client.auth.user.id }, { $set: { number: 42 } }, { upsert: true })

          console.log(`successfully logged in with id: ${authedUser.id}`)
        })
        .catch(err => console.error(`login failed with error: ${err}`))
    }
  }

  fetchTags() {
    const db = app
      .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      .db('githubdb')

    db.collection('tags')
      .find()
      // .find({ tags: id })
      // .sort({ name: 1 })
      .toArray()
      .then(items => {
        runInAction(() => {
          this.tags.clear()
          for (let x of items) {
            let id = x['_id'].toString()

            this.tags.set(id, x)
          }
        })
        console.log(this.tags)
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  }
}

const store = new Store()
export default store
