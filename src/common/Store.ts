import { observable, observe, runInAction } from 'mobx'
import {
  RemoteMongoClient,
  UserPasswordCredential
} from 'mongodb-stitch-browser-sdk'
import { app } from './stitch'
// import api from "../common/api";
import axios from "axios";
import { action } from 'mobx'
import api from './Api'
let GRAPH_ENDPOINT = "https://graph-express.herokuapp.com/graphql";

class Store {
  @observable keyword = '';
  @observable
  selectedTagId = null
  packages = observable.map(new Map(), { deep: false })
  allPackages = observable.map(new Map(), { deep: false })
  // categories = observable.map(new Map(), { deep: false });
  tags = observable.map(new Map(), { deep: false })
  async getPackageInfo(name) {
    // let downloads = await this.fetchDownloadCount(name);
    // let pkg = await this.fetchPackage(name);

    let query = `
    {
      Npm2 {
        packageInfo2(name: "${name}") {
          name
          description
          version
          author
          publisher
          resolvedRepoName
          githubExtra {
            created_at
            private
            subscribers_count
          }
          links
          evaluation
          score
          npm
          github
        }
      }
    }
    

    `;

    let { data } = await axios.get(GRAPH_ENDPOINT, { params: { query } });

    let pkg = data.data.Npm2.packageInfo2;

    const newItem = {
      owner_id: app.auth.user.id,
      name: pkg.name,
      description: pkg.description,
      version: pkg.version,
      author: pkg.author,
      resolvedRepoName:pkg.resolvedRepoName,
      links: pkg.links,
      githubExtra: pkg.githubExtra,
      publisher: pkg.publisher,
      evaluation: pkg.evaluation,
      score: pkg.score,
      npm: pkg.npm,
      github: pkg.github
    };

    return newItem;
  }
  async addPackage(name) {
    let newItem = await this.getPackageInfo(name);

    // @ts-ignore
    newItem.tags = [this.selectedTagId];

    const db = app
        .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
        .db("githubdb");

    let result = await db
        .collection("packages")

        .updateOne(
            { name: name },
            {
              $set: newItem
            },
            { upsert: true }
        );
    /* if there was an insert upsertedId will have a value*/
    if (result.upsertedId) {
      // @ts-ignore
      newItem._id = result.upsertedId;
      this.packages.set(name, newItem);
      this.allPackages.set(name, newItem);
      // set(this.packages, result.upsertedId.toString(), newItem);

      return true;
    } else {
      //  this could happen if record exists but with a different tag
      console.log("package updated, it already exist");

      return false;
    }
  }

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
