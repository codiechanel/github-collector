import {action, computed, observable} from 'mobx'
// import api from "../common/api";
import api from './Api'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
let GRAPH_ENDPOINT = "https://graph-express.herokuapp.com/graphql";

class Store {
  @observable keyword = '';
  @observable
  selectedSort = 'noSort'
  @observable
  selectedTagId = null
  packages = observable.map(new Map(), { deep: false })
  allPackages = observable.map(new Map(), { deep: false })
  // categories = observable.map(new Map(), { deep: false });
  tags = observable.map(new Map(), { deep: false })


  @action
  changeSort(sortId) {
    this.selectedSort = sortId
  }

  async addPackage(name) {
    await api.addPackage(name)
  }

  async fetchPackages() {
    await api.fetchPackagesByTag(this.selectedTagId)
  }
  async saveTag(name) {
    await  api.saveTag(name)
  }

  @computed
  get tagsArray() {
    return Array.from(this.tags)

  }

  @computed
  get packagesArray() {
    let list: any = Array.from(this.packages)

    if (this.selectedSort == 'monthlyDownloads') {
      list = list.sort(function(a, b) {
        let [keyA, valA] = a
        let [keyB, valB] = b
        if (valA.npm && valB.npm) {
          let downloadsA = valA.npm.downloads[2].count
          let downloadsB = valB.npm.downloads[2].count
          /* sort desc */
          return downloadsB - downloadsA
        } else {
          return 0
        }
      })
    } else if (this.selectedSort == 'yearlyDownloads') {
      list = list.sort(function(a, b) {
        let [keyA, valA] = a
        let [keyB, valB] = b
        if (valA.npm && valB.npm) {
          let downloadsA = valA.npm.downloads[5].count
          let downloadsB = valB.npm.downloads[5].count
          /* sort desc */
          return downloadsB - downloadsA
        } else {
          return 0
        }
      })
    }
    else if (this.selectedSort == 'sortByYear') {
      list = list.sort(function(a, b) {
        let [keyA, valA] = a
        let [keyB, valB] = b
        if (valA.githubExtra && valB.githubExtra) {
          let createdA = valA.githubExtra.created_at
          createdA = dayjs(createdA).unix()
          let createdB = valB.githubExtra.created_at
          createdB = dayjs(createdB).unix()
          /* in unix time since epoch
          the more recent date has a greater integer value  */
          return createdA - createdB
        } else {
          return 0
        }
      })
    }
    return list

  }

  login() {
   api.login()
  }

  async fetchTags() {
    await api.fetchTags()
  }
}

const store = new Store()
export default store
