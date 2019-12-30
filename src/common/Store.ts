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

    list = api.sortPackages(list, this.selectedSort)


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
