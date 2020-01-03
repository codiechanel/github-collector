// import api from "../common/api";
// import axios from "axios";
import {RemoteMongoClient, UserPasswordCredential} from 'mongodb-stitch-browser-sdk'
import {app} from './stitch'
import axios from "axios";
import * as dayjs from "dayjs";
import * as yaml from 'js-yaml'
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
            .deleteOne({full_name: name})

    }



    async updatePackageWithNpm(pkg, npm_name) {
        let npmResult = await axios.get(`https://api.npms.io/v2/package/${npm_name}`);
        pkg.npm = npmResult.data.collected.npm
        let {data} = await axios.get(`https://libraries.io/api/NPM/${encodeURIComponent(npm_name)}?api_key=${process.env.LIBRARIES_API_KEY}`)
        pkg.npm.dependent_repos_count = data.dependent_repos_count
        pkg.npm.dependents_count = data.dependents_count

        const db = app
            .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
            .db("githubdb");

        let result = await db
            .collection("packages")

            .updateOne(
                {full_name: pkg.full_name},
                {
                    $set: pkg
                },
                {upsert: true}
            );

        return pkg

    }

    async refreshPackage(full_name, newTags) {
        // let item = this.allPackages.get(pkgName);

        // let newItem = await this.getPackageInfo(name);
        let {data} = await axios.get(`https://api.github.com/repos/${full_name}`,);
        const newItem = {
            owner_id: app.auth.user.id,
            name: data.name,
            full_name: data.full_name,
            description: data.description,
            resolvedRepoName: data.full_name,
            github: data
        };

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
                {full_name: full_name},
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

    async fetchContributors(repo) {

        let {data} = await axios.get(`https://api.github.com/repos/${repo}/contributors?q=contributions&order=desc`,);
        return data
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
        let dependents_count = null

        let dependent_repos_count = null
        if (item.pub) {
            dependents_count = item.pub.dependents_count
            dependent_repos_count = item.pub.dependent_repos_count
        }
        if (item.npm) {
            dependents_count = item.npm.dependents_count  ?  this.formatNumber(item.npm.dependents_count ) : null
            dependent_repos_count = item.npm.dependent_repos_count ?  this.formatNumber(item.npm.dependent_repos_count) : null


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
            starsCount = api.formatNumber(item.github.stargazers_count)
            created_at = item.github.created_at
            created_at = dayjs(created_at)
            // @ts-ignore
            created_at = dayjs().from(created_at, true) + ' ago'

        }

        // if (item.githubExtra) {
        //     created_at = item.githubExtra.created_at
        //     created_at = dayjs(created_at)
        //     // @ts-ignore
        //     created_at = dayjs().from(created_at, true) + ' ago'
        // }

        return {
            downloadsLastMonth,
            downloadsLastYear,
            aveMonthly,
            diff,
            percent,
            starsCount,
            created_at,
            dependents_count,
            dependent_repos_count
        }
    }

    fetchDemo() {
        let name = 'react'
        axios.get(`https://api.npms.io/v2/package/${name}`).then(x => console.log(x))
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

    async addPackage(pkg, selectedTagId) {

        let {data} = await axios.get(`https://api.github.com/repos/${pkg.full_name}`,);


        const newItem: any = {
            owner_id: app.auth.user.id,
            full_name: data.full_name,
            name: data.name,
            stargazers_count: data.stargazers_count,
            private: data.private,

            description: data.description,
            resolvedRepoName: data.full_name,
            github: data
        };

        try {
            if (data.language === "Dart") {
                let filename = `https://raw.githubusercontent.com/${pkg.full_name}/master/pubspec.yaml`
                let pkgJson = await axios.get(filename)
                let pkgJsonData = pkgJson.data

                let doc = yaml.load(pkgJsonData)
                let {data} = await axios.get(`https://libraries.io/api/Pub/${doc.name}?api_key=${process.env.LIBRARIES_API_KEY}`)
                newItem.pub = {
                    name: data.name,
                    dependent_repos_count: data.dependent_repos_count,
                    dependents_count: data.dependents_count
                }
                newItem.platform = 'Pub'


            } else if (data.language === "JavaScript") {
                let filename = `https://raw.githubusercontent.com/${pkg.full_name}/master/package.json`
                let pkgJson = await axios.get(filename)
                let pkgJsonData = pkgJson.data
                if (pkgJsonData.private !== true && pkgJsonData.name) {

                    let npmResult = await axios.get(`https://api.npms.io/v2/package/${encodeURIComponent(pkgJsonData.name)}`);

                    newItem.npm = npmResult.data.collected.npm
                    let {data} = await axios.get(`https://libraries.io/api/NPM/${encodeURIComponent(pkgJsonData.name)}?api_key=${process.env.LIBRARIES_API_KEY}`)
                    newItem.npm.dependent_repos_count = data.dependent_repos_count
                    newItem.npm.dependents_count = data.dependents_count
                }


            }
        } catch (e) {
            // console.log(e)
        }

//         if (!data.private) {
//             console.log('not private', data)
//             let pkgJson = await axios.get(`https://raw.githubusercontent.com/${pkg.full_name}/master/package.json`)
//
//             let pkgJsonData = pkgJson.data
//             console.log(pkgJsonData.name, pkgJsonData)
//             let npmResult = await axios.get(`https://api.npms.io/v2/package/${encodeURIComponent(pkgJsonData.name)}`);
// console.log(npmResult)
//             // newItem.npm = npmResult.data.collected.npm
//
//         }
        // @ts-ignore
        newItem.tags = [selectedTagId];

        const db = app
            .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
            .db("githubdb");

        let result = await db
            .collection("packages")

            .updateOne(
                {full_name: pkg.full_name},
                {
                    $set: newItem
                },
                {upsert: true}
            );
        return [result, newItem]
    }

    // TODO: this one uses name not full name
    // ideally we should use github full name to make it really unique
    async addPackageOld(name, selectedTagId) {
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
                if (valA.github && valB.github) {
                    let createdA = valA.github.created_at
                    createdA = dayjs(createdA).unix()
                    let createdB = valB.github.created_at
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
