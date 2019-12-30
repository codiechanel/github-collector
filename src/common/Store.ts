import {computed, observable, observe, runInAction} from 'mobx'
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
    return Array.from(this.packages)

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
