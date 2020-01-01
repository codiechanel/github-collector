// import api from "../common/api";
// import axios from "axios";
import {RemoteMongoClient, UserPasswordCredential} from 'mongodb-stitch-browser-sdk'
import {app} from './stitch'
import axios from "axios";
import * as dayjs from "dayjs";
import {action} from "mobx";
import store from "./Store";

let GRAPH_ENDPOINT = "https://graph-express.herokuapp.com/graphql";

class Api {
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    async deletePackage(name) {
        // this.deletePackageAsync(name).then(this.deletePackageSuccess);
        const db = app
            .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
            .db("githubdb");
        await db.collection("packages")
            .deleteOne({name: name})

    }

    async refreshPackage(name, newTags) {
        // let item = this.allPackages.get(pkgName);

        let newItem = await this.getPackageInfo(name);

        /* let oldTags = store.allPackages.get(name).tags;
         let newTags = oldTags;

         if (selectedTagId) {
             // add the cat id
             oldTags.push(selectedTagId);
             // newTags = [...oldTags, store.selectedTagId.get()];
             newTags = [...new Set(oldTags)];
         }*/

        // @ts-ignore
        newItem.tags = newTags;

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

    async fetchCommitStats(repo) {
        let {data} = await axios.get(`https://api.github.com/repos/${repo}/stats/participation`,);
        return data
    }

    // computePercentInc(downloadsMonth, downloadsYear) {
    //     let aveMonth = downloadsYear / 12
    //     let diff = downloadsMonth - aveMonth
    //     let percent = (diff / aveMonth) * 100
    //     return percent
    // }

    packageInfo(item) {
        let downloadsLastMonth = null
        let downloadsLastYear = null
        let aveMonthly = null
        let diff = null
        let percent = null
        let starsCount = null
        let created_at = null
        if (item.npm) {
            let downloadsLastYearNum = item.npm.downloads[5].count
            let downloadsLastMonthNum = item.npm.downloads[2].count
            let aveMonthlyNum = downloadsLastYearNum / 12
            downloadsLastYear = this.formatNumber(downloadsLastYearNum)

            downloadsLastMonth = this.formatNumber(downloadsLastMonthNum)
            aveMonthly = this.formatNumber(aveMonthlyNum.toFixed(0))

            let diffNum = downloadsLastMonthNum - aveMonthlyNum
            diff = this.formatNumber(diffNum.toFixed(0))

            // percent = ((diffNum / aveMonth) * 100).toFixed(0);
            percent = this.computePercentInc(downloadsLastMonthNum, downloadsLastYearNum)
            percent = percent.toFixed(0)
        }


        if (item.github) {
            starsCount = api.formatNumber(item.github.starsCount)
        }

        if (item.githubExtra) {
            created_at = item.githubExtra.created_at
            created_at = dayjs(created_at)
            // @ts-ignore
            created_at = dayjs().from(created_at, true) + ' ago'
        }

        return {
            downloadsLastMonth,
            downloadsLastYear,
            aveMonthly,
            diff,
            percent,
            starsCount,
            created_at
        }
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
            process.env.USER,
            process.env.PASS
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
