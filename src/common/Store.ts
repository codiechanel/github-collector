import {action, computed, observable, runInAction} from 'mobx'
// import api from "../common/api";
import api from './Api'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import {app} from "./stitch";

dayjs.extend(relativeTime)
let GRAPH_ENDPOINT = "https://graph-express.herokuapp.com/graphql";

class Store {
  @observable keyword = '';
  @observable
  selectedSort = 'noSort'
  // @observable
  // selectedRepo = null
  @observable
  selectedSearchItem = null
  @observable
  selectedPackage = null
  @observable
  platform = "NPM"
  @observable
  selectedTagId = null
  packages = observable.map(new Map(), { deep: false })
  contributors = observable.map(new Map(), { deep: false })
  allPackages = observable.map(new Map(), { deep: false })
  // categories = observable.map(new Map(), { deep: false });
  tags = observable.map(new Map(), { deep: false })


  @action
  changePlatform(platform) {
    this.platform = platform
  }
  @action
  changeSort(sortId) {
    this.selectedSort = sortId
  }

  @action
  changePackage(pkg) {
    this.selectedPackage = pkg
  }

  // @action
  // changeRepo(repo) {
  //   this.selectedRepo = repo
  // }

  async fetchCommitStats() {
  let data =   api.fetchCommitStats(this.selectedPackage.full_name)
    return data


  }

  packageInfo(item) {
   return api.packageInfo(item)
  }


  async updatePackageWithNpm(npm_name) {
   let pkg =  await api.updatePackageWithNpm(this.selectedPackage, npm_name)
    runInAction(() => {
      let key = this.selectedPackage.full_name
      this.packages.set(key, pkg);
      this.allPackages.set(key, pkg);
    })

  }

  prepareTags(name) {
    let oldTags = this.allPackages.get(name).tags;
    let newTags = oldTags;

    if (this.selectedTagId) {
      // add the cat id
      oldTags.push(this.selectedTagId);
      // newTags = [...oldTags, store.selectedTagId.get()];
      newTags = [...new Set(oldTags)];
    }
    return newTags
  }

  async  refreshPackage(name) {
    let [result, newItem] = await api.refreshPackage(name, this.prepareTags(name))
    /* if there was an insert upsertedId will have a value*/
    // @ts-ignore
    if (result.upsertedId) {
      return true;
    } else {
      // @ts-ignore
      // newItem._id = item._id;
      // set(this.packages, item._id.toString(), newItem);

      this.packages.set(name, newItem);
      this.allPackages.set(name, newItem);
      return false;
    }

  }

  async deletePackage(name) {
    await api.deletePackage(name)
    runInAction(() => {
      this.packages.delete(name);
      this.allPackages.delete(name);
    })

  }

  async addPackage(pkg) {
    let [result , newItem] = await api.addPackage(pkg, this.selectedTagId)
    /* if there was an insert upsertedId will have a value*/
    // @ts-ignore
    if (result.upsertedId) {
      // @ts-ignore
      newItem._id = result.upsertedId;
      let key = newItem.full_name
      this.packages.set(key, newItem);
      this.allPackages.set(key, newItem);
      // set(this.packages, result.upsertedId.toString(), newItem);

      return true;
    } else {
      //  this could happen if record exists but with a different tag
      console.log("package updated, it already exist");

      return false;
    }
  }

  async fetchPackages() {
   let items =  await api.fetchPackagesByTag(this.selectedTagId)
    runInAction(() => {
      this.packages.clear()
      for (let x of items) {

        // @ts-ignore
        this.packages.set(x.full_name, x)
        // @ts-ignore
        this.allPackages.set(x.full_name, x)
      }
    })
  }
  async fetchContributors() {
    let data = await api.fetchContributors(this.selectedPackage.full_name)
    return data

  }
  async saveTag(name) {
  let result =  await  api.saveTag(name)
    if (result.upsertedId) {
      this.tags.set(result.upsertedId.toString(), {name: name})

      return true
    } else {
      return false
    }
  }

  @computed
  get tagsArray() {
    return Array.from(this.tags)

  }

  @computed
  get contributorsArray() {
    return Array.from(this.contributors)

  }

  @computed
  get packagesArray() {
    let list: any = Array.from(this.packages)
    console.log('packagesArray', list)

    list = api.sortPackages(list, this.selectedSort)


    return [...list]

  }



  async login() {
    if (app.auth.isLoggedIn) {
      console.log(`user already cool  logged in`)
      // store.fetchSuggestions("react").then();
      // store.fetchPackagesByTag();
     await this.fetchTags()
      // store.fetchDailyTrends("PH").then();
      // store.fetchHourlyTrends().then();
    } else {
      let authedUser  = await api.login()

      console.log(`successfully logged in with id: ${authedUser.id}`)
      await this.fetchTags()

    }

  }



  async fetchTags() {
   let items =  await api.fetchTags()
    runInAction(() => {
      this.tags.clear()
      for (let x of items) {
        let id = x['_id'].toString()

        this.tags.set(id, x)
      }
    })
  }
}

const store = new Store()
export default store
