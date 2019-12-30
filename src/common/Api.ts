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
import axios from "axios";
let GRAPH_ENDPOINT = "https://graph-express.herokuapp.com/graphql";
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
      store.packages.set(name, newItem);
      store.allPackages.set(name, newItem);
      // set(this.packages, result.upsertedId.toString(), newItem);

      return true;
    } else {
      //  this could happen if record exists but with a different tag
      console.log("package updated, it already exist");

      return false;
    }
  }
  login() {
    if (app.auth.isLoggedIn) {
      console.log(`user already logged in`)
      // store.fetchSuggestions("react").then();
      // store.fetchPackagesByTag();
      store.fetchTags().then()
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
  async fetchTags() {
    const db = app
        .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
        .db('githubdb')

   let items = await db.collection('tags')
        .find()
        // .find({ tags: id })
        // .sort({ name: 1 })
        .toArray()
    runInAction(() => {
      store.tags.clear()
      for (let x of items) {
        let id = x['_id'].toString()

        store.tags.set(id, x)
      }
    })
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

}

const api = new Api()
export default api
