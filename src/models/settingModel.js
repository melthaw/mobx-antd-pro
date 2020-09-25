import {observable, action} from "mobx";

import defaultSettings from '../../config/defaultSettings';


const updateColorWeak = (colorWeak) => {
  const root = document.getElementById('root');

  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

export class SettingModel {

  rootStore = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable settings = defaultSettings;

  @action
  changeSetting({payload}) {
    const {colorWeak, contentWidth} = payload;

    if (this.settings.contentWidth !== contentWidth && window.dispatchEvent) {
      window.dispatchEvent(new Event('resize'));
    }

    updateColorWeak(!!colorWeak);
    this.settings = {...this.settings, ...payload};
  }
}

