import {action, observable} from "mobx";
import {queryNotices} from "@/services/user";

export class GlobalModel {

  rootStore = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable collapsed = false;
  @observable notices = [];
  @observable fetchingNotices = false;

  @action
  async fetchNotices({payload}) {
    this.collapsed = false;
    this.fetchingNotices = true;

    await queryNotices().then(response => {
      this.notices = response;

      const unreadCount = this.notices.filter((item) => !item.read).length;

      this.rootStore.userModel.changeNotifyCount({
        payload: {
          totalCount: this.notices.length,
          unreadCount,
        }
      });
    }).finally(() => {
      this.fetchingNotices = false;
    })

  }

  @action
  clearNotices({payload}) {

    this.collapsed = false;
    this.notices = this.notices.filter((item) => item.type !== payload);

    const count = this.notices.length;
    const unreadCount = this.notices.filter((item) => !item.read).length;

    this.rootStore.userModel.changeNotifyCount({
      payload: {
        totalCount: count,
        unreadCount,
      }
    });
  }


  @action
  changeNoticeReadState({payload}) {
    const notices = this.notices.map((item) => {
      const notice = {...item};

      if (notice.id === payload) {
        notice.read = true;
      }

      return notice;
    });

    this.collapsed = false;
    this.notices = notices;

    this.rootStore.userModel.changeNotifyCount({
      payload: {
        totalCount: notices.length,
        unreadCount: notices.filter((item) => !item.read).length,
      }
    });

  }

}

