import React from 'react';

import Settings from 'utils/Settings';
import Languages from 'utils/Languages';

export default class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.onEnabledChanged = this.onEnabledChanged.bind(this);
    this.onLanguageChanged = this.onLanguageChanged.bind(this);

    this.state = {
      isWorking: false,
      enabled: null,
      language: null
    };
  }
  componentWillMount() {
    this.setState({ isWorking: true });

    Settings.get().then(settings => this.setState({ isWorking: false, ...settings }));
  }
  onEnabledChanged(event) {
    const enabled = event.currentTarget.checked;

    this.updateSettings({ enabled });
  }
  onLanguageChanged(event) {
    const language = event.currentTarget.value;

    this.updateSettings({ language });
  }
  updateSettings(settings) {
    this.setState({ isWorking: true });

    Settings.set(settings).then(() => this.setState({ isWorking: false, ...settings }));
  }
  render() {
    const { isWorking } = this.state;
    const languages = Languages.getAvailable();
    const isAuto = this.state.language === 'auto';
    const fallbackLanguageCode = Languages.getFirstSupportedFallbackLanguageCode();
    const fallbackLanguage = Languages.find(fallbackLanguageCode);

    return <div>
      <div className='settings__row'>
        <h2>Mean Facebook</h2>
      </div>

      <div className='settings__row'>
        <label>
          <input type='checkbox' checked={this.state.enabled} onChange={this.onEnabledChanged}/> Enabled
        </label>
      </div>

      <div className='settings__row'>
        <label>
          Language:
        </label>

        <select
          disabled={isWorking}
          onChange={this.onLanguageChanged}
          value={this.state.language}>
          <option key='auto' value='auto'>Automatically detect</option>
          {languages.map(language => <option key={language.code} value={language.code}>{language.name}</option>)}
        </select>
      </div>

      {isAuto && <div className='settings__row'>
        <aside>
          When auto is selected this add-on will try to guess the language from the posts on your facebook.
          If that fails the language will fall back to {fallbackLanguage.name}.
        </aside>
      </div>}

      <aside>You need to refresh the page after you change the settings.</aside>
    </div>;
  }
}
