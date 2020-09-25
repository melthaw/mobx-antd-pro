import {queryCurrent, query as queryUsers} from '@/services/user';
import {observable, action} from "mobx";


export class UserModel {

  rootStore = null

  @observable users = []
  @observable currentUser = {}

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  fetch() {
    queryUsers().then(response => {
      this.users = response
    })
  }

  @action
  fetchCurrent() {
    queryCurrent().then(response => {
      this.currentUser = response
    })
  }

}
