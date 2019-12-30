// import api from "../common/api";
// import axios from "axios";
import {RemoteMongoClient, UserPasswordCredential} from 'mongodb-stitch-browser-sdk'
import {app} from './stitch'
import axios from "axios";
import * as dayjs from "dayjs";

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
            filter = {tags: id}
        }

        let items = await db
            .collection('packages')
            .find(filter)
            // .sort({ name: 1 })
            .toArray()
        return items
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

        let {data} = await axios.get(GRAPH_ENDPOINT, {params: {query}});

        let pkg = data.data.Npm2.packageInfo2;

        const newItem = {
            owner_id: app.auth.user.id,
            name: pkg.name,
            description: pkg.description,
            version: pkg.version,
            author: pkg.author,
            resolvedRepoName: pkg.resolvedRepoName,
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

    async addPackage(name, selectedTagId) {
        let newItem = await this.getPackageInfo(name);

        // @ts-ignore
        newItem.tags = [selectedTagId];

        const db = app
            .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
            .db("githubdb");

        let result = await db
            .collection("packages")

            .updateOne(
                {name: name},
                {
                    $set: newItem
                },
                {upsert: true}
            );
        return [result, newItem]
    }

    async login() {

        const credential = new UserPasswordCredential(
            'wsguy10a@gmail.com',
            'temp123'
        )
        let authedUser = await app.auth
            .loginWithCredential(credential)
        return authedUser

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
        return items
    }

    sortPackages(list, selectedSort) {
        if (selectedSort == 'monthlyDownloads') {
            list = list.sort((a, b) => {
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
        } else if (selectedSort == 'yearlyDownloads') {
            list = list.sort((a, b) => {
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
        } else if (selectedSort == 'sortByYear') {
            list = list.sort((a, b) => {
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
        } else if (selectedSort == 'percent') {
            list = list.sort((a, b) => {
                let [keyA, valA] = a
                let [keyB, valB] = b
                if (valA.npm && valB.npm) {
                    let downloadsMonthA = valA.npm.downloads[2].count
                    let downloadsYearA = valA.npm.downloads[5].count
                    let downloadsMonthB = valB.npm.downloads[2].count
                    let downloadsYearB = valB.npm.downloads[5].count

                    let percentA = this.computePercentInc(downloadsMonthA, downloadsYearA)
                    let percentB = this.computePercentInc(downloadsMonthB, downloadsYearB)
                    /* sort desc */
                    return percentB - percentA
                } else {
                    return 0
                }
            })
        }
        return list

    }

    computePercentInc(downloadsMonth, downloadsYear) {
        let aveMonth = downloadsYear / 12
        let diff = downloadsMonth - aveMonth
        let percent = (diff / aveMonth) * 100
        return percent
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
                {name: name},
                {
                    $set: newItem
                },
                {upsert: true}
            )
        return result
    }

}

const api = new Api()
export default api
