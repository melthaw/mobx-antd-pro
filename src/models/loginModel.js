import {stringify} from 'querystring';
import {history} from 'umi';
import {fakeAccountLogin} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';
import {action, observable} from "mobx";


export class LoginModel {

  rootStore = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable status = undefined;
  @observable type = undefined;
  @observable submitting = false;

  @action
  login({payload}) {
    this.submitting = true;
    fakeAccountLogin(payload).then(response => {
      setAuthority(response.currentAuthority);
      this.status = response.status;
      this.type = response.type;

      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    }).finally(() => {
      this.submitting = false;
    })
  }

  @action
  logout() {
    const {redirect} = getPageQuery(); // Note: There may be security issues, please note

    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
  }

}
