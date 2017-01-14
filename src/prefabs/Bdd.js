import * as firebase from 'firebase'

export default class Bdd {
    constructor (config){
        this.config = config;

        return firebase.initializeApp(config);
    }
}